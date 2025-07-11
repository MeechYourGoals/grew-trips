
import { GeminiAPIConfig } from './types';
import { TripPreferences } from '../../types/consumer';

export class GeminiService {
  buildContextPrompt(userMessage: string, basecamp?: { name: string; address: string }, preferences?: TripPreferences): string {
    let contextInfo = `You are Triv Concierge, a helpful travel assistant. The user is planning a trip and needs recommendations.`;
    
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

  async callAPI(message: string, config: GeminiAPIConfig, tripContext?: any): Promise<string> {
    // Call the Supabase Edge Function instead of direct Gemini API
    const response = await fetch('/api/gemini-chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        config,
        tripContext
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`API Error: ${response.status} - ${errorData.error || 'Unknown error'}`);
    }

    const data = await response.json();
    return data.response;
  }
}
