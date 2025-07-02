
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface RequestBody {
  url: string;
  user_id: string;
  trip_id?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const jwt = req.headers.get('Authorization')?.replace('Bearer ', '') || ''

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const { data: { user } } = await supabase.auth.getUser(jwt)
    if (!user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Parse request body
    const { url, user_id, trip_id }: RequestBody = await req.json()

    // Validate input
    if (!url || !user_id) {
      return new Response(
        JSON.stringify({ error: 'Missing required parameters: url and user_id' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Validate URL format
    try {
      new URL(url)
    } catch {
      return new Response(
        JSON.stringify({ error: 'Invalid URL format' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Check user quota
    const { data: quotaCheck, error: quotaError } = await supabase
      .rpc('check_audio_quota', { p_user_id: user_id })

    if (quotaError || !quotaCheck) {
      return new Response(
        JSON.stringify({ error: 'Audio generation quota exceeded. Upgrade your plan for more usage.' }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Get API keys from environment
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY')
    const elevenLabsApiKey = Deno.env.get('ELEVENLABS_API_KEY')

    if (!openaiApiKey && !elevenLabsApiKey) {
      throw new Error('No TTS API keys configured')
    }

    // Generate audio summary using Podcastfy approach
    const result = await generateAudioSummary(url, openaiApiKey, elevenLabsApiKey)

    // Generate unique file key
    const fileKey = `${user_id}/${trip_id || 'general'}/${crypto.randomUUID()}.mp3`

    // Upload audio to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('audio-summaries')
      .upload(fileKey, result.audioBuffer, {
        contentType: 'audio/mpeg',
        upsert: false
      })

    if (uploadError) {
      console.error('Upload error:', uploadError)
      throw new Error('Failed to upload audio file')
    }

    // Save metadata to database
    const { error: insertError } = await supabase
      .from('audio_summaries')
      .insert({
        id: fileKey,
        user_id: user_id,
        trip_id: trip_id,
        source_url: url,
        transcript: result.transcript,
        duration: result.duration,
        created_at: new Date().toISOString()
      })

    if (insertError) {
      console.error('Database insert error:', insertError)
      // Clean up uploaded file
      await supabase.storage.from('audio-summaries').remove([fileKey])
      throw new Error('Failed to save audio metadata')
    }

    // Update user quota
    await supabase.rpc('increment_audio_usage', {
      p_user_id: user_id,
      p_duration: result.duration
    })

    // Get signed URL for the uploaded file
    const { data: signedData } = await supabase.storage
      .from('audio-summaries')
      .createSignedUrl(fileKey, 3600) // 1 hour expiry

    return new Response(
      JSON.stringify({
        success: true,
        summary: result.transcript,
        audioUrl: signedData?.signedUrl || '',
        duration: result.duration,
        fileKey: fileKey
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Audio Summary Generation Error:', error)
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Internal server error',
        details: 'Failed to generate audio summary'
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

async function generateAudioSummary(url: string, openaiKey?: string, elevenLabsKey?: string) {
  try {
    // Step 1: Extract and summarize content from URL
    const content = await extractContentFromUrl(url)
    const summary = await generateSummaryText(content, openaiKey!)
    
    // Step 2: Convert summary to speech
    const audioBuffer = await generateSpeech(summary, elevenLabsKey || openaiKey!)
    
    // Calculate approximate duration (rough estimate: 150 words per minute)
    const wordCount = summary.split(' ').length
    const duration = Math.ceil((wordCount / 150) * 60) // seconds

    return {
      transcript: summary,
      audioBuffer: audioBuffer,
      duration: duration
    }
  } catch (error) {
    console.error('Audio generation failed:', error)
    throw new Error('Failed to generate audio summary')
  }
}

async function extractContentFromUrl(url: string): Promise<string> {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; AudioSummaryBot/1.0)'
      }
    })
    
    if (!response.ok) {
      throw new Error(`Failed to fetch URL: ${response.status}`)
    }
    
    const html = await response.text()
    
    // Basic content extraction (in production, use a proper HTML parser)
    const textContent = html
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
      .replace(/<[^>]*>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
    
    // Limit content length to avoid API limits
    return textContent.substring(0, 10000)
  } catch (error) {
    throw new Error(`Content extraction failed: ${error.message}`)
  }
}

async function generateSummaryText(content: string, openaiKey: string): Promise<string> {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${openaiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are an expert content summarizer. Create an engaging, conversational audio summary that sounds natural when spoken aloud. Focus on key insights, interesting details, and practical takeaways. Keep it concise but informative, suitable for a 2-3 minute audio overview.'
        },
        {
          role: 'user',
          content: `Please create an engaging audio summary of this content:\n\n${content}`
        }
      ],
      max_tokens: 1000,
      temperature: 0.7
    })
  })

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.status}`)
  }

  const data = await response.json()
  return data.choices[0]?.message?.content || 'Summary generation failed'
}

async function generateSpeech(text: string, apiKey: string): Promise<Uint8Array> {
  // Try ElevenLabs first if key is available, then fallback to OpenAI
  if (apiKey.startsWith('sk_')) {
    // ElevenLabs API key pattern
    return generateElevenLabsSpeech(text, apiKey)
  } else {
    // OpenAI API key pattern
    return generateOpenAISpeech(text, apiKey)
  }
}

async function generateElevenLabsSpeech(text: string, apiKey: string): Promise<Uint8Array> {
  const voiceId = 'EXAVITQu4vr4xnSDxMaL' // Sarah voice
  
  const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
    method: 'POST',
    headers: {
      'xi-api-key': apiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      text: text,
      model_id: 'eleven_multilingual_v2',
      voice_settings: {
        stability: 0.5,
        similarity_boost: 0.8,
        style: 0.0,
        use_speaker_boost: true
      }
    })
  })

  if (!response.ok) {
    throw new Error(`ElevenLabs API error: ${response.status}`)
  }

  return new Uint8Array(await response.arrayBuffer())
}

async function generateOpenAISpeech(text: string, apiKey: string): Promise<Uint8Array> {
  const response = await fetch('https://api.openai.com/v1/audio/speech', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'tts-1',
      input: text,
      voice: 'alloy',
      response_format: 'mp3'
    })
  })

  if (!response.ok) {
    throw new Error(`OpenAI TTS API error: ${response.status}`)
  }

  return new Uint8Array(await response.arrayBuffer())
}
