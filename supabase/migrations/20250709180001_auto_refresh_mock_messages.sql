-- Simplified migration - just add template_key column if needed
-- (Removed auto-refresh trigger functionality as requested)

ALTER TABLE public.trips ADD COLUMN IF NOT EXISTS template_key TEXT;