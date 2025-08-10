-- 1) Create table for saved recommendations
CREATE TABLE IF NOT EXISTS public.saved_recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  rec_id INTEGER NOT NULL,
  rec_type TEXT NOT NULL,
  title TEXT NOT NULL,
  location TEXT,
  city TEXT,
  external_link TEXT,
  image_url TEXT,
  data JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, rec_id)
);

-- 2) Enable RLS
ALTER TABLE public.saved_recommendations ENABLE ROW LEVEL SECURITY;

-- 3) Policies: users can manage their own saved recs
CREATE POLICY "Users can view own saved recommendations"
ON public.saved_recommendations
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own saved recommendations"
ON public.saved_recommendations
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own saved recommendations"
ON public.saved_recommendations
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own saved recommendations"
ON public.saved_recommendations
FOR DELETE
USING (auth.uid() = user_id);

-- 4) Timestamp trigger for updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_saved_recommendations_updated_at ON public.saved_recommendations;
CREATE TRIGGER update_saved_recommendations_updated_at
BEFORE UPDATE ON public.saved_recommendations
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 5) Helpful indexes
CREATE INDEX IF NOT EXISTS idx_saved_recs_user_id ON public.saved_recommendations(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_recs_rec_type ON public.saved_recommendations(rec_type);
