-- Events Enhancement Migration - Live Q&A, Personalized Agendas, Networking

-- Live Q&A System
CREATE TABLE IF NOT EXISTS public.session_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT NOT NULL,
  event_id TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  user_name TEXT NOT NULL,
  question TEXT NOT NULL,
  upvotes INTEGER DEFAULT 0,
  answered BOOLEAN DEFAULT false,
  answer TEXT,
  answered_by TEXT,
  answered_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Personalized User Schedules
CREATE TABLE IF NOT EXISTS public.user_schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  event_id TEXT NOT NULL,
  session_id TEXT NOT NULL,
  session_title TEXT NOT NULL,
  notification_preference INTEGER DEFAULT 15, -- minutes before
  reminder_sent BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Networking Connections
CREATE TABLE IF NOT EXISTS public.attendee_connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id TEXT NOT NULL,
  requester_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  recipient_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  requester_name TEXT NOT NULL,
  recipient_name TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined')),
  match_score FLOAT DEFAULT 0,
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Event Analytics Tracking
CREATE TABLE IF NOT EXISTS public.event_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  action_type TEXT NOT NULL, -- 'session_view', 'question_asked', 'connection_made', etc.
  session_id TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Sponsor Metrics
CREATE TABLE IF NOT EXISTS public.sponsor_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id TEXT NOT NULL,
  sponsor_id TEXT NOT NULL,
  metric_type TEXT NOT NULL, -- 'booth_visits', 'brochure_downloads', 'leads_generated'
  value INTEGER DEFAULT 0,
  metadata JSONB DEFAULT '{}',
  recorded_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.session_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendee_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sponsor_metrics ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view questions for events they attend" ON public.session_questions
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own questions" ON public.session_questions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own questions" ON public.session_questions
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own schedules" ON public.user_schedules
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own schedules" ON public.user_schedules
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their connections" ON public.attendee_connections
  FOR SELECT USING (auth.uid() = requester_id OR auth.uid() = recipient_id);

CREATE POLICY "Users can create connections" ON public.attendee_connections
  FOR INSERT WITH CHECK (auth.uid() = requester_id);

CREATE POLICY "Users can update their connections" ON public.attendee_connections
  FOR UPDATE USING (auth.uid() = requester_id OR auth.uid() = recipient_id);

-- Indexes for performance
CREATE INDEX idx_session_questions_session_id ON public.session_questions(session_id);
CREATE INDEX idx_session_questions_event_id ON public.session_questions(event_id);
CREATE INDEX idx_user_schedules_user_id ON public.user_schedules(user_id);
CREATE INDEX idx_user_schedules_event_id ON public.user_schedules(event_id);
CREATE INDEX idx_attendee_connections_requester ON public.attendee_connections(requester_id);
CREATE INDEX idx_attendee_connections_recipient ON public.attendee_connections(recipient_id);
CREATE INDEX idx_event_analytics_event_id ON public.event_analytics(event_id);
CREATE INDEX idx_sponsor_metrics_event_id ON public.sponsor_metrics(event_id);