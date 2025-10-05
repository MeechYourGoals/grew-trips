import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders } from '../_shared/cors.ts';

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

serve(async (req) => {
  const { createOptionsResponse, createErrorResponse, createSecureResponse } = await import('../_shared/securityHeaders.ts');
  
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { tripId = '1' } = await req.json();
    
    // Clear existing data for this trip
    await Promise.all([
      supabase.from('trip_chat_messages').delete().eq('trip_id', tripId),
      supabase.from('trip_polls').delete().eq('trip_id', tripId),
      supabase.from('trip_files').delete().eq('trip_id', tripId),
      supabase.from('trip_links').delete().eq('trip_id', tripId)
    ]);

    // Mock user IDs (these should correspond to actual profiles)
    const users = {
      sarah: '550e8400-e29b-41d4-a716-446655440001',
      mike: '550e8400-e29b-41d4-a716-446655440002',
      jessica: '550e8400-e29b-41d4-a716-446655440003',
      current: '550e8400-e29b-41d4-a716-446655440000' // Current user
    };

    // Seed chat messages
    const chatMessages = [
      {
        trip_id: tripId,
        content: "Hey everyone! Just confirmed our hotel reservations at the Grand Resort for March 15-18. Check-in is at 3 PM.",
        author_name: "Sarah Chen",
        created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        trip_id: tripId,
        content: "Perfect! I've booked our dinner at Marea for March 16th at 8 PM. They have that amazing seafood menu we talked about.",
        author_name: "Mike Rodriguez",
        created_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        trip_id: tripId,
        content: "Flight update: My American Airlines flight 1847 lands at JFK at 2:15 PM on March 15th. Can someone pick me up?",
        author_name: "Jessica Williams",
        created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        trip_id: tripId,
        content: "I can pick you up Jessica! Also, I found some great Broadway show options for Friday night.",
        author_name: "Sarah Chen",
        created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        trip_id: tripId,
        content: "Thanks Sarah! Also, reminder that we need to pack warm clothes - weather forecast shows temps in the 40s.",
        author_name: "Mike Rodriguez",
        created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        trip_id: tripId,
        content: "Just arrived at the hotel! The view from our rooms is incredible. Can't wait for tomorrow's activities!",
        author_name: "Sarah Chen",
        created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
      }
    ];

    // Seed polls
    const polls = [
      {
        trip_id: tripId,
        created_by: users.sarah,
        question: "Where should we have lunch on Saturday?",
        options: JSON.stringify([
          { id: '1', text: 'Katz\'s Delicatessen', votes: 3 },
          { id: '2', text: 'Joe\'s Pizza', votes: 2 },
          { id: '3', text: 'The Plaza Food Hall', votes: 1 },
          { id: '4', text: 'Shake Shack', votes: 2 }
        ]),
        total_votes: 8,
        status: 'active',
        created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        trip_id: tripId,
        created_by: users.mike,
        question: "What time should we meet for the Central Park walk?",
        options: JSON.stringify([
          { id: '1', text: '9:00 AM', votes: 1 },
          { id: '2', text: '10:00 AM', votes: 4 },
          { id: '3', text: '11:00 AM', votes: 2 }
        ]),
        total_votes: 7,
        status: 'completed',
        created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
      }
    ];

    // Seed files
    const files = [
      {
        trip_id: tripId,
        uploaded_by: users.sarah,
        name: "Hotel Confirmation - Grand Resort.pdf",
        file_type: "application/pdf",
        content_text: "Confirmation Number: GR78945. Guest: Sarah Chen. Check-in: March 15, 2024 3:00 PM. Check-out: March 18, 2024 11:00 AM. Room Type: Deluxe King Suite. Total Amount: $1,247.50. Includes breakfast and WiFi.",
        ai_summary: "Hotel reservation confirmation for Grand Resort, March 15-18, 2024, Deluxe King Suite for $1,247.50",
        created_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        trip_id: tripId,
        uploaded_by: users.jessica,
        name: "Flight Itinerary - American Airlines.pdf",
        file_type: "application/pdf",
        content_text: "American Airlines Flight 1847. Departure: LAX 10:45 AM PST. Arrival: JFK 2:15 PM EST. Passenger: Jessica Williams. Seat: 12A. Confirmation: ABC123.",
        ai_summary: "Flight itinerary for Jessica Williams, AA1847 from LAX to JFK on March 15",
        created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        trip_id: tripId,
        uploaded_by: users.mike,
        name: "NYC Restaurant List.docx",
        file_type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        content_text: "NYC Must-Try Restaurants: 1. Marea - Seafood, Midtown. Reservation confirmed for March 16, 8 PM. 2. Eleven Madison Park - Fine dining. 3. Peter Luger - Steakhouse, Brooklyn. 4. Le Bernardin - French seafood. 5. Joe's Pizza - Classic NY slice.",
        ai_summary: "List of recommended NYC restaurants including confirmed Marea reservation",
        created_at: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString()
      }
    ];

    // Seed links
    const links = [
      {
        trip_id: tripId,
        added_by: users.sarah,
        title: "NYC Weather Forecast - March 15-18",
        url: "https://weather.com/weather/tenday/NYC",
        description: "10-day weather forecast for our trip dates. Looks like highs in the 40s, lows in the 30s. Pack warm!",
        category: "weather",
        votes: 3,
        created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        trip_id: tripId,
        added_by: users.mike,
        title: "Broadway Shows This Weekend",
        url: "https://www.broadway.com/shows/",
        description: "Hamilton has tickets available Friday 8 PM. Also Lion King Saturday matinee.",
        category: "entertainment",
        votes: 5,
        created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        trip_id: tripId,
        added_by: users.jessica,
        title: "Central Park Map & Activities",
        url: "https://www.centralparknyc.org/map",
        description: "Interactive map with all the must-see spots. Bethesda Fountain, Bow Bridge, Strawberry Fields.",
        category: "activities",
        votes: 4,
        created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
      }
    ];

    // Insert all data
    const results = await Promise.all([
      supabase.from('trip_chat_messages').insert(chatMessages),
      supabase.from('trip_polls').insert(polls),
      supabase.from('trip_files').insert(files),
      supabase.from('trip_links').insert(links)
    ]);

    // Check for errors
    const errors = results.filter(result => result.error);
    if (errors.length > 0) {
      console.error('Seeding errors:', errors);
      throw new Error(`Failed to seed data: ${errors.map(e => e.error?.message).join(', ')}`);
    }

    // Trigger AI ingestion for the trip
    const { error: ingestError } = await supabase.functions.invoke('ai-ingest', {
      body: { 
        source: 'trip_batch',
        sourceId: tripId,
        tripId: tripId
      }
    });

    if (ingestError) {
      console.error('Ingestion error:', ingestError);
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Demo data seeded successfully',
        counts: {
          messages: chatMessages.length,
          polls: polls.length,
          files: files.length,
          links: links.length
        },
        ingestionTriggered: !ingestError
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error seeding demo data:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});