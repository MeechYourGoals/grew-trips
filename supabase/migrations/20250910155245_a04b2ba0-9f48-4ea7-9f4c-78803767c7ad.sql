-- Fix the function search path issue
CREATE OR REPLACE FUNCTION public.update_updated_at_trip_tasks()
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