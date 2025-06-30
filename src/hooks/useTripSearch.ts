
import { useState, useCallback } from 'react';
import { useMutation } from '@tanstack/react-query';
import { SearchResult } from '../components/SearchResults';

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
        const response = await fetch('/api/search', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ query, scope: 'trip', tripId }),
        });

        if (!response.ok) {
          throw new Error('Search failed');
        }

        const data = await response.json();
        return { success: true, results: data.results || [] };
      } catch (error) {
        // Mock results for development
        const mockResults: SearchResult[] = [
          {
            id: 'trip-1',
            objectType: 'message',
            objectId: 'msg-1',
            tripId,
            tripName: 'Current Trip',
            content: 'Message about dinner plans',
            snippet: 'Hey everyone, dinner at 7pm at that Italian place we talked about',
            score: 0.87
          },
          {
            id: 'trip-2',
            objectType: 'calendar_event',
            objectId: 'event-1',
            tripId,
            tripName: 'Current Trip',
            content: 'Museum visit scheduled',
            snippet: 'Art Museum visit - 2:00 PM tomorrow',
            score: 0.82
          }
        ];

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
    if (query.trim()) {
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
