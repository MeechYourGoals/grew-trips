import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { corsHeaders } from '../_shared/cors.ts'

const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY')
const ELEVENLABS_API_KEY = Deno.env.get('ELEVENLABS_API_KEY')

interface VoiceRequest {
  audioBlob: string; // base64 encoded audio
  tripId: string;
  isProTrip: boolean;
  tripContext?: any;
}

interface VoiceResponse {
  success: boolean;
  transcription?: string;
  response?: string;
  audioUrl?: string;
  error?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { audioBlob, tripId, isProTrip, tripContext }: VoiceRequest = await req.json()

    // Step 1: Transcribe audio with Whisper
    const audioBuffer = Uint8Array.from(atob(audioBlob), c => c.charCodeAt(0))
    const formData = new FormData()
    formData.append('file', new Blob([audioBuffer], { type: 'audio/webm' }), 'audio.webm')
    formData.append('model', 'whisper-1')
    formData.append('language', 'en')

    const whisperResponse = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: formData,
    })

    if (!whisperResponse.ok) {
      throw new Error('Whisper transcription failed')
    }

    const { text: transcription } = await whisperResponse.json()

    // Step 2: Generate response with GPT-4o
    const contextPrompt = `You are a helpful travel assistant for this trip. 
    
    Trip Context: ${JSON.stringify(tripContext)}
    
    Provide concise, natural responses to user questions about their trip. Keep responses under 100 words and focus on the most relevant information.
    
    Use a friendly, conversational tone as if you're a knowledgeable travel companion.`

    const gptResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: contextPrompt },
          { role: 'user', content: transcription }
        ],
        max_tokens: 150,
        temperature: 0.7,
      }),
    })

    if (!gptResponse.ok) {
      throw new Error('GPT response generation failed')
    }

    const { choices } = await gptResponse.json()
    const response = choices[0]?.message?.content || "I'm sorry, I couldn't process that request."

    // Step 3: Generate voice response with ElevenLabs
    const ttsResponse = await fetch('https://api.elevenlabs.io/v1/text-to-speech/EXAVITQu4vr4xnSDxMaL', {
      method: 'POST',
      headers: {
        'xi-api-key': ELEVENLABS_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: response,
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
        },
        output_format: 'mp3_44100_128',
      }),
    })

    if (!ttsResponse.ok) {
      // Return text response even if TTS fails
      return new Response(
        JSON.stringify({
          success: true,
          transcription,
          response,
          error: 'Voice synthesis unavailable, text response provided'
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    const audioBuffer2 = await ttsResponse.arrayBuffer()
    const audioBase64 = btoa(String.fromCharCode(...new Uint8Array(audioBuffer2)))

    const result: VoiceResponse = {
      success: true,
      transcription,
      response,
      audioUrl: `data:audio/mp3;base64,${audioBase64}`
    }

    return new Response(
      JSON.stringify(result),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )

  } catch (error) {
    console.error('Voice assistant error:', error)
    
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Something went wrong. Please try again.'
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})