export interface ElevenLabsVoiceResult {
  audioUrl: string;
  success: boolean;
  error?: string;
}

export interface VoiceSettings {
  stability: number;
  similarity_boost: number;
  style?: number;
  use_speaker_boost?: boolean;
}

export class ElevenLabsService {
  private static readonly ELEVENLABS_ENDPOINT = 'https://api.elevenlabs.io/v1/text-to-speech';
  
  // Popular ElevenLabs voices
  public static readonly VOICES = {
    SARAH: 'EXAVITQu4vr4xnSDxMaL', // Professional female
    BRIAN: 'nPczCjzI2devNBz1zQrb', // Professional male
    ALICE: 'Xb7hH8MSUJpSbSDYk0k2', // Friendly female
    CHARLIE: 'IKne3meq5aSn9XLyUdCD', // Friendly male
    ARIA: '9BWtsMINqrJLrRacOk9x', // Warm female
  };

  static async synthesizeVoice(
    text: string, 
    voiceId: string = this.VOICES.SARAH,
    settings: VoiceSettings = { stability: 0.5, similarity_boost: 0.75 }
  ): Promise<ElevenLabsVoiceResult> {
    try {
      if (!import.meta.env.VITE_ELEVENLABS_API_KEY) {
        throw new Error('ElevenLabs API key not configured');
      }

      const response = await fetch(`${this.ELEVENLABS_ENDPOINT}/${voiceId}`, {
        method: 'POST',
        headers: {
          'xi-api-key': import.meta.env.VITE_ELEVENLABS_API_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          voice_settings: settings,
          output_format: 'mp3_44100_128',
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`ElevenLabs API error: ${response.status} - ${errorText}`);
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);

      return {
        audioUrl,
        success: true,
      };
    } catch (error) {
      console.error('ElevenLabs synthesis error:', error);
      return {
        audioUrl: '',
        success: false,
        error: error instanceof Error ? error.message : 'Voice synthesis failed',
      };
    }
  }

  static async isApiKeyConfigured(): Promise<boolean> {
    return !!import.meta.env.VITE_ELEVENLABS_API_KEY;
  }

  static cleanupAudioUrl(url: string): void {
    if (url) {
      URL.revokeObjectURL(url);
    }
  }
}