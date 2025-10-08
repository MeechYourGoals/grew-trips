-- Create event Q&A tables for Live Q&A functionality
CREATE TABLE event_qa_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id TEXT NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  session_id TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id),
  user_name TEXT NOT NULL,
  question TEXT NOT NULL,
  upvotes INTEGER DEFAULT 0,
  answered BOOLEAN DEFAULT FALSE,
  answer TEXT,
  answered_by TEXT,
  answered_by_user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE event_qa_upvotes (
  question_id UUID REFERENCES event_qa_questions(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (question_id, user_id)
);

-- RLS Policies
ALTER TABLE event_qa_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_qa_upvotes ENABLE ROW LEVEL SECURITY;

-- Anyone can view questions for events they have access to
CREATE POLICY "view_qa_questions" ON event_qa_questions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM trip_members tm
      WHERE tm.trip_id = event_id AND tm.user_id = auth.uid()
    )
  );

-- Authenticated users can submit questions
CREATE POLICY "insert_qa_questions" ON event_qa_questions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Organizers/speakers can answer
CREATE POLICY "update_qa_questions" ON event_qa_questions
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM trip_members tm
      WHERE tm.trip_id = event_id 
      AND tm.user_id = auth.uid()
      AND tm.role IN ('admin', 'organizer')
    )
  );

-- Users can upvote
CREATE POLICY "insert_upvotes" ON event_qa_upvotes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "view_upvotes" ON event_qa_upvotes
  FOR SELECT USING (true);

-- Indexes for performance
CREATE INDEX idx_qa_event_session ON event_qa_questions(event_id, session_id);
CREATE INDEX idx_qa_upvotes ON event_qa_questions(upvotes DESC);
CREATE INDEX idx_qa_created ON event_qa_questions(created_at DESC);

-- Enable Realtime
ALTER TABLE event_qa_questions REPLICA IDENTITY FULL;
ALTER TABLE event_qa_upvotes REPLICA IDENTITY FULL;