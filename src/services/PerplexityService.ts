import { supabase } from "@/integrations/supabase/client";

export interface PerplexityResponse {
  success: boolean;
  response?: string;
  error?: string;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
  citations?: Array<{
    title: string;
    url: string;
    snippet: string;
  }>;
  sources?: Array<{
    title: string;
    url: string;
    snippet: string;
  }>;
  model?: string;
}

export interface HealthCheckResult {
  healthy: boolean;
  model?: string;
  latency?: number;
  error?: string;
}

export class PerplexityService {
  static async healthCheck(): Promise<HealthCheckResult> {
    const startTime = Date.now();
    
    try {
      const { data, error } = await supabase.functions.invoke('perplexity-chat', {
        body: {
          message: 'Hello, this is a health check.',
          config: {
            model: 'sonar',
            temperature: 0.1,
            maxTokens: 50
          }
        }
      });

      const latency = Date.now() - startTime;

      if (error) {
        console.error('Perplexity health check error:', error);
        return {
          healthy: false,
          error: error.message,
          latency
        };
      }

      if (data?.success) {
        return {
          healthy: true,
          model: data.model || 'sonar',
          latency
        };
      }

      return {
        healthy: false,
        error: data?.error || 'Unknown error',
        latency
      };
    } catch (error) {
      const latency = Date.now() - startTime;
      console.error('Perplexity health check failed:', error);
      
      return {
        healthy: false,
        error: error instanceof Error ? error.message : 'Network error',
        latency
      };
    }
  }

  static async sendMessage(
    message: string,
    options: {
      tripContext?: any;
      chatHistory?: Array<{ role: string; content: string }>;
      config?: {
        model?: string;
        temperature?: number;
        maxTokens?: number;
        systemPrompt?: string;
      };
      imageBase64?: string;
      analysisType?: 'chat' | 'sentiment' | 'review' | 'audio' | 'image';
    } = {}
  ): Promise<PerplexityResponse> {
    try {
      const { data, error } = await supabase.functions.invoke('perplexity-chat', {
        body: {
          message,
          tripContext: options.tripContext,
          chatHistory: options.chatHistory || [],
          config: {
            model: 'sonar',
            temperature: 0.7,
            maxTokens: 2048,
            ...options.config
          },
          imageBase64: options.imageBase64,
          analysisType: options.analysisType || 'chat'
        }
      });

      if (error) {
        console.error('Perplexity API error:', error);
        return {
          success: false,
          error: error.message || 'Failed to connect to Perplexity AI'
        };
      }

      if (data?.success) {
        return {
          success: true,
          response: data.response,
          usage: data.usage,
          citations: data.citations || data.sources || [],
          sources: data.sources || data.citations || [],
          model: data.model
        };
      }

      return {
        success: false,
        error: data?.error || 'Unknown error from Perplexity AI'
      };
    } catch (error) {
      console.error('Perplexity service error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error'
      };
    }
  }
}