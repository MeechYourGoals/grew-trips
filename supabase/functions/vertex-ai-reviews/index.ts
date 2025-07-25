import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ReviewRequest {
  url: string;
  feature: string;
  model?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { url, feature, model }: ReviewRequest = await req.json()

    if (!url) {
      throw new Error('URL is required')
    }

    // Validate URL
    try {
      new URL(url)
    } catch {
      throw new Error('Invalid URL format')
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

    // Use Gemini 2.0 Flash for review analysis
    const analysisModel = model || 'gemini-2.0-flash-exp'
    const endpoint = `https://${location}-aiplatform.googleapis.com/v1/projects/${projectId}/locations/${location}/publishers/google/models/${analysisModel}:generateContent`

    const prompt = `Please analyze reviews and information from this URL: ${url}

I need you to provide a comprehensive analysis including:

1. **Overall Sentiment**: Classify as positive, negative, or neutral
2. **Sentiment Score**: Provide a score from 0-100 (0 = very negative, 100 = very positive)
3. **Key Insights**: Summarize the main themes from reviews
4. **Customer Feedback Summary**: What are customers saying?
5. **Recommendation**: Should someone visit/use this place based on reviews?

Please format your response clearly and provide specific insights based on the reviews you find.

If you cannot access the URL directly, provide a general framework for how someone could analyze reviews for this type of establishment.`

    const requestBody = {
      contents: [{
        parts: [{ text: prompt }]
      }],
      generationConfig: {
        temperature: 0.2,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      },
      safetySettings: [
        {
          category: 'HARM_CATEGORY_HATE_SPEECH',
          threshold: 'BLOCK_MEDIUM_AND_ABOVE'
        }
      ]
    }

    console.log('Analyzing reviews with Vertex AI:', url)

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
      console.error('Vertex AI Review Analysis Error:', response.status, errorText)
      throw new Error(`Vertex AI Error: ${response.status} - ${errorText}`)
    }

    const data = await response.json()
    
    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
      throw new Error('Invalid response format from Vertex AI')
    }
    
    const analysis = data.candidates[0].content.parts[0].text

    // Extract sentiment and score from the analysis
    const sentiment = extractSentiment(analysis)
    const score = extractScore(analysis)

    return new Response(
      JSON.stringify({ 
        text: analysis,
        sentiment: sentiment,
        score: score,
        platforms: ['Google Reviews', 'Yelp', 'TripAdvisor', 'Facebook'],
        analysis: analysis,
        model: analysisModel
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Review Analysis Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})

function extractSentiment(text: string): 'positive' | 'negative' | 'neutral' {
  const lowerText = text.toLowerCase()
  
  const positiveIndicators = ['positive', 'good', 'great', 'excellent', 'recommend', 'satisfied', 'happy']
  const negativeIndicators = ['negative', 'bad', 'poor', 'terrible', 'avoid', 'disappointed', 'unsatisfied']
  
  const positiveCount = positiveIndicators.filter(word => lowerText.includes(word)).length
  const negativeCount = negativeIndicators.filter(word => lowerText.includes(word)).length
  
  if (positiveCount > negativeCount) return 'positive'
  if (negativeCount > positiveCount) return 'negative'
  return 'neutral'
}

function extractScore(text: string): number {
  // Look for explicit scores in the text
  const scoreMatch = text.match(/(\d+)\/100|(\d+)%|\bscore[:\s]*(\d+)|(\d+)\s*out\s*of\s*100/i)
  if (scoreMatch) {
    const score = parseInt(scoreMatch[1] || scoreMatch[2] || scoreMatch[3] || scoreMatch[4])
    return Math.min(100, Math.max(0, score))
  }
  
  // Default scoring based on sentiment analysis
  const sentiment = extractSentiment(text)
  switch (sentiment) {
    case 'positive': return 85
    case 'negative': return 35
    default: return 65
  }
}

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