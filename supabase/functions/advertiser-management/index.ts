import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { persistSession: false } }
    );

    const authHeader = req.headers.get('Authorization')!;
    const token = authHeader.replace('Bearer ', '');
    const { data: userData, error: userError } = await supabase.auth.getUser(token);
    
    if (userError || !userData.user) {
      throw new Error('User not authenticated');
    }

    const { method } = req;
    const url = new URL(req.url);
    const action = url.searchParams.get('action');

    switch (action) {
      case 'get-profile':
        return await getAdvertiserProfile(supabase, userData.user.id);
      
      case 'create-profile':
        const profileData = await req.json();
        return await createAdvertiserProfile(supabase, userData.user.id, profileData);
      
      case 'update-profile':
        const updateData = await req.json();
        return await updateAdvertiserProfile(supabase, userData.user.id, updateData);
      
      case 'get-campaigns':
        return await getCampaigns(supabase, userData.user.id);
      
      case 'create-campaign':
        const campaignData = await req.json();
        return await createCampaign(supabase, userData.user.id, campaignData);
      
      case 'update-campaign':
        const { campaignId, ...updateCampaignData } = await req.json();
        return await updateCampaign(supabase, userData.user.id, campaignId, updateCampaignData);
      
      case 'get-ad-cards':
        const campaignIdParam = url.searchParams.get('campaignId');
        return await getAdCards(supabase, userData.user.id, campaignIdParam);
      
      case 'create-ad-card':
        const adCardData = await req.json();
        return await createAdCard(supabase, userData.user.id, adCardData);
      
      case 'update-ad-card':
        const { adCardId, ...updateAdCardData } = await req.json();
        return await updateAdCard(supabase, userData.user.id, adCardId, updateAdCardData);

      default:
        throw new Error('Invalid action');
    }
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});

async function getAdvertiserProfile(supabase: any, userId: string) {
  const { data, error } = await supabase
    .from('advertiser_profiles')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error && error.code !== 'PGRST116') {
    throw error;
  }

  return new Response(
    JSON.stringify({ profile: data }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function createAdvertiserProfile(supabase: any, userId: string, profileData: any) {
  const { data, error } = await supabase
    .from('advertiser_profiles')
    .insert({
      user_id: userId,
      company_name: profileData.company_name,
      company_logo_url: profileData.company_logo_url,
      contact_email: profileData.contact_email,
      contact_phone: profileData.contact_phone,
      business_address: profileData.business_address,
      business_description: profileData.business_description,
      website_url: profileData.website_url,
    })
    .select()
    .single();

  if (error) throw error;

  return new Response(
    JSON.stringify({ profile: data }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function updateAdvertiserProfile(supabase: any, userId: string, updateData: any) {
  const { data, error } = await supabase
    .from('advertiser_profiles')
    .update(updateData)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) throw error;

  return new Response(
    JSON.stringify({ profile: data }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function getCampaigns(supabase: any, userId: string) {
  const { data: profile } = await supabase
    .from('advertiser_profiles')
    .select('id')
    .eq('user_id', userId)
    .single();

  if (!profile) {
    throw new Error('Advertiser profile not found');
  }

  const { data, error } = await supabase
    .from('campaigns')
    .select(`
      *,
      ad_cards (count)
    `)
    .eq('advertiser_id', profile.id)
    .order('created_at', { ascending: false });

  if (error) throw error;

  return new Response(
    JSON.stringify({ campaigns: data }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function createCampaign(supabase: any, userId: string, campaignData: any) {
  const { data: profile } = await supabase
    .from('advertiser_profiles')
    .select('id')
    .eq('user_id', userId)
    .single();

  if (!profile) {
    throw new Error('Advertiser profile not found');
  }

  const { data, error } = await supabase
    .from('campaigns')
    .insert({
      advertiser_id: profile.id,
      name: campaignData.name,
      start_date: campaignData.start_date,
      end_date: campaignData.end_date,
      budget_amount: campaignData.budget_amount,
      status: 'draft'
    })
    .select()
    .single();

  if (error) throw error;

  return new Response(
    JSON.stringify({ campaign: data }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function updateCampaign(supabase: any, userId: string, campaignId: string, updateData: any) {
  const { data: profile } = await supabase
    .from('advertiser_profiles')
    .select('id')
    .eq('user_id', userId)
    .single();

  if (!profile) {
    throw new Error('Advertiser profile not found');
  }

  const { data, error } = await supabase
    .from('campaigns')
    .update(updateData)
    .eq('id', campaignId)
    .eq('advertiser_id', profile.id)
    .select()
    .single();

  if (error) throw error;

  return new Response(
    JSON.stringify({ campaign: data }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function getAdCards(supabase: any, userId: string, campaignId?: string) {
  const { data: profile } = await supabase
    .from('advertiser_profiles')
    .select('id')
    .eq('user_id', userId)
    .single();

  if (!profile) {
    throw new Error('Advertiser profile not found');
  }

  let query = supabase
    .from('ad_cards')
    .select(`
      *,
      campaigns!inner (
        id,
        name,
        advertiser_id
      )
    `)
    .eq('campaigns.advertiser_id', profile.id);

  if (campaignId) {
    query = query.eq('campaign_id', campaignId);
  }

  const { data, error } = await query.order('created_at', { ascending: false });

  if (error) throw error;

  return new Response(
    JSON.stringify({ ad_cards: data }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function createAdCard(supabase: any, userId: string, adCardData: any) {
  // Verify campaign ownership
  const { data: campaign } = await supabase
    .from('campaigns')
    .select(`
      id,
      advertiser_profiles!inner (user_id)
    `)
    .eq('id', adCardData.campaign_id)
    .eq('advertiser_profiles.user_id', userId)
    .single();

  if (!campaign) {
    throw new Error('Campaign not found or access denied');
  }

  const { data, error } = await supabase
    .from('ad_cards')
    .insert({
      campaign_id: adCardData.campaign_id,
      title: adCardData.title,
      description: adCardData.description,
      image_url: adCardData.image_url,
      external_link: adCardData.external_link,
      category: adCardData.category,
      tags: adCardData.tags || [],
      location_city: adCardData.location_city,
      location_coordinates: adCardData.location_coordinates,
      cta_text: adCardData.cta_text || 'Learn More',
      moderation_status: 'pending'
    })
    .select()
    .single();

  if (error) throw error;

  // Add to moderation queue
  await supabase
    .from('moderation_queue')
    .insert({
      ad_card_id: data.id,
      status: 'pending',
      priority: 1
    });

  return new Response(
    JSON.stringify({ ad_card: data }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function updateAdCard(supabase: any, userId: string, adCardId: string, updateData: any) {
  // Verify ad card ownership
  const { data: adCard } = await supabase
    .from('ad_cards')
    .select(`
      id,
      campaigns!inner (
        advertiser_profiles!inner (user_id)
      )
    `)
    .eq('id', adCardId)
    .eq('campaigns.advertiser_profiles.user_id', userId)
    .single();

  if (!adCard) {
    throw new Error('Ad card not found or access denied');
  }

  const { data, error } = await supabase
    .from('ad_cards')
    .update(updateData)
    .eq('id', adCardId)
    .select()
    .single();

  if (error) throw error;

  return new Response(
    JSON.stringify({ ad_card: data }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}