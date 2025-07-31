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

    const requestData = await req.json();
    const { endpoint, ...data } = requestData;
    
    const apiKey = Deno.env.get('GOOGLE_MAPS_API_KEY');
    if (!apiKey) {
      console.error('Google Maps API key not found in environment');
      throw new Error('Google Maps API key not configured');
    }

    switch (endpoint) {
      case 'embed-url': {
        const validation = validateAndSanitizeInput(data);
        
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
        const validation = validateAndSanitizeInput(data);
        
        if (!validation.isValid) {
          throw new Error(validation.error || 'Invalid input');
        }
        
        const { origins, destinations, mode = 'DRIVING' } = validation.sanitized!;
        if (!origins || !destinations) {
          throw new Error('Origins and destinations are required');
        }

        const apiUrl = `https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=${origins}&destinations=${destinations}&mode=${mode}&key=${apiKey}`;
        
        const apiResponse = await fetch(apiUrl);
        const apiData = await apiResponse.json();
        
        console.log('Distance Matrix API response:', apiData);
        
        const result = new Response(
          JSON.stringify(apiData),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
        
        return addSecurityHeaders(result);
      }

      case 'geocode': {
        const validation = validateAndSanitizeInput(data);
        
        if (!validation.isValid) {
          throw new Error(validation.error || 'Invalid input');
        }
        
        const { address } = validation.sanitized!;
        if (!address) {
          throw new Error('Address parameter is required');
        }

        console.log('Geocoding address:', address);
        const apiUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;
        
        const apiResponse = await fetch(apiUrl);
        const apiData = await apiResponse.json();
        
        console.log('Geocoding API response:', apiData);
        
        const result = new Response(
          JSON.stringify(apiData),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
        
        return addSecurityHeaders(result);
      }

      case 'places-search': {
        const validation = validateAndSanitizeInput(data);
        
        if (!validation.isValid) {
          throw new Error(validation.error || 'Invalid input');
        }
        
        const { query, location, radius = 5000 } = validation.sanitized!;
        if (!query || !location) {
          throw new Error('Query and location parameters are required');
        }

        const apiUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&location=${location}&radius=${radius}&key=${apiKey}`;
        
        const apiResponse = await fetch(apiUrl);
        const apiData = await apiResponse.json();
        
        const result = new Response(
          JSON.stringify(apiData),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
        
        return addSecurityHeaders(result);
      }

      case 'place-details': {
        const validation = validateAndSanitizeInput(data);
        
        if (!validation.isValid) {
          throw new Error(validation.error || 'Invalid input');
        }
        
        const { placeId } = validation.sanitized!;
        if (!placeId) {
          throw new Error('PlaceId parameter is required');
        }

        const apiUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${apiKey}`;
        
        const apiResponse = await fetch(apiUrl);
        const apiData = await apiResponse.json();
        
        const result = new Response(
          JSON.stringify(apiData),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
        
        return addSecurityHeaders(result);
      }

      default:
        throw new Error(`Invalid endpoint: ${endpoint}`);
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