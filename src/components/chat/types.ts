
export interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface GeminiAPIConfig {
  temperature: number;
  topK: number;
  topP: number;
  maxOutputTokens: number;
}
