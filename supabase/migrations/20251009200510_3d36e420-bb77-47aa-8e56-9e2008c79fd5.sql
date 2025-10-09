-- ==========================================
-- PHASE 1: CRITICAL SECURITY FIXES
-- ==========================================

-- 1. FIX PROFILE DATA EXPOSURE
-- ==========================================

-- Drop the overly permissive policy
DROP POLICY IF EXISTS "Users can view public profile information" ON public.profiles;

-- Create security definer function to safely filter profile fields
CREATE OR REPLACE FUNCTION public.get_visible_profile_fields(
  profile_user_id UUID,
  requesting_user_id UUID
)
RETURNS TABLE (
  user_id UUID,
  display_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  email TEXT,
  phone TEXT,
  first_name TEXT,
  last_name TEXT,
  show_email BOOLEAN,
  show_phone BOOLEAN
) 
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.user_id,
    p.display_name,
    p.avatar_url,
    p.bio,
    CASE WHEN p.show_email = true OR p.user_id = requesting_user_id THEN p.email ELSE NULL END,
    CASE WHEN p.show_phone = true OR p.user_id = requesting_user_id THEN p.phone ELSE NULL END,
    p.first_name,
    p.last_name,
    p.show_email,
    p.show_phone
  FROM profiles p
  WHERE p.user_id = profile_user_id;
END;
$$;

-- New restrictive policy: only view profiles of users in shared trips
CREATE POLICY "Users can view profiles of trip co-members"
ON public.profiles FOR SELECT
USING (
  auth.uid() = user_id  -- Own profile (full access)
  OR EXISTS (
    -- Profiles of users in shared trips only
    SELECT 1 FROM trip_members tm1
    JOIN trip_members tm2 ON tm1.trip_id = tm2.trip_id
    WHERE tm1.user_id = auth.uid() 
      AND tm2.user_id = profiles.user_id
  )
);

-- 2. FIX ORGANIZATION BILLING EXPOSURE
-- ==========================================

-- Create separate billing table for sensitive financial data
CREATE TABLE IF NOT EXISTS public.organization_billing (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE UNIQUE NOT NULL,
  billing_email TEXT NOT NULL,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Enable RLS on billing table
ALTER TABLE public.organization_billing ENABLE ROW LEVEL SECURITY;

-- Only org admins can view billing info
CREATE POLICY "Organization admins can view billing"
ON public.organization_billing FOR SELECT
USING (is_org_admin(auth.uid(), organization_id));

-- Only org admins can update billing info
CREATE POLICY "Organization admins can update billing"
ON public.organization_billing FOR UPDATE
USING (is_org_admin(auth.uid(), organization_id));

-- Only org admins can insert billing info
CREATE POLICY "Organization admins can insert billing"
ON public.organization_billing FOR INSERT
WITH CHECK (is_org_admin(auth.uid(), organization_id));

-- Migrate existing billing data to new table
INSERT INTO public.organization_billing (organization_id, billing_email, stripe_customer_id, stripe_subscription_id, created_at, updated_at)
SELECT id, billing_email, stripe_customer_id, stripe_subscription_id, created_at, updated_at
FROM public.organizations
WHERE billing_email IS NOT NULL
ON CONFLICT (organization_id) DO NOTHING;

-- Remove sensitive columns from organizations table
ALTER TABLE public.organizations 
  DROP COLUMN IF EXISTS billing_email,
  DROP COLUMN IF EXISTS stripe_customer_id,
  DROP COLUMN IF EXISTS stripe_subscription_id;

-- 3. FIX MESSAGE AUTHOR SPOOFING
-- ==========================================

-- First, check if trip_chat_messages table exists
DO $$
BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'trip_chat_messages') THEN
    -- Drop insecure policy
    DROP POLICY IF EXISTS "Authenticated can insert trip_chat_messages" ON public.trip_chat_messages;
    DROP POLICY IF EXISTS "Users can insert trip_chat_messages" ON public.trip_chat_messages;
    DROP POLICY IF EXISTS "Trip members can send messages" ON public.trip_chat_messages;
    
    -- Create secure policy that prevents author spoofing
    EXECUTE 'CREATE POLICY "Users send messages as themselves only"
    ON public.trip_chat_messages FOR INSERT
    WITH CHECK (
      auth.uid() = user_id  -- CRITICAL: Prevent spoofing
      AND EXISTS (
        SELECT 1 FROM trip_members 
        WHERE trip_id = trip_chat_messages.trip_id 
          AND user_id = auth.uid()
      )
    )';
  END IF;
END $$;

-- 4. REMOVE DANGEROUS STRIPE CUSTOMER ID FROM PROFILES
-- ==========================================

-- This column exposes sensitive payment data
ALTER TABLE public.profiles DROP COLUMN IF EXISTS stripe_customer_id;
ALTER TABLE public.profiles DROP COLUMN IF EXISTS subscription_product_id;

-- 5. ADD AUDIT LOGGING
-- ==========================================

-- Create security audit log table
CREATE TABLE IF NOT EXISTS public.security_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  action TEXT NOT NULL,
  table_name TEXT NOT NULL,
  record_id UUID,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Enable RLS on audit log
ALTER TABLE public.security_audit_log ENABLE ROW LEVEL SECURITY;

-- System can insert audit logs
CREATE POLICY "System can insert audit logs"
ON public.security_audit_log FOR INSERT
WITH CHECK (true);

-- Add trigger to log role changes
CREATE OR REPLACE FUNCTION public.log_role_change()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO security_audit_log (user_id, action, table_name, record_id, metadata)
    VALUES (NEW.user_id, 'role_granted', 'user_roles', NEW.id, jsonb_build_object('role', NEW.role));
  ELSIF TG_OP = 'DELETE' THEN
    INSERT INTO security_audit_log (user_id, action, table_name, record_id, metadata)
    VALUES (OLD.user_id, 'role_revoked', 'user_roles', OLD.id, jsonb_build_object('role', OLD.role));
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS audit_role_changes ON public.user_roles;
CREATE TRIGGER audit_role_changes
  AFTER INSERT OR DELETE ON public.user_roles
  FOR EACH ROW EXECUTE FUNCTION log_role_change();

-- Create index for better performance on audit log queries
CREATE INDEX IF NOT EXISTS idx_security_audit_log_user_id ON public.security_audit_log(user_id);
CREATE INDEX IF NOT EXISTS idx_security_audit_log_created_at ON public.security_audit_log(created_at DESC);