-- Create storage bucket for advertiser assets
INSERT INTO storage.buckets (id, name, public) VALUES ('advertiser-assets', 'advertiser-assets', true);

-- Create storage policies for advertiser assets
CREATE POLICY "Authenticated users can upload advertiser assets" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'advertiser-assets' AND auth.uid() IS NOT NULL);

CREATE POLICY "Advertiser assets are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'advertiser-assets');

CREATE POLICY "Users can update their own advertiser assets" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'advertiser-assets' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own advertiser assets" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'advertiser-assets' AND auth.uid()::text = (storage.foldername(name))[1]);