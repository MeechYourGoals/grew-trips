-- Travel Wallet Tables
CREATE TABLE public.loyalty_airlines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  airline TEXT NOT NULL,
  program_name TEXT NOT NULL,
  membership_number TEXT NOT NULL,
  tier TEXT,
  is_preferred BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, airline, membership_number)
);

CREATE TABLE public.loyalty_hotels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  hotel_chain TEXT NOT NULL,
  program_name TEXT NOT NULL,
  membership_number TEXT NOT NULL,
  tier TEXT,
  is_preferred BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, hotel_chain, membership_number)
);

CREATE TABLE public.loyalty_rentals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  company TEXT NOT NULL,
  program_name TEXT NOT NULL,
  membership_number TEXT NOT NULL,
  tier TEXT,
  is_preferred BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, company, membership_number)
);

-- Enable RLS
ALTER TABLE public.loyalty_airlines ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.loyalty_hotels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.loyalty_rentals ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users manage own airline programs"
  ON public.loyalty_airlines
  FOR ALL USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users manage own hotel programs"
  ON public.loyalty_hotels
  FOR ALL USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users manage own rental programs"
  ON public.loyalty_rentals
  FOR ALL USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Triggers
CREATE TRIGGER update_loyalty_airlines_updated_at
  BEFORE UPDATE ON public.loyalty_airlines
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_loyalty_hotels_updated_at
  BEFORE UPDATE ON public.loyalty_hotels
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_loyalty_rentals_updated_at
  BEFORE UPDATE ON public.loyalty_rentals
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Game Schedule Table
CREATE TABLE public.game_schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE NOT NULL,
  trip_id TEXT REFERENCES public.trips(id) ON DELETE CASCADE,
  opponent TEXT NOT NULL,
  venue TEXT NOT NULL,
  venue_address TEXT,
  game_date DATE NOT NULL,
  game_time TIME NOT NULL,
  load_in_time TIME,
  is_home BOOLEAN DEFAULT true,
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'confirmed', 'completed', 'cancelled')),
  created_by UUID NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.game_schedules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Org members manage game schedules"
  ON public.game_schedules
  FOR ALL USING (
    is_org_member(auth.uid(), organization_id)
  )
  WITH CHECK (
    is_org_member(auth.uid(), organization_id)
  );

CREATE TRIGGER update_game_schedules_updated_at
  BEFORE UPDATE ON public.game_schedules
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Show Schedule Table
CREATE TABLE public.show_schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE NOT NULL,
  trip_id TEXT REFERENCES public.trips(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  venue TEXT NOT NULL,
  venue_address TEXT,
  show_date DATE NOT NULL,
  show_time TIME NOT NULL,
  soundcheck_time TIME,
  load_in_time TIME,
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'confirmed', 'completed', 'cancelled')),
  created_by UUID NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.show_schedules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Org members manage show schedules"
  ON public.show_schedules
  FOR ALL USING (
    is_org_member(auth.uid(), organization_id)
  )
  WITH CHECK (
    is_org_member(auth.uid(), organization_id)
  );

CREATE TRIGGER update_show_schedules_updated_at
  BEFORE UPDATE ON public.show_schedules
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();