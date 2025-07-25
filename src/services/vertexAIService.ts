import { TripPreferences } from '../types/consumer';
import { TripContext } from './sciraAI';

export interface VertexAIConfig {
  temperature?: number;
  maxTokens?: number;
  topK?: number;
  topP?: number;
  webSearch?: boolean;
}

export interface VertexAIResponse {
  content: string;
  sources?: Array<{
    title: string;
    url: string;
    snippet: string;
  }>;
  citations?: string[];
  finishReason?: string;
  safetyRatings?: any[];
}

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

export interface EmbeddingResult {
  embedding: number[];
  inputText: string;
}

export class VertexAIService {
  private static readonly VERTEX_ENDPOINT = '/api/vertex-ai-chat';
  private static readonly EMBEDDING_ENDPOINT = '/api/vertex-ai-embeddings';
  private static readonly AUDIO_ENDPOINT = '/api/vertex-ai-audio';
  private static readonly REVIEWS_ENDPOINT = '/api/vertex-ai-reviews';
  
  private static readonly DEFAULT_CONFIG: VertexAIConfig = {
    temperature: 0.3,
    maxTokens: 1024,
    topK: 40,
    topP: 0.95,
    webSearch: false
  };

  static buildContextPrompt(userMessage: string, basecamp?: { name: string; address: string }, preferences?: TripPreferences): string {
    let contextInfo = `You are Concierge, a helpful travel assistant powered by Google Vertex AI Gemini 2.0 Flash. The user is planning a trip and needs recommendations.`;
    
    if (basecamp) {
      contextInfo += `\n\nBasecamp Location: ${basecamp.name} at ${basecamp.address}`;
    }
    
    if (preferences) {
      if (preferences.dietary.length > 0) {
        contextInfo += `\nDietary preferences: ${preferences.dietary.join(', ')}`;
      }
      if (preferences.vibe.length > 0) {
        contextInfo += `\nPreferred activities/vibe: ${preferences.vibe.join(', ')}`;
      }
      contextInfo += `\nBudget range: $${preferences.budgetMin} - $${preferences.budgetMax}`;
      contextInfo += `\nTime preference: ${preferences.timePreference}`;
    }
    
    contextInfo += `\n\nPlease provide helpful, specific recommendations based on this context. Focus on practical advice and real places/activities near their basecamp location.`;
    contextInfo += `\n\nUser question: ${userMessage}`;
    
    return contextInfo;
  }

