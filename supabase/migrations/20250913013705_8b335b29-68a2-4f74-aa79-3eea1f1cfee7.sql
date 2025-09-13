-- Fix security linter warnings by setting search_path on functions

-- Update create_payment_with_splits function
CREATE OR REPLACE FUNCTION create_payment_with_splits(
  p_trip_id TEXT,
  p_amount NUMERIC,
  p_currency TEXT,
  p_description TEXT,
  p_split_count INTEGER,
  p_split_participants JSONB,
  p_payment_methods JSONB,
  p_created_by UUID
) RETURNS UUID AS $$
DECLARE
  payment_id UUID;
  participant UUID;
  split_amount NUMERIC;
BEGIN
  -- Calculate split amount
  split_amount := p_amount / p_split_count;
  
  -- Create payment message
  INSERT INTO trip_payment_messages (
    trip_id, amount, currency, description, split_count,
    split_participants, payment_methods, created_by
  ) VALUES (
    p_trip_id, p_amount, p_currency, p_description, p_split_count,
    p_split_participants, p_payment_methods, p_created_by
  ) RETURNING id INTO payment_id;
  
  -- Create payment splits for each participant
  FOR participant IN SELECT jsonb_array_elements_text(p_split_participants)::UUID
  LOOP
    INSERT INTO payment_splits (
      payment_message_id, debtor_user_id, amount_owed
    ) VALUES (
      payment_id, participant, split_amount
    );
  END LOOP;
  
  RETURN payment_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Update toggle_task_status function
CREATE OR REPLACE FUNCTION toggle_task_status(
  p_task_id UUID,
  p_user_id UUID,
  p_completed BOOLEAN,
  p_current_version INTEGER
) RETURNS BOOLEAN AS $$
DECLARE
  task_version INTEGER;
BEGIN
  -- Check if task version matches (optimistic locking)
  SELECT version INTO task_version FROM trip_tasks WHERE id = p_task_id;
  
  IF task_version != p_current_version THEN
    RAISE EXCEPTION 'Task has been modified by another user. Please refresh and try again.';
  END IF;
  
  -- Update or insert task status
  INSERT INTO task_status (task_id, user_id, completed, completed_at)
  VALUES (p_task_id, p_user_id, p_completed, CASE WHEN p_completed THEN NOW() ELSE NULL END)
  ON CONFLICT (task_id, user_id) 
  DO UPDATE SET 
    completed = p_completed,
    completed_at = CASE WHEN p_completed THEN NOW() ELSE NULL END;
    
  -- Update task version
  UPDATE trip_tasks SET 
    version = version + 1,
    updated_at = NOW()
  WHERE id = p_task_id;
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Update vote_on_poll function
CREATE OR REPLACE FUNCTION vote_on_poll(
  p_poll_id UUID,
  p_option_id TEXT,
  p_user_id UUID,
  p_current_version INTEGER
) RETURNS JSONB AS $$
DECLARE
  poll_version INTEGER;
  current_options JSONB;
  updated_options JSONB;
  option_obj JSONB;
  voters JSONB;
BEGIN
  -- Check if poll version matches (optimistic locking)
  SELECT version, options INTO poll_version, current_options 
  FROM trip_polls WHERE id = p_poll_id;
  
  IF poll_version != p_current_version THEN
    RAISE EXCEPTION 'Poll has been modified by another user. Please refresh and try again.';
  END IF;
  
  -- Update the specific option with the vote
  updated_options := current_options;
  
  FOR i IN 0..jsonb_array_length(current_options) - 1
  LOOP
    option_obj := current_options -> i;
    
    IF option_obj ->> 'id' = p_option_id THEN
      voters := COALESCE(option_obj -> 'voters', '[]'::jsonb);
      
      -- Check if user already voted
      IF voters ? p_user_id::text THEN
        RAISE EXCEPTION 'User has already voted on this option.';
      END IF;
      
      -- Add voter and increment count
      voters := voters || jsonb_build_array(p_user_id::text);
      option_obj := jsonb_set(option_obj, '{voters}', voters);
      option_obj := jsonb_set(option_obj, '{voteCount}', 
        to_jsonb((option_obj ->> 'voteCount')::integer + 1));
      
      updated_options := jsonb_set(updated_options, ARRAY[i::text], option_obj);
      EXIT;
    END IF;
  END LOOP;
  
  -- Update poll with new options and increment version
  UPDATE trip_polls SET 
    options = updated_options,
    total_votes = total_votes + 1,
    version = version + 1,
    updated_at = NOW()
  WHERE id = p_poll_id;
  
  RETURN updated_options;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Update create_event_with_conflict_check function
CREATE OR REPLACE FUNCTION create_event_with_conflict_check(
  p_trip_id TEXT,
  p_title TEXT,
  p_description TEXT,
  p_location TEXT,
  p_start_time TIMESTAMPTZ,
  p_end_time TIMESTAMPTZ,
  p_created_by UUID
) RETURNS UUID AS $$
DECLARE
  event_id UUID;
  conflict_count INTEGER;
BEGIN
  -- Check for overlapping events
  SELECT COUNT(*) INTO conflict_count
  FROM trip_events
  WHERE trip_id = p_trip_id
    AND (
      (start_time <= p_start_time AND (end_time IS NULL OR end_time > p_start_time))
      OR
      (start_time < p_end_time AND (end_time IS NULL OR end_time >= p_end_time))
      OR
      (start_time >= p_start_time AND (end_time IS NULL OR end_time <= p_end_time))
    );
    
  IF conflict_count > 0 THEN
    RAISE EXCEPTION 'Time conflict detected. There is already an event scheduled during this time.';
  END IF;
  
  -- Create the event
  INSERT INTO trip_events (
    trip_id, title, description, location, start_time, end_time, created_by
  ) VALUES (
    p_trip_id, p_title, p_description, p_location, p_start_time, p_end_time, p_created_by
  ) RETURNING id INTO event_id;
  
  RETURN event_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;