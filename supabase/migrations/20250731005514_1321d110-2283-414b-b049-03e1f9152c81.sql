-- Create profiles table for user data
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  display_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  email TEXT,
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  role TEXT DEFAULT 'consumer',
  notification_settings JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Profiles are viewable by everyone" 
ON public.profiles 
FOR SELECT 
USING (true);

CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create receipts table
CREATE TABLE public.receipts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  trip_id TEXT,
  amount DECIMAL(10,2) NOT NULL,
  description TEXT,
  category TEXT,
  receipt_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for receipts
ALTER TABLE public.receipts ENABLE ROW LEVEL SECURITY;

-- Create policies for receipts
CREATE POLICY "Users can view their own receipts" 
ON public.receipts 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own receipts" 
ON public.receipts 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own receipts" 
ON public.receipts 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own receipts" 
ON public.receipts 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create invite_links table
CREATE TABLE public.invite_links (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  trip_id TEXT NOT NULL,
  code TEXT NOT NULL UNIQUE,
  created_by UUID NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE,
  max_uses INTEGER,
  current_uses INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for invite_links
ALTER TABLE public.invite_links ENABLE ROW LEVEL SECURITY;

-- Create policies for invite_links
CREATE POLICY "Anyone can view active invite links" 
ON public.invite_links 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Users can create invite links" 
ON public.invite_links 
FOR INSERT 
WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update their own invite links" 
ON public.invite_links 
FOR UPDATE 
USING (auth.uid() = created_by);

-- Create secure_storage table
CREATE TABLE public.secure_storage (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  key TEXT NOT NULL,
  value TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, key)
);

-- Enable RLS for secure_storage
ALTER TABLE public.secure_storage ENABLE ROW LEVEL SECURITY;

-- Create policies for secure_storage
CREATE POLICY "Users can access their own secure storage" 
ON public.secure_storage 
FOR ALL 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_receipts_updated_at
BEFORE UPDATE ON public.receipts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_invite_links_updated_at
BEFORE UPDATE ON public.invite_links
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_secure_storage_updated_at
BEFORE UPDATE ON public.secure_storage
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();