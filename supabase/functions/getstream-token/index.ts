import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { StreamChat } from 'https://esm.sh/stream-chat@9.10.0';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders } from "../_shared/cors.ts";

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify JWT token for authentication
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new Error('Authorization header required');
    }

    const token = authHeader.replace('Bearer ', '');
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const { data: user, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user.user) {
      throw new Error('Invalid authentication token');
    }
    const { user_id, user_name, user_avatar } = await req.json();
    
    // Ensure the authenticated user matches the requested user_id
    if (user.user.id !== user_id) {
      throw new Error('User ID mismatch');
    }

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