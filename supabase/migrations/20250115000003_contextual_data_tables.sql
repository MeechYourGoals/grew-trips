-- Create trip_links table for storing shared links
CREATE TABLE IF NOT EXISTS public.trip_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id UUID NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL CHECK (category IN ('restaurant', 'activity', 'accommodation', 'transportation', 'attraction', 'shopping', 'other')),
  votes INTEGER DEFAULT 0,
  added_by UUID NOT NULL REFERENCES auth.users(id),
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create trip_polls table for storing group polls
CREATE TABLE IF NOT EXISTS public.trip_polls (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id UUID NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  options JSONB NOT NULL DEFAULT '[]'::jsonb, -- Array of {id, text, votes}
  total_votes INTEGER DEFAULT 0,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'closed')),
  created_by UUID NOT NULL REFERENCES auth.users(id),
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create trip_chat_messages table for storing chat history
CREATE TABLE IF NOT EXISTS public.trip_chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id UUID NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  author_id UUID NOT NULL REFERENCES auth.users(id),
  author_name TEXT NOT NULL,
  message_type TEXT DEFAULT 'message' CHECK (message_type IN ('message', 'broadcast', 'system')),
  sentiment TEXT CHECK (sentiment IN ('positive', 'neutral', 'negative')),
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create trip_files table for storing uploaded files and their AI summaries
CREATE TABLE IF NOT EXISTS public.trip_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id UUID NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size INTEGER,
  file_url TEXT,
  content_text TEXT, -- Extracted text content
  ai_summary TEXT, -- AI-generated summary
  extracted_events INTEGER DEFAULT 0,
  uploaded_by UUID NOT NULL REFERENCES auth.users(id),
  processing_status TEXT DEFAULT 'pending' CHECK (processing_status IN ('pending', 'processing', 'completed', 'failed')),
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create trip_preferences table for storing group preferences
CREATE TABLE IF NOT EXISTS public.trip_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id UUID NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  dietary TEXT[] DEFAULT '{}', -- Array of dietary restrictions
  vibe TEXT[] DEFAULT '{}', -- Array of preferred vibes
  accessibility TEXT[] DEFAULT '{}', -- Accessibility requirements
  business TEXT[] DEFAULT '{}', -- Business preferences
  entertainment TEXT[] DEFAULT '{}', -- Entertainment preferences  
  lifestyle TEXT[] DEFAULT '{}', -- Lifestyle preferences
  budget_min INTEGER DEFAULT 0,
  budget_max INTEGER DEFAULT 1000,
  time_preference TEXT DEFAULT 'flexible' CHECK (time_preference IN ('early-riser', 'night-owl', 'flexible')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(trip_id)
);

-- Enable RLS on all new tables
ALTER TABLE public.trip_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trip_polls ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trip_chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trip_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trip_preferences ENABLE ROW LEVEL SECURITY;

-- RLS Policies for trip_links
CREATE POLICY "Users can view links from their trips" ON public.trip_links
  FOR SELECT USING (
    trip_id IN (
      SELECT id FROM trips WHERE user_id = auth.uid()
      OR id IN (SELECT trip_id FROM trip_participants WHERE user_id = auth.uid())
    )
  );

CREATE POLICY "Users can manage links in their trips" ON public.trip_links
  FOR ALL USING (
    trip_id IN (
      SELECT id FROM trips WHERE user_id = auth.uid()
      OR id IN (SELECT trip_id FROM trip_participants WHERE user_id = auth.uid())
    )
  );

-- RLS Policies for trip_polls  
CREATE POLICY "Users can view polls from their trips" ON public.trip_polls
  FOR SELECT USING (
    trip_id IN (
      SELECT id FROM trips WHERE user_id = auth.uid()
      OR id IN (SELECT trip_id FROM trip_participants WHERE user_id = auth.uid())
    )
  );

CREATE POLICY "Users can manage polls in their trips" ON public.trip_polls
  FOR ALL USING (
    trip_id IN (
      SELECT id FROM trips WHERE user_id = auth.uid()
      OR id IN (SELECT trip_id FROM trip_participants WHERE user_id = auth.uid())
    )
  );

-- RLS Policies for trip_chat_messages
CREATE POLICY "Users can view chat messages from their trips" ON public.trip_chat_messages
  FOR SELECT USING (
    trip_id IN (
      SELECT id FROM trips WHERE user_id = auth.uid()
      OR id IN (SELECT trip_id FROM trip_participants WHERE user_id = auth.uid())
    )
  );

CREATE POLICY "Users can insert chat messages in their trips" ON public.trip_chat_messages
  FOR INSERT WITH CHECK (
    trip_id IN (
      SELECT id FROM trips WHERE user_id = auth.uid()
      OR id IN (SELECT trip_id FROM trip_participants WHERE user_id = auth.uid())
    )
  );

-- RLS Policies for trip_files
CREATE POLICY "Users can view files from their trips" ON public.trip_files
  FOR SELECT USING (
    trip_id IN (
      SELECT id FROM trips WHERE user_id = auth.uid()
      OR id IN (SELECT trip_id FROM trip_participants WHERE user_id = auth.uid())
    )
  );

CREATE POLICY "Users can manage files in their trips" ON public.trip_files
  FOR ALL USING (
    trip_id IN (
      SELECT id FROM trips WHERE user_id = auth.uid()
      OR id IN (SELECT trip_id FROM trip_participants WHERE user_id = auth.uid())
    )
  );

-- RLS Policies for trip_preferences
CREATE POLICY "Users can view preferences from their trips" ON public.trip_preferences
  FOR SELECT USING (
    trip_id IN (
      SELECT id FROM trips WHERE user_id = auth.uid()
      OR id IN (SELECT trip_id FROM trip_participants WHERE user_id = auth.uid())
    )
  );

CREATE POLICY "Users can manage preferences in their trips" ON public.trip_preferences
  FOR ALL USING (
    trip_id IN (
      SELECT id FROM trips WHERE user_id = auth.uid()
      OR id IN (SELECT trip_id FROM trip_participants WHERE user_id = auth.uid())
    )
  );

-- Create indexes for performance
CREATE INDEX idx_trip_links_trip_id ON public.trip_links(trip_id);
CREATE INDEX idx_trip_links_category ON public.trip_links(category);
CREATE INDEX idx_trip_polls_trip_id ON public.trip_polls(trip_id);
CREATE INDEX idx_trip_polls_status ON public.trip_polls(status);
CREATE INDEX idx_trip_chat_messages_trip_id ON public.trip_chat_messages(trip_id);
CREATE INDEX idx_trip_chat_messages_created_at ON public.trip_chat_messages(created_at);
CREATE INDEX idx_trip_files_trip_id ON public.trip_files(trip_id);
CREATE INDEX idx_trip_files_processing_status ON public.trip_files(processing_status);
CREATE INDEX idx_trip_preferences_trip_id ON public.trip_preferences(trip_id);

-- Create triggers for updated_at columns
CREATE TRIGGER update_trip_links_updated_at
  BEFORE UPDATE ON public.trip_links
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_trip_polls_updated_at
  BEFORE UPDATE ON public.trip_polls
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_trip_chat_messages_updated_at
  BEFORE UPDATE ON public.trip_chat_messages
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_trip_files_updated_at
  BEFORE UPDATE ON public.trip_files
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_trip_preferences_updated_at
  BEFORE UPDATE ON public.trip_preferences
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();