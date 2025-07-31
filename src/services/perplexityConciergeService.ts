import { PerplexityService, PerplexityResponse } from './PerplexityService';
import { TripContext } from '../types/tripContext';

export type { PerplexityResponse };

export interface HealthCheckResult {
  healthy: boolean;
  model?: string;
  latency?: number;
  error?: string;
}

export class PerplexityConciergeService {
  static async healthCheck(): Promise<HealthCheckResult> {
    return PerplexityService.healthCheck();
  }

  static buildSystemPrompt(
    tripContext?: TripContext,
    basecampLocation?: { name: string; address: string },
    preferences?: any
  ): string {
    let systemPrompt = `You are Concierge, an intelligent travel assistant with access to real-time web information. You help travelers plan and manage their trips with personalized recommendations and current information.

Key capabilities:
- Real-time web search for current information about restaurants, attractions, events
- Location-based recommendations and directions
- Weather updates and travel conditions
- Local insights and hidden gems
- Practical travel advice and tips

Always provide helpful, specific, and current information. When providing recommendations, include current details like hours, prices, and availability when possible. Cite your sources for factual information.`;

    if (tripContext) {
      systemPrompt += `\n\nCurrent Trip Context:`;
      systemPrompt += `\n- Destination: ${tripContext.location}`;
      
      if (typeof tripContext.dateRange === 'object') {
        systemPrompt += `\n- Travel Dates: ${tripContext.dateRange.start} to ${tripContext.dateRange.end}`;
      } else if (tripContext.dateRange) {
        systemPrompt += `\n- Travel Dates: ${tripContext.dateRange}`;
      }
      
      systemPrompt += `\n- Group Size: ${tripContext.participants?.length || 0} travelers`;
      
      if (tripContext.accommodation) {
        const accommodation = typeof tripContext.accommodation === 'object' 
          ? `${tripContext.accommodation.name} at ${tripContext.accommodation.address}`
          : tripContext.accommodation;
        systemPrompt += `\n- Accommodation: ${accommodation}`;
      }

      if (basecampLocation) {
        systemPrompt += `\n- Basecamp: ${basecampLocation.name} at ${basecampLocation.address}`;
      }

      if (tripContext.upcomingEvents?.length > 0) {
        systemPrompt += `\n- Upcoming Events: ${tripContext.upcomingEvents.map(e => `${e.title} on ${e.date}`).join(', ')}`;
      }

      if (preferences) {
        systemPrompt += `\n- Preferences: Consider the group's interests and preferences in your recommendations`;
      }
    }

    systemPrompt += `\n\nProvide personalized recommendations based on this context. Use web search to get the most current information about restaurants, attractions, events, and conditions. Always be helpful, friendly, and informative.`;

    return systemPrompt;
  }

  static async sendMessage(
    message: string,
    tripContext?: TripContext,
    basecampLocation?: { name: string; address: string },
    preferences?: any,
    chatHistory: Array<{ role: string; content: string }> = []
  ): Promise<PerplexityResponse> {
    const systemPrompt = this.buildSystemPrompt(tripContext, basecampLocation, preferences);

    try {
      const response = await PerplexityService.sendMessage(message, {
        tripContext,
        chatHistory,
        config: {
          systemPrompt,
          model: 'sonar-medium-online',
          temperature: 0.7,
          maxTokens: 2048
        }
      });

      return response;
    } catch (error) {
      console.error('Perplexity concierge error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get response from travel concierge'
      };
    }
  }
}
