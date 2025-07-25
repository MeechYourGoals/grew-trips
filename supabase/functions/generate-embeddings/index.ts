import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from "../_shared/cors.ts"

const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY')
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY')

interface EmbeddingRequest {
  texts: string[]
  objectType?: string
  objectId?: string
  tripId?: string
}

interface EmbeddingResponse {
  success: boolean
  embeddings?: number[][]
  error?: string
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    if (!GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY not configured')
    }

    const { texts, objectType, objectId, tripId }: EmbeddingRequest = await req.json()

    if (!texts || texts.length === 0) {
      throw new Error('No texts provided for embedding')
    }

    // Call Gemini Embeddings API
    const embeddings = await generateEmbeddings(texts)

    // Store embeddings in search_index if object details provided
    if (objectType && objectId && embeddings.length > 0) {
      const supabase = createClient(SUPABASE_URL!, SUPABASE_ANON_KEY!)
      
      await supabase
        .from('search_index')
        .upsert({
          object_type: objectType,
          object_id: objectId,
          trip_id: tripId,
          content: texts.join(' '),
          embedding: embeddings[0],
          updated_at: new Date().toISOString()
        })
    }

    return new Response(
      JSON.stringify({ success: true, embeddings }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Embedding generation error:', error)
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})

async function generateEmbeddings(texts: string[]): Promise<number[][]> {
  try {
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
            parts: texts.map(text => ({ text }))
          },
          taskType: 'SEMANTIC_SIMILARITY',
          outputDimensionality: 1536
        })
      }
    )

    if (!response.ok) {
      const errorData = await response.text()
      throw new Error(`Gemini API error: ${response.status} - ${errorData}`)
    }

    const data = await response.json()
    
    if (!data.embedding || !data.embedding.values) {
      throw new Error('Invalid embedding response from Gemini API')
    }

    return [data.embedding.values]

  } catch (error) {
    console.error('Gemini API call failed:', error)
    throw error
  }
}