-- Create scheduled_messages table
CREATE TABLE IF NOT EXISTS scheduled_messages (
  id UUID PRIMARY KEY,
  content TEXT NOT NULL,
  send_at TIMESTAMPTZ NOT NULL,
  trip_id UUID,
  user_id UUID NOT NULL,
  priority TEXT
);
