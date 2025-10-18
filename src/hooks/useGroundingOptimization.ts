import { useMemo } from 'react';

/**
 * Smart grounding optimization hook
 * Detects location-related queries to minimize API costs
 */
export const useGroundingOptimization = () => {
  const detectLocationQuery = (message: string): boolean => {
    const locationKeywords = [
      'where', 'restaurant', 'hotel', 'cafe', 'bar', 'attraction',
      'place', 'location', 'near', 'around', 'close', 'best',
      'find', 'suggest', 'recommend', 'visit', 'see', 'go',
      'directions', 'route', 'address', 'map', 'distance',
      'food', 'eat', 'drink', 'stay', 'shop', 'buy',
      'activity', 'things to do', 'what to', 'sushi', 'pizza',
      'beach', 'museum', 'park', 'club', 'nightlife'
    ];

    const lowercaseMessage = message.toLowerCase();
    return locationKeywords.some(keyword => 
      lowercaseMessage.includes(keyword)
    );
  };

  const shouldEnableGrounding = (
    message: string,
    hasLocationContext: boolean
  ): boolean => {
    // Only enable grounding if:
    // 1. Query mentions location-related terms
    // 2. We have basecamp coordinates for accurate grounding
    return detectLocationQuery(message) && hasLocationContext;
  };

  return {
    detectLocationQuery,
    shouldEnableGrounding
  };
};
