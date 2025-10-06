import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders } from "../_shared/cors.ts";

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      throw new Error('Authorization header required');
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const { data: { user }, error: authError } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''));
    
    if (authError || !user) {
      throw new Error('Invalid authentication token');
    }

    const { name, description, destination, start_date, end_date, trip_type, cover_image_url } = await req.json();

    // Validation
    if (!name || name.trim().length === 0) {
      throw new Error('Trip name is required');
    }
    if (name.length > 100) {
      throw new Error('Trip name must be less than 100 characters');
    }
    if (trip_type && !['consumer', 'pro', 'event'].includes(trip_type)) {
      throw new Error('Invalid trip type');
    }

    // Check Pro tier access for pro/event trips
    if (trip_type === 'pro' || trip_type === 'event') {
      const { data: roleData } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .eq('role', 'pro')
        .single();

      if (!roleData) {
        throw new Error('Pro subscription required to create professional trips');
      }
    }

    // Create trip
    const { data: trip, error: tripError } = await supabase
      .from('trips')
      .insert({
        name,
        description,
        destination,
        start_date,
        end_date,
        trip_type: trip_type || 'consumer',
        cover_image_url,
        created_by: user.id
      })
      .select()
      .single();

    if (tripError) throw tripError;

    // Add creator as admin member
    const { error: memberError } = await supabase
      .from('trip_members')
      .insert({
        trip_id: trip.id,
        user_id: user.id,
        role: 'admin'
      });

    if (memberError) throw memberError;

    console.log(`Trip created: ${trip.id} by user ${user.id}`);

    return new Response(
      JSON.stringify({ success: true, trip }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error creating trip:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
