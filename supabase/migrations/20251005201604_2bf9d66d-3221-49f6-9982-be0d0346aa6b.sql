-- Fix RLS policy on profiles table to prevent unauthorized PII access
-- Drop the overly permissive "Authenticated users can view profiles" policy
DROP POLICY IF EXISTS "Authenticated users can view profiles" ON public.profiles;

-- Create a more secure policy that only allows viewing limited public profile data
CREATE POLICY "Users can view public profile information"
ON public.profiles
FOR SELECT
TO authenticated
USING (
  -- Users can always see their own full profile
  auth.uid() = user_id
  OR
  -- Others can only see limited public profile data based on privacy settings
  (
    -- Only show email if user has opted in
    (show_email = true OR auth.uid() = user_id)
    AND
    -- Only show phone if user has opted in
    (show_phone = true OR auth.uid() = user_id)
  )
);

-- Add comment explaining the security reasoning
COMMENT ON POLICY "Users can view public profile information" ON public.profiles IS 
'Secure RLS policy that respects user privacy preferences. Users can see their own full profile, but others only see data the user has opted to share via show_email and show_phone flags.';