-- Restrict public access to profiles by removing public SELECT and allowing only authenticated users
-- 1) Drop existing public SELECT policy
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;

-- 2) Create a new SELECT policy limited to authenticated users
CREATE POLICY "Authenticated users can view profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (true);

-- Note: Existing INSERT/UPDATE policies remain unchanged
--   "Users can update their own profile" (UPDATE)
--   "Users can insert their own profile" (INSERT)
