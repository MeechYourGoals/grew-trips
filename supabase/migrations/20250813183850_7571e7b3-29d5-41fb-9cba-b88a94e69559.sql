-- Enable vector extension for embeddings
CREATE EXTENSION IF NOT EXISTS vector;

-- Create knowledge base tables for AI system
CREATE TABLE IF NOT EXISTS public.kb_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id TEXT NOT NULL,
  source TEXT NOT NULL CHECK (source IN ('message', 'poll', 'broadcast', 'file', 'photo', 'calendar', 'link', 'location', 'system')),
  source_id UUID,
  modality TEXT DEFAULT 'text' CHECK (modality IN ('text', 'image', 'pdf', 'ics', 'html', 'map', 'audio', 'video')),
  plain_text TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  chunk_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.kb_chunks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  doc_id UUID REFERENCES public.kb_documents(id) ON DELETE CASCADE,
  chunk_index INTEGER,
  content TEXT,
  embedding vector(3072), -- OpenAI text-embedding-3-large dimension
  modality TEXT DEFAULT 'text' CHECK (modality IN ('text', 'image', 'pdf', 'ics', 'html', 'map', 'audio', 'video')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create search index for vector similarity
CREATE INDEX IF NOT EXISTS kb_chunks_embedding_idx ON public.kb_chunks USING ivfflat (embedding vector_cosine_ops);

-- Create indexes for efficient querying
CREATE INDEX IF NOT EXISTS kb_docs_trip_source_idx ON public.kb_documents (trip_id, source, created_at);
CREATE INDEX IF NOT EXISTS kb_chunks_doc_idx ON public.kb_chunks (doc_id, chunk_index);

-- Enable RLS on knowledge base tables
ALTER TABLE public.kb_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kb_chunks ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for kb_documents
CREATE POLICY "Users can view kb_documents for their trips" 
ON public.kb_documents 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM trip_members tm 
    WHERE tm.trip_id = kb_documents.trip_id 
    AND tm.user_id = auth.uid()
  )
);

CREATE POLICY "Users can insert kb_documents for their trips" 
ON public.kb_documents 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM trip_members tm 
    WHERE tm.trip_id = kb_documents.trip_id 
    AND tm.user_id = auth.uid()
  )
);

-- Create RLS policies for kb_chunks
CREATE POLICY "Users can view kb_chunks for their trips" 
ON public.kb_chunks 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM kb_documents kd 
    JOIN trip_members tm ON tm.trip_id = kd.trip_id
    WHERE kd.id = kb_chunks.doc_id 
    AND tm.user_id = auth.uid()
  )
);

-- Create function for vector similarity search
CREATE OR REPLACE FUNCTION match_kb_chunks(
  query_embedding vector(3072),
  match_count int DEFAULT 16,
  filter_trip text DEFAULT NULL
)
RETURNS TABLE (
  id uuid,
  doc_id uuid,
  content text,
  similarity float,
  trip_id text,
  source text,
  metadata jsonb
)
LANGUAGE sql STABLE
AS $$
  SELECT 
    kc.id,
    kc.doc_id,
    kc.content,
    1 - (kc.embedding <=> query_embedding) as similarity,
    kd.trip_id,
    kd.source,
    kd.metadata
  FROM kb_chunks kc
  JOIN kb_documents kd ON kd.id = kc.doc_id
  WHERE ($3 IS NULL OR kd.trip_id = $3)
  ORDER BY kc.embedding <=> $1
  LIMIT $2;
$$;

-- Create AI queries audit table
CREATE TABLE IF NOT EXISTS public.ai_queries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id TEXT,
  user_id UUID REFERENCES auth.users(id),
  query_text TEXT,
  response_text TEXT,
  source_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on ai_queries
ALTER TABLE public.ai_queries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own AI queries" 
ON public.ai_queries 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own AI queries" 
ON public.ai_queries 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Update trigger for kb_documents
CREATE OR REPLACE FUNCTION update_updated_at_kb_documents()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_kb_documents_updated_at
  BEFORE UPDATE ON public.kb_documents
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_kb_documents();