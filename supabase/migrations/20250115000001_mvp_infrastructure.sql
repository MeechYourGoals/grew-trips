-- Calendar Integration Tables
CREATE TABLE IF NOT EXISTS calendar_connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  provider TEXT NOT NULL CHECK (provider IN ('google', 'outlook', 'apple')),
  access_token TEXT NOT NULL,
  refresh_token TEXT,
  calendar_id TEXT NOT NULL,
  sync_enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Synced Events Tracking
CREATE TABLE IF NOT EXISTS synced_calendar_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_event_id UUID REFERENCES trip_events(id) ON DELETE CASCADE,
  external_event_id TEXT NOT NULL,
  calendar_provider TEXT NOT NULL,
  last_synced TIMESTAMPTZ DEFAULT now(),
  sync_status TEXT DEFAULT 'synced' CHECK (sync_status IN ('synced', 'failed', 'pending')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Notification Preferences
CREATE TABLE IF NOT EXISTS notification_preferences (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  push_enabled BOOLEAN DEFAULT true,
  email_enabled BOOLEAN DEFAULT true,
  sms_enabled BOOLEAN DEFAULT false,
  trip_updates BOOLEAN DEFAULT true,
  chat_messages BOOLEAN DEFAULT true,
  calendar_reminders BOOLEAN DEFAULT true,
  payment_alerts BOOLEAN DEFAULT true,
  quiet_hours_enabled BOOLEAN DEFAULT false,
  quiet_start TIME DEFAULT '22:00',
  quiet_end TIME DEFAULT '08:00',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Push Notification Tokens
CREATE TABLE IF NOT EXISTS push_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  token TEXT NOT NULL,
  platform TEXT NOT NULL CHECK (platform IN ('ios', 'android', 'web')),
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, platform)
);

