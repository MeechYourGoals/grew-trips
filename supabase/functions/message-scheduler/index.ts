import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient, SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { add } from 'https://deno.land/x/date_fns@v2.22.1/index.js';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ScheduledMessage {
  id: string;
  trip_id: string;
  message_content: string;
  scheduled_at_utc: string;
  status: string;
  recurrence_type: 'daily' | 'weekly' | null;
  recurrence_details?: { days?: number[] }; // e.g., for weekly [0,1,2,3,4,5,6] where 0 is Sunday
  next_send_at_utc: string;
  last_sent_at_utc?: string;
}

// Initialize Supabase client
const supabaseUrl = Deno.env.get('SUPABASE_URL');
const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY'); // Use anon key for invoking from scheduler
// For database operations that modify data, service_role key is often needed if RLS is restrictive.
// Ensure this function is invoked with appropriate permissions or use service_role key.
const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');


async function processScheduledMessages(supabase: SupabaseClient) {
  console.log("Scheduler function invoked at:", new Date().toISOString());
  const now = new Date().toISOString();

  // Fetch pending messages that are due
  const { data: messages, error } = await supabase
    .from('scheduled_messages')
    .select('*')
    .eq('status', 'pending')
    .lte('next_send_at_utc', now);

  if (error) {
    console.error('Error fetching scheduled messages:', error);
    return { status: 500, message: `Error fetching messages: ${error.message}` };
  }

  if (!messages || messages.length === 0) {
    console.log('No messages due for sending.');
    return { status: 200, message: 'No messages due.' };
  }

  console.log(`Found ${messages.length} messages to process.`);

  for (const message of messages as ScheduledMessage[]) {
    try {
      // 1. "Send" the message
      // In a real app, this would call your actual message delivery service (email, push, chat API)
      console.log(`Simulating sending message ID ${message.id}: "${message.message_content}" for trip ${message.trip_id}`);
      // TODO: Replace with actual message sending logic.
      // e.g., await sendChatMessage(message.trip_id, message.message_content);

      // 2. Update the message in DB
      let nextSendAt: Date | null = null;
      let newStatus = 'sent'; // Default to 'sent' for one-time or successfully recurring

      if (message.recurrence_type) {
        const currentNextSendDate = new Date(message.next_send_at_utc);
        if (message.recurrence_type === 'daily') {
          nextSendAt = add(currentNextSendDate, { days: 1 });
        } else if (message.recurrence_type === 'weekly' && message.recurrence_details?.days && message.recurrence_details.days.length > 0) {
          // Calculate next occurrence for weekly
          const sortedDays = message.recurrence_details.days.sort((a, b) => a - b);
          let currentDayOfWeek = currentNextSendDate.getUTCDay(); // 0 (Sun) to 6 (Sat)
          let nextDayOfWeek = -1;

          // Find the next scheduled day in the week
          for (const day of sortedDays) {
            if (day > currentDayOfWeek) {
              nextDayOfWeek = day;
              break;
            }
          }
          // If no day later in this week, take the first day of next week
          if (nextDayOfWeek === -1 && sortedDays.length > 0) {
            nextDayOfWeek = sortedDays[0];
            // Add days to get to the next week's occurrence
            nextSendAt = add(currentNextSendDate, { days: (7 - currentDayOfWeek) + nextDayOfWeek });
          } else if (nextDayOfWeek !== -1) {
             nextSendAt = add(currentNextSendDate, { days: nextDayOfWeek - currentDayOfWeek });
          } else {
            // Should not happen if recurrence_details.days is valid and non-empty
            console.error(`Could not calculate next send for weekly message ID ${message.id}. Disabling recurrence.`);
            newStatus = 'completed'; // Or 'error_in_recurrence'
          }
        } else {
          // Unknown or unsupported recurrence type, or missing details
          console.warn(`Unsupported recurrence type or missing details for message ID ${message.id}. Treating as one-time.`);
          newStatus = 'completed'; // Mark as completed to prevent re-processing with bad recurrence
        }

        // Basic check: if nextSendAt is somehow in the past or same, means calculation error for recurrence.
        if (nextSendAt && nextSendAt.toISOString() <= message.next_send_at_utc) {
            console.error(`Calculated next send time is not in the future for message ID ${message.id}. Disabling recurrence.`);
            nextSendAt = null; // Disable recurrence
            newStatus = 'error_recurrence';
        }

      } else {
        // One-time message
        newStatus = 'completed'; // Or keep as 'sent' if you prefer
      }

      const updatePayload: Partial<ScheduledMessage> & { next_send_at_utc?: string | null } = {
        status: nextSendAt ? 'pending' : newStatus, // If nextSendAt is set, it's still pending for future
        last_sent_at_utc: new Date().toISOString(),
        next_send_at_utc: nextSendAt ? nextSendAt.toISOString() : null,
        error_message: null,
      };

      if (!nextSendAt && message.recurrence_type) { // If it was recurring but now stops
        updatePayload.status = newStatus !== 'pending' ? newStatus : 'completed';
      }


      const { error: updateError } = await supabase
        .from('scheduled_messages')
        .update(updatePayload)
        .eq('id', message.id);

      if (updateError) {
        console.error(`Error updating message ID ${message.id}:`, updateError);
        // Optionally, set status to 'failed' or 'retry_needed'
        await supabase.from('scheduled_messages').update({ status: 'failed', error_message: updateError.message }).eq('id', message.id);
      } else {
        console.log(`Message ID ${message.id} processed. Next send: ${nextSendAt ? nextSendAt.toISOString() : 'N/A'}. Status: ${updatePayload.status}`);
      }

    } catch (e) {
      console.error(`Unhandled error processing message ID ${message.id}:`, e);
      await supabase.from('scheduled_messages').update({ status: 'failed', error_message: e.message }).eq('id', message.id);
    }
  }
  return { status: 200, message: `Processed ${messages.length} messages.` };
}


serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  // Secure the endpoint: Check for a secret header or ensure it's invoked by Supabase scheduler
  // const authHeader = req.headers.get('Authorization');
  // if (authHeader !== `Bearer ${Deno.env.get('CRON_SECRET')}`) {
  //   return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' }});
  // }

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    console.error("Supabase URL or Service Role Key is not configured.");
    return new Response(JSON.stringify({ error: 'Server configuration error.' }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }});
  }

  const supabaseAdminClient = createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      // autoRefreshToken: false, // Not needed for service role
      // persistSession: false // Not needed for service role
    }
  });

  try {
    const result = await processScheduledMessages(supabaseAdminClient);
    return new Response(JSON.stringify({ message: result.message }), {
      status: result.status,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (e) {
    console.error("Critical error in scheduler function:", e);
    return new Response(JSON.stringify({ error: `Internal Server Error: ${e.message}` }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

// To test locally with Supabase CLI:
// supabase functions serve message-scheduler --no-verify-jwt
// Then call: curl -X POST http://localhost:54321/functions/v1/message-scheduler -H "Authorization: Bearer YOUR_SUPABASE_ANON_KEY_OR_A_CRON_SECRET"
//
// To schedule this function in your Supabase project (after deploying):
// 1. Go to Database -> Function Hooks (or similar, UI might change) or use pg_cron.
// 2. Create a cron job: `SELECT cron.schedule('send-scheduled-messages', '*/1 * * * *', 'SELECT net.http_post(url:=''https://<YOUR_PROJECT_REF>.supabase.co/functions/v1/message-scheduler'', headers:=''{"Authorization": "Bearer YOUR_CRON_SECRET", "Content-Type": "application/json"}''::jsonb)');`
//    Replace <YOUR_PROJECT_REF> and YOUR_CRON_SECRET.
//    Alternatively, Supabase dashboard now has direct scheduling for functions. Navigate to Edge Functions -> Your Function -> Schedules.
// Remember to set SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY, and a CRON_SECRET (if using header auth) in your function's environment variables.
