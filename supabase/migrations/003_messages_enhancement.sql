-- Enhanced messaging system with priority, scheduling, and daily digests

-- Add priority column to existing messages table (if it doesn't exist)
-- ALTER TABLE messages ADD COLUMN IF NOT EXISTS priority TEXT CHECK (priority IN ('urgent', 'reminder', 'fyi')) DEFAULT 'fyi';

-- Create scheduled_messages table
CREATE TABLE IF NOT EXISTS scheduled_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content TEXT NOT NULL,
  send_at TIMESTAMPTZ NOT NULL,
  trip_id UUID,
  tour_id UUID,
  user_id UUID NOT NULL,
  priority TEXT CHECK (priority IN ('urgent', 'reminder', 'fyi')) DEFAULT 'fyi',
  is_recurring BOOLEAN DEFAULT FALSE,
  recurrence_type TEXT CHECK (recurrence_type IN ('daily', 'weekly', 'monthly')),
  recurrence_end TIMESTAMPTZ,
  template_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  is_sent BOOLEAN DEFAULT FALSE,
  sent_at TIMESTAMPTZ
);

-- Create daily_digests table
CREATE TABLE IF NOT EXISTS daily_digests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  trip_id UUID,
  tour_id UUID,
  digest_date DATE NOT NULL,
  summary TEXT NOT NULL,
  message_count INTEGER DEFAULT 0,
  urgent_count INTEGER DEFAULT 0,
  reminder_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, trip_id, tour_id, digest_date)
);

-- Create message_templates table
CREATE TABLE IF NOT EXISTS message_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL,
  trip_type TEXT, -- 'sports', 'music', 'corporate', 'school', etc.
  placeholders JSONB, -- Array of placeholder names like ["time", "location", "event"]
  created_at TIMESTAMPTZ DEFAULT NOW(),
  is_active BOOLEAN DEFAULT TRUE
);

-- Insert default message templates
INSERT INTO message_templates (name, content, category, trip_type, placeholders) VALUES
-- Sports templates
('Game Day Reminder', 'Team meeting at {{time}} in {{location}}. Please arrive 15 minutes early for warm-up. {{additional_info}}', 'logistics', 'sports', '["time", "location", "additional_info"]'),
('Equipment Check', 'Don''t forget to bring your {{equipment_list}} for tomorrow''s {{event}}. Contact {{contact_person}} if you have questions.', 'reminder', 'sports', '["equipment_list", "event", "contact_person"]'),
('Travel Update', 'Bus departure at {{departure_time}} from {{departure_location}}. Estimated arrival: {{arrival_time}}. {{special_instructions}}', 'logistics', 'sports', '["departure_time", "departure_location", "arrival_time", "special_instructions"]'),

-- Music/Entertainment templates  
('Sound Check', 'Sound check at {{time}} in {{venue}}. All {{role}} members must attend. {{technical_notes}}', 'logistics', 'music', '["time", "venue", "role", "technical_notes"]'),
('Load-in Schedule', 'Load-in starts at {{start_time}} at {{venue}}. {{equipment_notes}} Contact {{contact}} for questions.', 'logistics', 'music', '["start_time", "venue", "equipment_notes", "contact"]'),
('Show Day Brief', 'Show time: {{show_time}} at {{venue}}. Doors open: {{doors_time}}. {{special_instructions}}', 'logistics', 'music', '["show_time", "venue", "doors_time", "special_instructions"]'),

-- Corporate templates
('Meeting Reminder', 'Team meeting scheduled for {{time}} in {{location}}. Agenda: {{agenda}}. {{preparation_notes}}', 'reminder', 'corporate', '["time", "location", "agenda", "preparation_notes"]'),
('Travel Logistics', 'Flight details: {{flight_info}}. Hotel: {{hotel_info}}. Ground transport: {{transport_info}}', 'logistics', 'corporate', '["flight_info", "hotel_info", "transport_info"]'),
('Event Update', '{{event_name}} update: {{update_details}}. Next steps: {{action_items}}', 'update', 'corporate', '["event_name", "update_details", "action_items"]'),

-- School templates
('Field Trip Reminder', 'Field trip to {{destination}} tomorrow. Meet at {{meeting_point}} at {{time}}. Bring {{items_needed}}.', 'reminder', 'school', '["destination", "meeting_point", "time", "items_needed"]'),
('Academic Event', '{{event_name}} starts at {{time}} in {{location}}. {{preparation_required}} Questions? Contact {{supervisor}}.', 'logistics', 'school', '["event_name", "time", "location", "preparation_required", "supervisor"]'),
('Travel Notice', 'Departure: {{departure_time}} from {{departure_location}}. Return: {{return_time}}. {{parent_contact_info}}', 'logistics', 'school', '["departure_time", "departure_location", "return_time", "parent_contact_info"]');

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_scheduled_messages_send_at ON scheduled_messages(send_at) WHERE NOT is_sent;
CREATE INDEX IF NOT EXISTS idx_scheduled_messages_user_trip ON scheduled_messages(user_id, trip_id, tour_id);
CREATE INDEX IF NOT EXISTS idx_daily_digests_user_date ON daily_digests(user_id, digest_date);
CREATE INDEX IF NOT EXISTS idx_message_templates_category ON message_templates(category, trip_type) WHERE is_active;

-- Create updated_at trigger for scheduled_messages
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_scheduled_messages_updated_at 
  BEFORE UPDATE ON scheduled_messages 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();