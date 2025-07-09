-- Create function to refresh mock messages when trip data changes
CREATE OR REPLACE FUNCTION public.refresh_mock_messages() 
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Only run for mock trips
  IF NEW.is_mock = true THEN
    -- Check if relevant columns changed
    IF (NEW.name IS DISTINCT FROM OLD.name OR 
        NEW.trip_type IS DISTINCT FROM OLD.trip_type OR 
        NEW.template_key IS DISTINCT FROM OLD.template_key) THEN
      
      -- Call the edge function to regenerate messages
      PERFORM net.http_post(
        url := format('%s/functions/v1/seed-mock-messages', current_setting('app.supabase_url', true)),
        body := json_build_object(
          'trip_id', NEW.id::text,
          'refresh', true
        )::text,
        headers := json_build_object(
          'Content-Type', 'application/json',
          'Authorization', format('Bearer %s', current_setting('app.supabase_service_role_key', true))
        )::jsonb
      );
      
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger for auto-refresh
DROP TRIGGER IF EXISTS trg_refresh_mock_messages ON public.trips;
CREATE TRIGGER trg_refresh_mock_messages
  AFTER UPDATE ON public.trips
  FOR EACH ROW
  WHEN (OLD.* IS DISTINCT FROM NEW.*)
  EXECUTE FUNCTION public.refresh_mock_messages();

-- Add template_key column to trips table if it doesn't exist
ALTER TABLE public.trips ADD COLUMN IF NOT EXISTS template_key TEXT;

-- Add comment explaining the trigger
COMMENT ON TRIGGER trg_refresh_mock_messages ON public.trips IS 
'Auto-regenerates mock messages when mock trip data changes';