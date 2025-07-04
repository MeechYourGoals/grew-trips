-- Create trip_invites table for managing invite tokens
CREATE TABLE public.trip_invites (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  trip_id TEXT NOT NULL,
  invite_token TEXT NOT NULL UNIQUE,
  created_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE,
  require_approval BOOLEAN NOT NULL DEFAULT false,
  is_active BOOLEAN NOT NULL DEFAULT true,
  max_uses INTEGER,
  current_uses INTEGER NOT NULL DEFAULT 0
);

-- Create trip_members table for managing who belongs to which trips
CREATE TABLE public.trip_members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  trip_id TEXT NOT NULL,
  user_id UUID NOT NULL,
  joined_via_invite_token TEXT,
  role TEXT NOT NULL DEFAULT 'member',
  status TEXT NOT NULL DEFAULT 'active',
  joined_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(trip_id, user_id)
);

-- Enable Row Level Security
ALTER TABLE public.trip_invites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trip_members ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for trip_invites
CREATE POLICY "Users can view invites for their trips" 
ON public.trip_invites 
FOR SELECT 
USING (
  created_by = auth.uid() OR 
  trip_id IN (
    SELECT trip_id FROM public.trip_members 
    WHERE user_id = auth.uid() AND status = 'active'
  )
);

CREATE POLICY "Users can create invites for their trips" 
ON public.trip_invites 
FOR INSERT 
WITH CHECK (
  created_by = auth.uid() AND
  trip_id IN (
    SELECT trip_id FROM public.trip_members 
    WHERE user_id = auth.uid() AND status = 'active'
  )
);

CREATE POLICY "Users can update invites for their trips" 
ON public.trip_invites 
FOR UPDATE 
USING (
  created_by = auth.uid() OR 
  trip_id IN (
    SELECT trip_id FROM public.trip_members 
    WHERE user_id = auth.uid() AND status = 'active'
  )
);

-- Create RLS policies for trip_members
CREATE POLICY "Users can view members of their trips" 
ON public.trip_members 
FOR SELECT 
USING (
  user_id = auth.uid() OR 
  trip_id IN (
    SELECT trip_id FROM public.trip_members 
    WHERE user_id = auth.uid() AND status = 'active'
  )
);

CREATE POLICY "Users can join trips via valid invites" 
ON public.trip_members 
FOR INSERT 
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own membership" 
ON public.trip_members 
FOR UPDATE 
USING (user_id = auth.uid());

-- Create edge function for handling invite joins
CREATE OR REPLACE FUNCTION public.join_trip_via_invite(invite_token_param TEXT)
RETURNS JSON AS $$
DECLARE
  invite_record RECORD;
  member_record RECORD;
  result JSON;
BEGIN
  -- Find the invite
  SELECT * INTO invite_record 
  FROM public.trip_invites 
  WHERE invite_token = invite_token_param 
    AND is_active = true 
    AND (expires_at IS NULL OR expires_at > now());
  
  IF NOT FOUND THEN
    RETURN json_build_object('success', false, 'error', 'Invalid or expired invite');
  END IF;
  
  -- Check if user is already a member
  SELECT * INTO member_record 
  FROM public.trip_members 
  WHERE trip_id = invite_record.trip_id 
    AND user_id = auth.uid();
  
  IF FOUND THEN
    RETURN json_build_object('success', false, 'error', 'Already a member of this trip');
  END IF;
  
  -- Check usage limits
  IF invite_record.max_uses IS NOT NULL AND invite_record.current_uses >= invite_record.max_uses THEN
    RETURN json_build_object('success', false, 'error', 'Invite has reached maximum uses');
  END IF;
  
  -- Add user to trip
  INSERT INTO public.trip_members (trip_id, user_id, joined_via_invite_token)
  VALUES (invite_record.trip_id, auth.uid(), invite_token_param);
  
  -- Update invite usage count
  UPDATE public.trip_invites 
  SET current_uses = current_uses + 1 
  WHERE invite_token = invite_token_param;
  
  RETURN json_build_object(
    'success', true, 
    'trip_id', invite_record.trip_id,
    'message', 'Successfully joined the trip'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;