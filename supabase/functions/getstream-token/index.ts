import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { StreamChat } from 'https://esm.sh/stream-chat@9.10.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { user_id, user_name, user_avatar } = await req.json();

    if (!user_id || !user_name) {
      throw new Error('Missing required fields: user_id, user_name');
    }

    // Initialize Stream Chat server client
    const streamApiKey = Deno.env.get('STREAM_API_KEY');
    const streamApiSecret = Deno.env.get('STREAM_API_SECRET');

    if (!streamApiKey || !streamApiSecret) {
      throw new Error('Stream API credentials not configured');
    }

    const serverClient = StreamChat.getInstance(streamApiKey, streamApiSecret);

    // Create or update user in GetStream
    await serverClient.upsertUser({
      id: user_id,
      name: user_name,
      image: user_avatar || undefined,
    });

    // Generate user token
    const token = serverClient.createToken(user_id);

    return new Response(
      JSON.stringify({ 
        token,
        api_key: streamApiKey,
        user_id 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error generating GetStream token:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});