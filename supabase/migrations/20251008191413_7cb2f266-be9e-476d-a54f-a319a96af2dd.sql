-- Create trip_join_requests table for approval workflow
CREATE TABLE IF NOT EXISTS public.trip_join_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id TEXT NOT NULL,
  user_id UUID NOT NULL,
  invite_code TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  requested_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  resolved_at TIMESTAMPTZ,
  resolved_by UUID,
  UNIQUE(trip_id, user_id)
);

-- Enable RLS
ALTER TABLE public.trip_join_requests ENABLE ROW LEVEL SECURITY;

-- Trip members can view join requests for their trips
CREATE POLICY "Trip members can view join requests"
ON public.trip_join_requests
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM trip_members tm
    WHERE tm.trip_id = trip_join_requests.trip_id
    AND tm.user_id = auth.uid()
  )
);

-- Users can create their own join requests
CREATE POLICY "Users can create join requests"
ON public.trip_join_requests
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Trip creators can update join requests (approve/reject)
CREATE POLICY "Trip creators can update join requests"
ON public.trip_join_requests
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM trips t
    WHERE t.id = trip_join_requests.trip_id
    AND t.created_by = auth.uid()
  )
);

-- Add index for performance
CREATE INDEX idx_trip_join_requests_trip_status ON trip_join_requests(trip_id, status);
CREATE INDEX idx_trip_join_requests_user ON trip_join_requests(user_id);