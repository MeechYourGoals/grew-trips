-- Create advertiser profiles table
CREATE TABLE public.advertiser_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  company_name TEXT NOT NULL,
  company_logo_url TEXT,
  contact_email TEXT NOT NULL,
  contact_phone TEXT,
  business_address TEXT,
  business_description TEXT,
  website_url TEXT,
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create campaigns table
CREATE TABLE public.campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  advertiser_id UUID NOT NULL REFERENCES public.advertiser_profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'pending', 'active', 'paused', 'completed', 'rejected')),
  start_date TIMESTAMPTZ,
  end_date TIMESTAMPTZ,
  budget_amount DECIMAL(10,2),
  total_impressions INTEGER DEFAULT 0,
  total_clicks INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create ad cards table
CREATE TABLE public.ad_cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID NOT NULL REFERENCES public.campaigns(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT NOT NULL,
  external_link TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('hotel', 'restaurant', 'activity', 'tour', 'experience', 'transportation')),
  tags TEXT[] DEFAULT '{}',
  location_city TEXT,
  location_coordinates JSONB,
  is_sponsored BOOLEAN DEFAULT true,
  sponsor_badge TEXT DEFAULT 'Promoted',
  cta_text TEXT DEFAULT 'Learn More',
  moderation_status TEXT DEFAULT 'pending' CHECK (moderation_status IN ('pending', 'approved', 'rejected')),
  moderation_notes TEXT,
  impressions INTEGER DEFAULT 0,
  clicks INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create campaign performance tracking table
CREATE TABLE public.campaign_performance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID NOT NULL REFERENCES public.campaigns(id) ON DELETE CASCADE,
  ad_card_id UUID NOT NULL REFERENCES public.ad_cards(id) ON DELETE CASCADE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  impressions INTEGER DEFAULT 0,
  clicks INTEGER DEFAULT 0,
  ctr DECIMAL(5,4) DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create moderation queue table
CREATE TABLE public.moderation_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ad_card_id UUID NOT NULL REFERENCES public.ad_cards(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_review', 'approved', 'rejected')),
  assigned_moderator UUID REFERENCES auth.users(id),
  priority INTEGER DEFAULT 1,
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  reviewed_at TIMESTAMPTZ,
  notes TEXT
);

-- Enable RLS on all tables
ALTER TABLE public.advertiser_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ad_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaign_performance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.moderation_queue ENABLE ROW LEVEL SECURITY;

-- RLS Policies for advertiser_profiles
CREATE POLICY "Advertisers can view their own profile" ON public.advertiser_profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Advertisers can update their own profile" ON public.advertiser_profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own advertiser profile" ON public.advertiser_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for campaigns
CREATE POLICY "Advertisers can view their own campaigns" ON public.campaigns
  FOR SELECT USING (
    advertiser_id IN (
      SELECT id FROM public.advertiser_profiles WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Advertisers can manage their own campaigns" ON public.campaigns
  FOR ALL USING (
    advertiser_id IN (
      SELECT id FROM public.advertiser_profiles WHERE user_id = auth.uid()
    )
  );

-- RLS Policies for ad_cards
CREATE POLICY "Advertisers can view their own ad cards" ON public.ad_cards
  FOR SELECT USING (
    campaign_id IN (
      SELECT c.id FROM public.campaigns c
      JOIN public.advertiser_profiles ap ON ap.id = c.advertiser_id
      WHERE ap.user_id = auth.uid()
    )
  );

CREATE POLICY "Advertisers can manage their own ad cards" ON public.ad_cards
  FOR ALL USING (
    campaign_id IN (
      SELECT c.id FROM public.campaigns c
      JOIN public.advertiser_profiles ap ON ap.id = c.advertiser_id
      WHERE ap.user_id = auth.uid()
    )
  );

CREATE POLICY "Public can view approved ad cards" ON public.ad_cards
  FOR SELECT USING (moderation_status = 'approved');

-- RLS Policies for campaign_performance
CREATE POLICY "Advertisers can view their own performance data" ON public.campaign_performance
  FOR SELECT USING (
    campaign_id IN (
      SELECT c.id FROM public.campaigns c
      JOIN public.advertiser_profiles ap ON ap.id = c.advertiser_id
      WHERE ap.user_id = auth.uid()
    )
  );

-- RLS Policies for moderation_queue (admin only)
CREATE POLICY "Only admins can access moderation queue" ON public.moderation_queue
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Create indexes for performance
CREATE INDEX idx_campaigns_advertiser_id ON public.campaigns(advertiser_id);
CREATE INDEX idx_campaigns_status ON public.campaigns(status);
CREATE INDEX idx_ad_cards_campaign_id ON public.ad_cards(campaign_id);
CREATE INDEX idx_ad_cards_category ON public.ad_cards(category);
CREATE INDEX idx_ad_cards_moderation_status ON public.ad_cards(moderation_status);
CREATE INDEX idx_campaign_performance_campaign_id ON public.campaign_performance(campaign_id);
CREATE INDEX idx_campaign_performance_date ON public.campaign_performance(date);
CREATE INDEX idx_moderation_queue_status ON public.moderation_queue(status);

-- Create trigger for updated_at columns
CREATE TRIGGER update_advertiser_profiles_updated_at
  BEFORE UPDATE ON public.advertiser_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_campaigns_updated_at
  BEFORE UPDATE ON public.campaigns
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_ad_cards_updated_at
  BEFORE UPDATE ON public.ad_cards
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();