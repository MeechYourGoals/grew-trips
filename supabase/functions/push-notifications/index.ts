import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.3';
import { corsHeaders } from '../_shared/cors.ts';

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_ANON_KEY') ?? ''
);

/**
 * @description A comprehensive notification dispatcher function. It provides a single entry point
 * for sending notifications across different channels (push, email, SMS) and for managing
 * user push notification tokens. It integrates with third-party services like FCM,
 * SendGrid, and Twilio.
 *
 * @param {Request} req - The incoming request object.
 * @param {object} req.body - The JSON body of the request.
 * @param {string} req.body.action - The notification action to perform.
 * @param {object} [req.body.*] - Other parameters specific to the chosen action.
 *
 * @returns {Response} A response object indicating the result of the notification action.
 */
serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { action, ...payload } = await req.json();
    
    switch (action) {
      case 'send_push':
        return await sendPushNotification(payload);
      case 'send_email':
        return await sendEmailNotification(payload);
      case 'send_sms':
        return await sendSMSNotification(payload);
      case 'save_token':
        return await savePushToken(payload);
      case 'remove_token':
        return await removePushToken(payload);
      default:
        throw new Error('Invalid action');
    }
  } catch (error) {
    console.error('Notification error:', error);
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
 * @description Sends a push notification using Firebase Cloud Messaging (FCM).
 *
 * @param {object} params - The parameters for sending the push notification.
 * @param {string} params.userId - The ID of the user receiving the notification (for logging).
 * @param {string|string[]} params.tokens - The FCM device token(s) to send the notification to.
 * @param {string} params.title - The title of the notification.
 * @param {string} params.body - The body content of the notification.
 * @param {object} [params.data] - Optional data payload to send with the notification.
 * @param {string} [params.icon] - Optional URL to an icon for the notification.
 * @param {string} [params.badge] - Optional URL to a badge for the notification.
 * @returns {Promise<Response>} A promise that resolves to a response object with the FCM result.
 */
async function sendPushNotification({ userId, tokens, title, body, data, icon, badge }: any) {
  const fcmServerKey = Deno.env.get('FCM_SERVER_KEY');
  
  if (!fcmServerKey) {
    throw new Error('FCM server key not configured');
  }

  const fcmPayload = {
    registration_ids: Array.isArray(tokens) ? tokens : [tokens],
    notification: {
      title,
      body,
      icon: icon || '/favicon.ico',
      badge: badge || '/favicon.ico',
      click_action: data?.url || '/',
    },
    data: data || {},
    webpush: {
      fcm_options: {
        link: data?.url || '/'
      }
    }
  };

  const response = await fetch('https://fcm.googleapis.com/fcm/send', {
    method: 'POST',
    headers: {
      'Authorization': `key=${fcmServerKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(fcmPayload),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`FCM error: ${error}`);
  }

  const result = await response.json();

  // Log notification in database
  await supabase
    .from('notification_logs')
    .insert({
      user_id: userId,
      type: 'push',
      title,
      body,
      data,
      success: result.success || 0,
      failure: result.failure || 0,
      sent_at: new Date().toISOString()
    });

  return new Response(
    JSON.stringify(result),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

/**
 * @description Sends an email notification using the SendGrid API.
 *
 * @param {object} params - The parameters for sending the email.
 * @param {string} params.userId - The ID of the user receiving the email (for logging).
 * @param {string} params.email - The recipient's email address.
 * @param {string} params.subject - The subject of the email.
 * @param {string} [params.content] - The plain text or HTML content of the email.
 * @param {string} [params.template] - An optional SendGrid template to use.
 * @returns {Promise<Response>} A promise that resolves to a response object indicating success.
 */
async function sendEmailNotification({ userId, email, subject, content, template }: any) {
  const sendgridApiKey = Deno.env.get('SENDGRID_API_KEY');
  
  if (!sendgridApiKey) {
    throw new Error('SendGrid API key not configured');
  }

  const emailPayload = {
    personalizations: [{
      to: [{ email }],
      subject
    }],
    from: {
      email: 'noreply@yourdomain.com',
      name: 'Travel Planning App'
    },
    content: [{
      type: 'text/html',
      value: template || `<p>${content}</p>`
    }]
  };

  const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${sendgridApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(emailPayload),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`SendGrid error: ${error}`);
  }

  // Log notification in database
  await supabase
    .from('notification_logs')
    .insert({
      user_id: userId,
      type: 'email',
      title: subject,
      body: content,
      recipient: email,
      sent_at: new Date().toISOString()
    });

  return new Response(
    JSON.stringify({ success: true }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

/**
 * @description Sends an SMS notification using the Twilio API.
 *
 * @param {object} params - The parameters for sending the SMS.
 * @param {string} params.userId - The ID of the user receiving the SMS (for logging).
 * @param {string} params.phoneNumber - The recipient's phone number.
 * @param {string} params.message - The content of the SMS message.
 * @returns {Promise<Response>} A promise that resolves to a response object with the Twilio result.
 */
async function sendSMSNotification({ userId, phoneNumber, message }: any) {
  const twilioAccountSid = Deno.env.get('TWILIO_ACCOUNT_SID');
  const twilioAuthToken = Deno.env.get('TWILIO_AUTH_TOKEN');
  const twilioPhoneNumber = Deno.env.get('TWILIO_PHONE_NUMBER');
  
  if (!twilioAccountSid || !twilioAuthToken || !twilioPhoneNumber) {
    throw new Error('Twilio credentials not configured');
  }

  const credentials = btoa(`${twilioAccountSid}:${twilioAuthToken}`);
  
  const response = await fetch(
    `https://api.twilio.com/2010-04-01/Accounts/${twilioAccountSid}/Messages.json`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        From: twilioPhoneNumber,
        To: phoneNumber,
        Body: message
      }),
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Twilio error: ${error}`);
  }

  const result = await response.json();

  // Log notification in database
  await supabase
    .from('notification_logs')
    .insert({
      user_id: userId,
      type: 'sms',
      title: 'SMS Notification',
      body: message,
      recipient: phoneNumber,
      external_id: result.sid,
      sent_at: new Date().toISOString()
    });

  return new Response(
    JSON.stringify(result),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

/**
 * @description Saves or updates a user's push notification token in the database.
 *
 * @param {object} params - The parameters for saving the token.
 * @param {string} params.userId - The ID of the user the token belongs to.
 * @param {string} params.token - The push notification token from the device.
 * @param {string} [params.platform='web'] - The platform of the device (e.g., 'web', 'ios', 'android').
 * @returns {Promise<Response>} A promise that resolves to a response object with the saved token record.
 */
async function savePushToken({ userId, token, platform }: any) {
  const { data, error } = await supabase
    .from('push_tokens')
    .upsert({
      user_id: userId,
      token,
      platform: platform || 'web',
      updated_at: new Date().toISOString()
    }, {
      onConflict: 'user_id,token'
    })
    .select()
    .single();

  if (error) throw error;

  return new Response(
    JSON.stringify({ success: true, data }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

/**
 * @description Removes a specific push notification token for a user from the database.
 *
 * @param {object} params - The parameters for removing the token.
 * @param {string} params.userId - The ID of the user the token belongs to.
 * @param {string} params.token - The push notification token to remove.
 * @returns {Promise<Response>} A promise that resolves to a response object indicating success.
 */
async function removePushToken({ userId, token }: any) {
  const { error } = await supabase
    .from('push_tokens')
    .delete()
    .eq('user_id', userId)
    .eq('token', token);

  if (error) throw error;

  return new Response(
    JSON.stringify({ success: true }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}