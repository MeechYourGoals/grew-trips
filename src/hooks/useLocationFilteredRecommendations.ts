
import { useMemo } from 'react';
import { getRecommendationsByType, Recommendation } from '../data/recommendations';
import { useBasecamp } from '../contexts/BasecampContext';

export const useLocationFilteredRecommendations = (
  activeFilter: string = 'all',
  manualLocation?: string
) => {
  const { basecamp } = useBasecamp();

  const recommendations = useMemo(() => {
    return getRecommendationsByType(activeFilter);
  }, [activeFilter]);

  const filteredRecommendations = useMemo(() => {
    let filtered = recommendations.filter(rec => rec.isSponsored);

    // Determine which location to filter by
    const filterLocation = manualLocation || (basecamp ? extractCityFromAddress(basecamp.address) : '');

    // If we have a location filter, apply it
    if (filterLocation) {
      filtered = filtered.filter(rec => 
        rec.city.toLowerCase().includes(filterLocation.toLowerCase()) ||
        rec.location.toLowerCase().includes(filterLocation.toLowerCase())
      );
    }

    return filtered;
  }, [recommendations, manualLocation, basecamp]);

  const extractCityFromAddress = (address: string) => {
    const parts = address.split(',');
    return parts[parts.length - 2]?.trim() || address;
  };

  const activeLocation = manualLocation || (basecamp ? extractCityFromAddress(basecamp.address) : '');
  const isBasecampLocation = !manualLocation && !!basecamp;

  return {
    recommendations: filteredRecommendations,
    hasRecommendations: filteredRecommendations.length > 0,
    activeLocation,
    isBasecampLocation
  };
};
