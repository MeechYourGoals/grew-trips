
export interface ReviewAnalysisResult {
  text: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  score: number; // 0-100
  platforms: string[];
}

export interface AudioOverviewResult {
  summary: string;
  audioUrl: string;
  duration: number;
}

export interface AiFeatureResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export class AiFeatureService {
  private static async makeRequest<T>(
    feature: 'reviews' | 'audio',
    url: string
  ): Promise<AiFeatureResponse<T>> {
    try {
      const response = await fetch('/api/ai-features', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ feature, url }),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || 'API request failed');
      }

      const result = await response.json();
      return { success: true, data: result };
    } catch (error) {
      console.error(`AI Feature Error (${feature}):`, error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  static async analyzeReviews(url: string): Promise<AiFeatureResponse<ReviewAnalysisResult>> {
    return this.makeRequest<ReviewAnalysisResult>('reviews', url);
  }

  static async generateAudioOverview(url: string): Promise<AiFeatureResponse<AudioOverviewResult>> {
    return this.makeRequest<AudioOverviewResult>('audio', url);
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
  
  // Basic extraction logic for common platforms
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
    // TripAdvisor URLs often have restaurant names in the path
    const restaurantPart = pathParts.find(part => part.includes('Restaurant'));
    if (restaurantPart) {
      const name = restaurantPart.replace(/Restaurant_Review-|_/g, ' ').trim();
      return { name };
    }
  }
  
  return {};
};
