-- Create realtime_locations table for Find My Friends feature
CREATE TABLE public.realtime_locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id TEXT NOT NULL,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  lat DECIMAL(10, 8) NOT NULL,
  lng DECIMAL(11, 8) NOT NULL,
  accuracy INTEGER,
  heading INTEGER,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(trip_id, user_id)
);

-- Create indexes for efficient queries
CREATE INDEX realtime_locations_trip_id_idx ON public.realtime_locations (trip_id);
CREATE INDEX realtime_locations_user_id_idx ON public.realtime_locations (user_id);
CREATE INDEX realtime_locations_updated_at_idx ON public.realtime_locations (updated_at);

-- Enable RLS
ALTER TABLE public.realtime_locations ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Users can insert/update their own location
CREATE POLICY "Users can manage their own location" 
ON public.realtime_locations 
FOR ALL 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Trip participants can view all locations for their trip
CREATE POLICY "Trip participants can view locations" 
ON public.realtime_locations 
FOR SELECT 
USING (true); -- For demo purposes, allow all reads. In production, check trip membership

-- Function to clean up stale locations (older than 48 hours)
CREATE OR REPLACE FUNCTION public.delete_stale_locations()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  DELETE FROM public.realtime_locations 
  WHERE updated_at < now() - INTERVAL '48 hours';
END;
$$;

-- Create trigger for automatic timestamp updates
CREATE OR REPLACE FUNCTION public.update_realtime_locations_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_realtime_locations_updated_at
  BEFORE UPDATE ON public.realtime_locations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_realtime_locations_updated_at();