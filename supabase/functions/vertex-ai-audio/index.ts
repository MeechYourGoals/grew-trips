import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface AudioRequest {
  url: string;
  user_id: string;
  trip_id?: string;
  model?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { url, user_id, trip_id, model }: AudioRequest = await req.json()

    if (!url || !user_id) {
      throw new Error('URL and user_id are required')
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
    const elevenlabsKey = Deno.env.get('ELEVENLABS_API_KEY')

    if (!projectId || !serviceAccountKey) {
      throw new Error('Google Cloud credentials not configured')
    }

    const credentials = JSON.parse(serviceAccountKey)
    const accessToken = await getVertexAIAccessToken(credentials)

    // Use Gemini 2.0 Flash for content analysis and summary generation
    const analysisModel = model || 'gemini-2.0-flash-exp'
    const endpoint = `https://${location}-aiplatform.googleapis.com/v1/projects/${projectId}/locations/${location}/publishers/google/models/${analysisModel}:generateContent`

    const prompt = `Please analyze and summarize the content from this URL: ${url}

Create a comprehensive audio summary script that includes:

1. **Introduction**: Brief overview of what this place/experience is
2. **Key Highlights**: Most important features or attractions  
3. **Practical Information**: Hours, pricing, location details
4. **Visitor Experience**: What to expect when visiting
5. **Recommendations**: Best times to visit, tips for travelers
6. **Conclusion**: Final thoughts and recommendation

Please write this in a conversational, engaging tone suitable for an audio overview. The summary should be informative yet accessible, as if you're a knowledgeable travel guide sharing insights with a friend.

Target length: 2-3 minutes when spoken aloud.

Format the response as natural, flowing speech that would work well as an audio narrative.`

    const requestBody = {
      contents: [{
        parts: [{ text: prompt }]
      }],
      generationConfig: {
        temperature: 0.4,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1500,
      }
    }

    console.log('Generating audio summary with Vertex AI for:', url)

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
      console.error('Vertex AI Audio Summary Error:', response.status, errorText)
      throw new Error(`Vertex AI Error: ${response.status} - ${errorText}`)
    }

    const data = await response.json()
    
    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
      throw new Error('Invalid response format from Vertex AI')
    }
    
    const summary = data.candidates[0].content.parts[0].text

    // Generate audio using ElevenLabs if API key is available
    let audioUrl = "https://www.soundjay.com/misc/sounds/magic-chime-02.wav" // Default fallback
    let duration = Math.max(60, Math.floor(summary.length / 10)) // Estimate duration

    if (elevenlabsKey) {
      try {
        const audioResponse = await generateAudioWithElevenLabs(summary, elevenlabsKey)
        if (audioResponse.audioUrl) {
          audioUrl = audioResponse.audioUrl
          duration = audioResponse.duration || duration
        }
      } catch (audioError) {
        console.error('ElevenLabs audio generation failed:', audioError)
        // Continue with text summary even if audio generation fails
      }
    }

    return new Response(
      JSON.stringify({ 
        summary: summary,
        audioUrl: audioUrl,
        duration: duration,
        fileKey: `audio_${user_id}_${Date.now()}`,
        model: analysisModel
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Audio Summary Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})

async function generateAudioWithElevenLabs(text: string, apiKey: string): Promise<{ audioUrl: string; duration?: number }> {
  const voiceId = 'EXAVITQu4vr4xnSDxMaL' // Default voice
  
  const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
    method: 'POST',
    headers: {
      'Accept': 'audio/mpeg',
      'Content-Type': 'application/json',
      'xi-api-key': apiKey
    },
    body: JSON.stringify({
      text: text,
      model_id: 'eleven_monolingual_v1',
      voice_settings: {
        stability: 0.5,
        similarity_boost: 0.5
      }
    })
  })

  if (!response.ok) {
    throw new Error(`ElevenLabs API error: ${response.status}`)
  }

  const audioBuffer = await response.arrayBuffer()
  const audioBase64 = btoa(String.fromCharCode(...new Uint8Array(audioBuffer)))
  
  // In a real implementation, you would upload this to storage and return the URL
  // For now, return a data URL as fallback
  const audioUrl = `data:audio/mpeg;base64,${audioBase64}`
  
  // Estimate duration (roughly 150 words per minute)
  const wordCount = text.split(' ').length
  const duration = Math.ceil((wordCount / 150) * 60)
  
  return { audioUrl, duration }
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