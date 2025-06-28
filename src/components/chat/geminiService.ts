
import { GeminiAPIConfig } from './types';
import { TripPreferences } from '../../types/consumer';

export class GeminiService {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  buildContextPrompt(userMessage: string, basecamp?: { name: string; address: string }, preferences?: TripPreferences): string {
    let contextInfo = `You are a helpful travel assistant. The user is planning a trip and needs recommendations.`;
    
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
      contextInfo += `\nBudget range: ${preferences.budget}`;
      contextInfo += `\nTime preference: ${preferences.timePreference}`;
    }
    
    contextInfo += `\n\nPlease provide helpful, specific recommendations based on this context. Focus on practical advice and real places/activities near their basecamp location.`;
    contextInfo += `\n\nUser question: ${userMessage}`;
    
    return contextInfo;
  }

  async callAPI(message: string, config: GeminiAPIConfig): Promise<string> {
    if (!this.apiKey.trim()) {
      throw new Error('Please enter your Google Gemini API key first');
    }

    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=' + this.apiKey, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: message
          }]
        }],
        generationConfig: config
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`API Error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    
    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
      throw new Error('Invalid response format from Gemini API');
    }
    
    return data.candidates[0].content.parts[0].text;
  }
}
