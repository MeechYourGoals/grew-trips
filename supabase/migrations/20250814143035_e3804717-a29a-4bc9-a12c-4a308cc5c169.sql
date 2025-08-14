-- Add media fields to trip_chat_messages
ALTER TABLE trip_chat_messages 
ADD COLUMN media_type TEXT,
ADD COLUMN media_url TEXT,
ADD COLUMN link_preview JSONB;

-- Create trip_media_index for automatic media aggregation
CREATE TABLE trip_media_index (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id TEXT NOT NULL,
  message_id UUID REFERENCES trip_chat_messages(id) ON DELETE CASCADE,
  media_type TEXT NOT NULL, -- 'image', 'video', 'audio', 'document'
  media_url TEXT NOT NULL,
  filename TEXT,
  file_size INTEGER,
  mime_type TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create trip_link_index for automatic link aggregation  
CREATE TABLE trip_link_index (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id TEXT NOT NULL,
  message_id UUID REFERENCES trip_chat_messages(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  domain TEXT,
  og_title TEXT,
  og_description TEXT,
  og_image_url TEXT,
  favicon_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on new tables
ALTER TABLE trip_media_index ENABLE ROW LEVEL SECURITY;
ALTER TABLE trip_link_index ENABLE ROW LEVEL SECURITY;

-- RLS policies for trip_media_index
CREATE POLICY "Members can view trip media"
ON trip_media_index FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM trip_members m 
    WHERE m.trip_id = trip_media_index.trip_id 
    AND m.user_id = auth.uid()
  )
);

CREATE POLICY "Members can insert trip media"
ON trip_media_index FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM trip_members m 
    WHERE m.trip_id = trip_media_index.trip_id 
    AND m.user_id = auth.uid()
  )
);

-- RLS policies for trip_link_index
CREATE POLICY "Members can view trip links"
ON trip_link_index FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM trip_members m 
    WHERE m.trip_id = trip_link_index.trip_id 
    AND m.user_id = auth.uid()
  )
);

CREATE POLICY "Members can insert trip links"
ON trip_link_index FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM trip_members m 
    WHERE m.trip_id = trip_link_index.trip_id 
    AND m.user_id = auth.uid()
  )
);

-- Create indexes for performance
CREATE INDEX idx_trip_media_index_trip_id_created_at ON trip_media_index(trip_id, created_at DESC);
CREATE INDEX idx_trip_link_index_trip_id_created_at ON trip_link_index(trip_id, created_at DESC);
CREATE INDEX idx_trip_media_index_media_type ON trip_media_index(media_type);
CREATE INDEX idx_trip_link_index_domain ON trip_link_index(domain);