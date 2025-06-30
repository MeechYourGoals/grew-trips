
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface SearchRequest {
  query: string;
  scope: 'global' | 'trip';
  tripId?: string;
  limit?: number;
}

interface SearchResult {
  id: string;
  objectType: 'trip' | 'collaborator' | 'calendar_event' | 'receipt' | 'file' | 'message';
  objectId: string;
  tripId: string;
  tripName: string;
  content: string;
  snippet: string;
  score: number;
  deepLink?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Parse request body
    const { query, scope, tripId, limit = 20 }: SearchRequest = await req.json()

    // Validate input
    if (!query || !scope) {
      return new Response(
        JSON.stringify({ error: 'Missing required parameters' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // TODO: Add JWT verification here
    // const supabase = createClient(...)
    // const { data: { user } } = await supabase.auth.getUser(jwt)
    // if (!user) return unauthorized response

    // For now, return mock results based on query patterns
    const results = await performSearch(query, scope, tripId, limit);

    return new Response(
      JSON.stringify({ success: true, results }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Search Error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

async function performSearch(query: string, scope: string, tripId?: string, limit: number = 20): Promise<SearchResult[]> {
  // TODO: Implement actual vector search with pgvector
  // This is a mock implementation for development
  
  const mockResults: SearchResult[] = [];
  const queryLower = query.toLowerCase();

  // Date pattern matching
  if (queryLower.includes('november') || queryLower.includes('nov')) {
    mockResults.push({
      id: 'search-1',
      objectType: 'trip',
      objectId: '4',
      tripId: '4',
      tripName: "Kristen's Bachelorette Party",
      content: 'Nashville trip in November 2025',
      snippet: 'Bachelorette party weekend in Nashville - November 8-10, 2025',
      score: 0.95,
      deepLink: '/trip/4'
    });
  }

  // Location matching
  if (queryLower.includes('miami')) {
    mockResults.push({
      id: 'search-2',
      objectType: 'trip',
      objectId: '8',
      tripId: '8',
      tripName: 'Miami Beach Getaway',
      content: 'Beach vacation in Miami',
      snippet: 'Summer beach vacation in Miami with ocean views and great weather',
      score: 0.92,
      deepLink: '/trip/8'
    });
  }

  // People/collaborator matching
  if (queryLower.includes('tour manager') || queryLower.includes('manager')) {
    mockResults.push({
      id: 'search-3',
      objectType: 'collaborator',
      objectId: 'collab-1',
      tripId: 'pro-1',
      tripName: 'Madison Square Garden Residency',
      content: 'Tour Manager - John Smith',
      snippet: 'Tour Manager responsible for logistics, scheduling, and team coordination',
      score: 0.89,
      deepLink: '/tour/pro/pro-1'
    });
    
    mockResults.push({
      id: 'search-4',
      objectType: 'calendar_event',
      objectId: 'event-1',
      tripId: 'pro-2',
      tripName: 'World Tour 2025',
      content: 'Meeting with tour manager about logistics',
      snippet: 'Pre-show meeting with tour manager to review sound check and backstage logistics',
      score: 0.85,
      deepLink: '/tour/pro/pro-2#calendar'
    });
  }

  // Generic message/file matching
  if (queryLower.includes('receipt') || queryLower.includes('expense')) {
    mockResults.push({
      id: 'search-5',
      objectType: 'receipt',
      objectId: 'receipt-1',
      tripId: tripId || '1',
      tripName: 'Current Trip',
      content: 'Hotel receipt for accommodation',
      snippet: 'Hotel Marriott - $280.50 for 2 nights accommodation',
      score: 0.78,
      deepLink: `${tripId ? `/trip/${tripId}` : '/trip/1'}#receipts`
    });
  }

  // Filter by scope
  if (scope === 'trip' && tripId) {
    return mockResults.filter(result => result.tripId === tripId).slice(0, limit);
  }

  return mockResults.slice(0, limit);
}
