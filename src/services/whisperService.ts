import { supabase } from '@/integrations/supabase/client';

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
      
      const { data, error } = await supabase.functions.invoke('voice-assistant', {
        body: {
          audioBlob: base64Audio,
          tripId: '1',
          isProTrip: false,
          tripContext: {}
        }
      });

      if (error) {
        console.error('Supabase function error:', error);
        throw new Error('Network error - please check your connection and try again');
      }
      
      if (!data.success) {
        throw new Error(data.error || 'Voice processing failed');
      }

      return {
        text: data.transcription?.trim() || '',
        success: true,
      };
    } catch (error) {
      console.error('Voice transcription error:', error);
      
      const errorMessage = error instanceof Error ? error.message : 'Something went wrong. Please try again.';
      
      return {
        text: '',
        success: false,
        error: errorMessage,
      };
    }
  }

  static async isApiKeyConfigured(): Promise<boolean> {
    // Always return true since backend handles API keys
    return true;
  }
}