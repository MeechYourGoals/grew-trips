
import { TripPreferences } from '../types/consumer';
import { ProTripData } from '../types/pro';

export interface SciraAIConfig {
  temperature?: number;
  maxTokens?: number;
  webSearch?: boolean;
  citations?: boolean;
}

export interface SciraAIResponse {
  content: string;
  sources?: Array<{
    title: string;
    url: string;
    snippet: string;
  }>;
  citations?: string[];
}

export interface TripContext {
  id: string;
  title: string;
  location: string;
  dateRange: string;
  basecamp?: { name: string; address: string };
  preferences?: TripPreferences;
  participants?: Array<{ name: string; role: string }>;
  itinerary?: any[];
  budget?: any;
  broadcasts?: any[];
  links?: any[];
  files?: any[];
  isPro?: boolean;
  proData?: ProTripData;
}

export class SciraAIService {
  private static readonly SCIRA_API_BASE = 'https://api.scira.ai/v1';
  
  static buildTripContext(tripContext: TripContext): string {
    const contextSize = tripContext.isPro ? 8000 : 2000;
    
    let context = `You are TripSync AI, an intelligent travel assistant with deep knowledge of this specific trip. Answer questions concisely and provide actionable insights.

TRIP OVERVIEW:
- Title: ${tripContext.title}
- Location: ${tripContext.location}
- Dates: ${tripContext.dateRange}`;

    if (tripContext.basecamp) {
      context += `
- Basecamp: ${tripContext.basecamp.name} at ${tripContext.basecamp.address}`;
    }

    if (tripContext.preferences) {
      context += `

USER PREFERENCES:
- Dietary: ${tripContext.preferences.dietary?.join(', ') || 'None specified'}
- Activities: ${tripContext.preferences.vibe?.join(', ') || 'None specified'}
- Budget: ${tripContext.preferences.budget || 'Not specified'}
- Time Preference: ${tripContext.preferences.timePreference || 'Not specified'}`;
    }

    if (tripContext.participants && tripContext.participants.length > 0) {
      context += `

PARTICIPANTS:`;
      tripContext.participants.forEach(participant => {
        context += `
- ${participant.name} (${participant.role})`;
      });
    }

    if (tripContext.itinerary && tripContext.itinerary.length > 0) {
      context += `

ITINERARY:`;
      tripContext.itinerary.slice(0, 10).forEach((day, index) => {
        context += `
Day ${index + 1} (${day.date}):`;
        day.events?.forEach((event: any) => {
          context += `
  - ${event.title} at ${event.location} (${event.time})`;
        });
      });
    }

    if (tripContext.broadcasts && tripContext.broadcasts.length > 0) {
      context += `

RECENT UPDATES:`;
      tripContext.broadcasts.slice(-5).forEach(broadcast => {
        context += `
- ${broadcast.senderName}: ${broadcast.content}`;
      });
    }

    if (tripContext.links && tripContext.links.length > 0) {
      context += `

SAVED LINKS:`;
      tripContext.links.slice(-10).forEach(link => {
        context += `
- ${link.title}: ${link.url}`;
      });
    }

    // Truncate if too long
    if (context.length > contextSize) {
      context = context.substring(0, contextSize) + '...\n[Context truncated]';
    }

    return context;
  }

  static async querySciraAI(
    query: string,
    context: string,
    config: SciraAIConfig = {}
  ): Promise<SciraAIResponse> {
    const prompt = `${context}

USER QUESTION: ${query}

Please provide a helpful, specific response based on the trip context above. If you need current information about places, events, or travel conditions, feel free to search the web.`;

    try {
      // For now, we'll use a fallback service until Scira AI is properly integrated
      // This maintains the existing functionality while preparing for Scira integration
      const response = await fetch('/api/gemini-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: prompt,
          config: {
            temperature: config.temperature || 0.3,
            maxOutputTokens: config.maxTokens || 1024,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();
      
      return {
        content: data.response,
        sources: [], // Will be populated when Scira AI is integrated
        citations: []
      };
    } catch (error) {
      console.error('Scira AI Query Error:', error);
      throw new Error('Failed to get AI response. Please try again.');
    }
  }

  static async analyzeReviews(url: string): Promise<{
    text: string;
    sentiment: 'positive' | 'negative' | 'neutral';
    score: number;
    platforms: string[];
  }> {
    // TODO: Implement with Scira AI web search and analysis
    // For now, return mock data
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    return {
      text: "This venue consistently receives praise for its quality and service. Customers particularly appreciate the atmosphere and value. Most reviews highlight positive experiences with staff and amenities.",
      sentiment: 'positive',
      score: 85,
      platforms: ['Google Reviews', 'Yelp', 'TripAdvisor']
    };
  }

  static async generateAudioSummary(tripContext: TripContext): Promise<{
    summary: string;
    audioUrl: string;
    duration: number;
  }> {
    // TODO: Implement with Scira AI content generation
    // For now, return mock data
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const summary = `Welcome to your ${tripContext.title} overview. This trip to ${tripContext.location} ${tripContext.dateRange} includes ${tripContext.participants?.length || 0} participants and covers exciting activities based on your preferences.`;
    
    return {
      summary,
      audioUrl: "https://www.soundjay.com/misc/sounds/magic-chime-02.wav",
      duration: 120
    };
  }
}
