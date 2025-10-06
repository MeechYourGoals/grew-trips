-- Phase 1: Enhance trip_chat_messages for production real-time messaging
ALTER TABLE trip_chat_messages
ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id),
ADD COLUMN IF NOT EXISTS reply_to_id uuid REFERENCES trip_chat_messages(id),
ADD COLUMN IF NOT EXISTS thread_id uuid,
ADD COLUMN IF NOT EXISTS is_edited boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS edited_at timestamptz,
ADD COLUMN IF NOT EXISTS is_deleted boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS deleted_at timestamptz,
ADD COLUMN IF NOT EXISTS attachments jsonb DEFAULT '[]'::jsonb;

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_trip_chat_messages_user_id ON trip_chat_messages(user_id);
CREATE INDEX IF NOT EXISTS idx_trip_chat_messages_trip_created ON trip_chat_messages(trip_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_trip_chat_messages_thread ON trip_chat_messages(thread_id) WHERE thread_id IS NOT NULL;

-- Enable realtime for trip_chat_messages
ALTER TABLE trip_chat_messages REPLICA IDENTITY FULL;

-- Phase 4: Payment audit log for compliance
CREATE TABLE IF NOT EXISTS payment_audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  payment_message_id uuid REFERENCES trip_payment_messages(id) ON DELETE CASCADE,
  action text NOT NULL CHECK (action IN ('created', 'updated', 'settled', 'cancelled', 'reminder_sent')),
  actor_user_id uuid REFERENCES auth.users(id),
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE payment_audit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Trip members can view payment audit logs"
ON payment_audit_log FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM trip_payment_messages tpm
    JOIN trip_members tm ON tm.trip_id = tpm.trip_id
    WHERE tpm.id = payment_audit_log.payment_message_id
    AND tm.user_id = auth.uid()
  )
);

-- Enhanced payment creation with audit trail
CREATE OR REPLACE FUNCTION create_payment_with_splits_v2(
  p_trip_id text,
  p_amount numeric,
  p_currency text,
  p_description text,
  p_split_count integer,
  p_split_participants jsonb,
  p_payment_methods jsonb,
  p_created_by uuid
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  payment_id uuid;
  participant uuid;
  split_amount numeric;
BEGIN
  -- Start transaction
  split_amount := p_amount / p_split_count;
  
  -- Create payment message
  INSERT INTO trip_payment_messages (
    trip_id, amount, currency, description, split_count,
    split_participants, payment_methods, created_by
  ) VALUES (
    p_trip_id, p_amount, p_currency, p_description, p_split_count,
    p_split_participants, p_payment_methods, p_created_by
  ) RETURNING id INTO payment_id;
  
  -- Create payment splits
  FOR participant IN SELECT jsonb_array_elements_text(p_split_participants)::uuid
  LOOP
    INSERT INTO payment_splits (
      payment_message_id, debtor_user_id, amount_owed
    ) VALUES (
      payment_id, participant, split_amount
    );
  END LOOP;
  
  -- Audit log entry
  INSERT INTO payment_audit_log (payment_message_id, action, actor_user_id, metadata)
  VALUES (payment_id, 'created', p_created_by, jsonb_build_object('amount', p_amount, 'currency', p_currency));
  
  RETURN payment_id;
EXCEPTION
  WHEN OTHERS THEN
    RAISE EXCEPTION 'Payment creation failed: %', SQLERRM;
END;
$$;

-- Phase 5: Calendar & Task enhancements
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS timezone text DEFAULT 'UTC';

-- Timezone-aware event query function
CREATE OR REPLACE FUNCTION get_events_in_user_tz(p_trip_id text, p_user_id uuid)
RETURNS TABLE (
  id uuid,
  trip_id text,
  title text,
  description text,
  location text,
  start_time timestamptz,
  end_time timestamptz,
  event_category text,
  created_by uuid,
  user_local_start text,
  user_local_end text
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    e.id,
    e.trip_id,
    e.title,
    e.description,
    e.location,
    e.start_time,
    e.end_time,
    e.event_category,
    e.created_by,
    to_char(e.start_time AT TIME ZONE COALESCE(p.timezone, 'UTC'), 'YYYY-MM-DD HH24:MI:SS') as user_local_start,
    to_char(e.end_time AT TIME ZONE COALESCE(p.timezone, 'UTC'), 'YYYY-MM-DD HH24:MI:SS') as user_local_end
  FROM trip_events e
  CROSS JOIN profiles p
  WHERE e.trip_id = p_trip_id
    AND p.user_id = p_user_id
  ORDER BY e.start_time ASC;
$$;

-- Task assignments table
CREATE TABLE IF NOT EXISTS task_assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id uuid REFERENCES trip_tasks(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  assigned_by uuid REFERENCES auth.users(id),
  assigned_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(task_id, user_id)
);

ALTER TABLE task_assignments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Trip members can view task assignments"
ON task_assignments FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM trip_tasks tt
    JOIN trip_members tm ON tm.trip_id = tt.trip_id
    WHERE tt.id = task_assignments.task_id
    AND tm.user_id = auth.uid()
  )
);

CREATE POLICY "Trip members can assign tasks"
ON task_assignments FOR INSERT
WITH CHECK (
  auth.uid() = assigned_by
  AND EXISTS (
    SELECT 1 FROM trip_tasks tt
    JOIN trip_members tm ON tm.trip_id = tt.trip_id
    WHERE tt.id = task_assignments.task_id
    AND tm.user_id = auth.uid()
  )
);

-- Phase 3: Pro trip organization linking trigger
CREATE OR REPLACE FUNCTION link_pro_trip_to_org()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_org_id uuid;
BEGIN
  -- Only for pro/event trips
  IF NEW.trip_type IN ('pro', 'event') THEN
    -- Get user's primary organization
    SELECT organization_id INTO user_org_id
    FROM organization_members
    WHERE user_id = NEW.created_by
      AND status = 'active'
      AND role IN ('owner', 'admin')
    ORDER BY joined_at ASC
    LIMIT 1;
    
    -- Link trip to organization if found
    IF user_org_id IS NOT NULL THEN
      INSERT INTO pro_trip_organizations (trip_id, organization_id, created_by)
      VALUES (NEW.id, user_org_id, NEW.created_by)
      ON CONFLICT (trip_id) DO NOTHING;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS link_pro_trip_to_org_trigger ON trips;
CREATE TRIGGER link_pro_trip_to_org_trigger
AFTER INSERT ON trips
FOR EACH ROW
EXECUTE FUNCTION link_pro_trip_to_org();