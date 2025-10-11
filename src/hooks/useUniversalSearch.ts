import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface SearchResult {
  id: string;
  type: 'regular' | 'pro' | 'event';
  title: string;
  location: string;
  dateRange: string;
  status: 'active' | 'archived' | 'upcoming';
  participants: number;
  matchScore: number;
  deepLink: string;
}

export const useUniversalSearch = (query: string, filters: { status: string; type: string }) => {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const searchTrips = async () => {
      if (!query.trim() || query.length < 2) {
        setResults([]);
        return;
      }

      setIsLoading(true);
      
      try {
        const { data, error } = await supabase.functions.invoke('search', {
          body: {
            query: query.trim(),
            scope: 'global',
            limit: 50,
            tripType: filters.type !== 'all' ? filters.type : undefined
          }
        });

        if (error) throw error;

        if (data?.results) {
          const formattedResults: SearchResult[] = data.results.map((result: any) => {
            const tripType = result.deepLink?.includes('/tour/pro/') ? 'pro' 
              : result.deepLink?.includes('/event/') ? 'event' 
              : 'regular';
            
            const endDateStr = result.snippet?.match(/\(.*?-\s*(.*?)\)/)?.[1];
            const endDate = endDateStr ? new Date(endDateStr) : null;
            const status = endDate && endDate < new Date() ? 'archived' : 'upcoming';

            return {
              id: result.objectId || result.tripId,
              type: tripType,
              title: result.tripName || result.content,
              location: result.snippet?.split(' - ')[1]?.split(' (')[0] || 'Unknown',
              dateRange: result.snippet?.match(/\((.*?)\)/)?.[1] || '',
              status,
              participants: 0,
              matchScore: result.score || 0.5,
              deepLink: result.deepLink || `/trip/${result.tripId}`
            };
          });

          // Apply status filter
          const filtered = formattedResults.filter(result => {
            if (filters.status !== 'all' && result.status !== filters.status) return false;
            return true;
          });

          setResults(filtered);
        } else {
          setResults([]);
        }
      } catch (error) {
        console.error('Search error:', error);
        toast({
          title: "Search Error",
          description: "Unable to search trips. Please try again.",
          variant: "destructive"
        });
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    const debounceTimer = setTimeout(searchTrips, 300);
    return () => clearTimeout(debounceTimer);
  }, [query, filters, toast]);

  return { results, isLoading };
};
