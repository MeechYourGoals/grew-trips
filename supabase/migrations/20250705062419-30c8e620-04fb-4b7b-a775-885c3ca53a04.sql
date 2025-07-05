-- Create storage buckets for file management
INSERT INTO storage.buckets (id, name, public) VALUES 
  ('trip-files', 'trip-files', false),
  ('trip-images', 'trip-images', false),
  ('trip-photos', 'trip-photos', true);

-- Create trip_files table for document/file management
CREATE TABLE public.trip_files (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  trip_id TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size BIGINT,
  uploaded_by UUID NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create file_ai_extractions table for AI parsing results
CREATE TABLE public.file_ai_extractions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  file_id UUID REFERENCES public.trip_files(id) ON DELETE CASCADE,
  extracted_data JSONB NOT NULL DEFAULT '{}',
  extraction_type TEXT NOT NULL, -- 'calendar', 'receipt', 'text', etc.
  confidence_score DECIMAL(3,2),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create trip_photos table for photo management
CREATE TABLE public.trip_photos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  trip_id TEXT NOT NULL,
  photo_path TEXT NOT NULL,
  thumbnail_path TEXT,
  uploaded_by UUID NOT NULL,
  caption TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create photo_albums table for organizing photos
CREATE TABLE public.photo_albums (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  trip_id TEXT NOT NULL,
  album_name TEXT NOT NULL,
  cover_photo_id UUID REFERENCES public.trip_photos(id) ON DELETE SET NULL,
  created_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create trip_receipts table for receipt management
CREATE TABLE public.trip_receipts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  trip_id TEXT NOT NULL,
  receipt_image_path TEXT NOT NULL,
  total_amount DECIMAL(10,2),
  currency TEXT DEFAULT 'USD',
  uploaded_by UUID NOT NULL,
  parsed_data JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create expense_splits table for expense splitting
CREATE TABLE public.expense_splits (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  receipt_id UUID REFERENCES public.trip_receipts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  amount_owed DECIMAL(10,2) NOT NULL,
  payment_status TEXT DEFAULT 'pending', -- 'pending', 'paid', 'declined'
  payment_method TEXT, -- 'venmo', 'cashapp', 'zelle', etc.
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create payment_requests table for tracking payment requests
CREATE TABLE public.payment_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  expense_split_id UUID REFERENCES public.expense_splits(id) ON DELETE CASCADE,
  request_status TEXT DEFAULT 'sent', -- 'sent', 'viewed', 'paid', 'expired'
  payment_link TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create trip_events table for calendar events
CREATE TABLE public.trip_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  trip_id TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE,
  location TEXT,
  created_by UUID NOT NULL,
  google_event_id TEXT, -- for Google Calendar sync
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create event_attendees table for RSVP management
CREATE TABLE public.event_attendees (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID REFERENCES public.trip_events(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  attendance_status TEXT DEFAULT 'pending', -- 'pending', 'attending', 'not_attending', 'maybe'
  rsvp_time TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(event_id, user_id)
);

-- Create calendar_integrations table for calendar sync
CREATE TABLE public.calendar_integrations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  calendar_provider TEXT NOT NULL, -- 'google', 'outlook', 'apple'
  access_token TEXT,
  refresh_token TEXT,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, calendar_provider)
);

-- Enable RLS on all new tables
ALTER TABLE public.trip_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.file_ai_extractions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trip_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.photo_albums ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trip_receipts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expense_splits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trip_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_attendees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.calendar_integrations ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for trip_files
CREATE POLICY "Users can view files for their trips" ON public.trip_files
  FOR SELECT USING (trip_id IN (
    SELECT trip_id FROM trip_members 
    WHERE user_id = auth.uid() AND status = 'active'
  ));

CREATE POLICY "Users can upload files to their trips" ON public.trip_files
  FOR INSERT WITH CHECK (
    uploaded_by = auth.uid() AND 
    trip_id IN (
      SELECT trip_id FROM trip_members 
      WHERE user_id = auth.uid() AND status = 'active'
    )
  );

-- Create RLS policies for trip_photos
CREATE POLICY "Users can view photos for their trips" ON public.trip_photos
  FOR SELECT USING (trip_id IN (
    SELECT trip_id FROM trip_members 
    WHERE user_id = auth.uid() AND status = 'active'
  ));

CREATE POLICY "Users can upload photos to their trips" ON public.trip_photos
  FOR INSERT WITH CHECK (
    uploaded_by = auth.uid() AND 
    trip_id IN (
      SELECT trip_id FROM trip_members 
      WHERE user_id = auth.uid() AND status = 'active'
    )
  );

-- Create RLS policies for trip_receipts
CREATE POLICY "Users can view receipts for their trips" ON public.trip_receipts
  FOR SELECT USING (trip_id IN (
    SELECT trip_id FROM trip_members 
    WHERE user_id = auth.uid() AND status = 'active'
  ));

CREATE POLICY "Users can upload receipts to their trips" ON public.trip_receipts
  FOR INSERT WITH CHECK (
    uploaded_by = auth.uid() AND 
    trip_id IN (
      SELECT trip_id FROM trip_members 
      WHERE user_id = auth.uid() AND status = 'active'
    )
  );

-- Create RLS policies for trip_events
CREATE POLICY "Users can view events for their trips" ON public.trip_events
  FOR SELECT USING (trip_id IN (
    SELECT trip_id FROM trip_members 
    WHERE user_id = auth.uid() AND status = 'active'
  ));

CREATE POLICY "Users can create events for their trips" ON public.trip_events
  FOR INSERT WITH CHECK (
    created_by = auth.uid() AND 
    trip_id IN (
      SELECT trip_id FROM trip_members 
      WHERE user_id = auth.uid() AND status = 'active'
    )
  );

-- Create RLS policies for calendar_integrations (users can only manage their own)
CREATE POLICY "Users can manage their own calendar integrations" ON public.calendar_integrations
  FOR ALL USING (user_id = auth.uid());

-- Create storage policies for trip-files bucket
CREATE POLICY "Users can view files for their trips" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'trip-files' AND 
    (storage.foldername(name))[1] IN (
      SELECT trip_id FROM trip_members 
      WHERE user_id = auth.uid() AND status = 'active'
    )
  );

CREATE POLICY "Users can upload files to their trips" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'trip-files' AND 
    (storage.foldername(name))[1] IN (
      SELECT trip_id FROM trip_members 
      WHERE user_id = auth.uid() AND status = 'active'
    )
  );

