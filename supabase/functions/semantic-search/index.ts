import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from "../_shared/cors.ts"

const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY')
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY')

interface SemanticSearchRequest {
  query: string
  tripId?: string
  limit?: number
  threshold?: number
}

interface SearchResult {
  id: string
  objectType: string
  objectId: string
  tripId?: string
  content: string
  snippet: string
  score: number
  similarity: number
  deepLink?: string
  matchReason: string
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { query, tripId, limit = 20, threshold = 0.7 }: SemanticSearchRequest = await req.json()

    if (!query) {
      throw new Error('Query is required')
    }

    const supabase = createClient(SUPABASE_URL!, SUPABASE_ANON_KEY!)

    // Generate embedding for the query
    const queryEmbedding = await generateQueryEmbedding(query)

    // Perform semantic search
    const semanticResults = await performSemanticSearch(
      supabase, 
      queryEmbedding, 
      tripId, 
      limit, 
      threshold
    )

    // Also perform traditional keyword search for comparison
    const keywordResults = await performKeywordSearch(supabase, query, tripId, limit)

    // Combine and rank results
    const combinedResults = combineSearchResults(semanticResults, keywordResults, query)

    return new Response(
      JSON.stringify({ 
        success: true, 
        results: combinedResults,
        semanticCount: semanticResults.length,
        keywordCount: keywordResults.length
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Semantic search error:', error)
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})

async function generateQueryEmbedding(query: string): Promise<number[]> {
  const response = await fetch(
    'https://generativelanguage.googleapis.com/v1beta/models/text-embedding-004:embedContent',
    {
      method: 'POST',
      headers: {
        'x-goog-api-key': GEMINI_API_KEY!,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        content: {
          parts: [{ text: query }]
        },
        taskType: 'RETRIEVAL_QUERY',
        outputDimensionality: 1536
      })
    }
  )

  if (!response.ok) {
    throw new Error(`Failed to generate query embedding: ${response.status}`)
  }

  const data = await response.json()
  return data.embedding.values
}

async function performSemanticSearch(
  supabase: any,
  queryEmbedding: number[],
  tripId?: string,
  limit: number = 20,
  threshold: number = 0.7
): Promise<SearchResult[]> {
  let query = supabase
    .rpc('match_trips', {
      query_embedding: queryEmbedding,
      match_threshold: threshold,
      match_count: limit
    })

  if (tripId) {
    query = query.eq('trip_id', tripId)
  }

  const { data, error } = await query

  if (error) {
    console.error('Semantic search error:', error)
    return []
  }

  return data.map((match: any) => ({
    id: match.id,
    objectType: match.object_type,
    objectId: match.object_id,
    tripId: match.trip_id,
    content: match.content,
    snippet: match.content.substring(0, 200) + '...',
    score: match.score || 0,
    similarity: match.similarity,
    matchReason: 'semantic_similarity',
    deepLink: generateDeepLink(match.object_type, match.object_id, match.trip_id)
  }))
}

async function performKeywordSearch(
  supabase: any,
  query: string,
  tripId?: string,
  limit: number = 20
): Promise<SearchResult[]> {
  let searchQuery = supabase
    .from('search_index')
    .select('*')
    .textSearch('content', query)
    .limit(limit)

  if (tripId) {
    searchQuery = searchQuery.eq('trip_id', tripId)
  }

  const { data, error } = await searchQuery

  if (error) {
    console.error('Keyword search error:', error)
    return []
  }

  return data.map((match: any) => ({
    id: match.id,
    objectType: match.object_type,
    objectId: match.object_id,
    tripId: match.trip_id,
    content: match.content,
    snippet: match.content.substring(0, 200) + '...',
    score: 0.5, // Default score for keyword matches
    similarity: 0,
    matchReason: 'keyword_match',
    deepLink: generateDeepLink(match.object_type, match.object_id, match.trip_id)
  }))
}

function combineSearchResults(
  semanticResults: SearchResult[],
  keywordResults: SearchResult[],
  query: string
): SearchResult[] {
  const combined = new Map<string, SearchResult>()

  // Add semantic results (higher priority)
  semanticResults.forEach(result => {
    combined.set(result.id, { ...result, score: result.similarity })
  })

  // Add keyword results that weren't found semantically
  keywordResults.forEach(result => {
    if (!combined.has(result.id)) {
      combined.set(result.id, result)
    }
  })

  // Sort by score (semantic similarity or keyword relevance)
  return Array.from(combined.values())
    .sort((a, b) => b.score - a.score)
    .slice(0, 20)
}

function generateDeepLink(objectType: string, objectId: string, tripId?: string): string {
  switch (objectType) {
    case 'trip':
      return `/trip/${objectId}`
    case 'place':
      return `/trip/${tripId}#place-${objectId}`
    case 'event':
      return `/trip/${tripId}#event-${objectId}`
    case 'message':
      return `/trip/${tripId}#message-${objectId}`
    default:
      return `/trip/${tripId}`
  }
}