-- Notification History
CREATE TABLE IF NOT EXISTS notification_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  trip_id UUID REFERENCES trips(id) ON DELETE CASCADE,
  notification_type TEXT NOT NULL CHECK (notification_type IN ('push', 'email', 'sms')),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  sent_at TIMESTAMPTZ DEFAULT now(),
  delivery_status TEXT DEFAULT 'pending' CHECK (delivery_status IN ('pending', 'sent', 'failed', 'delivered')),
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Enhanced Photo Metadata
CREATE TABLE IF NOT EXISTS photo_metadata (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  photo_id UUID REFERENCES photos(id) ON DELETE CASCADE,
  exif_data JSONB DEFAULT '{}'::jsonb,
  ai_tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  detected_activities TEXT[] DEFAULT ARRAY[]::TEXT[],
  location_extracted BOOLEAN DEFAULT false,
  faces_detected INTEGER DEFAULT 0,
  confidence_score DECIMAL(3,2) DEFAULT 0.0,
  processing_status TEXT DEFAULT 'pending' CHECK (processing_status IN ('pending', 'processing', 'completed', 'failed')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Smart Todo Items
CREATE TABLE IF NOT EXISTS smart_todos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id UUID REFERENCES trips(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  category TEXT DEFAULT 'activity' CHECK (category IN ('preparation', 'booking', 'packing', 'logistics', 'activity')),
  due_date TIMESTAMPTZ,
  completed BOOLEAN DEFAULT false,
  confidence_score DECIMAL(3,2) DEFAULT 0.0,
  source_message TEXT,
  source_type TEXT DEFAULT 'manual' CHECK (source_type IN ('manual', 'ai_generated', 'chat_extracted')),
  assignee_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Travel Bookings
CREATE TABLE IF NOT EXISTS travel_bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id UUID REFERENCES trips(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  booking_type TEXT NOT NULL CHECK (booking_type IN ('flight', 'hotel', 'restaurant', 'transportation')),
  provider TEXT NOT NULL,
  external_booking_id TEXT,
  confirmation_number TEXT,
  booking_data JSONB NOT NULL DEFAULT '{}'::jsonb,
  booking_status TEXT DEFAULT 'pending' CHECK (booking_status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  total_price DECIMAL(10,2),
  currency TEXT DEFAULT 'USD',
  booking_date TIMESTAMPTZ DEFAULT now(),
  travel_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enhanced Expense Tracking
CREATE TABLE IF NOT EXISTS expense_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  icon TEXT,
  color TEXT,
  default_category BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Insert default expense categories
INSERT INTO expense_categories (name, icon, color, default_category) VALUES
  ('Transportation', '🚗', '#3b82f6', true),
  ('Accommodation', '🏨', '#10b981', true),
  ('Food & Dining', '🍽️', '#f59e0b', true),
  ('Activities', '🎯', '#8b5cf6', true),
  ('Shopping', '🛍️', '#ec4899', true),
  ('Miscellaneous', '📦', '#6b7280', true)
ON CONFLICT DO NOTHING;

-- Enhanced Expenses Table
CREATE TABLE IF NOT EXISTS enhanced_expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id UUID REFERENCES trips(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  category_id UUID REFERENCES expense_categories(id),
  title TEXT NOT NULL,
  description TEXT,
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  receipt_url TEXT,
  receipt_data JSONB DEFAULT '{}'::jsonb,
  split_type TEXT DEFAULT 'equal' CHECK (split_type IN ('equal', 'exact', 'percentage')),
  participants JSONB DEFAULT '[]'::jsonb,
  payment_method TEXT,
  location TEXT,
  expense_date TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- AI Processing Queue
CREATE TABLE IF NOT EXISTS ai_processing_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  processing_type TEXT NOT NULL CHECK (processing_type IN ('photo_analysis', 'calendar_detection', 'todo_generation', 'receipt_parsing')),
  input_data JSONB NOT NULL DEFAULT '{}'::jsonb,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  result_data JSONB DEFAULT '{}'::jsonb,
  confidence_score DECIMAL(3,2),
  processing_time INTEGER, -- in milliseconds
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_calendar_connections_user_id ON calendar_connections(user_id);
CREATE INDEX IF NOT EXISTS idx_synced_calendar_events_trip_event_id ON synced_calendar_events(trip_event_id);
CREATE INDEX IF NOT EXISTS idx_push_tokens_user_id ON push_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_notification_history_user_id ON notification_history(user_id);
CREATE INDEX IF NOT EXISTS idx_photo_metadata_photo_id ON photo_metadata(photo_id);
CREATE INDEX IF NOT EXISTS idx_smart_todos_trip_id ON smart_todos(trip_id);
CREATE INDEX IF NOT EXISTS idx_travel_bookings_trip_id ON travel_bookings(trip_id);
CREATE INDEX IF NOT EXISTS idx_enhanced_expenses_trip_id ON enhanced_expenses(trip_id);
CREATE INDEX IF NOT EXISTS idx_ai_processing_queue_status ON ai_processing_queue(status);
CREATE INDEX IF NOT EXISTS idx_ai_processing_queue_user_id ON ai_processing_queue(user_id);

-- Enable Row Level Security
ALTER TABLE calendar_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE synced_calendar_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE push_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE photo_metadata ENABLE ROW LEVEL SECURITY;
ALTER TABLE smart_todos ENABLE ROW LEVEL SECURITY;
ALTER TABLE travel_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE expense_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE enhanced_expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_processing_queue ENABLE ROW LEVEL SECURITY;

-- RLS Policies for calendar_connections
CREATE POLICY "Users can view their own calendar connections" ON calendar_connections
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own calendar connections" ON calendar_connections
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own calendar connections" ON calendar_connections
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own calendar connections" ON calendar_connections
  FOR DELETE USING (user_id = auth.uid());

-- RLS Policies for notification_preferences
CREATE POLICY "Users can view their own notification preferences" ON notification_preferences
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own notification preferences" ON notification_preferences
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own notification preferences" ON notification_preferences
  FOR UPDATE USING (user_id = auth.uid());

-- RLS Policies for push_tokens
CREATE POLICY "Users can manage their own push tokens" ON push_tokens
  FOR ALL USING (user_id = auth.uid());

-- RLS Policies for notification_history
CREATE POLICY "Users can view their own notification history" ON notification_history
  FOR SELECT USING (user_id = auth.uid());

-- RLS Policies for smart_todos
CREATE POLICY "Users can view todos for their trips" ON smart_todos
  FOR SELECT USING (user_id = auth.uid() OR trip_id IN (
    SELECT id FROM trips WHERE user_id = auth.uid()
  ));

CREATE POLICY "Users can manage todos for their trips" ON smart_todos
  FOR ALL USING (user_id = auth.uid() OR trip_id IN (
    SELECT id FROM trips WHERE user_id = auth.uid()
  ));

-- RLS Policies for travel_bookings
CREATE POLICY "Users can view bookings for their trips" ON travel_bookings
  FOR SELECT USING (user_id = auth.uid() OR trip_id IN (
    SELECT id FROM trips WHERE user_id = auth.uid()
  ));

CREATE POLICY "Users can manage bookings for their trips" ON travel_bookings
  FOR ALL USING (user_id = auth.uid() OR trip_id IN (
    SELECT id FROM trips WHERE user_id = auth.uid()
  ));

-- RLS Policies for expense_categories
CREATE POLICY "Anyone can view expense categories" ON expense_categories
  FOR SELECT USING (true);

-- RLS Policies for enhanced_expenses
CREATE POLICY "Users can view expenses for their trips" ON enhanced_expenses
  FOR SELECT USING (user_id = auth.uid() OR trip_id IN (
    SELECT id FROM trips WHERE user_id = auth.uid()
  ));

CREATE POLICY "Users can manage expenses for their trips" ON enhanced_expenses
  FOR ALL USING (user_id = auth.uid() OR trip_id IN (
    SELECT id FROM trips WHERE user_id = auth.uid()
  ));

-- RLS Policies for ai_processing_queue
CREATE POLICY "Users can view their own AI processing queue" ON ai_processing_queue
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own AI processing requests" ON ai_processing_queue
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- Service role policies for edge functions
CREATE POLICY "Service role can manage all data" ON calendar_connections
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role can manage all notification preferences" ON notification_preferences
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role can manage all push tokens" ON push_tokens
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role can manage all notification history" ON notification_history
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role can manage all photo metadata" ON photo_metadata
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role can manage all smart todos" ON smart_todos
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role can manage all travel bookings" ON travel_bookings
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role can manage all enhanced expenses" ON enhanced_expenses
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role can manage all AI processing queue" ON ai_processing_queue
  FOR ALL USING (auth.role() = 'service_role');

-- Functions for updating timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_calendar_connections_updated_at 
  BEFORE UPDATE ON calendar_connections 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_notification_preferences_updated_at 
  BEFORE UPDATE ON notification_preferences 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_push_tokens_updated_at 
  BEFORE UPDATE ON push_tokens 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_photo_metadata_updated_at 
  BEFORE UPDATE ON photo_metadata 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_smart_todos_updated_at 
  BEFORE UPDATE ON smart_todos 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_travel_bookings_updated_at 
  BEFORE UPDATE ON travel_bookings 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_enhanced_expenses_updated_at 
  BEFORE UPDATE ON enhanced_expenses 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ai_processing_queue_updated_at 
  BEFORE UPDATE ON ai_processing_queue 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();