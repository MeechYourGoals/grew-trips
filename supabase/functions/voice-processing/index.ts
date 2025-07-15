import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from '../_shared/cors.ts';

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { action, audioData, text, voiceId, format } = await req.json();
    
    switch (action) {
      case 'speech_to_text':
        return await speechToText(audioData, format);
      case 'text_to_speech':
        return await textToSpeech(text, voiceId);
      default:
        throw new Error('Invalid action');
    }
  } catch (error) {
    console.error('Voice processing error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});

async function speechToText(audioData: number[], format: string = 'webm') {
  const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
  
  if (!openaiApiKey) {
    throw new Error('OpenAI API key not configured');
  }

  // Convert audio data to blob
  const audioBlob = new Blob([new Uint8Array(audioData)], { 
    type: `audio/${format}` 
  });

  const formData = new FormData();
  formData.append('file', audioBlob, `audio.${format}`);
  formData.append('model', 'whisper-1');
  formData.append('language', 'en'); // Can be made configurable
  formData.append('response_format', 'json');

  const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${openaiApiKey}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`OpenAI Whisper error: ${error}`);
  }

  const result = await response.json();
  
  return new Response(
    JSON.stringify({
      success: true,
      transcript: result.text,
      language: result.language || 'en'
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function textToSpeech(text: string, voiceId: string = 'EXAVITQu4vr4xnSDxMaL') {
  const elevenlabsApiKey = Deno.env.get('ELEVENLABS_API_KEY');
  
  if (!elevenlabsApiKey) {
    throw new Error('ElevenLabs API key not configured');
  }

  const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
    method: 'POST',
    headers: {
      'Accept': 'audio/mpeg',
      'Content-Type': 'application/json',
      'xi-api-key': elevenlabsApiKey,
    },
    body: JSON.stringify({
      text,
      model_id: 'eleven_monolingual_v1',
      voice_settings: {
        stability: 0.5,
        similarity_boost: 0.5,
        style: 0.0,
        use_speaker_boost: true
      }
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`ElevenLabs error: ${error}`);
  }

  const audioBuffer = await response.arrayBuffer();
  const base64Audio = btoa(String.fromCharCode(...new Uint8Array(audioBuffer)));
  
  return new Response(
    JSON.stringify({
      success: true,
      audio_data: base64Audio,
      content_type: 'audio/mpeg'
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}