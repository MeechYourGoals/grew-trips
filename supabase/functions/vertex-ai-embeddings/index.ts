import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface EmbeddingRequest {
  texts: string[];
  model?: string;
  taskType?: string;
  dimensionality?: number;
  objectType?: string;
  objectId?: string;
  tripId?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { texts, model, taskType, dimensionality, objectType, objectId, tripId }: EmbeddingRequest = await req.json()

    if (!texts || !texts.length) {
      throw new Error('No texts provided for embedding')
    }

    // Get credentials from environment
    const projectId = Deno.env.get('GOOGLE_CLOUD_PROJECT')
    const location = Deno.env.get('GOOGLE_CLOUD_LOCATION') || 'us-central1'
    const serviceAccountKey = Deno.env.get('GOOGLE_SERVICE_ACCOUNT_KEY')

    if (!projectId || !serviceAccountKey) {
      throw new Error('Google Cloud credentials not configured')
    }

    const credentials = JSON.parse(serviceAccountKey)
    const accessToken = await getVertexAIAccessToken(credentials)

    // Use latest Gemini embedding model
    const embeddingModel = model || 'text-embedding-004'
    const endpoint = `https://${location}-aiplatform.googleapis.com/v1/projects/${projectId}/locations/${location}/publishers/google/models/${embeddingModel}:predict`

    const embeddings = []

    // Process texts in batches
    for (const text of texts) {
      const requestBody = {
        instances: [{
          content: text,
          task_type: taskType || 'RETRIEVAL_DOCUMENT',
          title: objectType ? `${objectType}: ${objectId}` : undefined
        }],
        parameters: {
          outputDimensionality: dimensionality || 768
        }
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error('Vertex AI Embedding Error:', response.status, errorText)
        throw new Error(`Vertex AI Embedding Error: ${response.status} - ${errorText}`)
      }

      const data = await response.json()
      
      if (!data.predictions || !data.predictions[0] || !data.predictions[0].embeddings) {
        throw new Error('Invalid embedding response format')
      }

      embeddings.push(data.predictions[0].embeddings.values)
    }

    // If metadata provided, store in search index
    if (objectType && objectId) {
      const supabaseUrl = Deno.env.get('SUPABASE_URL')!
      const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
      const supabase = createClient(supabaseUrl, supabaseKey)

      const { error } = await supabase
        .from('search_index')
        .upsert({
          object_type: objectType,
          object_id: objectId,
          trip_id: tripId,
          content: texts[0],
          embedding: embeddings[0],
          updated_at: new Date().toISOString()
        })

      if (error) {
        console.error('Failed to store embedding:', error)
      }
    }

    return new Response(
      JSON.stringify({ 
        embeddings,
        model: embeddingModel,
        dimensionality: dimensionality || 768
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Vertex AI Embeddings Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})

async function getVertexAIAccessToken(credentials: any): Promise<string> {
  const header = {
    alg: 'RS256',
    typ: 'JWT'
  }

  const now = Math.floor(Date.now() / 1000)
  const claim = {
    iss: credentials.client_email,
    scope: 'https://www.googleapis.com/auth/cloud-platform',
    aud: 'https://oauth2.googleapis.com/token',
    exp: now + 3600,
    iat: now
  }

  const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: await createJWT(header, claim, credentials.private_key)
    }).toString()
  })

  if (!tokenResponse.ok) {
    throw new Error('Failed to get access token')
  }

  const tokenData = await tokenResponse.json()
  return tokenData.access_token
}

async function createJWT(header: any, payload: any, privateKey: string): Promise<string> {
  const encoder = new TextEncoder()
  
  const headerBase64 = btoa(JSON.stringify(header)).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_')
  const payloadBase64 = btoa(JSON.stringify(payload)).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_')
  
  const data = `${headerBase64}.${payloadBase64}`
  
  const keyData = privateKey.replace(/-----BEGIN PRIVATE KEY-----/, '').replace(/-----END PRIVATE KEY-----/, '').replace(/\s/g, '')
  const binaryKey = Uint8Array.from(atob(keyData), c => c.charCodeAt(0))
  
  const cryptoKey = await crypto.subtle.importKey(
    'pkcs8',
    binaryKey,
    {
      name: 'RSASSA-PKCS1-v1_5',
      hash: 'SHA-256',
    },
    false,
    ['sign']
  )
  
  const signature = await crypto.subtle.sign(
    'RSASSA-PKCS1-v1_5',
    cryptoKey,
    encoder.encode(data)
  )
  
  const signatureBase64 = btoa(String.fromCharCode(...new Uint8Array(signature)))
    .replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_')
  
  return `${data}.${signatureBase64}`
}