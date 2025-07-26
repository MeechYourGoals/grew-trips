import { VertexAIService } from './vertexAIService';

export interface OpenAIReviewResult {
  text: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  score: number;
  platforms: string[];
}

export interface OpenAIAudioResult {
  summary: string;
  audioUrl: string;
  duration: number;
  fileKey?: string;
}

export interface OpenAIOptions {
  tone?: 'friendly' | 'professional' | 'funny' | 'urgent' | 'direct' | 'cheerful';
  maxTokens?: number;
}

export class OpenAIService {
  static async analyzeReviews(url: string): Promise<OpenAIReviewResult> {
    return await VertexAIService.analyzeReviews(url);
  }

  static async generateAudioSummary(url: string, userId: string, tripId?: string): Promise<OpenAIAudioResult> {
    return await VertexAIService.generateAudioSummary(url, userId, tripId);
  }

  static async queryOpenAI(prompt: string, options: OpenAIOptions = {}): Promise<string> {
    return await VertexAIService.generateMessageWithTone(prompt, options.tone);
  }

  static async classifyPriority(text: string): Promise<'urgent' | 'reminder' | 'fyi'> {
    return await VertexAIService.classifyPriority(text);
  }
}