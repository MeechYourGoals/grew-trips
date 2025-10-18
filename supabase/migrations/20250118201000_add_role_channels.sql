-- Create role_channels table for optional role-specific chat channels
CREATE TABLE IF NOT EXISTS role_channels (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  trip_id UUID REFERENCES trips(id) ON DELETE CASCADE,
  role_name TEXT NOT NULL,
  created_by UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(trip_id, role_name)
);

-- Create role_channel_messages table
CREATE TABLE IF NOT EXISTS role_channel_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  channel_id UUID REFERENCES role_channels(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_role_channels_trip_id ON role_channels(trip_id);
CREATE INDEX IF NOT EXISTS idx_role_channels_role_name ON role_channels(role_name);
CREATE INDEX IF NOT EXISTS idx_role_channel_messages_channel_id ON role_channel_messages(channel_id);
CREATE INDEX IF NOT EXISTS idx_role_channel_messages_created_at ON role_channel_messages(created_at DESC);

-- Enable RLS
ALTER TABLE role_channels ENABLE ROW LEVEL SECURITY;
ALTER TABLE role_channel_messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies for role_channels
-- Users can view channels for trips they're part of and roles they have
CREATE POLICY "Users can view role channels for their trips"
  ON role_channels FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM trip_participants
      WHERE trip_participants.trip_id = role_channels.trip_id
      AND trip_participants.user_id = auth.uid()
    )
  );

-- Admins can create role channels
CREATE POLICY "Admins can create role channels"
  ON role_channels FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM trip_participants
      WHERE trip_participants.trip_id = role_channels.trip_id
      AND trip_participants.user_id = auth.uid()
      AND trip_participants.role IN ('admin', 'organizer')
    )
  );

-- Admins can delete role channels
CREATE POLICY "Admins can delete role channels"
  ON role_channels FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM trip_participants
      WHERE trip_participants.trip_id = role_channels.trip_id
      AND trip_participants.user_id = auth.uid()
      AND trip_participants.role IN ('admin', 'organizer')
    )
  );

-- RLS Policies for role_channel_messages
-- Users can view messages in channels they have access to (based on their role)
CREATE POLICY "Users can view role channel messages"
  ON role_channel_messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM role_channels rc
      JOIN trip_participants tp ON tp.trip_id = rc.trip_id
      WHERE rc.id = role_channel_messages.channel_id
      AND tp.user_id = auth.uid()
    )
  );

-- Users can send messages in channels for their role
CREATE POLICY "Users can send role channel messages"
  ON role_channel_messages FOR INSERT
  WITH CHECK (auth.uid() = sender_id);

-- Users can delete their own messages
CREATE POLICY "Users can delete own messages"
  ON role_channel_messages FOR DELETE
  USING (auth.uid() = sender_id);

