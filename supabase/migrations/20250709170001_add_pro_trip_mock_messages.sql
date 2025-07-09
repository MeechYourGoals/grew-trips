-- Add Pro trip mock messages to the existing mock_messages table
INSERT INTO public.mock_messages (trip_type, sender_name, message_content, timestamp_offset_days, tags) VALUES
-- Lakers Road Trip (sports-pro)
('sports-pro', 'Coach Johnson', '🚌 Bus call moved to 09:00 — lobby of the Marriott', 1, ARRAY['logistics']),
('sports-pro', 'Team Manager', 'Per-diems will be distributed after warm-ups', 1, ARRAY['coordination']),
('sports-pro', 'Athletic Director', 'Reminder: team meeting in Conference Room B at 6 PM', 2, ARRAY['meeting']),
('sports-pro', 'Coach Johnson', 'Updated travel itinerary sent to everyone. Check your emails.', 3, ARRAY['logistics']),

-- Taylor Swift Eras Tour (entertainment-tour)
('entertainment-tour', 'Tour Director', '🎵 Load-in starts at 10 AM sharp — all crew report to loading dock', 1, ARRAY['production']),
('entertainment-tour', 'Production Manager', 'Sound check moved to 2:30 PM due to venue scheduling', 1, ARRAY['logistics']),
('entertainment-tour', 'Security Chief', 'Settlement meeting with venue at 11 PM post-show', 2, ARRAY['business']),
('entertainment-tour', 'Tour Director', 'VIP meet & greet moved to 7:30 PM backstage', 2, ARRAY['coordination']),

-- Eli Lilly Corporate Retreat (corporate-retreat)
('corporate-retreat', 'Event Coordinator', '📋 Updated agenda in the Files tab — review before tomorrow''s session', 1, ARRAY['business']),
('corporate-retreat', 'Executive Assistant', 'Reminder: business casual attire for the client dinner tonight', 1, ARRAY['coordination']),
('corporate-retreat', 'Team Lead', 'Transportation to the golf course leaves at 8 AM from hotel lobby', 2, ARRAY['logistics']),
('corporate-retreat', 'Event Coordinator', 'Breakfast meeting with stakeholders at 7 AM sharp', 3, ARRAY['business']),

-- Scarlet Knights Volleyball (youth-sports)
('youth-sports', 'Coach Sarah', '🏐 Practice uniforms for warm-up, game jerseys for matches', 1, ARRAY['youth']),
('youth-sports', 'Team Mom Lisa', 'Parents: pick-up location has changed to the north parking lot', 1, ARRAY['coordination']),
('youth-sports', 'Athletic Director', 'Medical forms need to be submitted before tomorrow''s games', 2, ARRAY['compliance']),
('youth-sports', 'Coach Sarah', 'Team snacks and water bottles will be provided for all matches', 2, ARRAY['youth']),

-- Real Housewives Production (entertainment-tour)
('entertainment-tour', 'Production Manager', '🎬 Call time for filming is 6 AM at the hotel suite', 1, ARRAY['production']),
('entertainment-tour', 'Director', 'Talent briefing at 8 AM - all cast members required', 1, ARRAY['coordination']),
('entertainment-tour', 'Security Chief', 'Paparazzi protocols in effect - use rear entrance only', 2, ARRAY['security']);

-- Add Pro trip mock broadcasts
INSERT INTO public.mock_broadcasts (trip_type, sender_name, content, tag, location) VALUES
-- Sports Pro broadcasts
('sports-pro', 'Coach Johnson', 'Team meeting moved to 7 PM in Conference Room A', 'logistics', 'Hotel Conference Room A'),
('sports-pro', 'Team Manager', 'Game jerseys ready for pickup at equipment room', 'chill', 'Equipment Room'),
('sports-pro', 'Athletic Director', 'Bus departure delayed by 30 minutes due to traffic', 'urgent', 'Hotel Lobby'),

-- Entertainment Tour broadcasts
('entertainment-tour', 'Tour Director', 'Load-in completed ahead of schedule - sound check at 2 PM', 'chill', 'Main Stage'),
('entertainment-tour', 'Production Manager', 'Technical rehearsal mandatory for all crew at 4 PM', 'logistics', 'Main Stage'),
('entertainment-tour', 'Security Chief', 'VIP area access restricted until 6 PM', 'urgent', 'VIP Section'),

-- Corporate Retreat broadcasts
('corporate-retreat', 'Event Coordinator', 'Welcome reception starts at 6 PM in the Grand Ballroom', 'chill', 'Grand Ballroom'),
('corporate-retreat', 'Executive Assistant', 'Presentation materials available in the Files tab', 'logistics', 'Online'),
('corporate-retreat', 'Team Lead', 'Weather update: outdoor activities moved indoors', 'urgent', 'Activity Center'),

-- Youth Sports broadcasts
('youth-sports', 'Coach Sarah', 'Game schedule posted - check the Calendar tab', 'chill', 'Online'),
('youth-sports', 'Team Mom Lisa', 'Snack signup sheet in the Files - please contribute', 'logistics', 'Online'),
('youth-sports', 'Athletic Director', 'Tournament bracket updated - we play at 2 PM', 'urgent', 'Court 3');