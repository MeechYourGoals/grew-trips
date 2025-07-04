-- Create broadcasts table for announcement-style messages
CREATE TABLE public.broadcasts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  trip_id TEXT NOT NULL,
  sender_id UUID NOT NULL,
  sender_name TEXT NOT NULL,
  sender_avatar TEXT NOT NULL,
  content TEXT NOT NULL,
  location TEXT,
  tag TEXT CHECK (tag IN ('chill', 'logistics', 'urgent')) DEFAULT 'chill',
  scheduled_time TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create broadcast_reactions table for RSVP tracking
CREATE TABLE public.broadcast_reactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  broadcast_id UUID NOT NULL REFERENCES public.broadcasts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  user_name TEXT NOT NULL,
  reaction_type TEXT CHECK (reaction_type IN ('coming', 'wait', 'cant')) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(broadcast_id, user_id)
);

-- Enable RLS on both tables
ALTER TABLE public.broadcasts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.broadcast_reactions ENABLE ROW LEVEL SECURITY;

-- RLS policies for broadcasts - users can only see broadcasts for trips they're members of
CREATE POLICY "Users can view broadcasts for their trips"
ON public.broadcasts
FOR SELECT
USING (
  trip_id IN (
    SELECT trip_id FROM trip_members 
    WHERE user_id = auth.uid() AND status = 'active'
  )
);

CREATE POLICY "Users can create broadcasts for their trips"
ON public.broadcasts
FOR INSERT
WITH CHECK (
  sender_id = auth.uid() AND
  trip_id IN (
    SELECT trip_id FROM trip_members 
    WHERE user_id = auth.uid() AND status = 'active'
  )
);

CREATE POLICY "Users can update their own broadcasts"
ON public.broadcasts
FOR UPDATE
USING (sender_id = auth.uid());

-- RLS policies for broadcast_reactions
CREATE POLICY "Users can view reactions for broadcasts they can see"
ON public.broadcast_reactions
FOR SELECT
USING (
  broadcast_id IN (
    SELECT id FROM broadcasts WHERE
    trip_id IN (
      SELECT trip_id FROM trip_members 
      WHERE user_id = auth.uid() AND status = 'active'
    )
  )
);

CREATE POLICY "Users can create reactions for broadcasts they can see"
ON public.broadcast_reactions
FOR INSERT
WITH CHECK (
  user_id = auth.uid() AND
  broadcast_id IN (
    SELECT id FROM broadcasts WHERE
    trip_id IN (
      SELECT trip_id FROM trip_members 
      WHERE user_id = auth.uid() AND status = 'active'
    )
  )
);

CREATE POLICY "Users can update their own reactions"
ON public.broadcast_reactions
FOR UPDATE
USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own reactions"
ON public.broadcast_reactions
FOR DELETE
USING (user_id = auth.uid());

-- Create indexes for performance
CREATE INDEX idx_broadcasts_trip_id ON public.broadcasts(trip_id);
CREATE INDEX idx_broadcasts_created_at ON public.broadcasts(created_at DESC);
CREATE INDEX idx_broadcast_reactions_broadcast_id ON public.broadcast_reactions(broadcast_id);
CREATE INDEX idx_broadcast_reactions_user_id ON public.broadcast_reactions(user_id);

-- Create function to update timestamps
CREATE TRIGGER update_broadcasts_updated_at
BEFORE UPDATE ON public.broadcasts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();