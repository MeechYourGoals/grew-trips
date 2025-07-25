import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface VertexAIRequest {
  message: string;
  config?: {
    model?: string;
    temperature?: number;
    topK?: number;
    topP?: number;
    maxOutputTokens?: number;
    responseMimeType?: string;
  };
  tripContext?: any;
  vertexAI?: boolean;
  multimodal?: boolean;
  image?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { message, config, tripContext, vertexAI, multimodal, image }: VertexAIRequest = await req.json()

    // Get credentials from environment
    const projectId = Deno.env.get('GOOGLE_CLOUD_PROJECT')
    const location = Deno.env.get('GOOGLE_CLOUD_LOCATION') || 'us-central1'
    const serviceAccountKey = Deno.env.get('GOOGLE_SERVICE_ACCOUNT_KEY')

    if (!projectId || !serviceAccountKey) {
      throw new Error('Google Cloud credentials not configured')
    }

    // Parse service account key
    const credentials = JSON.parse(serviceAccountKey)

    // Get access token for Vertex AI
    const accessToken = await getVertexAIAccessToken(credentials)

    // Prepare the request payload
    const model = config?.model || 'gemini-2.0-flash-exp'
    const endpoint = `https://${location}-aiplatform.googleapis.com/v1/projects/${projectId}/locations/${location}/publishers/google/models/${model}:generateContent`

    // Build content parts
    const parts = [{ text: message }]
    if (multimodal && image) {
      parts.push({
        inline_data: {
          mime_type: 'image/jpeg',
          data: image
        }
      })
    }

    const requestBody = {
      contents: [{
        parts: parts
      }],
      generationConfig: {
        temperature: config?.temperature ?? 0.3,
        topK: config?.topK ?? 40,
        topP: config?.topP ?? 0.95,
        maxOutputTokens: config?.maxOutputTokens ?? 1024,
        responseMimeType: config?.responseMimeType ?? 'text/plain'
      },
      safetySettings: [
        {
          category: 'HARM_CATEGORY_HATE_SPEECH',
          threshold: 'BLOCK_MEDIUM_AND_ABOVE'
        },
        {
          category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
          threshold: 'BLOCK_MEDIUM_AND_ABOVE'
        },
        {
          category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
          threshold: 'BLOCK_MEDIUM_AND_ABOVE'
        },
        {
          category: 'HARM_CATEGORY_HARASSMENT',
          threshold: 'BLOCK_MEDIUM_AND_ABOVE'
        }
      ]
    }

    console.log('Calling Vertex AI:', endpoint)

    // Make request to Vertex AI
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
      console.error('Vertex AI Error:', response.status, errorText)
      throw new Error(`Vertex AI Error: ${response.status} - ${errorText}`)
    }

    const data = await response.json()
    
    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
      throw new Error('Invalid response format from Vertex AI')
    }
    
    const aiResponse = data.candidates[0].content.parts[0].text
    const finishReason = data.candidates[0].finishReason
    const safetyRatings = data.candidates[0].safetyRatings

    return new Response(
      JSON.stringify({ 
        response: aiResponse,
        finishReason,
        safetyRatings,
        model: model
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Vertex AI Chat Error:', error)
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
  // Create JWT for service account authentication
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

  // In a production environment, you would properly sign this JWT
  // For now, we'll use a simplified approach with the service account key
  
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
  // This is a simplified JWT creation - in production, use a proper JWT library
  const encoder = new TextEncoder()
  
  const headerBase64 = btoa(JSON.stringify(header)).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_')
  const payloadBase64 = btoa(JSON.stringify(payload)).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_')
  
  const data = `${headerBase64}.${payloadBase64}`
  
  // Import the private key
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