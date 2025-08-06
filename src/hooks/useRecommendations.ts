import { useMemo } from 'react';
import { getRecommendationsByType, Recommendation } from '../data/recommendations';

export const useRecommendations = (activeFilter: string = 'all') => {
  const recommendations = useMemo(() => {
    return getRecommendationsByType(activeFilter);
  }, [activeFilter]);

  const filteredRecommendations = useMemo(() => {
    // Ensure we always show promoted/sponsored content only
    return recommendations.filter(rec => rec.isSponsored);
  }, [recommendations]);

  return {
    recommendations: filteredRecommendations,
    hasRecommendations: filteredRecommendations.length > 0
  };
};