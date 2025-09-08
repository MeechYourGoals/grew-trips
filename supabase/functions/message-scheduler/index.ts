import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

/**
 * @description CORS headers for cross-origin requests.
 */
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

/**
 * @description A dual-purpose Supabase edge function for scheduling and sending messages.
 *
 * - **POST Request:** Schedules a new message by adding it to the `scheduled_messages` table.
 *   - @param {object} req.body - The JSON body for scheduling.
 *   - @param {string} req.body.content - The message content.
 *   - @param {string} req.body.send_at - The ISO 8601 timestamp when the message should be sent.
 *   - @param {string} req.body.trip_id - The ID of the trip the message belongs to.
 *   - @param {string} req.body.user_id - The ID of the user sending the message.
 *   - @param {string} [req.body.priority] - The priority of the message.
 *
 * - **GET Request (or any other method):** Acts as a poller, intended to be called by a cron job.
 *   It checks for any messages in the `scheduled_messages` table that are due to be sent,
 *   moves them to the main `messages` table, and then deletes them from the schedule.
 *
 * @param {Request} req - The incoming request object.
 *
 * @returns {Response} A response object indicating success or the number of messages processed.
 */
serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  try {
    if (req.method === 'POST') {
      const body = await req.json();
      const { content, send_at, trip_id, user_id, priority } = body;
      if (!content || !send_at || !user_id) {
        return new Response(
          JSON.stringify({ error: 'Missing required fields' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const { error } = await supabase.from('scheduled_messages').insert({
        id: crypto.randomUUID(),
        content,
        send_at,
        trip_id,
        user_id,
        priority,
      });

      if (error) throw error;

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Poll for due messages
    const now = new Date().toISOString();
    const { data: due, error } = await supabase
      .from('scheduled_messages')
      .select('*')
      .lte('send_at', now);

    if (error) throw error;

    for (const msg of due ?? []) {
      await supabase.from('messages').insert({
        content: msg.content,
        trip_id: msg.trip_id,
        user_id: msg.user_id,
        priority: msg.priority,
      });
      await supabase.from('scheduled_messages').delete().eq('id', msg.id);
    }

    return new Response(JSON.stringify({ processed: due?.length || 0 }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
