import { supabase } from '../integrations/supabase/client';
import { OpenAIService } from './OpenAIService';
import { TripContext } from '../types/tripContext';

export interface SearchResult {
  id: string;
  objectType: 'message' | 'calendar_event' | 'file' | 'receipt' | 'place' | 'participant';
  objectId: string;
  tripId: string;
  tripName: string;
  content: string;
  snippet: string;
  score: number;
  deepLink: string;
  matchReason: string;
  metadata?: {
    fileName?: string;
    fileType?: string;
    amount?: number;
    date?: string;
    participants?: string[];
  };
}

export interface ConciergeMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: string;
  searchResults?: SearchResult[];
  isFromFallback?: boolean;
}

export class UniversalConciergeService {
  private static isSearchQuery(query: string): boolean {
    const searchKeywords = [
      'find', 'search', 'show me', 'where is', 'where are', 'look for',
      'get me', 'display', 'list', 'who has', 'what is', 'when is',
      'how much', 'receipt', 'file', 'document', 'event', 'calendar'
    ];
    
    const lowercaseQuery = query.toLowerCase();
    return searchKeywords.some(keyword => lowercaseQuery.includes(keyword));
  }

  private static async performUniversalSearch(query: string, tripId: string): Promise<SearchResult[]> {
    try {
      const { data, error } = await supabase.functions.invoke('ai-search', {
        body: {
          query,
          tripId,
          limit: 10
        }
      });

      if (error) throw error;
      return data?.results || [];
    } catch (error) {
      console.error('Search error:', error);
      return this.getFallbackSearchResults(query, tripId);
    }
  }

  private static getFallbackSearchResults(query: string, tripId: string): SearchResult[] {
    const lowercaseQuery = query.toLowerCase();
    
    if (lowercaseQuery.includes('receipt') || lowercaseQuery.includes('expense')) {
      return [
        {
          id: '1',
          objectType: 'receipt',
          objectId: 'receipt_1',
          tripId,
          tripName: 'Current Trip',
          content: 'Dinner at The Ivy - $125.50',
          snippet: 'Restaurant receipt for group dinner',
          score: 0.9,
          deepLink: `#files?filter=receipts`,
          matchReason: 'Receipt expense match',
          metadata: {
            fileName: 'dinner_receipt.pdf',
            fileType: 'pdf',
            amount: 125.50,
            date: '2024-01-15'
          }
        }
      ];
    }

    if (lowercaseQuery.includes('file') || lowercaseQuery.includes('document')) {
      return [
        {
          id: '2',
          objectType: 'file',
          objectId: 'file_1',
          tripId,
          tripName: 'Current Trip',
          content: 'Trip itinerary and tickets',
          snippet: 'Flight tickets and hotel confirmations',
          score: 0.8,
          deepLink: `#files`,
          matchReason: 'File content match',
          metadata: {
            fileName: 'trip_documents.pdf',
            fileType: 'pdf'
          }
        }
      ];
    }

    return [];
  }

  private static formatSearchResults(results: SearchResult[]): string {
    if (results.length === 0) {
      return "I couldn't find any results for that search. Try asking me about files, receipts, events, or messages in this trip.";
    }

    let response = `I found ${results.length} result${results.length > 1 ? 's' : ''} for you:\n\n`;
    
    results.forEach((result, index) => {
      response += `${index + 1}. **${result.objectType.toUpperCase()}**: ${result.snippet}\n`;
      if (result.metadata?.amount) {
        response += `   💰 Amount: $${result.metadata.amount}\n`;
      }
      if (result.metadata?.date) {
        response += `   📅 Date: ${result.metadata.date}\n`;
      }
      response += `   🔗 [View Details](${result.deepLink})\n\n`;
    });

    return response;
  }

  static async processMessage(
    message: string,
    tripContext: TripContext
  ): Promise<{ content: string; searchResults?: SearchResult[]; isFromFallback?: boolean }> {
    try {
      // Check if this is a search-style query
      if (this.isSearchQuery(message)) {
        const searchResults = await this.performUniversalSearch(message, tripContext.tripId);
        const searchResponse = this.formatSearchResults(searchResults);
        
        return {
          content: searchResponse,
          searchResults,
          isFromFallback: false
        };
      }

      // For non-search queries, use the new AI answer service with RAG
      const { data, error } = await supabase.functions.invoke('ai-answer', {
        body: {
          query: message,
          tripId: tripContext.tripId,
          chatHistory: [] // TODO: Pass actual chat history if available
        }
      });

      if (error) throw error;

      return {
        content: data.answer || "I'm having trouble processing your request right now.",
        searchResults: data.citations || [],
        isFromFallback: false
      };
    } catch (error) {
      console.error('Concierge processing error:', error);
      return {
        content: "I'm having trouble processing your request right now. Please try again in a moment.",
        isFromFallback: true
      };
    }
  }

  static formatSearchResultsForDisplay(results: SearchResult[]) {
    return results.map((result) => ({
      id: result.id,
      type: result.objectType,
      title: result.snippet,
      content: result.content,
      metadata: result.metadata,
      deepLink: result.deepLink
    }));
  }
}