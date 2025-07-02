
import { SciraAIService } from './sciraAI';

export interface ReviewAnalysisResult {
  text: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  score: number;
  platforms: string[];
}

export interface AudioOverviewResult {
  summary: string;
  audioUrl: string;
  duration: number;
  fileKey?: string;
}

export interface AiFeatureResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export class AiFeatureService {
  static async analyzeReviews(url: string): Promise<AiFeatureResponse<ReviewAnalysisResult>> {
    try {
      const result = await SciraAIService.analyzeReviews(url);
      return { success: true, data: result };
    } catch (error) {
      console.error('Review Analysis Error:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  static async generateAudioOverview(url: string, userId?: string, tripId?: string): Promise<AiFeatureResponse<AudioOverviewResult>> {
    try {
      // Create a minimal trip context for audio generation
      const tripContext = {
        id: tripId || 'unknown',
        title: 'Trip Overview',
        location: 'Various locations',
        dateRange: 'Current period',
        isPro: false
      };

      const result = await SciraAIService.generateAudioSummary(tripContext);
      
      return { 
        success: true, 
        data: {
          summary: result.summary,
          audioUrl: result.audioUrl,
          duration: result.duration
        }
      };
    } catch (error) {
      console.error('Audio Overview Error:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  static async generateAiMessage(prompt: string, tone: string, tripId: string, templateText?: string): Promise<AiFeatureResponse<string>> {
    try {
      // This will call our Supabase edge function, which then calls OpenAI
      const payload: { prompt: string; tone: string; tripId: string; templateText?: string } = {
        prompt,
        tone,
        tripId
      };
      if (templateText) {
        payload.templateText = templateText;
      }

      const { data, error } = await SciraAIService.supabase.functions.invoke('ai-features', {
        body: {
          action: 'generateMessage',
          payload: payload
        },
      });

      if (error) throw error;
      if (!data || !data.message) throw new Error('No message generated.');

      return { success: true, data: data.message };
    } catch (error) {
      console.error('AI Message Generation Error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error during AI message generation'
      };
    }
  }

  static async classifyMessagePriority(messageContent: string, tripContext?: any): Promise<AiFeatureResponse<{ priority: string; score: number; reason: string }>> {
    try {
      const { data, error } = await SciraAIService.supabase.functions.invoke('ai-features', {
        body: {
          action: 'classifyMessagePriority',
          payload: { messageContent, tripContext } // tripContext is optional
        },
      });

      if (error) throw error;
      // Assuming the function returns { priority, score, reason } directly in data
      if (!data || !data.priority) throw new Error('Invalid response from priority classification.');

      return { success: true, data: data };
    } catch (error) {
      console.error('AI Message Priority Classification Error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error during AI priority classification',
        data: { priority: 'none', score: 0, reason: 'Classification failed' } // Default fallback
      };
    }
  }

  static async suggestSendTime(
    tripId: string,
    messagePurpose: string,
    currentMessageUrgency?: 'urgent' | 'reminder' | 'fyi' | 'none'
  ): Promise<AiFeatureResponse<{ suggestions: { suggested_time_utc: string; reasoning: string; confidence: string }[], error?: string }>> {
    try {
      const { data, error: functionError } = await SciraAIService.supabase.functions.invoke('ai-features', {
        body: {
          action: 'suggestSendTime',
          payload: { tripId, messagePurpose, currentMessageUrgency }
        },
      });

      if (functionError) throw functionError;

      // The Supabase function itself might return an error in its data payload if OpenAI fails or context is insufficient
      if (data && data.error) {
        console.warn('Suggest send time function returned an error in data:', data.error);
        return { success: false, error: data.error, data: { suggestions: [] } };
      }

      if (!data || !data.suggestions) {
        throw new Error('Invalid response from send time suggestion.');
      }

      return { success: true, data: data }; // data should be { suggestions: [...] }
    } catch (error) {
      console.error('AI Suggest Send Time Error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error during AI send time suggestion',
        data: { suggestions: [] }
      };
    }
  }
}

// URL validation utilities
export const validateUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const extractPlaceInfo = (url: string): { name?: string; location?: string } => {
  const urlObj = new URL(url);
  const hostname = urlObj.hostname.toLowerCase();
  
  if (hostname.includes('yelp.com')) {
    const pathParts = urlObj.pathname.split('/');
    const bizIndex = pathParts.indexOf('biz');
    if (bizIndex !== -1 && pathParts[bizIndex + 1]) {
      const name = pathParts[bizIndex + 1].replace(/-/g, ' ');
      return { name };
    }
  }
  
  if (hostname.includes('tripadvisor.com')) {
    const pathParts = urlObj.pathname.split('/');
    const restaurantPart = pathParts.find(part => part.includes('Restaurant'));
    if (restaurantPart) {
      const name = restaurantPart.replace(/Restaurant_Review-|_/g, ' ').trim();
      return { name };
    }
  }
  
  return {};
};
