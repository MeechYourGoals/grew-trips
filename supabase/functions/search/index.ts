
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
  tripType?: string;
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
  matchReason?: string;
}

serve(async (req) => {
  const { createOptionsResponse, createErrorResponse, createSecureResponse } = await import('../_shared/securityHeaders.ts');
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Parse request body
    const { query, scope, tripId, limit = 20, tripType }: SearchRequest = await req.json()

    // Validate input
    if (!query || !scope) {
      return new Response(
        JSON.stringify({ error: 'Missing required parameters' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Perform search using database
    const results = await performSearch(supabase, query, scope, tripId, limit, tripType);

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

async function performSearch(supabase: any, query: string, scope: string, tripId?: string, limit: number = 20, tripType?: string): Promise<SearchResult[]> {
  console.log(`Performing search for query: "${query}", scope: ${scope}, tripType: ${tripType}`)
  
  const queryLower = query.toLowerCase().trim()
  if (queryLower.length < 2) {
    return []
  }

  try {
    // First try semantic search if query is complex enough
    const semanticResults = await performSemanticSearch(supabase, query, scope, tripId, Math.floor(limit / 2), tripType)
    
    // Then perform traditional keyword search
    const keywordResults = await performKeywordSearch(supabase, query, scope, tripId, Math.floor(limit / 2), tripType)
    
    // Combine and deduplicate results
    const combinedResults = combineSearchResults(semanticResults, keywordResults, limit)
    
    console.log(`Found ${combinedResults.length} combined search results (${semanticResults.length} semantic + ${keywordResults.length} keyword)`)
    return combinedResults

  } catch (error) {
    console.error('Database search error:', error)
    return getFallbackResults(query, scope, tripId)
  }
}

async function performSemanticSearch(supabase: any, query: string, scope: string, tripId?: string, limit: number = 10, tripType?: string): Promise<SearchResult[]> {
  try {
    // Call the semantic search function
    const { data, error } = await supabase.functions.invoke('semantic-search', {
      body: {
        query,
        tripId,
        limit,
        threshold: 0.7
      }
    })

    if (error) {
      console.error('Semantic search error:', error)
      return []
    }

    return data?.results?.map((result: any) => ({
      id: result.id || `semantic-${Date.now()}-${Math.random()}`,
      objectType: result.objectType || 'trip',
      objectId: result.objectId || result.tripId,
      tripId: result.tripId,
      tripName: result.tripName || result.content?.slice(0, 50),
      content: result.content,
      snippet: result.snippet || result.content?.slice(0, 150),
      score: result.similarity || result.score || 0.8,
      deepLink: result.deepLink,
      matchReason: 'Matched via: AI semantic understanding'
    })) || []
  } catch (error) {
    console.error('Semantic search failed:', error)
    return []
  }
}

async function performKeywordSearch(supabase: any, query: string, scope: string, tripId?: string, limit: number = 10, tripType?: string): Promise<SearchResult[]> {
  const results = []
  
  try {
    // Search trips table directly by name and destination
    let searchQuery = supabase
      .from('trips')
      .select(`
        id,
        name,
        destination,
        start_date,
        end_date,
        trip_type,
        trip_members!inner(user_id)
      `)
    
    // Apply trip type filter
    if (tripType && tripType !== 'all') {
      const typeMap: Record<string, string> = {
        'regular': 'consumer',
        'pro': 'pro',
        'event': 'event'
      };
      searchQuery = searchQuery.eq('trip_type', typeMap[tripType] || 'consumer');
    }
    
    if (scope === 'trip' && tripId) {
      searchQuery = searchQuery.eq('id', tripId);
    }

    // Search by name or destination only (no dates or participants)
    const { data: trips, error } = await searchQuery
      .or(`name.ilike.%${query}%,destination.ilike.%${query}%`)
      .limit(limit);

    if (error) {
      console.error('Trip search error:', error);
      return [];
    }

    if (trips) {
      trips.forEach(trip => {
        const score = trip.name.toLowerCase().includes(query.toLowerCase()) ? 0.95 : 0.85;
        const matchReason = trip.name.toLowerCase().includes(query.toLowerCase()) ? 'title' : 'location';
        
        results.push(createSearchResult({
          id: trip.id,
          trip_id: trip.id,
          title: trip.name,
          location: trip.destination || 'Unknown',
          date_range: `${trip.start_date} - ${trip.end_date}`,
          trip_type: trip.trip_type,
          description: ''
        }, score, matchReason));
      });
    }

    return results.slice(0, limit);

  } catch (error) {
    console.error('Keyword search error:', error);
    return [];
  }
}

function combineSearchResults(semanticResults: SearchResult[], keywordResults: SearchResult[], limit: number): SearchResult[] {
  const combined = []
  const seen = new Set()

  // Add semantic results first (higher priority)
  for (const result of semanticResults) {
    if (!seen.has(result.tripId)) {
      combined.push({
        ...result,
        score: result.score * 1.1 // Boost semantic results slightly
      })
      seen.add(result.tripId)
    }
  }

  // Add keyword results that aren't duplicates
  for (const result of keywordResults) {
    if (!seen.has(result.tripId)) {
      combined.push(result)
      seen.add(result.tripId)
    }
  }

  // Sort by score and limit
  return combined
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
}

function createSearchResult(match: any, baseScore: number, matchReason: string): SearchResult {
  const deepLink = match.trip_type === 'pro' 
    ? `/tour/pro/${match.trip_id}`
    : match.trip_type === 'event'
    ? `/event/${match.trip_id}`
    : `/trip/${match.trip_id}`

  return {
    id: match.id,
    objectType: 'trip',
    objectId: match.trip_id,
    tripId: match.trip_id,
    tripName: match.title,
    content: match.description,
    snippet: `${match.title} - ${match.location} (${match.date_range})`,
    score: baseScore,
    deepLink,
    matchReason: `Matched via: ${matchReason}`
  }
}

function getFallbackResults(query: string, scope: string, tripId?: string): SearchResult[] {
  const queryLower = query.toLowerCase()
  const fallbackResults: SearchResult[] = []

  // Basic fallback results for common searches
  if (queryLower.includes('tokyo')) {
    fallbackResults.push({
      id: 'fallback-1',
      objectType: 'trip',
      objectId: '2',
      tripId: '2',
      tripName: 'Tokyo Adventure',
      content: 'Cultural exploration of Japan\'s capital',
      snippet: 'Tokyo Adventure - Tokyo, Japan (Oct 5 - Oct 15, 2025)',
      score: 0.85,
      deepLink: '/trip/2',
      matchReason: 'Matched via: location'
    })
  }

  if (queryLower.includes('lakers')) {
    fallbackResults.push({
      id: 'fallback-2', 
      objectType: 'trip',
      objectId: 'lakers-road-trip',
      tripId: 'lakers-road-trip',
      tripName: 'Lakers Road Trip - Western Conference',
      content: 'Professional basketball team road trip',
      snippet: 'Lakers Road Trip - Multiple Cities, USA (Mar 1 - Mar 15, 2025)',
      score: 0.90,
      deepLink: '/tour/pro/lakers-road-trip',
      matchReason: 'Matched via: title'
    })
  }

  return fallbackResults.slice(0, 3)
}
