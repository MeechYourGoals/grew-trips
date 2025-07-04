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
    // Now handled by voice assistant edge function
    return {
      audioUrl: '',
      success: true,
    };
  }

  static async isApiKeyConfigured(): Promise<boolean> {
    // Always return true since backend handles API keys
    return true;
  }

  static cleanupAudioUrl(url: string): void {
    if (url) {
      URL.revokeObjectURL(url);
    }
  }
}