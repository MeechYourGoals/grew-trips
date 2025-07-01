
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
