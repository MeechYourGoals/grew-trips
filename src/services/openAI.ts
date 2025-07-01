import { TripPreferences } from '../types/consumer';
import { ProTripData } from '../types/pro';

export interface OpenAIConfig {
  temperature?: number;
  maxTokens?: number;
}

export interface OpenAIResponse {
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

export class OpenAIService {
  private static readonly ENDPOINT = '/api/openai-chat';

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

    if (context.length > contextSize) {
      context = context.substring(0, contextSize) + '...\n[Context truncated]';
    }

    return context;
  }

  static async queryOpenAI(prompt: string, config: OpenAIConfig = {}): Promise<OpenAIResponse> {
    const response = await fetch(this.ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ prompt, config })
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`HTTP ${response.status}: ${text}`);
    }

    const data = await response.json();
    return {
      content: data.response || data.content || '',
      sources: data.sources || [],
      citations: data.citations || [],
      isFromFallback: false,
    };
  }

  static async analyzeReviews(url: string): Promise<{
    text: string;
    sentiment: 'positive' | 'negative' | 'neutral';
    score: number;
    platforms: string[];
  }> {
    const prompt = `Please analyze reviews from this URL: ${url}

Provide a comprehensive sentiment analysis including:
1. Overall sentiment (positive/negative/neutral)
2. Sentiment score (0-100)
3. Key themes and insights
4. Summary of customer feedback

Format your response as a detailed analysis.`;

    const response = await this.queryOpenAI(prompt, { temperature: 0.2 });

    const content = response.content;
    const score = this.extractScoreFromText(content);
    const sentiment = this.determineSentiment(score, content);

    return {
      text: content,
      sentiment,
      score,
      platforms: ['Google Reviews', 'Yelp', 'TripAdvisor']
    };
  }

  static async generateAudioSummary(tripContext: TripContext): Promise<{
    summary: string;
    audioUrl: string;
    duration: number;
  }> {
    const context = this.buildTripContext(tripContext);
    const prompt = `Based on this trip information, create a comprehensive audio summary script:

${context}

Please create a natural, conversational script that would work well as an audio overview of this trip. Include key details, highlights, and practical information that travelers would want to know.`;

    const response = await this.queryOpenAI(prompt, { temperature: 0.4, maxTokens: 1000 });

    return {
      summary: response.content,
      audioUrl: 'https://www.soundjay.com/misc/sounds/magic-chime-02.wav',
      duration: Math.max(60, Math.floor(response.content.length / 10))
    };
  }

  private static extractScoreFromText(text: string): number {
    const scoreMatch = text.match(/(\d+)%|\bscore[:\s]*(\d+)|(\d+)\s*out\s*of\s*\d+/i);
    if (scoreMatch) {
      const score = parseInt(scoreMatch[1] || scoreMatch[2] || scoreMatch[3]);
      return Math.min(100, Math.max(0, score));
    }

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
