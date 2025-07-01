
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
  private static readonly SCIRA_API_BASE = 'https://scira.sh/api';
  
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

Please provide a helpful, specific response based on the trip context above. If you need current information about places, events, or travel conditions, use web search capabilities.`;

    try {
      const response = await fetch(`${this.SCIRA_API_BASE}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: prompt,
          model: 'gpt-4o-mini', // Using the free model from Scira
          stream: false,
          web_search: config.webSearch || true,
          temperature: config.temperature || 0.3,
          max_tokens: config.maxTokens || 1024,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Scira AI API Error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      
      // Handle Scira AI response format
      const content = data.message || data.response || data.content || 'No response received';
      const sources = data.sources || [];
      
      return {
        content,
        sources: sources.map((source: any) => ({
          title: source.title || 'Unknown',
          url: source.url || '',
          snippet: source.snippet || source.description || ''
        })),
        citations: data.citations || []
      };
    } catch (error) {
      console.error('Scira AI Query Error:', error);
      
      // Fallback to simple response on error
      return {
        content: `I apologize, but I'm experiencing technical difficulties. Please try again in a moment. Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        sources: [],
        citations: []
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

      // Extract sentiment info from response
      const content = response.content;
      const score = this.extractScoreFromText(content);
      const sentiment = this.determineSentiment(score, content);
      
      return {
        text: content,
        sentiment,
        score,
        platforms: ['Google Reviews', 'Yelp', 'TripAdvisor'] // Will be enhanced with actual platform detection
      };
    } catch (error) {
      console.error('Review Analysis Error:', error);
      throw new Error('Failed to analyze reviews. Please try again.');
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

      // For now, return the text summary - audio generation would require additional TTS integration
      return {
        summary: response.content,
        audioUrl: "https://www.soundjay.com/misc/sounds/magic-chime-02.wav", // Placeholder
        duration: Math.max(60, Math.floor(response.content.length / 10)) // Estimate based on text length
      };
    } catch (error) {
      console.error('Audio Summary Error:', error);
      throw new Error('Failed to generate audio summary. Please try again.');
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
