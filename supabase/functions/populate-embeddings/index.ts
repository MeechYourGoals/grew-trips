import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from "../_shared/cors.ts"

const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY')
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!)
    
    // Get all search_index records without embeddings
    const { data: records, error } = await supabase
      .from('search_index')
      .select('*')
      .is('embedding', null)
      .limit(100) // Process in batches

    if (error) {
      throw new Error(`Failed to fetch records: ${error.message}`)
    }

    if (!records || records.length === 0) {
      return new Response(
        JSON.stringify({ success: true, message: 'No records to process', processed: 0 }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    let processed = 0
    let errors = 0

    // Process records in smaller batches to avoid rate limits
    for (let i = 0; i < records.length; i += 5) {
      const batch = records.slice(i, i + 5)
      
      for (const record of batch) {
        try {
          if (!record.content) continue

          // Generate embedding
          const embedding = await generateEmbedding(record.content)
          
          // Update record with embedding
          const { error: updateError } = await supabase
            .from('search_index')
            .update({ 
              embedding: embedding,
              updated_at: new Date().toISOString()
            })
            .eq('id', record.id)

          if (updateError) {
            console.error(`Failed to update record ${record.id}:`, updateError)
            errors++
          } else {
            processed++
          }

          // Small delay to respect rate limits
          await new Promise(resolve => setTimeout(resolve, 100))

        } catch (error) {
          console.error(`Error processing record ${record.id}:`, error)
          errors++
        }
      }

      // Longer delay between batches
      await new Promise(resolve => setTimeout(resolve, 1000))
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        processed, 
        errors,
        message: `Processed ${processed} records with ${errors} errors`
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Populate embeddings error:', error)
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})

async function generateEmbedding(text: string): Promise<number[]> {
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
          parts: [{ text }]
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

  return data.embedding.values
}