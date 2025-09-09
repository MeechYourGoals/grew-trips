-- Fix search_path security warnings for existing functions
CREATE OR REPLACE FUNCTION public.initialize_trip_privacy_config()
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = public
AS $$
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
$$;

-- Create trigger for auto-initializing privacy config
CREATE TRIGGER trigger_initialize_trip_privacy_config
AFTER INSERT ON public.trips
FOR EACH ROW
EXECUTE FUNCTION public.initialize_trip_privacy_config();