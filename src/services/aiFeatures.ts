
import { supabase } from '@/integrations/supabase/client';

export interface ReviewAnalysisResult {
  text: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  score: number;
  platforms: string[];
  summary: string;
  themes: string[];
  pros: string[];
  cons: string[];
  rating: number;
  totalReviews: number;
}


export interface AiFeatureResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export class AiFeatureService {
  static async analyzeReviews(url: string): Promise<AiFeatureResponse<ReviewAnalysisResult>> {
    try {
      const { data, error } = await supabase.functions.invoke('ai-features', {
        body: {
          feature: 'review-analysis',
          url
        }
      });

      if (error) throw error;
      
      return { success: true, data: data.result };
    } catch (error) {
      console.error('Review Analysis Error:', error);
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
