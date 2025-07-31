import { supabase } from '@/integrations/supabase/client';
import { TripContext } from '@/types/tripContext';
import { BasecampLocation } from '@/types/basecamp';
import { TripPreferences } from '@/types/consumer';

export interface OpenAIResponse {
  success: boolean;
  content: string;
  error?: string;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
  model?: string;
  isFromOpenAI: boolean;
}

export interface HealthCheckResult {
  isHealthy: boolean;
  model: string;
  latency: number;
  error?: string;
}

export class OpenAIConciergeService {
  
  /**
   * Health check to verify OpenAI API is working
   */
  static async healthCheck(): Promise<HealthCheckResult> {
    const startTime = Date.now();
    
    try {
      console.log('🏥 Starting OpenAI health check...');
      
      const { data, error } = await supabase.functions.invoke('openai-chat', {
        body: {
          message: 'Health check - please respond with just "Ready"',
          config: {
            temperature: 0,
            maxTokens: 10,
            model: 'gpt-4.1-2025-04-14'
          }
        }
      });

      const latency = Date.now() - startTime;

      if (error) {
        console.error('🚨 Supabase function error:', error);
        throw new Error(error.message || 'Health check failed');
      }

      if (!data?.success) {
        console.error('🚨 OpenAI API error:', data?.error);
        throw new Error(data?.error || 'OpenAI API not responding correctly');
      }

      console.log('✅ OpenAI health check successful:', {
        latency,
        model: data.model,
        response: data.response?.substring(0, 50)
      });

      return {
        isHealthy: true,
        model: data.model || 'gpt-4.1-2025-04-14',
        latency,
      };
      
    } catch (error) {
      const latency = Date.now() - startTime;
      console.error('❌ OpenAI health check failed:', error);
      
      return {
        isHealthy: false,
        model: 'unknown',
        latency,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Build comprehensive system prompt with full context
   */
  static buildSystemPrompt(
    tripContext: TripContext,
    basecamp?: BasecampLocation | null,
    preferences?: TripPreferences
  ): string {
    const basecampInfo = basecamp 
      ? `Your Basecamp is: ${basecamp.name} at ${basecamp.address} (${basecamp.coordinates?.lat}, ${basecamp.coordinates?.lng})`
      : 'No Basecamp is currently set';

    const preferencesInfo = preferences ? `
User Preferences:
- Dietary: ${preferences.dietary?.join(', ') || 'None specified'}
- Vibe: ${preferences.vibe?.join(', ') || 'None specified'}  
- Budget: $${preferences.budgetMin || 0} - $${preferences.budgetMax || 0} ${preferences.budgetMin || preferences.budgetMax ? '' : '(not specified)'}
- Time preference: ${preferences.timePreference || 'None specified'}` : 'No preferences specified';

    const participantsList = Array.isArray(tripContext.participants) 
      ? tripContext.participants.map(p => typeof p === 'string' ? p : p.name).join(', ')
      : 'None specified';

    const upcomingEventsList = tripContext.upcomingEvents
      ?.map(event => `- ${event.title} ${event.time ? `at ${event.time}` : ''} ${event.location ? `(${event.location})` : ''}`)
      .join('\n') || 'No upcoming events';

    const recentUpdatesList = Array.isArray(tripContext.recentUpdates)
      ? tripContext.recentUpdates.map(update => 
          typeof update === 'string' ? `- ${update}` : `- ${update.message || update}`
        ).join('\n')
      : 'No recent updates';

    return `You are an expert travel concierge. You provide ultra-personalized, context-rich assistance for travelers.

CURRENT TRIP CONTEXT:
- Trip: ${tripContext.title}
- Location: ${tripContext.location}
- Dates: ${typeof tripContext.dateRange === 'string' ? tripContext.dateRange : `${tripContext.dateRange.start} to ${tripContext.dateRange.end}`}
- Participants: ${participantsList}
- Accommodation: ${tripContext.accommodation || 'Not specified'}

${basecampInfo}

TODAY'S DATE: ${tripContext.currentDate}

UPCOMING EVENTS:
${upcomingEventsList}

RECENT UPDATES:
${recentUpdatesList}

${preferencesInfo}

INSTRUCTIONS:
- Always use the Basecamp as the reference point for location-based queries unless explicitly told otherwise
- When recommending restaurants, activities, or places, prioritize proximity to the Basecamp
- Factor in all user preferences when making suggestions
- Provide specific, actionable advice with addresses and details when possible
- If asked about confirmation numbers or trip details, reference the provided context
- Always mention distances from Basecamp when relevant
- Be conversational and helpful

Use the trip context and Basecamp to provide the most helpful, personalized response possible.`;
  }

  /**
   * Send message to OpenAI with full context
   */
  static async sendMessage(
    userMessage: string,
    tripContext: TripContext,
    basecamp?: BasecampLocation | null,
    preferences?: TripPreferences,
    chatHistory: Array<{role: string, content: string}> = []
  ): Promise<OpenAIResponse> {
    

    try {
      const systemPrompt = this.buildSystemPrompt(tripContext, basecamp, preferences);
      
      // Build messages array with system prompt first
      const messages = [
        {
          role: 'system',
          content: systemPrompt
        },
        // Add chat history
        ...chatHistory.slice(-6), // Keep last 6 messages for context
        // Add current user message
        {
          role: 'user',
          content: userMessage
        }
      ];

      console.log('🤖 Sending to OpenAI:', {
        endpoint: 'openai-chat',
        messageCount: messages.length,
        systemPromptLength: systemPrompt.length,
        userMessage: userMessage.substring(0, 100) + '...'
      });

      const { data, error } = await supabase.functions.invoke('openai-chat', {
        body: {
          message: userMessage,
          tripContext,
          chatHistory,
          config: {
            model: 'gpt-4.1-2025-04-14',
            temperature: 0.7,
            maxTokens: 1000,
            systemPrompt: systemPrompt
          }
        }
      });

      if (error) {
        console.error('OpenAI API Error:', error);
        throw new Error(`OpenAI API Error: ${error.message || 'Unknown error'}`);
      }

      if (!data?.response) {
        throw new Error('Empty response from AI service');
      }

      console.log('✅ AI Response:', {
        success: true,
        contentLength: data.response.length,
        usage: data.usage
      });

      return {
        success: true,
        content: data.response,
        usage: data.usage,
        isFromOpenAI: true
      };

    } catch (error) {
      console.error('OpenAI Concierge Error:', error);
      
      // Only return error for genuine API failures
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      // Check if it's a genuine API failure vs other errors
      const isAPIFailure = errorMessage.includes('API') || 
                          errorMessage.includes('429') || 
                          errorMessage.includes('401') || 
                          errorMessage.includes('500');

      return {
        success: false,
        content: "I'm experiencing technical difficulties right now. Please try again in a moment.",
        error: errorMessage,
        isFromOpenAI: false
      };
    }
  }
}
