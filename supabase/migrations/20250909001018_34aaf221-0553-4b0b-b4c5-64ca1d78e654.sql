-- Fix remaining search_path security warnings for other functions
CREATE OR REPLACE FUNCTION public.update_updated_at_kb_documents()
RETURNS TRIGGER 
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Update match_kb_chunks function to include search_path
CREATE OR REPLACE FUNCTION public.match_kb_chunks(
  query_embedding vector, 
  match_count integer DEFAULT 16, 
  filter_trip text DEFAULT NULL::text
)
RETURNS TABLE(
  id uuid, 
  doc_id uuid, 
  content text, 
  similarity double precision, 
  trip_id text, 
  source text, 
  metadata jsonb
)
LANGUAGE sql
STABLE
SET search_path = public
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