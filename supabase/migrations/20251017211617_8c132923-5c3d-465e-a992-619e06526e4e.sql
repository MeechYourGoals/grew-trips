-- Update RLS policy to allow all trip members to edit trips (not just creators)
-- This matches the requirement: "anyone in the Trip Collaborators list should be able to edit"

-- Drop old restrictive policy that only allowed creators to update
DROP POLICY IF EXISTS "Trip creators can update their trips" ON public.trips;

-- Create new permissive policy that allows all trip members to update trip details
CREATE POLICY "Trip members can update trip details" 
ON public.trips 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 
    FROM public.trip_members 
    WHERE trip_id = trips.id 
    AND user_id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 
    FROM public.trip_members 
    WHERE trip_id = trips.id 
    AND user_id = auth.uid()
  )
);

-- Add helpful comment
COMMENT ON POLICY "Trip members can update trip details" ON public.trips IS 
'Allows any trip member (not just creator) to update trip details like name, location, and dates';
