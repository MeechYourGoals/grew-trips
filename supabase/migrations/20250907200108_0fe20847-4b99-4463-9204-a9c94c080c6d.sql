-- Fix search path security warning for the function
DROP FUNCTION public.update_updated_at_trips();

CREATE OR REPLACE FUNCTION public.update_updated_at_trips()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;