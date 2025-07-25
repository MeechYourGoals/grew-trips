-- Add table for storing travel reservations
CREATE TABLE IF NOT EXISTS trip_bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id UUID REFERENCES trips(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  booking_type TEXT NOT NULL CHECK (booking_type IN ('flight', 'hotel', 'restaurant', 'transportation')),
  provider TEXT NOT NULL,
  external_booking_id TEXT,
  confirmation_number TEXT,
  booking_data JSONB NOT NULL DEFAULT '{}'::jsonb,
  booking_status TEXT DEFAULT 'pending' CHECK (booking_status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  total_price DECIMAL(10,2),
  currency TEXT DEFAULT 'USD',
  booking_date TIMESTAMPTZ DEFAULT now(),
  travel_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_trip_bookings_trip_id ON trip_bookings(trip_id);
CREATE INDEX IF NOT EXISTS idx_trip_bookings_user_id ON trip_bookings(user_id);

ALTER TABLE trip_bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view bookings for their trips" ON trip_bookings
  FOR SELECT USING (user_id = auth.uid() OR trip_id IN (
    SELECT id FROM trips WHERE user_id = auth.uid()
  ));

CREATE POLICY "Users can manage bookings for their trips" ON trip_bookings
  FOR ALL USING (user_id = auth.uid() OR trip_id IN (
    SELECT id FROM trips WHERE user_id = auth.uid()
  ));

CREATE POLICY "Service role can manage all trip bookings" ON trip_bookings
  FOR ALL USING (auth.role() = 'service_role');

CREATE TRIGGER update_trip_bookings_updated_at
  BEFORE UPDATE ON trip_bookings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
