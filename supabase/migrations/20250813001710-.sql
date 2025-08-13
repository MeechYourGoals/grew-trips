-- 1) Create trip_members table to model trip participation
CREATE TABLE IF NOT EXISTS public.trip_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id TEXT NOT NULL,
  user_id UUID NOT NULL,
  role TEXT NOT NULL DEFAULT 'member',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.trip_members ENABLE ROW LEVEL SECURITY;

-- Basic policy: users can view their own memberships
DROP POLICY IF EXISTS "Users can view their trip memberships" ON public.trip_members;
CREATE POLICY "Users can view their trip memberships"
ON public.trip_members
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Timestamp trigger for updated_at
DROP TRIGGER IF EXISTS update_trip_members_updated_at ON public.trip_members;
CREATE TRIGGER update_trip_members_updated_at
BEFORE UPDATE ON public.trip_members
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Helpful indexes for membership lookups
CREATE INDEX IF NOT EXISTS idx_trip_members_trip_user ON public.trip_members (trip_id, user_id);
CREATE INDEX IF NOT EXISTS idx_trip_members_user ON public.trip_members (user_id);

-- 2) Restrict public SELECT on trip-related tables to members only (with owner fallback where applicable)

-- trip_files
DROP POLICY IF EXISTS "Anyone can read trip_files" ON public.trip_files;
CREATE POLICY "Members can read trip_files"
ON public.trip_files
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.trip_members m
    WHERE m.trip_id = trip_files.trip_id AND m.user_id = auth.uid()
  )
  OR uploaded_by = auth.uid()
);

-- trip_links
DROP POLICY IF EXISTS "Anyone can read trip_links" ON public.trip_links;
CREATE POLICY "Members can read trip_links"
ON public.trip_links
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.trip_members m
    WHERE m.trip_id = trip_links.trip_id AND m.user_id = auth.uid()
  )
  OR added_by = auth.uid()
);

-- trip_polls
DROP POLICY IF EXISTS "Anyone can read trip_polls" ON public.trip_polls;
CREATE POLICY "Members can read trip_polls"
ON public.trip_polls
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.trip_members m
    WHERE m.trip_id = trip_polls.trip_id AND m.user_id = auth.uid()
  )
  OR created_by = auth.uid()
);

-- trip_chat_messages
DROP POLICY IF EXISTS "Anyone can read trip_chat_messages" ON public.trip_chat_messages;
CREATE POLICY "Members can read trip_chat_messages"
ON public.trip_chat_messages
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.trip_members m
    WHERE m.trip_id = trip_chat_messages.trip_id AND m.user_id = auth.uid()
  )
);

-- trip_preferences
DROP POLICY IF EXISTS "Anyone can read trip_preferences" ON public.trip_preferences;
CREATE POLICY "Members can read trip_preferences"
ON public.trip_preferences
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.trip_members m
    WHERE m.trip_id = trip_preferences.trip_id AND m.user_id = auth.uid()
  )
);
