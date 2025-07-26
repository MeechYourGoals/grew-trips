import { VertexAIService } from './vertexAIService';
import { TripContext, TripContextService } from './tripContextService';

export interface VoiceQuery {
  text: string;
  category: 'schedule' | 'accommodation' | 'logistics' | 'participants' | 'general';
  confidence: number;
}

export class VoiceAssistantService {
  static async processVoiceQuery(
    query: string, 
    tripId: string, 
    isProTrip = false
  ): Promise<string> {
    try {
      // Get trip context
      const context = await TripContextService.getTripContext(tripId, isProTrip);
      
      // Classify the query
      const classification = this.classifyQuery(query);
      
      // Generate contextual response
      const response = await this.generateResponse(query, context, classification);
      
      return response;
    } catch (error) {
      console.error('Voice assistant error:', error);
      return "I'm sorry, I couldn't process your request right now. Please try again or check the trip details manually.";
    }
  }

  private static classifyQuery(query: string): VoiceQuery {
    const lowerQuery = query.toLowerCase();
    
    // Schedule/Calendar queries
    if (lowerQuery.includes('agenda') || lowerQuery.includes('schedule') || 
        lowerQuery.includes('today') || lowerQuery.includes('tomorrow') ||
        lowerQuery.includes('time') || lowerQuery.includes('when')) {
      return { text: query, category: 'schedule', confidence: 0.9 };
    }
    
    // Accommodation queries  
    if (lowerQuery.includes('hotel') || lowerQuery.includes('staying') ||
        lowerQuery.includes('accommodation') || lowerQuery.includes('room')) {
      return { text: query, category: 'accommodation', confidence: 0.9 };
    }
    
    // Logistics queries
    if (lowerQuery.includes('confirmation') || lowerQuery.includes('rental') ||
        lowerQuery.includes('flight') || lowerQuery.includes('car') ||
        lowerQuery.includes('transport') || lowerQuery.includes('number')) {
      return { text: query, category: 'logistics', confidence: 0.9 };
    }
    
    // Participant queries
    if (lowerQuery.includes('who') || lowerQuery.includes('participants') ||
        lowerQuery.includes('attendees') || lowerQuery.includes('going')) {
      return { text: query, category: 'participants', confidence: 0.8 };
    }
    
    return { text: query, category: 'general', confidence: 0.5 };
  }

  private static async generateResponse(
    query: string, 
    context: TripContext, 
    classification: VoiceQuery
  ): Promise<string> {
    const contextPrompt = TripContextService.formatContextForAI(context);
    
    const systemPrompt = `You are Concierge, your helpful travel assistant for "${context.title}". 
    
    Provide concise, natural responses to user questions about their trip. Keep responses under 100 words and focus on the most relevant information.
    
    For schedule questions: Focus on today's events and next upcoming activities.
    For logistics questions: Provide specific confirmation numbers and details.
    For accommodation questions: Give the hotel/accommodation name and relevant details.
    For participant questions: List the key people involved.
    
    Use a friendly, conversational tone as if you're a knowledgeable travel companion.
    
    Current trip context:
    ${contextPrompt}`;

    try {
      const response = await VertexAIService.generateMessageWithTone(
        `User question: "${query}"
        
        Please provide a helpful, concise answer based on the trip context provided.`,
        'friendly'
      );
      
      return response || "I don't have specific information about that. You might want to check the trip details or ask the group.";
    } catch (error) {
      console.error('OpenAI response error:', error);
      return this.getFallbackResponse(classification, context);
    }
  }

  private static getFallbackResponse(classification: VoiceQuery, context: TripContext): string {
    switch (classification.category) {
      case 'schedule':
        const nextEvent = context.upcomingEvents[0];
        return nextEvent 
          ? `Your next event is ${nextEvent.title} at ${nextEvent.time} at ${nextEvent.location}.`
          : "I don't see any upcoming events in your schedule right now.";
          
      case 'accommodation':
        return context.accommodation 
          ? `You're staying at ${context.accommodation}.`
          : "I don't have accommodation information available right now.";
          
      case 'logistics':
        const confirmations = Object.entries(context.confirmationNumbers)
          .map(([type, number]) => `${type.replace('_', ' ')}: ${number}`)
          .join(', ');
        return confirmations 
          ? `Here are your confirmation numbers: ${confirmations}`
          : "I don't have confirmation numbers available right now.";
          
      case 'participants':
        return `The participants on this trip are: ${context.participants.join(', ')}.`;
        
      default:
        return "I can help you with information about your schedule, accommodation, logistics, and participants. What would you like to know?";
    }
  }
}