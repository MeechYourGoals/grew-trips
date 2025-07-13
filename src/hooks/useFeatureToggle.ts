import { useMemo } from 'react';

export const DEFAULT_FEATURES = [
  'chat',
  'broadcasts', 
  'links',
  'polls',
  'todo',
  'calendar',
  'photos',
  'files',
  'concierge',
  'search'
] as const;

export type FeatureType = typeof DEFAULT_FEATURES[number];

interface FeatureConfig {
  enabled_features?: string[];
  trip_type?: 'consumer' | 'pro' | 'event';
}

export const useFeatureToggle = (config: FeatureConfig) => {
  return useMemo(() => {
    // Consumer trips always have all features enabled
    if (config.trip_type === 'consumer') {
      return {
        showChat: true,
        showBroadcasts: true,
        showLinks: true,
        showPolls: true,
        showTodo: true,
        showCalendar: true,
        showPhotos: true,
        showFiles: true,
        showConcierge: true,
        showSearch: true,
        isFeatureEnabled: () => true
      };
    }

    // For Pro/Event trips, check enabled_features array
    const enabledFeatures = config.enabled_features || DEFAULT_FEATURES;
    
    return {
      showChat: enabledFeatures.includes('chat'),
      showBroadcasts: enabledFeatures.includes('broadcasts'),
      showLinks: enabledFeatures.includes('links'),
      showPolls: enabledFeatures.includes('polls'),
      showTodo: enabledFeatures.includes('todo'),
      showCalendar: enabledFeatures.includes('calendar'),
      showPhotos: enabledFeatures.includes('photos'),
      showFiles: enabledFeatures.includes('files'),
      showConcierge: enabledFeatures.includes('concierge'),
      showSearch: enabledFeatures.includes('search'),
      isFeatureEnabled: (feature: FeatureType) => enabledFeatures.includes(feature)
    };
  }, [config.enabled_features, config.trip_type]);
};