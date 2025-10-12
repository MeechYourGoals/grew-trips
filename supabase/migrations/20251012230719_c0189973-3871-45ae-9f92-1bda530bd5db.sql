-- Fix 1: Update trip_chat_messages RLS policy to respect privacy mode
DROP POLICY IF EXISTS "Members can read trip_chat_messages" ON trip_chat_messages;

CREATE POLICY "Members can read non-private messages"
ON trip_chat_messages FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM trip_members m
    WHERE m.trip_id = trip_chat_messages.trip_id 
    AND m.user_id = auth.uid()
  )
  AND (
    -- Allow reading if not encrypted and standard privacy
    (COALESCE(privacy_encrypted, false) = false AND COALESCE(privacy_mode, 'standard') = 'standard')
    OR
    -- Or if user is the message author
    user_id = auth.uid()
    OR
    -- Or if privacy_mode is NULL (legacy/broadcast messages)
    privacy_mode IS NULL
  )
);

-- Ensure users can always read their own messages
CREATE POLICY "Users can read their own messages"
ON trip_chat_messages FOR SELECT
USING (user_id = auth.uid());