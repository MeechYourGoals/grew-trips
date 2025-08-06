
import { useMemo, useEffect, useState } from 'react';
import { getRecommendationsByType, Recommendation } from '../data/recommendations';
import { supabase } from '@/integrations/supabase/client';

export const useRecommendations = (activeFilter: string = 'all') => {
  const [adCards, setAdCards] = useState<Recommendation[]>([]);
  
  const staticRecommendations = useMemo(() => {
    return getRecommendationsByType(activeFilter);
  }, [activeFilter]);

  useEffect(() => {
    fetchApprovedAdCards();
  }, [activeFilter]);

  const fetchApprovedAdCards = async () => {
    try {
      const { data, error } = await supabase
        .from('ad_cards')
        .select('*')
        .eq('moderation_status', 'approved');

      if (error) {
        console.error('Error fetching ad cards:', error);
        return;
      }

      // Convert ad cards to recommendation format
      const convertedCards: Recommendation[] = data.map((card, index) => ({
        id: 9000 + index, // Use high ID to avoid conflicts
        type: card.category as 'hotel' | 'restaurant' | 'activity' | 'tour' | 'experience' | 'transportation',
        title: card.title,
        location: card.location_city || 'Multiple Locations',
        city: card.location_city || '',
        coordinates: card.location_coordinates && typeof card.location_coordinates === 'object' 
          ? card.location_coordinates as { lat: number; lng: number }
          : undefined,
        description: card.description,
        rating: 4.5, // Default rating for ads
        priceLevel: 2 as 1 | 2 | 3 | 4, // Default price level
        images: [card.image_url],
        tags: card.tags || [],
        isSponsored: true,
        sponsorBadge: card.sponsor_badge || 'Promoted',
        ctaButton: {
          text: card.cta_text || 'Learn More',
          action: 'view' as 'book' | 'reserve' | 'view' | 'save'
        },
        externalLink: card.external_link,
        isAvailable: true
      }));

      // Filter by category if needed
      const filtered = activeFilter === 'all' 
        ? convertedCards 
        : convertedCards.filter(card => card.type === activeFilter);

      setAdCards(filtered);
    } catch (error) {
      console.error('Error in fetchApprovedAdCards:', error);
    }
  };

  const filteredRecommendations = useMemo(() => {
    // Combine static sponsored recommendations with dynamic ad cards
    const staticSponsored = staticRecommendations.filter(rec => rec.isSponsored);
    
    // Merge and shuffle to distribute ad cards throughout
    const combined = [...staticSponsored, ...adCards];
    
    return combined;
  }, [staticRecommendations, adCards]);

  return {
    recommendations: filteredRecommendations,
    hasRecommendations: filteredRecommendations.length > 0
  };
};
