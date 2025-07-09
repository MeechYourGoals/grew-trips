import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders } from '../_shared/cors.ts';

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

// Trip-specific message templates
const TRIP_TEMPLATES = {
  'paul-george-elite-aau-nationals-2025': {
    messages: [
      "🚌 Bus call moved to 7:00 AM sharp — Mandalay Bay main lobby",
      "Reminder: white jerseys for today's games, black for tomorrow",
      "College scouts confirmed: Duke, UCLA, and Kentucky reps arriving at 2 PM",
      "Training table setup at 6 PM — Carter and Jaden on water duty"
    ],
    senders: ['Brandon Lincoln', 'Matt Barnes', 'Jerald Dickson', 'Brandon Lincoln']
  },
  'lakers-road-trip': {
    messages: [
      "🚌 Bus call moved to 09:00 — lobby of the team hotel",
      "Per-diems will be distributed after warm-ups",
      "Reminder: team meeting in Conference Room B at 6 PM"
    ],
    senders: ['Coach Johnson', 'Team Manager', 'Athletic Director']
  },
  'taylor-swift-eras-tour': {
    messages: [
      "🎵 Load-in starts at 10 AM sharp — all crew report to loading dock",
      "Sound check moved to 2:30 PM due to venue scheduling",
      "Settlement meeting with venue at 11 PM post-show"
    ],
    senders: ['Tour Director', 'Production Manager', 'Security Chief']
  },
  'eli-lilly-c-suite-retreat-2026': {
    messages: [
      "📋 Updated agenda in the Files tab — review before tomorrow's session",
      "Reminder: business casual attire for the client dinner tonight",
      "Transportation to the golf course leaves at 8 AM from hotel lobby"
    ],
    senders: ['Event Coordinator', 'Executive Assistant', 'Team Lead']
  }
};

// Fallback templates by category
const FALLBACK_TEMPLATES = {
  'sports-pro': [
    "🚌 Bus call moved to 09:00 — lobby of the team hotel",
    "Per-diems will be distributed after warm-ups",
    "Reminder: team meeting in Conference Room B at 6 PM"
  ],
  'entertainment-tour': [
    "🎵 Load-in starts at 10 AM sharp — all crew report to loading dock",
    "Sound check moved to 2:30 PM due to venue scheduling",
    "Settlement meeting with venue at 11 PM post-show"
  ],
  'corporate-retreat': [
    "📋 Updated agenda in the Files tab — review before tomorrow's session",
    "Reminder: business casual attire for the client dinner tonight",
    "Transportation to the golf course leaves at 8 AM from hotel lobby"
  ],
  'youth-sports': [
    "🏐 Practice uniforms for warm-up, game jerseys for matches",
    "Parents: pick-up location has changed to the north parking lot",
    "Medical forms need to be submitted before tomorrow's games"
  ]
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const body = req.method === 'POST' ? await req.json() : {};
    const { trip_id, refresh } = body;

    // If specific trip_id provided, handle targeted generation
    if (trip_id) {
      // Safety check: ensure we only modify mock data
      const { data: trip, error: tripError } = await supabase
        .from('trips')
        .select('id, is_mock, name, trip_type')
        .eq('id', trip_id)
        .single();

      if (tripError || !trip?.is_mock) {
        return new Response(
          JSON.stringify({ error: 'Invalid trip or not a mock trip' }),
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }

      // Clear existing messages for this trip if refresh requested
      if (refresh) {
        await supabase
          .from('mock_messages')
          .delete()
          .eq('trip_id', trip_id);
      }

      // Generate contextual messages for this specific trip
      const mockMessages = generateMessagesForTrip(trip);
      
      if (mockMessages.length > 0) {
        const { error } = await supabase
          .from('mock_messages')
          .insert(mockMessages);

        if (error) {
          throw error;
        }
      }

      return new Response(
        JSON.stringify({ 
          success: true, 
          message: `Mock messages generated for trip ${trip.name}`,
          count: mockMessages.length
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Default behavior: seed all Pro trip mock messages
    await supabase
      .from('mock_messages')
      .delete()
      .in('trip_type', ['sports-pro', 'entertainment-tour', 'corporate-retreat', 'youth-sports']);

    const mockMessages = [];
    
    // Generate messages for specific known trips
    Object.entries(TRIP_TEMPLATES).forEach(([tripId, template]) => {
      template.messages.forEach((message, index) => {
        mockMessages.push({
          trip_id: tripId,
          trip_type: getTripTypeFromId(tripId),
          sender_name: template.senders[index] || 'Team Member',
          message_content: message,
          timestamp_offset_days: Math.floor(Math.random() * 3) + 1,
          tags: getTags(getTripTypeFromId(tripId))
        });
      });
    });

    // Generate fallback messages for trip types
    Object.entries(FALLBACK_TEMPLATES).forEach(([tripType, messages]) => {
      messages.forEach((message, index) => {
        mockMessages.push({
          trip_type: tripType,
          sender_name: getSenderName(tripType, index),
          message_content: message,
          timestamp_offset_days: Math.floor(Math.random() * 3) + 1,
          tags: getTags(tripType)
        });
      });
    });

    const { error } = await supabase
      .from('mock_messages')
      .insert(mockMessages);

    if (error) {
      throw error;
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Pro trip mock messages seeded successfully',
        count: mockMessages.length
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error seeding mock messages:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

function generateMessagesForTrip(trip: any): any[] {
  const template = TRIP_TEMPLATES[trip.id as keyof typeof TRIP_TEMPLATES];
  
  if (template) {
    return template.messages.map((message, index) => ({
      trip_id: trip.id,
      trip_type: trip.trip_type,
      sender_name: template.senders[index] || 'Team Member',
      message_content: message,
      timestamp_offset_days: Math.floor(Math.random() * 3) + 1,
      tags: getTags(trip.trip_type)
    }));
  }

  // Fallback to generic messages for trip type
  const fallbackMessages = FALLBACK_TEMPLATES[trip.trip_type as keyof typeof FALLBACK_TEMPLATES] || [];
  return fallbackMessages.map((message, index) => ({
    trip_id: trip.id,
    trip_type: trip.trip_type,
    sender_name: getSenderName(trip.trip_type, index),
    message_content: message,
    timestamp_offset_days: Math.floor(Math.random() * 3) + 1,
    tags: getTags(trip.trip_type)
  }));
}

function getTripTypeFromId(tripId: string): string {
  if (tripId.includes('aau') || tripId.includes('lakers')) return 'sports-pro';
  if (tripId.includes('taylor-swift')) return 'entertainment-tour';
  if (tripId.includes('eli-lilly')) return 'corporate-retreat';
  return 'sports-pro';
}

function getSenderName(tripType: string, index: number): string {
  const names = {
    'sports-pro': ['Coach Johnson', 'Team Manager', 'Athletic Director'],
    'entertainment-tour': ['Tour Director', 'Production Manager', 'Security Chief'],
    'corporate-retreat': ['Event Coordinator', 'Executive Assistant', 'Team Lead'],
    'youth-sports': ['Coach Sarah', 'Team Mom Lisa', 'Athletic Director']
  };
  
  return names[tripType as keyof typeof names]?.[index] || 'Team Member';
}

function getTags(tripType: string): string[] {
  const tags = {
    'sports-pro': ['logistics', 'coordination'],
    'entertainment-tour': ['production', 'logistics'],
    'corporate-retreat': ['business', 'coordination'],
    'youth-sports': ['youth', 'coordination']
  };
  
  return tags[tripType as keyof typeof tags] || ['coordination'];
}