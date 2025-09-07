-- Create trips table for core trip information
CREATE TABLE public.trips (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  start_date DATE,
  end_date DATE,
  destination TEXT,
  cover_image_url TEXT,
  created_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_archived BOOLEAN DEFAULT false,
  trip_type TEXT DEFAULT 'consumer',
  basecamp_name TEXT,
  basecamp_address TEXT
);

-- Enable RLS
ALTER TABLE public.trips ENABLE ROW LEVEL SECURITY;

-- Create policies for trips
CREATE POLICY "Trip members can view trips" 
ON public.trips 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM trip_members tm 
    WHERE tm.trip_id = trips.id AND tm.user_id = auth.uid()
  )
);

CREATE POLICY "Trip creators can create trips" 
ON public.trips 
FOR INSERT 
WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Trip creators can update their trips" 
ON public.trips 
FOR UPDATE 
USING (auth.uid() = created_by);

-- Create trip_events table for calendar functionality
CREATE TABLE public.trip_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  trip_id TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE,
  location TEXT,
  event_category TEXT DEFAULT 'other',
  include_in_itinerary BOOLEAN DEFAULT true,
  source_type TEXT DEFAULT 'manual',
  source_data JSONB DEFAULT '{}',
  created_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.trip_events ENABLE ROW LEVEL SECURITY;

-- Create policies for trip_events
CREATE POLICY "Trip members can view events" 
ON public.trip_events 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM trip_members tm 
    WHERE tm.trip_id = trip_events.trip_id AND tm.user_id = auth.uid()
  )
);

CREATE POLICY "Trip members can create events" 
ON public.trip_events 
FOR INSERT 
WITH CHECK (
  auth.uid() = created_by AND
  EXISTS (
    SELECT 1 FROM trip_members tm 
    WHERE tm.trip_id = trip_events.trip_id AND tm.user_id = auth.uid()
  )
);

CREATE POLICY "Event creators can update their events" 
ON public.trip_events 
FOR UPDATE 
USING (auth.uid() = created_by);

CREATE POLICY "Event creators can delete their events" 
ON public.trip_events 
FOR DELETE 
USING (auth.uid() = created_by);

-- Create broadcasts table
CREATE TABLE public.broadcasts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  trip_id TEXT NOT NULL,
  message TEXT NOT NULL,
  priority TEXT DEFAULT 'fyi',
  created_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  scheduled_for TIMESTAMP WITH TIME ZONE,
  is_sent BOOLEAN DEFAULT false,
  metadata JSONB DEFAULT '{}'
);

-- Enable RLS
ALTER TABLE public.broadcasts ENABLE ROW LEVEL SECURITY;

-- Create policies for broadcasts
CREATE POLICY "Trip members can view broadcasts" 
ON public.broadcasts 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM trip_members tm 
    WHERE tm.trip_id = broadcasts.trip_id AND tm.user_id = auth.uid()
  )
);

CREATE POLICY "Trip members can create broadcasts" 
ON public.broadcasts 
FOR INSERT 
WITH CHECK (
  auth.uid() = created_by AND
  EXISTS (
    SELECT 1 FROM trip_members tm 
    WHERE tm.trip_id = broadcasts.trip_id AND tm.user_id = auth.uid()
  )
);

CREATE POLICY "Broadcast creators can update their broadcasts" 
ON public.broadcasts 
FOR UPDATE 
USING (auth.uid() = created_by);

-- Create broadcast_reactions table
CREATE TABLE public.broadcast_reactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  broadcast_id UUID NOT NULL REFERENCES public.broadcasts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  reaction_type TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(broadcast_id, user_id)
);

-- Enable RLS
ALTER TABLE public.broadcast_reactions ENABLE ROW LEVEL SECURITY;

-- Create policies for broadcast_reactions
CREATE POLICY "Users can manage their own reactions" 
ON public.broadcast_reactions 
FOR ALL 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Trip members can view reactions" 
ON public.broadcast_reactions 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM broadcasts b
    JOIN trip_members tm ON tm.trip_id = b.trip_id
    WHERE b.id = broadcast_reactions.broadcast_id AND tm.user_id = auth.uid()
  )
);

-- Create trigger for updating timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_trips()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_trips_updated_at
BEFORE UPDATE ON public.trips
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_trips();

CREATE TRIGGER update_trip_events_updated_at
BEFORE UPDATE ON public.trip_events
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_broadcasts_updated_at
BEFORE UPDATE ON public.broadcasts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();