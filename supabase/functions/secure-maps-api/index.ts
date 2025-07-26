import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.ts";

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Get authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Authorization required' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Verify user authentication
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      global: { headers: { Authorization: authHeader } }
    });

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid authentication' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { action, ...params } = await req.json();
    
    const googleMapsApiKey = Deno.env.get('GOOGLE_MAPS_API_KEY');
    if (!googleMapsApiKey) {
      return new Response(
        JSON.stringify({ error: 'Maps service unavailable' }),
        { status: 503, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    let response;
    
    switch (action) {
      case 'distance_matrix':
        response = await handleDistanceMatrix(googleMapsApiKey, params);
        break;
      case 'geocode':
        response = await handleGeocode(googleMapsApiKey, params);
        break;
      case 'embed_url':
        response = await handleEmbedUrl(googleMapsApiKey, params);
        break;
      default:
        return new Response(
          JSON.stringify({ error: 'Invalid action' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }

    return new Response(
      JSON.stringify(response),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Secure Maps API Error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

async function handleDistanceMatrix(apiKey: string, params: any) {
  const { origins, destinations, mode = 'driving' } = params;
  
  if (!origins || !destinations) {
    throw new Error('Origins and destinations required');
  }

  const url = `https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=${encodeURIComponent(origins)}&destinations=${encodeURIComponent(destinations)}&mode=${mode.toUpperCase()}&key=${apiKey}`;
  
  const response = await fetch(url);
  const data = await response.json();
  
  return { success: true, data };
}

async function handleGeocode(apiKey: string, params: any) {
  const { address } = params;
  
  if (!address) {
    throw new Error('Address required');
  }

  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;
  
  const response = await fetch(url);
  const data = await response.json();
  
  return { success: true, data };
}

async function handleEmbedUrl(apiKey: string, params: any) {
  const { query, zoom = 12 } = params;
  
  if (!query) {
    throw new Error('Query required');
  }

  // Return a secure embed URL without exposing the API key
  const embedUrl = `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${encodeURIComponent(query)}&zoom=${zoom}`;
  
  return { success: true, embedUrl };
}