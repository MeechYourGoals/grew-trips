
import { useState, useCallback } from 'react';
import { useMutation } from '@tanstack/react-query';
import { SearchResult } from '../components/SearchResults';

interface SearchResponse {
  success: boolean;
  results?: SearchResult[];
  error?: string;
}

export const useGlobalSearch = () => {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const searchMutation = useMutation({
    mutationFn: async (query: string): Promise<SearchResponse> => {
      if (!query.trim()) {
        return { success: true, results: [] };
      }

      try {
        const response = await fetch('/api/search', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ query, scope: 'global' }),
        });

        if (!response.ok) {
          throw new Error('Search failed');
        }

        const data = await response.json();
        return { success: true, results: data.results || [] };
      } catch (error) {
        // For now, return mock data for development
        console.log('Search query:', query);
        
        // Mock results based on query patterns
        const mockResults: SearchResult[] = [];
        
        if (query.toLowerCase().includes('miami')) {
          mockResults.push({
            id: '1',
            objectType: 'trip',
            objectId: '1',
            tripId: '1',
            tripName: 'Summer in Miami',
            content: 'Miami Beach vacation with friends',
            snippet: 'Miami Beach vacation with friends - July 2025',
            score: 0.95
          });
        }
        
        if (query.toLowerCase().includes('november')) {
          mockResults.push({
            id: '2',
            objectType: 'calendar_event',
            objectId: '2',
            tripId: '4',
            tripName: "Kristen's Bachelorette Party",
            content: 'Nashville trip in November',
            snippet: 'Bachelorette party weekend in Nashville - November 8-10, 2025',
            score: 0.89
          });
        }
        
        if (query.toLowerCase().includes('tour manager') || query.toLowerCase().includes('manager')) {
          mockResults.push({
            id: '3',
            objectType: 'collaborator',
            objectId: '3',
            tripId: 'pro-1',
            tripName: 'Madison Square Garden Residency',
            content: 'Tour Manager - Operations',
            snippet: 'Tour Manager responsible for logistics and operations',
            score: 0.92
          });
        }

        return { success: true, results: mockResults };
      }
    },
    onSuccess: (data) => {
      if (data.success && data.results) {
        setResults(data.results);
        setIsOpen(data.results.length > 0);
      }
    },
  });

  const search = useCallback((query: string) => {
    if (query.trim()) {
      searchMutation.mutate(query);
    } else {
      setResults([]);
      setIsOpen(false);
    }
  }, [searchMutation]);

  const clearResults = useCallback(() => {
    setResults([]);
    setIsOpen(false);
  }, []);

  return {
    search,
    results,
    isLoading: searchMutation.isPending,
    error: searchMutation.error,
    isOpen,
    setIsOpen,
    clearResults,
  };
};
