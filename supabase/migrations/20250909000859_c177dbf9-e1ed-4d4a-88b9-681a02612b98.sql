-- Add privacy settings to trips table
ALTER TABLE public.trips 
ADD COLUMN privacy_mode text DEFAULT 'standard'::text CHECK (privacy_mode IN ('standard', 'high')),
ADD COLUMN ai_access_enabled boolean DEFAULT true;

-- Update existing trips with smart defaults based on trip_type
UPDATE public.trips 
SET privacy_mode = CASE 
  WHEN trip_type IN ('pro', 'event') THEN 'high'
  ELSE 'standard'
END,
ai_access_enabled = CASE 
  WHEN trip_type IN ('pro', 'event') THEN false
  ELSE true
END
WHERE privacy_mode IS NULL;

-- Create table for trip privacy configurations
CREATE TABLE public.trip_privacy_configs (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  trip_id text NOT NULL REFERENCES public.trips(id) ON DELETE CASCADE,
  privacy_mode text NOT NULL DEFAULT 'standard'::text CHECK (privacy_mode IN ('standard', 'high')),
  ai_access_enabled boolean NOT NULL DEFAULT true,
  can_change_privacy boolean NOT NULL DEFAULT true,
  created_by uuid NOT NULL,
  participants_notified boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(trip_id)
);

-- Enable RLS on trip_privacy_configs
ALTER TABLE public.trip_privacy_configs ENABLE ROW LEVEL SECURITY;

-- Create policies for trip_privacy_configs
CREATE POLICY "Trip members can view privacy configs" 
ON public.trip_privacy_configs 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM trip_members tm 
    WHERE tm.trip_id = trip_privacy_configs.trip_id 
    AND tm.user_id = auth.uid()
  )
);

CREATE POLICY "Trip organizers can manage privacy configs" 
ON public.trip_privacy_configs 
FOR ALL 
USING (auth.uid() = created_by)
WITH CHECK (auth.uid() = created_by);

-- Create trigger for updated_at
CREATE TRIGGER update_trip_privacy_configs_updated_at
BEFORE UPDATE ON public.trip_privacy_configs
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add privacy metadata to trip_chat_messages
ALTER TABLE public.trip_chat_messages 
ADD COLUMN privacy_encrypted boolean DEFAULT false,
ADD COLUMN privacy_mode text DEFAULT 'standard'::text CHECK (privacy_mode IN ('standard', 'high'));

-- Create function to initialize privacy config when trip is created
CREATE OR REPLACE FUNCTION public.initialize_trip_privacy_config()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.trip_privacy_configs (
    trip_id, 
    privacy_mode, 
    ai_access_enabled, 
    created_by
  ) VALUES (
    NEW.id,
    COALESCE(NEW.privacy_mode, 'standard'),
    COALESCE(NEW.ai_access_enabled, true),
    NEW.created_by
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;