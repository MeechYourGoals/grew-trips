import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.3';

/**
 * @description CORS headers for cross-origin requests.
 */
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

/**
 * @description Supabase edge function for adding or updating a reaction to a broadcast message.
 * It authenticates the user and then upserts their reaction into the `broadcast_reactions`
 * table. It returns the updated reaction counts for the broadcast.
 *
 * @param {Request} req - The incoming request object.
 * @param {object} req.body - The JSON body of the request.
 * @param {string} req.body.broadcast_id - The ID of the broadcast to react to.
 * @param {string} req.body.reaction_type - The type of reaction ('coming', 'wait', or 'cant').
 *
 * @returns {Response} A response object containing the saved reaction and updated counts.
 * @returns {object} Response.body.reaction - The reaction object that was created or updated.
 * @returns {object} Response.body.counts - An object with the total counts for each reaction type.
 * @returns {object} Response.body.error - An error message if something went wrong.
 */
serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Missing authorization header');
    }

    // Get user from auth token
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      throw new Error('Invalid authentication token');
    }

    const { broadcast_id, reaction_type } = await req.json();

    if (!broadcast_id || !reaction_type) {
      throw new Error('Missing required fields: broadcast_id, reaction_type');
    }

    if (!['coming', 'wait', 'cant'].includes(reaction_type)) {
      throw new Error('Invalid reaction_type. Must be: coming, wait, or cant');
    }

    // Get user profile for reaction info
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('display_name')
      .eq('user_id', user.id)
      .single();

    const userName = profile?.display_name || user.email?.split('@')[0] || 'Unknown User';

    // Upsert reaction (update if exists, insert if not)
    const { data: reaction, error: reactionError } = await supabase
      .from('broadcast_reactions')
      .upsert({
        broadcast_id,
        user_id: user.id,
        user_name: userName,
        reaction_type,
        created_at: new Date().toISOString(),
      }, {
        onConflict: 'broadcast_id,user_id'
      })
      .select()
      .single();

    if (reactionError) {
      console.error('Error creating/updating reaction:', reactionError);
      throw new Error('Failed to save reaction');
    }

    // Get updated reaction counts
    const { data: reactionCounts, error: countsError } = await supabase
      .from('broadcast_reactions')
      .select('reaction_type')
      .eq('broadcast_id', broadcast_id);

    if (countsError) {
      console.error('Error fetching reaction counts:', countsError);
    }

    // Calculate counts
    const counts = {
      coming: reactionCounts?.filter(r => r.reaction_type === 'coming').length || 0,
      wait: reactionCounts?.filter(r => r.reaction_type === 'wait').length || 0,
      cant: reactionCounts?.filter(r => r.reaction_type === 'cant').length || 0,
    };

    return new Response(
      JSON.stringify({ 
        success: true, 
        reaction,
        counts
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in broadcasts-react function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});