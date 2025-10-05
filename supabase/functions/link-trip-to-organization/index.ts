import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface LinkTripRequest {
  tripId: string;
  organizationId: string;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get user from auth header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const { data: { user }, error: userError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (userError || !user) {
      throw new Error('Unauthorized');
    }

    const { tripId, organizationId }: LinkTripRequest = await req.json();

    console.log('Linking trip to organization:', { tripId, organizationId, userId: user.id });

    // Verify user is member of the organization
    const { data: membership, error: membershipError } = await supabase
      .from('organization_members')
      .select('role')
      .eq('organization_id', organizationId)
      .eq('user_id', user.id)
      .eq('status', 'active')
      .single();

    if (membershipError || !membership) {
      throw new Error('You must be a member of this organization');
    }

    // Verify trip exists and user is trip creator
    const { data: trip, error: tripError } = await supabase
      .from('trips')
      .select('created_by, trip_type')
      .eq('id', tripId)
      .single();

    if (tripError || !trip) {
      throw new Error('Trip not found');
    }

    if (trip.created_by !== user.id) {
      throw new Error('Only the trip creator can link it to an organization');
    }

    if (trip.trip_type !== 'pro' && trip.trip_type !== 'event') {
      throw new Error('Only Pro and Event trips can be linked to organizations');
    }

    // Check if already linked
    const { data: existingLink } = await supabase
      .from('pro_trip_organizations')
      .select('id')
      .eq('trip_id', tripId)
      .eq('organization_id', organizationId)
      .single();

    if (existingLink) {
      throw new Error('Trip is already linked to this organization');
    }

    // Create the link
    const { data: link, error: linkError } = await supabase
      .from('pro_trip_organizations')
      .insert({
        trip_id: tripId,
        organization_id: organizationId,
        created_by: user.id
      })
      .select()
      .single();

    if (linkError) {
      console.error('Error linking trip:', linkError);
      throw new Error('Failed to link trip to organization');
    }

    console.log('Trip linked successfully:', link.id);

    return new Response(
      JSON.stringify({ 
        success: true,
        linkId: link.id
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Error in link-trip-to-organization:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    );
  }
});