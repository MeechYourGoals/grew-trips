export interface WhisperTranscriptionResult {
  text: string;
  success: boolean;
  error?: string;
}

export class WhisperService {
  private static readonly WHISPER_ENDPOINT = 'https://api.openai.com/v1/audio/transcriptions';

  static async transcribeAudio(audioBlob: Blob): Promise<WhisperTranscriptionResult> {
    try {
      // Convert WebM to WAV for better compatibility
      const formData = new FormData();
      formData.append('file', audioBlob, 'audio.webm');
      formData.append('model', 'whisper-1');
      formData.append('language', 'en');
      formData.append('response_format', 'json');

      const response = await fetch(this.WHISPER_ENDPOINT, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Whisper API error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      return {
        text: data.text?.trim() || '',
        success: true,
      };
    } catch (error) {
      console.error('Whisper transcription error:', error);
      return {
        text: '',
        success: false,
        error: error instanceof Error ? error.message : 'Transcription failed',
      };
    }
  }

  static async isApiKeyConfigured(): Promise<boolean> {
    return !!import.meta.env.VITE_OPENAI_API_KEY;
  }
}