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
- Context-aware suggestions based on your trip data

Always provide helpful, specific, and current information. When providing recommendations, include current details like hours, prices, and availability when possible. Cite your sources for factual information.`;

    if (tripContext) {
      systemPrompt += `\n\n=== TRIP CONTEXT ===`;
      systemPrompt += `\nDestination: ${tripContext.location}`;
      
      if (typeof tripContext.dateRange === 'object') {
        systemPrompt += `\nTravel Dates: ${tripContext.dateRange.start} to ${tripContext.dateRange.end}`;
      } else if (tripContext.dateRange) {
        systemPrompt += `\nTravel Dates: ${tripContext.dateRange}`;
      }
      
      systemPrompt += `\nGroup Size: ${tripContext.participants?.length || 0} travelers`;
      systemPrompt += `\nParticipants: ${tripContext.participants?.map(p => p.name).join(', ') || 'Not specified'}`;
      
      if (tripContext.accommodation) {
        const accommodation = typeof tripContext.accommodation === 'object' 
          ? `${tripContext.accommodation.name} at ${tripContext.accommodation.address}`
          : tripContext.accommodation;
        systemPrompt += `\nAccommodation: ${accommodation}`;
      }

      if (basecampLocation) {
        systemPrompt += `\nCurrent Basecamp: ${basecampLocation.name} at ${basecampLocation.address}`;
        if (tripContext.basecamp?.coordinates) {
          systemPrompt += ` (${tripContext.basecamp.coordinates.lat}, ${tripContext.basecamp.coordinates.lng})`;
        }
      }

      // Enhanced context sections
      if (tripContext.preferences) {
        systemPrompt += `\n\n=== GROUP PREFERENCES ===`;
        const prefs = tripContext.preferences;
        if (prefs.dietary?.length) systemPrompt += `\nDietary: ${prefs.dietary.join(', ')}`;
        if (prefs.vibe?.length) systemPrompt += `\nVibes: ${prefs.vibe.join(', ')}`;
        if (prefs.entertainment?.length) systemPrompt += `\nEntertainment: ${prefs.entertainment.join(', ')}`;
        if (prefs.lifestyle?.length) systemPrompt += `\nLifestyle: ${prefs.lifestyle.join(', ')}`;
        if (prefs.budgetMin && prefs.budgetMax) {
          systemPrompt += `\nBudget Range: $${prefs.budgetMin} - $${prefs.budgetMax} per person`;
        }
        systemPrompt += `\nTime Preference: ${prefs.timePreference || 'flexible'}`;
      }

      if (tripContext.visitedPlaces?.length) {
        systemPrompt += `\n\n=== ALREADY VISITED ===`;
        systemPrompt += `\nPlaces: ${tripContext.visitedPlaces.join(', ')}`;
        systemPrompt += `\nNote: Avoid recommending these places unless specifically asked.`;
      }

      if (tripContext.spendingPatterns) {
        systemPrompt += `\n\n=== SPENDING PATTERNS ===`;
        systemPrompt += `\nTotal Spent: $${tripContext.spendingPatterns.totalSpent.toFixed(2)}`;
        systemPrompt += `\nAverage per Person: $${tripContext.spendingPatterns.avgPerPerson.toFixed(2)}`;
        const categories = Object.entries(tripContext.spendingPatterns.categories)
          .map(([cat, amount]) => `${cat}: $${amount}`)
          .join(', ');
        if (categories) systemPrompt += `\nBy Category: ${categories}`;
      }

      if (tripContext.groupDynamics) {
        systemPrompt += `\n\n=== GROUP DYNAMICS ===`;
        systemPrompt += `\nMost Active: ${tripContext.groupDynamics.mostActiveParticipants.join(', ')}`;
        systemPrompt += `\nConsensus Level: ${tripContext.groupDynamics.consensusLevel}`;
        if (tripContext.groupDynamics.recentDecisions.length) {
          systemPrompt += `\nRecent Decisions: ${tripContext.groupDynamics.recentDecisions.join('; ')}`;
        }
      }

      if (tripContext.links?.length) {
        systemPrompt += `\n\n=== SHARED LINKS & IDEAS ===`;
        tripContext.links.forEach(link => {
          systemPrompt += `\n- ${link.title} (${link.category}, ${link.votes} votes): ${link.description}`;
        });
      }

      if (tripContext.polls?.length) {
        systemPrompt += `\n\n=== ACTIVE POLLS & DECISIONS ===`;
        tripContext.polls.forEach(poll => {
          if (poll.status === 'active') {
            const topOption = poll.options.reduce((max, opt) => opt.votes > max.votes ? opt : max);
            systemPrompt += `\n- ${poll.question}: Leading option is "${topOption.text}" (${topOption.votes}/${poll.totalVotes} votes)`;
          }
        });
      }

      if (tripContext.files?.length) {
        systemPrompt += `\n\n=== UPLOADED FILES & CONTENT ===`;
        tripContext.files.forEach(file => {
          if (file.aiSummary) {
            systemPrompt += `\n- ${file.name}: ${file.aiSummary}`;
          }
          if (file.extractedEvents) {
            systemPrompt += ` (${file.extractedEvents} events extracted)`;
          }
        });
      }

      if (tripContext.chatHistory?.length) {
        systemPrompt += `\n\n=== RECENT GROUP CHAT SENTIMENT ===`;
        const recentMessages = tripContext.chatHistory.slice(-5);
        const positiveCount = recentMessages.filter(m => m.sentiment === 'positive').length;
        const mood = positiveCount >= 3 ? 'Very positive' : positiveCount >= 2 ? 'Positive' : 'Mixed';
        systemPrompt += `\nGroup Mood: ${mood}`;
        systemPrompt += `\nRecent Topics: ${recentMessages.map(m => `"${m.content}"`).join('; ')}`;
      }

      if (tripContext.upcomingEvents?.length > 0) {
        systemPrompt += `\n\n=== UPCOMING SCHEDULE ===`;
        tripContext.upcomingEvents.forEach(event => {
          systemPrompt += `\n- ${event.title} on ${event.date}`;
          if (event.time) systemPrompt += ` at ${event.time}`;
          if (event.location) systemPrompt += ` (${event.location})`;
        });
      }

      if (tripContext.confirmationNumbers) {
        systemPrompt += `\n\n=== CONFIRMATIONS ===`;
        Object.entries(tripContext.confirmationNumbers).forEach(([type, number]) => {
          systemPrompt += `\n${type.replace('_', ' ')}: ${number}`;
        });
      }

      if (tripContext.weatherContext) {
        systemPrompt += `\n\n=== WEATHER CONTEXT ===`;
        systemPrompt += `\nCurrent: ${tripContext.weatherContext.current}`;
        if (tripContext.weatherContext.forecast?.length) {
          systemPrompt += `\nForecast: ${tripContext.weatherContext.forecast.join(', ')}`;
        }
      }
    }

    systemPrompt += `\n\n=== INSTRUCTIONS ===`;
    systemPrompt += `\nProvide personalized recommendations based on ALL the context above. Use web search to get the most current information about restaurants, attractions, events, and conditions.`;
    systemPrompt += `\nKey guidelines:`;
    systemPrompt += `\n- Consider group preferences, budget, and past decisions`;
    systemPrompt += `\n- Avoid suggesting places they've already visited unless asked`;
    systemPrompt += `\n- Factor in current location/basecamp for proximity`;
    systemPrompt += `\n- Reference their shared content when relevant`;
    systemPrompt += `\n- Match recommendations to group mood and consensus level`;
    systemPrompt += `\n- Always provide specific, actionable suggestions with current details`;
    systemPrompt += `\n- Cite your sources for factual information`;

    return systemPrompt;
  }

  static async sendMessage(
    message: string,
    tripContext?: TripContext,
    basecampLocation?: { name: string; address: string },
    preferences?: any,
    chatHistory: Array<{ role: string; content: string }> = [],
    isDemoMode: boolean = false
  ): Promise<PerplexityResponse> {
    const systemPrompt = this.buildSystemPrompt(tripContext, basecampLocation, preferences);

    try {
      // Route to Lovable AI for demo mode, Perplexity for production
      if (isDemoMode) {
        return await this.sendToLovableAI(message, tripContext, systemPrompt, chatHistory);
      }

      const response = await PerplexityService.sendMessage(message, {
        tripContext,
        chatHistory,
        config: {
          systemPrompt,
          model: 'sonar',
          temperature: 0.7,
          maxTokens: 2048
        }
      });

      return response;
    } catch (error) {
      console.error('Concierge error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get response from travel concierge'
      };
    }
  }

  private static async sendToLovableAI(
    message: string,
    tripContext: TripContext | undefined,
    systemPrompt: string,
    chatHistory: Array<{ role: string; content: string }>
  ): Promise<PerplexityResponse> {
    const { supabase } = await import('@/integrations/supabase/client');
    
    try {
      const { data, error } = await supabase.functions.invoke('lovable-concierge', {
        body: {
          message,
          tripContext,
          chatHistory,
          config: {
            systemPrompt,
            model: 'google/gemini-2.5-flash',
            temperature: 0.7,
            maxTokens: 2048
          }
        }
      });

      if (error) throw error;

      return {
        success: data.success,
        response: data.response,
        usage: data.usage,
        sources: data.sources || [],
        error: data.error
      };
    } catch (error) {
      console.error('Lovable AI error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to connect to AI service'
      };
    }
  }
}
