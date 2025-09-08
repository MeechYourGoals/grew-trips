import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.3';

/**
 * @description CORS headers for cross-origin requests.
 */
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

/**
 * @description Supabase edge function for managing trip calendar events (CRUD).
 * It acts as a dispatcher, routing requests to the appropriate sub-function
 * based on the `action` parameter in the request body. This provides the backend
 * for the collaborative calendar feature.
 *
 * @param {Request} req - The incoming request object.
 * @param {object} req.body - The JSON body of the request.
 * @param {string} req.body.action - The CRUD action to perform ('create_event', 'get_events', 'update_event', 'delete_event').
 * @param {string} req.body.tripId - The ID of the trip.
 * @param {string} req.body.userId - The ID of the user performing the action.
 * @param {object} [req.body.eventData] - The event data, required for create and update actions.
 *
 * @returns {Response} A response object containing the result of the CRUD operation.
 */
serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { action, tripId, userId, eventData } = await req.json();

    if (!action || !tripId || !userId) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    switch (action) {
      case 'create_event':
        return await createEvent(supabase, tripId, userId, eventData);
      case 'get_events':
        return await getEvents(supabase, tripId);
      case 'update_event':
        return await updateEvent(supabase, eventData);
      case 'delete_event':
        return await deleteEvent(supabase, eventData.eventId);
      default:
        return new Response(
          JSON.stringify({ error: 'Invalid action' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }

  } catch (error) {
    console.error('Error in calendar-sync function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

/**
 * @description Creates a new event in the `trip_events` table.
 *
 * @param {any} supabase - The Supabase client instance.
 * @param {string} tripId - The ID of the trip to add the event to.
 * @param {string} userId - The ID of the user creating the event.
 * @param {object} eventData - The data for the new event.
 * @returns {Promise<Response>} A promise that resolves to a response object with the created event.
 */
async function createEvent(supabase: any, tripId: string, userId: string, eventData: any) {
  const { data: eventRecord, error } = await supabase
    .from('trip_events')
    .insert({
      trip_id: tripId,
      title: eventData.title,
      description: eventData.description || null,
      start_time: eventData.start_time,
      end_time: eventData.end_time || null,
      location: eventData.location || null,
      created_by: userId,
      metadata: eventData.metadata || {}
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create event: ${error.message}`);
  }

  return new Response(
    JSON.stringify({ success: true, event: eventRecord }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

/**
 * @description Retrieves all events for a given trip, including attendee information.
 *
 * @param {any} supabase - The Supabase client instance.
 * @param {string} tripId - The ID of the trip to fetch events for.
 * @returns {Promise<Response>} A promise that resolves to a response object with the list of events.
 */
async function getEvents(supabase: any, tripId:string) {
  const { data: events, error } = await supabase
    .from('trip_events')
    .select(`
      *,
      event_attendees(
        user_id,
        attendance_status,
        rsvp_time
      )
    `)
    .eq('trip_id', tripId)
    .order('start_time', { ascending: true });

  if (error) {
    throw new Error(`Failed to fetch events: ${error.message}`);
  }

  return new Response(
    JSON.stringify({ success: true, events }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

/**
 * @description Updates an existing event in the `trip_events` table.
 *
 * @param {any} supabase - The Supabase client instance.
 * @param {object} eventData - The updated event data. Must include the event `id`.
 * @returns {Promise<Response>} A promise that resolves to a response object with the updated event.
 */
async function updateEvent(supabase: any, eventData: any) {
  const { data: eventRecord, error } = await supabase
    .from('trip_events')
    .update({
      title: eventData.title,
      description: eventData.description,
      start_time: eventData.start_time,
      end_time: eventData.end_time,
      location: eventData.location,
      metadata: eventData.metadata
    })
    .eq('id', eventData.id)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update event: ${error.message}`);
  }

  return new Response(
    JSON.stringify({ success: true, event: eventRecord }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

/**
 * @description Deletes an event from the `trip_events` table.
 *
 * @param {any} supabase - The Supabase client instance.
 * @param {string} eventId - The ID of the event to delete.
 * @returns {Promise<Response>} A promise that resolves to a response object indicating success.
 */
async function deleteEvent(supabase: any, eventId: string) {
  const { error } = await supabase
    .from('trip_events')
    .delete()
    .eq('id', eventId);

  if (error) {
    throw new Error(`Failed to delete event: ${error.message}`);
  }

  return new Response(
    JSON.stringify({ success: true }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}