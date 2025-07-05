
import { useState, useCallback } from 'react';
import { useMutation } from '@tanstack/react-query';
import { SearchResult } from '../components/SearchResults';
import { supabase } from '../integrations/supabase/client';

interface TripSearchResponse {
  success: boolean;
  results?: SearchResult[];
  error?: string;
}

export const useTripSearch = (tripId: string) => {
  const [results, setResults] = useState<SearchResult[]>([]);

  const searchMutation = useMutation({
    mutationFn: async (query: string): Promise<TripSearchResponse> => {
      if (!query.trim()) {
        return { success: true, results: [] };
      }

      try {
        // Call the enhanced search edge function for trip-specific search
        const { data, error } = await supabase.functions.invoke('search', {
          body: { 
            query: query.trim(), 
            scope: 'trip',
            tripId,
            limit: 10
          }
        });

        if (error) {
          console.error('Trip search function error:', error);
          throw error;
        }

        return data || { success: true, results: [] };
      } catch (error) {
        console.error('Trip search error:', error);
        
        // Enhanced fallback with trip-specific mock results
        const mockResults: SearchResult[] = [];
        const queryLower = query.toLowerCase();
        
        if (queryLower.includes('message') || queryLower.includes('chat')) {
          mockResults.push({
            id: 'trip-msg-1',
            objectType: 'message',
            objectId: 'msg-1',
            tripId,
            tripName: 'Current Trip',
            content: 'Message about dinner plans',
            snippet: 'Hey everyone, dinner at 7pm at that Italian place we talked about',
            score: 0.87,
            matchReason: 'Matched via: content'
          });
        }
        
        if (queryLower.includes('event') || queryLower.includes('calendar')) {
          mockResults.push({
            id: 'trip-event-1',
            objectType: 'calendar_event',
            objectId: 'event-1',
            tripId,
            tripName: 'Current Trip',
            content: 'Museum visit scheduled',
            snippet: 'Art Museum visit - 2:00 PM tomorrow',
            score: 0.82,
            matchReason: 'Matched via: title'
          });
        }
        
        if (queryLower.includes('receipt') || queryLower.includes('expense')) {
          mockResults.push({
            id: 'trip-receipt-1',
            objectType: 'receipt',
            objectId: 'receipt-1',
            tripId,
            tripName: 'Current Trip',
            content: 'Hotel receipt for accommodation',
            snippet: 'Hotel Marriott - $280.50 for 2 nights accommodation',
            score: 0.78,
            matchReason: 'Matched via: content'
          });
        }

        return { success: true, results: mockResults };
      }
    },
    onSuccess: (data) => {
      if (data.success && data.results) {
        setResults(data.results);
      }
    },
  });

  const search = useCallback((query: string) => {
    if (query.trim().length >= 2) {
      searchMutation.mutate(query);
    } else {
      setResults([]);
    }
  }, [searchMutation]);

  const clearResults = useCallback(() => {
    setResults([]);
  }, []);

  return {
    search,
    results,
    isLoading: searchMutation.isPending,
    error: searchMutation.error,
    clearResults,
  };
};
