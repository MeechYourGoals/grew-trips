-- Create payment-related tables for trip expense tracking

-- User payment methods table
CREATE TABLE public.user_payment_methods (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  method_type TEXT NOT NULL CHECK (method_type IN ('venmo', 'zelle', 'cashapp', 'applepay', 'paypal', 'cash', 'other')),
  identifier TEXT NOT NULL,
  display_name TEXT,
  is_preferred BOOLEAN DEFAULT false,
  is_visible BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Trip payment messages table
CREATE TABLE public.trip_payment_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  trip_id TEXT NOT NULL,
  message_id UUID,
  amount NUMERIC NOT NULL CHECK (amount > 0),
  currency TEXT NOT NULL DEFAULT 'USD',
  description TEXT NOT NULL,
  split_count INTEGER NOT NULL CHECK (split_count > 0),
  split_participants JSONB NOT NULL DEFAULT '[]'::jsonb,
  payment_methods JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_by UUID NOT NULL,
  is_settled BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Payment splits tracking table
CREATE TABLE public.payment_splits (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  payment_message_id UUID NOT NULL REFERENCES public.trip_payment_messages(id) ON DELETE CASCADE,
  debtor_user_id UUID NOT NULL,
  amount_owed NUMERIC NOT NULL CHECK (amount_owed > 0),
  is_settled BOOLEAN DEFAULT false,
  settled_at TIMESTAMP WITH TIME ZONE,
  settlement_method TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.user_payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trip_payment_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_splits ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_payment_methods
CREATE POLICY "Users can manage their own payment methods"
ON public.user_payment_methods
FOR ALL
USING (auth.uid() = user_id);

-- RLS Policies for trip_payment_messages
CREATE POLICY "Trip members can view payment messages"
ON public.trip_payment_messages
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM trip_members tm 
    WHERE tm.trip_id = trip_payment_messages.trip_id 
    AND tm.user_id = auth.uid()
  )
);

CREATE POLICY "Trip members can create payment messages"
ON public.trip_payment_messages
FOR INSERT
WITH CHECK (
  auth.uid() = created_by AND
  EXISTS (
    SELECT 1 FROM trip_members tm 
    WHERE tm.trip_id = trip_payment_messages.trip_id 
    AND tm.user_id = auth.uid()
  )
);

CREATE POLICY "Payment creators can update their messages"
ON public.trip_payment_messages
FOR UPDATE
USING (auth.uid() = created_by);

-- RLS Policies for payment_splits
CREATE POLICY "Trip members can view payment splits"
ON public.payment_splits
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM trip_payment_messages tpm
    JOIN trip_members tm ON tm.trip_id = tpm.trip_id
    WHERE tpm.id = payment_splits.payment_message_id
    AND tm.user_id = auth.uid()
  )
);

CREATE POLICY "Debtors can update their own payment splits"
ON public.payment_splits
FOR UPDATE
USING (auth.uid() = debtor_user_id);

-- Create indexes for better performance
CREATE INDEX idx_user_payment_methods_user_id ON public.user_payment_methods(user_id);
CREATE INDEX idx_trip_payment_messages_trip_id ON public.trip_payment_messages(trip_id);
CREATE INDEX idx_trip_payment_messages_created_by ON public.trip_payment_messages(created_by);
CREATE INDEX idx_payment_splits_payment_message_id ON public.payment_splits(payment_message_id);
CREATE INDEX idx_payment_splits_debtor_user_id ON public.payment_splits(debtor_user_id);

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_user_payment_methods_updated_at
  BEFORE UPDATE ON public.user_payment_methods
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_trip_payment_messages_updated_at
  BEFORE UPDATE ON public.trip_payment_messages
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_payment_splits_updated_at
  BEFORE UPDATE ON public.payment_splits
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();