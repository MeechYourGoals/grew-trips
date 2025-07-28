import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { validateAndSanitizeInput, checkRateLimit, addSecurityHeaders } from "../_shared/security.ts";

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Rate limiting
    const clientIP = req.headers.get('x-forwarded-for') || 'unknown';
    const rateLimit = checkRateLimit(clientIP, 100, 60000);
    
    if (!rateLimit.allowed) {
      return new Response(
        JSON.stringify({ error: 'Rate limit exceeded' }),
        { 
          status: 429, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const url = new URL(req.url);
    const endpoint = url.pathname.split('/').pop();
    
    const apiKey = Deno.env.get('GOOGLE_MAPS_API_KEY');
    if (!apiKey) {
      throw new Error('Google Maps API key not configured');
    }

    switch (endpoint) {
      case 'embed-url': {
        const requestData = await req.json();
        const validation = validateAndSanitizeInput(requestData);
        
        if (!validation.isValid) {
          throw new Error(validation.error || 'Invalid input');
        }
        
        const { query } = validation.sanitized!;
        if (!query || query.length === 0) {
          throw new Error('Query parameter is required');
        }
        
        const embedUrl = `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${encodeURIComponent(query)}&zoom=12`;
        
        const response = new Response(
          JSON.stringify({ embedUrl }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
        
        return addSecurityHeaders(response);
      }

      case 'distance-matrix': {
        const requestData = await req.json();
        const validation = validateAndSanitizeInput(requestData);
        
        if (!validation.isValid) {
          throw new Error(validation.error || 'Invalid input');
        }
        
        const { origins, destinations, mode = 'DRIVING' } = validation.sanitized!;
        if (!origins || !destinations) {
          throw new Error('Origins and destinations are required');
        }

        const apiUrl = `https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=${origins}&destinations=${destinations}&mode=${mode}&key=${apiKey}`;
        
        const response = await fetch(apiUrl);
        const data = await response.json();
        
        const result = new Response(
          JSON.stringify(data),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
        
        return addSecurityHeaders(result);
      }

      case 'geocode': {
        const requestData = await req.json();
        const validation = validateAndSanitizeInput(requestData);
        
        if (!validation.isValid) {
          throw new Error(validation.error || 'Invalid input');
        }
        
        const { address } = validation.sanitized!;
        if (!address) {
          throw new Error('Address parameter is required');
        }

        const apiUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;
        
        const response = await fetch(apiUrl);
        const data = await response.json();
        
        const result = new Response(
          JSON.stringify(data),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
        
        return addSecurityHeaders(result);
      }

      default:
        throw new Error('Invalid endpoint');
    }

  } catch (error) {
    console.error('Google Maps proxy error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});