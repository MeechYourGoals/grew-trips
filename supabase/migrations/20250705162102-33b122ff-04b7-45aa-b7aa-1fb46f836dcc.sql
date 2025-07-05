-- Enable fuzzy search extensions
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE EXTENSION IF NOT EXISTS vector;

-- Create search index table for unified trip search
CREATE TABLE public.search_index (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id TEXT NOT NULL,
  trip_type TEXT NOT NULL CHECK (trip_type IN ('regular', 'pro', 'event')),
  title TEXT NOT NULL,
  location TEXT,
  city TEXT,
  state TEXT,
  country TEXT,
  start_date DATE,
  end_date DATE,
  date_range TEXT,
  formatted_date TEXT, -- "March 2025", "April", etc.
  tags TEXT[],
  participant_names TEXT[],
  participant_roles TEXT[],
  category TEXT,
  description TEXT,
  full_text TEXT NOT NULL, -- Combined searchable text
  embedding VECTOR(1536), -- For future semantic search
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create indexes for efficient search
CREATE INDEX search_index_fulltext_gin_idx ON public.search_index USING gin (full_text gin_trgm_ops);
CREATE INDEX search_index_title_gin_idx ON public.search_index USING gin (title gin_trgm_ops);
CREATE INDEX search_index_location_gin_idx ON public.search_index USING gin (location gin_trgm_ops);
CREATE INDEX search_index_tags_gin_idx ON public.search_index USING gin (tags);
CREATE INDEX search_index_participants_gin_idx ON public.search_index USING gin (participant_names);
CREATE INDEX search_index_trip_type_idx ON public.search_index (trip_type);
CREATE INDEX search_index_date_idx ON public.search_index (start_date, end_date);

-- Add RLS policies
ALTER TABLE public.search_index ENABLE ROW LEVEL SECURITY;

-- Allow read access to search index (for search functionality)
CREATE POLICY "Allow read access to search index" 
ON public.search_index 
FOR SELECT 
USING (true);

-- Allow service role to manage search index (for populating data)
CREATE POLICY "Allow service role to manage search index" 
ON public.search_index 
FOR ALL 
USING (auth.role() = 'service_role'::text)
WITH CHECK (auth.role() = 'service_role'::text);

-- Function to refresh search index (can be called periodically)
CREATE OR REPLACE FUNCTION public.refresh_search_index()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- This function can be extended to sync with external data sources
  -- For now, it's a placeholder for future data synchronization
  REFRESH MATERIALIZED VIEW IF EXISTS search_index_materialized;
  
  -- Update the updated_at timestamp
  UPDATE public.search_index SET updated_at = now() WHERE updated_at < now() - INTERVAL '1 day';
END;
$$;

-- Create trigger for automatic timestamp updates
CREATE OR REPLACE FUNCTION public.update_search_index_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_search_index_updated_at
  BEFORE UPDATE ON public.search_index
  FOR EACH ROW
  EXECUTE FUNCTION public.update_search_index_updated_at();