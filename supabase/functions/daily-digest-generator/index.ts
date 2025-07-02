import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient, SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2';
import OpenAI from "https://deno.land/x/openai@v4.24.1/mod.ts";
import { subDays } from 'https://deno.land/x/date_fns@v2.22.1/index.js';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Initialize Supabase client
const supabaseUrl = Deno.env.get('SUPABASE_URL');
const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

// Initialize OpenAI client
const openAIKey = Deno.env.get('OPENAI_API_KEY');
let openai: OpenAI | null = null;
if (openAIKey) {
  openai = new OpenAI({ apiKey: openAIKey });
} else {
  console.warn("OPENAI_API_KEY is not set. Digest generation will be skipped.");
}

interface User {
  id: string;
  // email?: string; // Add other user fields if needed for context
}

interface Message {
  id: string;
  content: string;
  sender_user_id: string; // User who sent the message
  created_at: string;
  trip_id: string;
  // sender_name?: string; // Optional: if you can join sender's name easily
}

interface Trip {
    id: string;
    name: string; // Or title
}

async function generateDigestForUser(supabase: SupabaseClient, user: User) {
  if (!openai) {
    console.log(`Skipping digest for user ${user.id} due to missing OpenAI key.`);
    return;
  }
  console.log(`Generating digest for user ${user.id}`);

  const twentyFourHoursAgo = subDays(new Date(), 1).toISOString();

  // 1. Get trips the user is part of (assuming a 'trip_participants' table)
  const { data: tripParticipations, error: tripsError } = await supabase
    .from('trip_participants') // ASSUMPTION: table name
    .select('trip_id, trips (id, name)') // ASSUMPTION: trips table has name, and RLS allows this join
    .eq('user_id', user.id);

  if (tripsError) {
    console.error(`Error fetching trips for user ${user.id}:`, tripsError);
    return;
  }
  if (!tripParticipations || tripParticipations.length === 0) {
    console.log(`User ${user.id} is not part of any trips. Skipping digest.`);
    return;
  }

  const userTrips: Trip[] = tripParticipations.map(tp => ({id: tp.trip_id, name: (tp.trips as any)?.name || `Trip ${tp.trip_id}` })).filter(Boolean) as Trip[];


  for (const trip of userTrips) {
    // 2. Fetch recent messages for this user in this trip
    //    Adjust query based on your actual 'messages' table structure
    //    This example assumes messages are directly linked to trips and users.
    const { data: messages, error: messagesError } = await supabase
      .from('messages') // ASSUMPTION: table name for messages
      .select('id, content, sender_user_id, created_at, trip_id, users (raw_user_meta_data)') // Fetch sender's name if possible
      .eq('trip_id', trip.id)
      .gte('created_at', twentyFourHoursAgo)
      .order('created_at', { ascending: true });

    if (messagesError) {
      console.error(`Error fetching messages for user ${user.id} in trip ${trip.id}:`, messagesError);
      continue; // Try next trip
    }

    if (!messages || messages.length === 0) {
      console.log(`No recent messages for user ${user.id} in trip ${trip.name}.`);
      continue; // No messages to summarize for this trip
    }

    const messagesToSummarize = messages.map(m => {
        const senderName = (m.users as any)?.raw_user_meta_data?.name || `User ${m.sender_user_id.substring(0,4)}`;
        return `${senderName}: ${m.content}`;
    }).join('\n---\n'); // Simple formatting for the AI

    const sourceMessageIds = messages.map(m => m.id);

    // 3. Call OpenAI to summarize
    const summaryPrompt = `Summarize the following messages from the trip "${trip.name}" for a participant. Focus on key information, logistics, schedule updates, questions, and action items. Present as a concise bulleted list (3-5 points). Ignore casual chat unless it contains important info. Messages:\n\n${messagesToSummarize}`;

    try {
      const completion = await openai.chat.completions.create({
        messages: [
          { role: "system", content: "You are an AI assistant creating a daily digest of trip messages for a busy traveler. Be clear, concise, and focus on actionable or important information." },
          { role: "user", content: summaryPrompt }
        ],
        model: "gpt-3.5-turbo", // Cheaper model for summaries, or use gpt-4-turbo if higher quality is needed
        // max_tokens: 200,
      });

      const digestContent = completion.choices[0]?.message?.content?.trim();
      const tokenUsage = completion.usage;

      if (!digestContent) {
        console.error(`OpenAI returned empty summary for user ${user.id}, trip ${trip.id}.`);
        continue;
      }

      // 4. Store the digest
      const { error: insertError } = await supabase
        .from('daily_digests')
        .insert({
          user_id: user.id,
          trip_id: trip.id,
          digest_title: `Daily Summary for ${trip.name}`,
          digest_content: digestContent,
          summary_prompt: summaryPrompt, // For review
          source_message_ids: sourceMessageIds,
          token_usage: tokenUsage,
          generated_at_utc: new Date().toISOString(),
        });

      if (insertError) {
        console.error(`Error storing digest for user ${user.id}, trip ${trip.id}:`, insertError);
      } else {
        console.log(`Digest stored for user ${user.id}, trip ${trip.name}.`);
        // 5. TODO: Trigger a notification (e.g., push notification)
        // await sendPushNotification(user.id, `Your daily digest for ${trip.name} is ready!`);
      }

    } catch (e) {
      console.error(`Error generating summary with OpenAI for user ${user.id}, trip ${trip.id}:`, e);
    }
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  // Basic security: Ensure this is called by Supabase scheduler or a trusted source.
  // For production, consider a CRON_SECRET in Authorization header.
  // const authHeader = req.headers.get('Authorization');
  // if (authHeader !== `Bearer ${Deno.env.get('CRON_SECRET')}`) {
  //   return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' }});
  // }

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    console.error("Supabase URL or Service Role Key is not configured for Daily Digest Generator.");
    return new Response(JSON.stringify({ error: 'Server configuration error.' }), { status: 500 });
  }
  const supabaseAdminClient = createClient(supabaseUrl, supabaseServiceRoleKey);

  try {
    // Fetch all users to generate digests for.
    // Adjust this to fetch only active users or users with recent activity if needed.
    const { data: users, error: usersError } = await supabaseAdminClient
      .from('users') // Assuming your public users table, or profiles table
      .select('id'); // Fetch necessary fields

    if (usersError) {
      throw new Error(`Failed to fetch users: ${usersError.message}`);
    }

    if (!users || users.length === 0) {
      return new Response(JSON.stringify({ message: "No users to process." }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' }});
    }

    console.log(`Found ${users.length} users to potentially process digests for.`);

    for (const user of users as User[]) {
      await generateDigestForUser(supabaseAdminClient, user);
    }

    return new Response(JSON.stringify({ message: "Daily digest generation process completed." }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (e) {
    console.error("Critical error in Daily Digest Generator function:", e);
    return new Response(JSON.stringify({ error: `Internal Server Error: ${e.message}` }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

// To test locally:
// supabase functions serve daily-digest-generator --no-verify-jwt
// Then call: curl -X POST http://localhost:54321/functions/v1/daily-digest-generator [-H "Authorization: Bearer YOUR_CRON_SECRET_IF_IMPLEMENTED"]
//
// Schedule this function (e.g., daily at 7 AM UTC) in Supabase dashboard or via pg_cron.
// Remember to set SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, OPENAI_API_KEY.
// Also ensure the assumed table names ('trip_participants', 'messages', 'users', 'trips') match your schema.
