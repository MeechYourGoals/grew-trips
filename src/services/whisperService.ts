export interface WhisperTranscriptionResult {
  text: string;
  success: boolean;
  error?: string;
}

export class WhisperService {
  // Now handled by Supabase Edge Function
  static async transcribeAudio(audioBlob: Blob): Promise<WhisperTranscriptionResult> {
    try {
      // Convert blob to base64 for edge function
      const arrayBuffer = await audioBlob.arrayBuffer();
      const base64Audio = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
      
      const response = await fetch('/functions/v1/voice-assistant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          audioBlob: base64Audio,
          tripId: '1',
          isProTrip: false,
          tripContext: {}
        }),
      });

      if (!response.ok) {
        throw new Error(`Voice API error: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Transcription failed');
      }

      return {
        text: data.transcription?.trim() || '',
        success: true,
      };
    } catch (error) {
      console.error('Voice transcription error:', error);
      return {
        text: '',
        success: false,
        error: 'Something went wrong. Please try again.',
      };
    }
  }

  static async isApiKeyConfigured(): Promise<boolean> {
    // Always return true since backend handles API keys
    return true;
  }
}