  static buildTripContext(tripContext: TripContext): string {
    const contextSize = tripContext.isPro ? 16000 : 4000; // Increased for Gemini 2.0 Flash
    
    let context = `You are Concierge, an intelligent travel assistant powered by Google Vertex AI Gemini 2.0 Flash with advanced multimodal capabilities. Answer questions concisely and provide actionable insights.

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
      tripContext.itinerary.slice(0, 15).forEach((day, index) => {
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
      tripContext.broadcasts.slice(-8).forEach(broadcast => {
        context += `
- ${broadcast.senderName}: ${broadcast.content}`;
      });
    }

    if (tripContext.links && tripContext.links.length > 0) {
      context += `

SAVED LINKS:`;
      tripContext.links.slice(-15).forEach(link => {
        context += `
- ${link.title}: ${link.url}`;
      });
    }

    // Enhanced Pro features context
    if (tripContext.isPro && tripContext.proData) {
      context += `

PRO FEATURES:
- Category: ${tripContext.proData.category}`;
      
      if (tripContext.proData.equipment?.length) {
        context += `
- Equipment: ${tripContext.proData.equipment.slice(0, 5).join(', ')}`;
      }
    }

    // Truncate if too long
    if (context.length > contextSize) {
      context = context.substring(0, contextSize) + '...\n[Context truncated for optimal performance]';
    }

    return context;
  }

  static async queryVertexAI(
    query: string,
    context: string = '',
    config: VertexAIConfig = {}
  ): Promise<VertexAIResponse> {
    const fullConfig = { ...this.DEFAULT_CONFIG, ...config };
    
    const prompt = context ? `${context}\n\nUSER QUESTION: ${query}` : query;

    try {
      console.log('Sending request to Vertex AI Gemini 2.0 Flash...');

      const response = await fetch(this.VERTEX_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: prompt,
          config: {
            model: 'gemini-2.0-flash-exp',
            temperature: fullConfig.temperature,
            topK: fullConfig.topK,
            topP: fullConfig.topP,
            maxOutputTokens: fullConfig.maxTokens,
            responseMimeType: 'text/plain'
          },
          vertexAI: true // Flag to use Vertex AI endpoint
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Vertex AI Error: ${response.status} - ${errorData.error || 'Unknown error'}`);
      }

      const data = await response.json();
      console.log('Vertex AI response received successfully');
      
      return {
        content: data.response || data.content || '',
        sources: data.sources || [],
        citations: data.citations || [],
        finishReason: data.finishReason,
        safetyRatings: data.safetyRatings
      };
    } catch (error) {
      console.error('Vertex AI Request Failed:', error);
      throw error;
    }
  }

  static async generateEmbedding(text: string): Promise<EmbeddingResult> {
    try {
      console.log('Generating embeddings with Gemini Embedding 001...');

      const response = await fetch(this.EMBEDDING_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          texts: [text],
          model: 'text-embedding-004', // Latest Gemini embedding model
          taskType: 'RETRIEVAL_DOCUMENT',
          dimensionality: 768 // Optimal for most use cases
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Embedding Error: ${response.status} - ${errorData.error || 'Unknown error'}`);
      }

      const data = await response.json();
      return {
        embedding: data.embeddings[0],
        inputText: text
      };
    } catch (error) {
      console.error('Embedding Generation Failed:', error);
      throw error;
    }
  }

  static async analyzeReviews(url: string): Promise<ReviewAnalysisResult> {
    try {
      console.log('Analyzing reviews with Vertex AI...');

      const response = await fetch(this.REVIEWS_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          url,
          feature: 'reviews',
          model: 'gemini-2.0-flash-exp'
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Review Analysis Error: ${response.status} - ${errorData.error || 'Unknown error'}`);
      }

      const data = await response.json();
      return {
        text: data.text || data.analysis || '',
        sentiment: data.sentiment || 'neutral',
        score: data.score || 75,
        platforms: data.platforms || ['Google Reviews', 'Yelp', 'TripAdvisor']
      };
    } catch (error) {
      console.error('Review Analysis Failed:', error);
      throw error;
    }
  }

  static async generateAudioSummary(url: string, userId: string, tripId?: string): Promise<AudioOverviewResult> {
    try {
      console.log('Generating audio summary with Vertex AI...');

      const response = await fetch(this.AUDIO_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          url,
          user_id: userId,
          trip_id: tripId,
          model: 'gemini-2.0-flash-exp'
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Audio Summary Error: ${response.status} - ${errorData.error || 'Unknown error'}`);
      }

      const data = await response.json();
      return {
        summary: data.summary || '',
        audioUrl: data.audioUrl || '',
        duration: data.duration || 0,
        fileKey: data.fileKey
      };
    } catch (error) {
      console.error('Audio Summary Failed:', error);
      throw error;
    }
  }

  static async classifyPriority(text: string): Promise<'urgent' | 'reminder' | 'fyi'> {
    const prompt = `Classify the priority of this message into one of: urgent, reminder, fyi.
    
Message: "${text}"

Consider urgency, time sensitivity, and importance. Respond with only the priority level.`;

    try {
      const response = await this.queryVertexAI(prompt, '', { 
        maxTokens: 10,
        temperature: 0.1 
      });
      
      const priority = response.content.toLowerCase().trim();
      if (priority.includes('urgent')) return 'urgent';
      if (priority.includes('reminder')) return 'reminder';
      return 'fyi';
    } catch (error) {
      console.error('Priority classification failed:', error);
      return 'fyi';
    }
  }

  static async generateMessageWithTone(
    prompt: string, 
    tone: 'friendly' | 'professional' | 'funny' | 'urgent' | 'direct' | 'cheerful' = 'friendly'
  ): Promise<string> {
    const systemPrompt = `You are a helpful assistant that crafts messages in a ${tone} tone. 
    Generate a clear, appropriate message based on the user's request.`;

    try {
      const response = await this.queryVertexAI(prompt, systemPrompt, {
        temperature: 0.7,
        maxTokens: 256
      });
      
      return response.content.trim();
    } catch (error) {
      console.error('Message generation failed:', error);
      throw error;
    }
  }

  // Multimodal capabilities for future enhancements
  static async analyzeImageContent(imageBase64: string, prompt: string): Promise<string> {
    try {
      const response = await fetch(this.VERTEX_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: prompt,
          image: imageBase64,
          config: {
            model: 'gemini-2.0-flash-exp',
            temperature: 0.3,
            maxOutputTokens: 1024
          },
          multimodal: true
        })
      });

      if (!response.ok) {
        throw new Error(`Image analysis failed: ${response.status}`);
      }

      const data = await response.json();
      return data.response || data.content || '';
    } catch (error) {
      console.error('Image analysis failed:', error);
      throw error;
    }
  }
}