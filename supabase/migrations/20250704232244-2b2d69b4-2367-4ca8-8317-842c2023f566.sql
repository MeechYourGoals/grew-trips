-- Create mock_messages table for demo mode
CREATE TABLE public.mock_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  trip_type TEXT NOT NULL,
  sender_name TEXT NOT NULL,
  message_content TEXT NOT NULL,
  delay_seconds INTEGER DEFAULT 0,
  timestamp_offset_days INTEGER DEFAULT 1,
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create mock_broadcasts table for demo announcements
CREATE TABLE public.mock_broadcasts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  trip_type TEXT NOT NULL,
  sender_name TEXT NOT NULL,
  content TEXT NOT NULL,
  tag TEXT CHECK (tag IN ('chill', 'logistics', 'urgent')) DEFAULT 'chill',
  location TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.mock_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mock_broadcasts ENABLE ROW LEVEL SECURITY;

-- RLS policies - allow read access for demo purposes
CREATE POLICY "Allow read access to mock messages"
ON public.mock_messages
FOR SELECT
USING (true);

CREATE POLICY "Allow read access to mock broadcasts"
ON public.mock_broadcasts
FOR SELECT
USING (true);

-- Create indexes for performance
CREATE INDEX idx_mock_messages_trip_type ON public.mock_messages(trip_type);
CREATE INDEX idx_mock_broadcasts_trip_type ON public.mock_broadcasts(trip_type);

-- Insert your provided mock data
INSERT INTO public.mock_messages (trip_type, sender_name, message_content, timestamp_offset_days) VALUES
-- Bali Getaway (leisure-group)
('leisure-group', 'Alyssa', 'Do we need to bring bug spray or is that dramatic? 😅', 2),
('leisure-group', 'Marco', 'Just booked my massage for Day 3—highly recommend!', 1),
('leisure-group', 'Tasha', 'Also—can we do matching outfits for Uluwatu temple day?', 1),

-- Kristen's Bachelorette Party
('bachelorette', 'Jess', 'Soooo are we doing cowgirl boots or heels for Friday night?', 3),
('bachelorette', 'Kristen', 'I just want tacos, tequila, and good vibes y''all 🌮🍹', 2),
('bachelorette', 'Diego', 'I''m down to make the airport signs, btw. Any theme?', 1),

-- Coachella Squad 2026
('festival', 'Ray', 'Who''s making the shared playlist this year? 👀', 4),
('festival', 'Maya', 'I vote we all meet at the same Airbnb by 4PM Thursday', 3),
('festival', 'Sam', 'Sunday we rest. Saturday we rage. That''s the order.', 2),

-- Johnson Family Summer Vacay
('family-vacation', 'Mom', 'Don''t forget to pack sunscreen! ☀️', 3),
('family-vacation', 'Uncle Greg', 'Can we squeeze in one day for golf?', 2),
('family-vacation', 'Tina', 'Let''s do a big family dinner night on the 23rd. I''ll cook!', 1),

-- Fantasy Football Golf Trip
('friends-trip', 'Darren', 'Bet $20 Ben misses the tee time again this year 😂', 2),
('friends-trip', 'Mike', 'I booked the 6-person golf cart—we rolling deep', 1),
('friends-trip', 'Leo', 'Remind me what bar we hit last time? That bartender was 🔥', 1),

-- 8th Grade DC Field Trip
('school-trip', 'Ms. Greene', 'Reminder: bring snacks and chargers for the bus!', 3),
('school-trip', 'Tyrell', 'Are we allowed to bring Switches? Asking for a friend 👀', 2),
('school-trip', 'Jamie', 'Who''s rooming with who? I call dibs with Marcus.', 1),

-- Lakers Road Trip
('sports-pro', 'Coach Don', 'Media availability in Portland is 2 hours before tip-off.', 2),
('sports-pro', 'PR', 'Reminder: team photos in Denver. Wear black sweatsuits.', 1),
('sports-pro', 'Jay', 'Room assignments are in. No switches unless cleared with me.', 1),

-- Taylor Swift Eras Tour
('entertainment-tour', 'Tour Manager', 'Call time for Tokyo is 3PM sharp. Venue security is tight.', 2),
('entertainment-tour', 'Taylor', 'Can someone confirm if we got the same stage layout in Sydney?', 1),
('entertainment-tour', 'Security Lead', 'All wristbands and load-in passes are in the hotel lobby.', 1),

-- Eli Lilly C-Suite Retreat
('corporate-retreat', 'Angela (Exec Asst)', 'Welcome kits will be in each room by check-in.', 3),
('corporate-retreat', 'CEO', 'Let''s keep this off agenda—but I want a 15-min innovation huddle Friday.', 2),
('corporate-retreat', 'Strategy Lead', 'Team dinner on the terrace at 6:30. No decks. Just vibes.', 1),

-- AAU Volleyball Tournament
('youth-sports', 'Coach Val', 'Game 1 warm-up is 7:30am. Don''t be late or sleepy.', 2),
('youth-sports', 'Team Captain', 'Bring snacks and electrolytes. Court 4 is a hotbox.', 1),
('youth-sports', 'Parent Coordinator', 'Team dinner at Olive Garden Friday night 🍝', 1);

-- Insert mock broadcasts
INSERT INTO public.mock_broadcasts (trip_type, sender_name, content, tag, location) VALUES
('leisure-group', 'Marco', 'Dinner reservation confirmed for 7 PM at Locavore. Don''t be late!', 'logistics', 'Locavore Restaurant'),
('bachelorette', 'Kristen', 'Last shuttle back to hotel leaves at 2 AM - don''t miss it!', 'urgent', 'Downtown Nashville'),
('festival', 'Maya', 'Meeting point for Coachella: Main Stage at 3 PM. Look for the rainbow flag!', 'logistics', 'Coachella Main Stage'),
('family-vacation', 'Mom', 'Family photo session at the beach tomorrow at sunset 📸', 'chill', 'Beach Resort'),
('friends-trip', 'Mike', 'Golf tee time confirmed for 8 AM sharp. Breakfast included!', 'logistics', 'Augusta Golf Club'),
('sports-pro', 'Coach Don', 'Team meeting in Conference Room A at 6 PM. Mandatory attendance.', 'urgent', 'Team Hotel'),
('entertainment-tour', 'Tour Manager', 'Sound check moved to 4 PM. All crew report to stage.', 'logistics', 'Concert Venue'),
('corporate-retreat', 'Angela (Exec Asst)', 'Welcome reception starts at 6:30 PM in the main ballroom.', 'chill', 'Resort Ballroom'),
('youth-sports', 'Coach Val', 'Tournament bracket is out! We play at Court 3, 9 AM.', 'logistics', 'Sports Complex');