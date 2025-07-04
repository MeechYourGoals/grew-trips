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
  errorType?: 'validation' | 'whisper' | 'gpt' | 'elevenlabs' | 'network' | 'unknown';
}

// Add timeout wrapper for fetch requests
const fetchWithTimeout = async (url: string, options: RequestInit, timeoutMs = 30000) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
};

// Validate audio data
const validateAudioData = (audioBlob: string): { isValid: boolean; error?: string } => {
  if (!audioBlob || audioBlob.length === 0) {
    return { isValid: false, error: 'No audio data provided' };
  }
  
  try {
    const binaryString = atob(audioBlob);
    if (binaryString.length < 1000) { // Minimum ~1 second of audio
      return { isValid: false, error: 'Audio too short - please speak for at least 1 second' };
    }
    
    if (binaryString.length > 10 * 1024 * 1024) { // Max 10MB
      return { isValid: false, error: 'Audio file too large' };
    }
    
    return { isValid: true };
  } catch (error) {
    return { isValid: false, error: 'Invalid audio format' };
  }
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  console.log('Voice assistant request received')

  // Check if API keys are configured
  if (!OPENAI_API_KEY) {
    console.error('Missing OPENAI_API_KEY')
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Service temporarily unavailable - missing OpenAI configuration',
        errorType: 'validation'
      }),
      {
        status: 503,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }

  if (!ELEVENLABS_API_KEY) {
    console.error('Missing ELEVENLABS_API_KEY')
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Voice synthesis temporarily unavailable - missing ElevenLabs configuration',
        errorType: 'validation'
      }),
      {
        status: 503,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }

  try {
    const { audioBlob, tripId, isProTrip, tripContext }: VoiceRequest = await req.json()
    console.log(`Processing voice request for trip ${tripId} (isProTrip: ${isProTrip})`)

    // Validate audio data
    const validation = validateAudioData(audioBlob)
    if (!validation.isValid) {
      console.log('Audio validation failed:', validation.error)
      return new Response(
        JSON.stringify({
          success: false,
          error: validation.error,
          errorType: 'validation'
        }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    console.log('Audio validation passed, starting transcription...')

    // Step 1: Transcribe audio with Whisper (with timeout)
    let transcription = ''
    try {
      const audioBuffer = Uint8Array.from(atob(audioBlob), c => c.charCodeAt(0))
      const formData = new FormData()
      formData.append('file', new Blob([audioBuffer], { type: 'audio/webm' }), 'audio.webm')
      formData.append('model', 'whisper-1')
      formData.append('language', 'en')

      const whisperResponse = await fetchWithTimeout('https://api.openai.com/v1/audio/transcriptions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
        },
        body: formData,
      }, 15000) // 15 second timeout for Whisper

      if (!whisperResponse.ok) {
        const errorText = await whisperResponse.text()
        console.error('Whisper API error:', whisperResponse.status, errorText)
        throw new Error(`Whisper failed with status ${whisperResponse.status}`)
      }

      const whisperData = await whisperResponse.json()
      transcription = whisperData.text?.trim() || ''
      
      if (!transcription) {
        console.log('Empty transcription from Whisper')
        throw new Error('Could not understand audio - please speak more clearly')
      }

      console.log('Transcription successful:', transcription)
    } catch (error) {
      console.error('Whisper transcription error:', error)
      return new Response(
        JSON.stringify({
          success: false,
          error: error.message.includes('timeout') ? 
            'Audio processing is taking too long - please try again' :
            'Could not understand your audio - please speak more clearly and try again',
          errorType: 'whisper'
        }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    // Step 2: Generate response with GPT-4o (with timeout)
    let response = ''
    try {
      const contextPrompt = `You are a helpful travel assistant for this trip. 
      
      Trip Context: ${JSON.stringify(tripContext)}
      
      Provide concise, natural responses to user questions about their trip. Keep responses under 100 words and focus on the most relevant information.
      
      Use a friendly, conversational tone as if you're a knowledgeable travel companion.`

      const gptResponse = await fetchWithTimeout('https://api.openai.com/v1/chat/completions', {
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
      }, 10000) // 10 second timeout for GPT

      if (!gptResponse.ok) {
        const errorText = await gptResponse.text()
        console.error('GPT API error:', gptResponse.status, errorText)
        throw new Error(`GPT failed with status ${gptResponse.status}`)
      }

      const gptData = await gptResponse.json()
      response = gptData.choices?.[0]?.message?.content?.trim() || "I'm sorry, I couldn't process that request."
      
      console.log('GPT response generated successfully')
    } catch (error) {
      console.error('GPT response error:', error)
      return new Response(
        JSON.stringify({
          success: false,
          error: error.message.includes('timeout') ? 
            'AI is taking too long to respond - please try again' :
            'AI assistant is temporarily unavailable - please try again',
          errorType: 'gpt',
          transcription // Still return transcription so user knows it was heard
        }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    // Step 3: Generate voice response with ElevenLabs (with timeout)
    try {
      const ttsResponse = await fetchWithTimeout('https://api.elevenlabs.io/v1/text-to-speech/EXAVITQu4vr4xnSDxMaL', {
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
      }, 15000) // 15 second timeout for TTS

      if (!ttsResponse.ok) {
        console.error('ElevenLabs API error:', ttsResponse.status)
        // Return text response even if TTS fails
        return new Response(
          JSON.stringify({
            success: true,
            transcription,
            response,
            error: 'Voice synthesis unavailable - here\'s the text response',
            errorType: 'elevenlabs'
          }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        )
      }

      const audioBuffer = await ttsResponse.arrayBuffer()
      const audioBase64 = btoa(String.fromCharCode(...new Uint8Array(audioBuffer)))

      console.log('Voice synthesis successful')

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
      console.error('ElevenLabs TTS error:', error)
      // Return text response even if TTS fails
      return new Response(
        JSON.stringify({
          success: true,
          transcription,
          response,
          error: 'Voice synthesis temporarily unavailable - here\'s the text response',
          errorType: 'elevenlabs'
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

  } catch (error) {
    console.error('Voice assistant general error:', error)
    
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Voice assistant is temporarily unavailable - please try again in a moment',
        errorType: 'unknown'
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})