-- Create storage policies for trip-images bucket
CREATE POLICY "Users can view images for their trips" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'trip-images' AND 
    (storage.foldername(name))[1] IN (
      SELECT trip_id FROM trip_members 
      WHERE user_id = auth.uid() AND status = 'active'
    )
  );

CREATE POLICY "Users can upload images to their trips" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'trip-images' AND 
    (storage.foldername(name))[1] IN (
      SELECT trip_id FROM trip_members 
      WHERE user_id = auth.uid() AND status = 'active'
    )
  );

-- Create storage policies for trip-photos bucket (public for easy sharing)
CREATE POLICY "Anyone can view trip photos" ON storage.objects
  FOR SELECT USING (bucket_id = 'trip-photos');

CREATE POLICY "Users can upload photos to their trips" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'trip-photos' AND 
    (storage.foldername(name))[1] IN (
      SELECT trip_id FROM trip_members 
      WHERE user_id = auth.uid() AND status = 'active'
    )
  );

-- Create updated_at triggers for all tables
CREATE TRIGGER update_trip_files_updated_at
  BEFORE UPDATE ON public.trip_files
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_trip_photos_updated_at
  BEFORE UPDATE ON public.trip_photos
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_photo_albums_updated_at
  BEFORE UPDATE ON public.photo_albums
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_trip_receipts_updated_at
  BEFORE UPDATE ON public.trip_receipts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_expense_splits_updated_at
  BEFORE UPDATE ON public.expense_splits
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_payment_requests_updated_at
  BEFORE UPDATE ON public.payment_requests
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_trip_events_updated_at
  BEFORE UPDATE ON public.trip_events
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_calendar_integrations_updated_at
  BEFORE UPDATE ON public.calendar_integrations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();