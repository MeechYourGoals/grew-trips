import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AcceptInviteRequest {
  token: string;
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

    const { token }: AcceptInviteRequest = await req.json();

    console.log('Accepting invite with token:', token);

    // Find the invite
    const { data: invite, error: inviteError } = await supabase
      .from('organization_invites')
      .select('*')
      .eq('token', token)
      .eq('status', 'pending')
      .single();

    if (inviteError || !invite) {
      throw new Error('Invalid or expired invitation');
    }

    // Check if invite has expired
    if (new Date(invite.expires_at) < new Date()) {
      await supabase
        .from('organization_invites')
        .update({ status: 'expired' })
        .eq('id', invite.id);
      
      throw new Error('Invitation has expired');
    }

    // Check if user email matches invite
    if (user.email !== invite.email) {
      throw new Error('This invitation was sent to a different email address');
    }

    // Check if user is already a member
    const { data: existingMember } = await supabase
      .from('organization_members')
      .select('id')
      .eq('organization_id', invite.organization_id)
      .eq('user_id', user.id)
      .single();

    if (existingMember) {
      // Mark invite as accepted even though user was already a member
      await supabase
        .from('organization_invites')
        .update({ status: 'accepted' })
        .eq('id', invite.id);
      
      throw new Error('You are already a member of this organization');
    }

    // Check seat availability
    const { data: org, error: orgError } = await supabase
      .from('organizations')
      .select('seat_limit, seats_used')
      .eq('id', invite.organization_id)
      .single();

    if (orgError || !org) {
      throw new Error('Organization not found');
    }

    if (org.seats_used >= org.seat_limit) {
      throw new Error('Organization has reached its seat limit');
    }

    // Generate seat ID
    const seatId = `seat-${String(org.seats_used + 1).padStart(3, '0')}`;

    // Create organization membership
    const { error: memberError } = await supabase
      .from('organization_members')
      .insert({
        organization_id: invite.organization_id,
        user_id: user.id,
        role: invite.role,
        invited_by: invite.invited_by,
        seat_id: seatId,
        status: 'active'
      });

    if (memberError) {
      console.error('Error creating membership:', memberError);
      throw new Error('Failed to create membership');
    }

    // Update organization seats_used
    const { error: updateError } = await supabase
      .from('organizations')
      .update({ seats_used: org.seats_used + 1 })
      .eq('id', invite.organization_id);

    if (updateError) {
      console.error('Error updating seats:', updateError);
    }

    // Grant pro role to user
    const { error: roleError } = await supabase
      .from('user_roles')
      .insert({
        user_id: user.id,
        role: 'pro'
      })
      .select();

    if (roleError && roleError.code !== '23505') { // Ignore duplicate key error
      console.error('Error granting pro role:', roleError);
    }

    // Mark invite as accepted
    await supabase
      .from('organization_invites')
      .update({ status: 'accepted' })
      .eq('id', invite.id);

    console.log('Invite accepted successfully');

    return new Response(
      JSON.stringify({ 
        success: true,
        organizationId: invite.organization_id,
        seatId
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Error in accept-organization-invite:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    );
  }
});