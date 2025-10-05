-- Create organization types and core tables for Chravel Pro enterprise features

-- Organization subscription tiers enum
CREATE TYPE public.org_subscription_tier AS ENUM ('starter', 'growing', 'enterprise', 'enterprise-plus');

-- Organization status enum
CREATE TYPE public.org_status AS ENUM ('active', 'trial', 'cancelled', 'expired', 'suspended');

-- Organization member role enum
CREATE TYPE public.org_member_role AS ENUM ('owner', 'admin', 'member');

-- App role enum for system-wide permissions
CREATE TYPE public.app_role AS ENUM ('consumer', 'pro', 'enterprise_admin');

-- Organizations table
CREATE TABLE public.organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  display_name TEXT NOT NULL,
  subscription_tier org_subscription_tier NOT NULL DEFAULT 'starter',
  subscription_status org_status NOT NULL DEFAULT 'trial',
  seat_limit INTEGER NOT NULL DEFAULT 25,
  seats_used INTEGER NOT NULL DEFAULT 0,
  billing_email TEXT NOT NULL,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  trial_ends_at TIMESTAMPTZ,
  subscription_ends_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT seat_limit_positive CHECK (seat_limit > 0),
  CONSTRAINT seats_used_within_limit CHECK (seats_used <= seat_limit)
);

-- Organization members table (seat assignments)
CREATE TABLE public.organization_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role org_member_role NOT NULL DEFAULT 'member',
  seat_id TEXT NOT NULL,
  invited_by UUID REFERENCES auth.users(id),
  joined_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'pending', 'suspended')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (organization_id, user_id),
  UNIQUE (organization_id, seat_id)
);

-- Organization invites table
CREATE TABLE public.organization_invites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  invited_by UUID NOT NULL REFERENCES auth.users(id),
  role org_member_role NOT NULL DEFAULT 'member',
  token TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMPTZ NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'expired', 'cancelled')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (organization_id, email, status)
);

-- User roles table for app-wide role management
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Pro trips association with organizations
CREATE TABLE public.pro_trip_organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id TEXT NOT NULL,
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  created_by UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (trip_id, organization_id)
);

-- Enable RLS on all tables
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_invites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pro_trip_organizations ENABLE ROW LEVEL SECURITY;

-- Security definer function to check user role
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Security definer function to check organization membership
CREATE OR REPLACE FUNCTION public.is_org_member(_user_id UUID, _org_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.organization_members
    WHERE user_id = _user_id 
      AND organization_id = _org_id 
      AND status = 'active'
  )
$$;

-- Security definer function to check organization admin
CREATE OR REPLACE FUNCTION public.is_org_admin(_user_id UUID, _org_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.organization_members
    WHERE user_id = _user_id 
      AND organization_id = _org_id 
      AND role IN ('owner', 'admin')
      AND status = 'active'
  )
$$;

-- RLS Policies for organizations
CREATE POLICY "Organization members can view their organizations"
  ON public.organizations FOR SELECT
  USING (public.is_org_member(auth.uid(), id));

CREATE POLICY "Organization admins can update their organizations"
  ON public.organizations FOR UPDATE
  USING (public.is_org_admin(auth.uid(), id));

CREATE POLICY "Authenticated users can create organizations"
  ON public.organizations FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- RLS Policies for organization_members
CREATE POLICY "Organization members can view their org members"
  ON public.organization_members FOR SELECT
  USING (public.is_org_member(auth.uid(), organization_id));

CREATE POLICY "Organization admins can manage members"
  ON public.organization_members FOR ALL
  USING (public.is_org_admin(auth.uid(), organization_id));

-- RLS Policies for organization_invites
CREATE POLICY "Organization admins can manage invites"
  ON public.organization_invites FOR ALL
  USING (public.is_org_admin(auth.uid(), organization_id));

CREATE POLICY "Anyone can view pending invites by token"
  ON public.organization_invites FOR SELECT
  USING (status = 'pending' AND expires_at > now());

-- RLS Policies for user_roles
CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT
  USING (auth.uid() = user_id);

-- RLS Policies for pro_trip_organizations
CREATE POLICY "Organization members can view their org trips"
  ON public.pro_trip_organizations FOR SELECT
  USING (public.is_org_member(auth.uid(), organization_id));

CREATE POLICY "Organization admins can manage org trips"
  ON public.pro_trip_organizations FOR ALL
  USING (public.is_org_admin(auth.uid(), organization_id));

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Triggers for updated_at
CREATE TRIGGER update_organizations_updated_at
  BEFORE UPDATE ON public.organizations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_organization_members_updated_at
  BEFORE UPDATE ON public.organization_members
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Function to auto-create owner membership when organization is created
CREATE OR REPLACE FUNCTION public.create_org_owner_membership()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  creator_user_id UUID;
BEGIN
  -- Get the user_id from profiles table based on created_by
  SELECT user_id INTO creator_user_id
  FROM public.profiles
  WHERE user_id = auth.uid()
  LIMIT 1;

  -- Create owner membership
  INSERT INTO public.organization_members (
    organization_id,
    user_id,
    role,
    seat_id,
    status
  ) VALUES (
    NEW.id,
    creator_user_id,
    'owner',
    'seat-001',
    'active'
  );

  -- Update seats_used
  UPDATE public.organizations
  SET seats_used = 1
  WHERE id = NEW.id;

  -- Grant pro role to user
  INSERT INTO public.user_roles (user_id, role)
  VALUES (creator_user_id, 'pro')
  ON CONFLICT (user_id, role) DO NOTHING;

  RETURN NEW;
END;
$$;

CREATE TRIGGER on_organization_created
  AFTER INSERT ON public.organizations
  FOR EACH ROW EXECUTE FUNCTION public.create_org_owner_membership();