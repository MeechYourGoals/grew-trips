-- Create channel_messages table for storing Stream chat history
CREATE TABLE public.channel_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  channel_id TEXT NOT NULL,
  message_id TEXT NOT NULL,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  text TEXT,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Indexes for faster lookups
CREATE INDEX channel_messages_channel_id_idx ON public.channel_messages(channel_id);
CREATE INDEX channel_messages_user_id_idx ON public.channel_messages(user_id);

-- Enable Row Level Security
ALTER TABLE public.channel_messages ENABLE ROW LEVEL SECURITY;

-- Allow users to manage their own messages
CREATE POLICY "Users manage own messages" ON public.channel_messages
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
