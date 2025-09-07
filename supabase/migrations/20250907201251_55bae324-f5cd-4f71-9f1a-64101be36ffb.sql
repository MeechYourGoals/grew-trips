-- Fix search path security warning by altering the existing function
ALTER FUNCTION public.update_updated_at_trips() SET search_path = public;