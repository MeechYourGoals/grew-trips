import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface InviteRequest {
  organizationId: string;
  email: string;
  role: 'admin' | 'member';
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

    const { organizationId, email, role }: InviteRequest = await req.json();

    console.log('Inviting member:', { organizationId, email, role, invitedBy: user.id });

    // Verify user is admin of the organization
    const { data: membership, error: membershipError } = await supabase
      .from('organization_members')
      .select('role')
      .eq('organization_id', organizationId)
      .eq('user_id', user.id)
      .eq('status', 'active')
      .single();

    if (membershipError || !membership || (membership.role !== 'admin' && membership.role !== 'owner')) {
      throw new Error('Only organization admins can invite members');
    }

    // Generate unique invite token
    const token = crypto.randomUUID();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days expiry

    // Create invite record
    const { data: invite, error: inviteError } = await supabase
      .from('organization_invites')
      .insert({
        organization_id: organizationId,
        email,
        role,
        invited_by: user.id,
        token,
        expires_at: expiresAt.toISOString(),
        status: 'pending'
      })
      .select()
      .single();

    if (inviteError) {
      console.error('Error creating invite:', inviteError);
      throw new Error('Failed to create invitation');
    }

    // Get organization details for email
    const { data: org } = await supabase
      .from('organizations')
      .select('display_name')
      .eq('id', organizationId)
      .single();

    const inviteLink = `https://20feaa04-0946-4c68-a68d-0eb88cc1b9c4.lovableproject.com/accept-invite/${token}`;
    
    // TODO: Integrate with email service (Resend, SendGrid, etc.)
    // For now, we'll log the invite details
    console.log('Invite created successfully:', {
      inviteId: invite.id,
      email,
      organizationName: org?.display_name,
      inviteLink
    });

    // Email template to be sent:
    // Subject: You've been invited to join {org.display_name} on Chravel
    // Body:
    // Hi,
    // 
    // You've been invited to join {org.display_name} on Chravel as a {role}.
    // 
    // Click here to accept your invitation: {inviteLink}
    // 
    // This invitation expires in 7 days.
    // 
    // Best,
    // The Chravel Team

    return new Response(
      JSON.stringify({ 
        success: true, 
        invite: {
          id: invite.id,
          token,
          expiresAt: expiresAt.toISOString(),
          inviteLink
        }
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Error in invite-organization-member:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    );
  }
});