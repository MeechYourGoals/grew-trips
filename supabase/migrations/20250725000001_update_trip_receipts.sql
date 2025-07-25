-- Rename columns to match application expectations
ALTER TABLE public.trip_receipts
  RENAME COLUMN receipt_image_path TO file_url;
ALTER TABLE public.trip_receipts
  RENAME COLUMN uploaded_by TO uploader_id;

-- Update RLS policy to use new column name
DROP POLICY IF EXISTS "Users can upload receipts to their trips" ON public.trip_receipts;
CREATE POLICY "Users can upload receipts to their trips" ON public.trip_receipts
  FOR INSERT WITH CHECK (
    uploader_id = auth.uid() AND
    trip_id IN (
      SELECT trip_id FROM trip_members
      WHERE user_id = auth.uid() AND status = 'active'
    )
  );
