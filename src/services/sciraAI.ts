
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
  isFromFallback?: boolean;
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
  private static readonly SCIRA_API_BASE = 'https://scira.sh/api';
  private static readonly GEMINI_ENDPOINT = '/api/gemini-chat';
  private static readonly FALLBACK_ENABLED = true;
  
  static buildTripContext(tripContext: TripContext): string {
    const contextSize = tripContext.isPro ? 8000 : 2000;
    
    let context = `You are Triv Concierge, an intelligent travel assistant with deep knowledge of this specific trip. Answer questions concisely and provide actionable insights.

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
- Budget: $${tripContext.preferences.budgetMin || 0} - $${tripContext.preferences.budgetMax || 1000}
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

  private static async generateFallbackResponse(query: string, context: string): Promise<SciraAIResponse> {
    // Intelligent fallback responses based on query patterns
    const lowerQuery = query.toLowerCase();
    
    if (lowerQuery.includes('weather')) {
      return {
        content: "I'd recommend checking the weather forecast for your destination. You can use weather.com or your phone's weather app for the most current conditions. Generally, it's good to pack layers and check the forecast a few days before your trip.",
        isFromFallback: true
      };
    }
    
    if (lowerQuery.includes('restaurant') || lowerQuery.includes('food') || lowerQuery.includes('eat')) {
      return {
        content: "For restaurant recommendations, I suggest checking Google Maps, Yelp, or TripAdvisor for highly-rated local spots near your destination. Look for places with recent reviews and consider making reservations if it's a popular area.",
        isFromFallback: true
      };
    }
    
    if (lowerQuery.includes('activity') || lowerQuery.includes('things to do') || lowerQuery.includes('attraction')) {
      return {
        content: "To find great activities and attractions, try searching on Google Maps, TripAdvisor, or local tourism websites. Consider your group's interests and check opening hours and ticket requirements in advance.",
        isFromFallback: true
      };
    }
    
    if (lowerQuery.includes('transport') || lowerQuery.includes('getting around') || lowerQuery.includes('uber') || lowerQuery.includes('taxi')) {
      return {
        content: "For transportation, consider using ride-sharing apps like Uber or Lyft, public transit apps for your destination, or rental car services. Google Maps can help with navigation and transit options.",
        isFromFallback: true
      };
    }
    
    // Generic helpful response
    return {
      content: "I'm currently experiencing connectivity issues with my advanced AI features. For the best travel information, I recommend checking:\n\n• Google Maps for locations and directions\n• TripAdvisor or Yelp for reviews\n• Local tourism websites\n• Weather apps for forecasts\n\nYour trip details are saved, and I'll be back to full functionality soon!",
      isFromFallback: true
    };
  }

  private static isCorsError(error: any): boolean {
    return error.message?.includes('CORS') || 
           error.message?.includes('Access-Control-Allow-Origin') ||
           error.name === 'TypeError' && error.message?.includes('Failed to fetch');
  }

  private static isNetworkError(error: any): boolean {
    return error.message?.includes('Failed to fetch') ||
           error.message?.includes('NetworkError') ||
           error.message?.includes('ERR_NETWORK') ||
           error.code === 'NETWORK_ERROR';
  }

  static async querySciraAI(
    query: string,
    context: string,
    config: SciraAIConfig = {}
  ): Promise<SciraAIResponse> {
    const prompt = `${context}

USER QUESTION: ${query}

Please provide a helpful, specific response based on the trip context above. If you need current information about places, events, or travel conditions, use web search capabilities.`;

    try {
      console.log('Attempting Gemini AI request...');

      const geminiRes = await fetch(this.GEMINI_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: prompt,
          config: {
            temperature: config.temperature ?? 0.3,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: config.maxTokens ?? 1024
          },
          tripContext: null
        })
      });

      if (geminiRes.ok) {
        const geminiData = await geminiRes.json();
        console.log('Gemini AI response received:', geminiData);
        return { content: geminiData.response, sources: [], citations: [], isFromFallback: false };
      } else {
        const text = await geminiRes.text();
        throw new Error(`Gemini HTTP ${geminiRes.status}: ${text}`);
      }
    } catch (gemError) {
      console.error('Gemini AI Request Failed:', gemError);
    }

    try {
      console.log('Attempting Scira fallback request...');

      const response = await fetch(`${this.SCIRA_API_BASE}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: prompt,
          model: 'gpt-4o-mini',
          stream: false,
          web_search: config.webSearch !== false,
          temperature: config.temperature || 0.3,
          max_tokens: config.maxTokens || 1024,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Scira API HTTP Error:', response.status, errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      console.log('Scira AI response received:', data);

      const content = data.message || data.response || data.content || 'No response received';
      const sources = data.sources || [];

      return {
        content,
        sources: sources.map((source: any) => ({
          title: source.title || 'Unknown',
          url: source.url || '',
          snippet: source.snippet || source.description || ''
        })),
        citations: data.citations || [],
        isFromFallback: false
      };
    } catch (error) {
      console.error('Scira AI Request Failed:', error);
      
      // Determine error type for better user messaging
      let errorType = 'unknown';
      if (this.isCorsError(error)) {
        errorType = 'cors';
        console.log('CORS error detected - using fallback');
      } else if (this.isNetworkError(error)) {
        errorType = 'network';
        console.log('Network error detected - using fallback');
      }
      
      // Use fallback if enabled
      if (this.FALLBACK_ENABLED) {
        console.log('Using fallback response system');
        return await this.generateFallbackResponse(query, context);
      }
      
      // Return error message if no fallback
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return {
        content: `I'm currently unable to connect to my advanced AI features. This might be due to network connectivity or service availability. Please try again in a moment.\n\n${errorMessage}`,
        sources: [],
        citations: [],
        isFromFallback: true
      };
    }
  }

  static async analyzeReviews(url: string): Promise<{
    text: string;
    sentiment: 'positive' | 'negative' | 'neutral';
    score: number;
    platforms: string[];
  }> {
    try {
      const prompt = `Please analyze reviews from this URL: ${url}
      
Provide a comprehensive sentiment analysis including:
1. Overall sentiment (positive/negative/neutral)
2. Sentiment score (0-100)
3. Key themes and insights
4. Summary of customer feedback

Format your response as a detailed analysis.`;

      const response = await this.querySciraAI(prompt, '', {
        webSearch: true,
        temperature: 0.2
      });

      // If fallback was used, provide a generic analysis
      if (response.isFromFallback) {
        return {
          text: "Review analysis is temporarily unavailable. Please check the URL directly for the most current reviews and ratings.",
          sentiment: 'neutral',
          score: 75,
          platforms: ['Reviews temporarily unavailable']
        };
      }

      // Extract sentiment info from response
      const content = response.content;
      const score = this.extractScoreFromText(content);
      const sentiment = this.determineSentiment(score, content);
      
      return {
        text: content,
        sentiment,
        score,
        platforms: ['Google Reviews', 'Yelp', 'TripAdvisor']
      };
    } catch (error) {
      console.error('Review Analysis Error:', error);
      return {
        text: "Unable to analyze reviews at this time. Please check the URL directly.",
        sentiment: 'neutral',
        score: 50,
        platforms: ['Analysis unavailable']
      };
    }
  }

  static async generateAudioSummary(tripContext: TripContext): Promise<{
    summary: string;
    audioUrl: string;
    duration: number;
  }> {
    try {
      const context = this.buildTripContext(tripContext);
      const prompt = `Based on this trip information, create a comprehensive audio summary script:

${context}

Please create a natural, conversational script that would work well as an audio overview of this trip. Include key details, highlights, and practical information that travelers would want to know.`;

      const response = await this.querySciraAI(prompt, '', {
        temperature: 0.4,
        maxTokens: 1000
      });

      return {
        summary: response.content,
        audioUrl: "https://www.soundjay.com/misc/sounds/magic-chime-02.wav",
        duration: Math.max(60, Math.floor(response.content.length / 10))
      };
    } catch (error) {
      console.error('Audio Summary Error:', error);
      return {
        summary: "Audio summary generation is temporarily unavailable. Your trip details are saved and you can access them in the trip overview.",
        audioUrl: "https://www.soundjay.com/misc/sounds/magic-chime-02.wav",
        duration: 30
      };
    }
  }

  private static extractScoreFromText(text: string): number {
    // Look for percentage or score mentions in the text
    const scoreMatch = text.match(/(\d+)%|\bscore[:\s]*(\d+)|(\d+)\s*out\s*of\s*\d+/i);
    if (scoreMatch) {
      const score = parseInt(scoreMatch[1] || scoreMatch[2] || scoreMatch[3]);
      return Math.min(100, Math.max(0, score));
    }
    
    // Default scoring based on sentiment keywords
    const positiveWords = text.toLowerCase().match(/\b(excellent|great|amazing|wonderful|fantastic|good|positive|satisfied|happy|recommend)\b/g) || [];
    const negativeWords = text.toLowerCase().match(/\b(poor|bad|terrible|awful|negative|disappointed|unsatisfied|avoid|horrible)\b/g) || [];
    
    const positiveScore = positiveWords.length * 10;
    const negativeScore = negativeWords.length * 10;
    
    return Math.max(50, Math.min(90, 70 + positiveScore - negativeScore));
  }

  private static determineSentiment(score: number, text: string): 'positive' | 'negative' | 'neutral' {
    if (score >= 70) return 'positive';
    if (score <= 40) return 'negative';
    return 'neutral';
  }
}
