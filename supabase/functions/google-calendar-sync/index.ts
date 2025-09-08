import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.3';
import { corsHeaders } from '../_shared/cors.ts';

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_ANON_KEY') ?? ''
);

/**
 * @description Supabase edge function for integrating with Google Calendar.
 * This function handles the OAuth 2.0 flow, token management, and two-way
 * synchronization of calendar events. It acts as a dispatcher based on the
 * `action` parameter.
 *
 * @param {Request} req - The incoming request object.
 * @param {object} req.body - The JSON body of the request.
 * @param {string} req.body.action - The specific Google Calendar action to perform.
 * @param {*} [req.body.*] - Other parameters specific to the chosen action.
 *
 * @returns {Response} A response object containing the result of the Google Calendar operation.
 */
serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { action, userId, eventData, accessToken, calendarId = 'primary', code } = await req.json();
    
    switch (action) {
      case 'auth_callback':
        return await handleAuthCallback(code);
      case 'sync_to_google':
        return await syncEventToGoogle(eventData, accessToken, calendarId);
      case 'import_from_google':
        return await importFromGoogle(userId, accessToken, calendarId);
      case 'get_calendars':
        return await getUserCalendars(accessToken);
      case 'refresh_token':
        return await refreshAccessToken(userId);
      default:
        throw new Error('Invalid action');
    }
  } catch (error) {
    console.error('Google Calendar sync error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});

/**
 * @description Handles the Google OAuth 2.0 callback. It exchanges an authorization code
 * for an access token and a refresh token, then stores them in the database.
 *
 * @param {string} code - The authorization code from the Google OAuth callback.
 * @returns {Promise<Response>} A promise that resolves to a response object with the new calendar connection record.
 */
async function handleAuthCallback(code: string) {
  const clientId = Deno.env.get('GOOGLE_CALENDAR_CLIENT_ID');
  const clientSecret = Deno.env.get('GOOGLE_CALENDAR_CLIENT_SECRET');
  const redirectUri = Deno.env.get('GOOGLE_CALENDAR_REDIRECT_URI');

  if (!clientId || !clientSecret || !redirectUri) {
    throw new Error('Missing Google Calendar credentials');
  }

  const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      grant_type: 'authorization_code',
    }),
  });

  if (!tokenResponse.ok) {
    throw new Error('Failed to exchange code for tokens');
  }

  const tokens = await tokenResponse.json();

  // Store the connection in database
  const { data, error } = await supabase
    .from('calendar_connections')
    .insert({
      provider: 'google',
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      expires_at: new Date(Date.now() + tokens.expires_in * 1000).toISOString(),
      calendar_id: 'primary',
      sync_enabled: true
    })
    .select()
    .single();

  if (error) throw error;

  return new Response(
    JSON.stringify({ connection: data }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

/**
 * @description Pushes an event from this application to the user's Google Calendar.
 * It also creates a record to track the synchronization between the internal and external event.
 *
 * @param {object} eventData - The internal event object from the `trip_events` table.
 * @param {string} accessToken - The user's Google API access token.
 * @param {string} calendarId - The ID of the Google Calendar to add the event to (e.g., 'primary').
 * @returns {Promise<Response>} A promise that resolves to a response object with the created Google Calendar event.
 */
async function syncEventToGoogle(eventData: any, accessToken: string, calendarId: string) {
  const googleEvent = {
    summary: eventData.title,
    description: eventData.description || '',
    start: eventData.all_day ? {
      date: eventData.start_time.split('T')[0]
    } : {
      dateTime: eventData.start_time,
      timeZone: 'America/New_York',
    },
    end: eventData.all_day ? {
      date: eventData.end_time.split('T')[0]
    } : {
      dateTime: eventData.end_time,
      timeZone: 'America/New_York',
    },
    location: eventData.location || '',
  };

  const response = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(googleEvent),
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Google Calendar API error: ${error}`);
  }

  const result = await response.json();

  // Store the sync record
  if (eventData.id) {
    await supabase
      .from('synced_calendar_events')
      .insert({
        trip_event_id: eventData.id,
        external_event_id: result.id,
        calendar_provider: 'google',
        last_synced: new Date().toISOString()
      });
  }

  return new Response(
    JSON.stringify(result),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

/**
 * @description Fetches events from a user's Google Calendar for the next year.
 *
 * @param {string} userId - The ID of the user performing the import.
 * @param {string} accessToken - The user's Google API access token.
 * @param {string} calendarId - The ID of the Google Calendar to fetch events from.
 * @returns {Promise<Response>} A promise that resolves to a response object with the list of Google Calendar events.
 */
async function importFromGoogle(userId: string, accessToken: string, calendarId: string) {
  const timeMin = new Date().toISOString();
  const timeMax = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(); // 1 year ahead

  const response = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events?` +
    `timeMin=${timeMin}&timeMax=${timeMax}&singleEvents=true&orderBy=startTime`,
    {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch events from Google Calendar');
  }

  const data = await response.json();
  const events = data.items?.map((event: any) => ({
    title: event.summary || 'Untitled Event',
    description: event.description || '',
    start_time: event.start.dateTime || event.start.date,
    end_time: event.end.dateTime || event.end.date,
    location: event.location || '',
    all_day: !!event.start.date,
    external_id: event.id,
    source: 'google_calendar'
  })) || [];

  return new Response(
    JSON.stringify({ events }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

/**
 * @description Retrieves a list of all calendars the user has access to in their Google account.
 *
 * @param {string} accessToken - The user's Google API access token.
 * @returns {Promise<Response>} A promise that resolves to a response object with the list of calendars.
 */
async function getUserCalendars(accessToken: string) {
  const response = await fetch(
    'https://www.googleapis.com/calendar/v3/users/me/calendarList',
    {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch user calendars');
  }

  const data = await response.json();
  const calendars = data.items?.map((calendar: any) => ({
    id: calendar.id,
    name: calendar.summary,
    description: calendar.description || '',
    primary: calendar.primary || false,
    accessRole: calendar.accessRole
  })) || [];

  return new Response(
    JSON.stringify({ calendars }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

/**
 * @description Refreshes an expired Google API access token using a stored refresh token.
 *
 * @param {string} userId - The ID of the user whose access token needs to be refreshed.
 * @returns {Promise<Response>} A promise that resolves to a response object with the new access token.
 */
async function refreshAccessToken(userId: string) {
  const { data: connection, error } = await supabase
    .from('calendar_connections')
    .select('refresh_token')
    .eq('user_id', userId)
    .eq('provider', 'google')
    .single();

  if (error || !connection?.refresh_token) {
    throw new Error('No refresh token found');
  }

  const clientId = Deno.env.get('GOOGLE_CALENDAR_CLIENT_ID');
  const clientSecret = Deno.env.get('GOOGLE_CALENDAR_CLIENT_SECRET');

  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      refresh_token: connection.refresh_token,
      client_id: clientId!,
      client_secret: clientSecret!,
      grant_type: 'refresh_token',
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to refresh access token');
  }

  const tokens = await response.json();

  // Update the stored tokens
  await supabase
    .from('calendar_connections')
    .update({
      access_token: tokens.access_token,
      expires_at: new Date(Date.now() + tokens.expires_in * 1000).toISOString()
    })
    .eq('user_id', userId)
    .eq('provider', 'google');

  return new Response(
    JSON.stringify({ access_token: tokens.access_token }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}