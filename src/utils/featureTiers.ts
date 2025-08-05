// Feature tier indicators for premium features
export interface FeatureTier {
  emoji: string;
  label: string;
  description: string;
}

export const FEATURE_TIERS: Record<string, FeatureTier> = {
  plus: {
    emoji: '💎',
    label: 'Plus/Pro',
    description: 'Available with Travel Plus Pro subscription'
  },
  enterprise: {
    emoji: '🚀',
    label: 'Enterprise',
    description: 'Available with Enterprise subscription'
  },
  events: {
    emoji: '🌟',
    label: 'Events',
    description: 'Available with Events subscription'
  }
};

// Feature tier mappings for different settings
export const CONSUMER_FEATURE_TIERS: Record<string, string> = {
  'billing': 'plus',
  'travel-wallet': 'plus',
  'calendar-sync': 'plus',
  'connected-accounts': 'plus'
};

export const ENTERPRISE_FEATURE_TIERS: Record<string, string> = {
  'seats': 'enterprise',
  'travel-wallet': 'enterprise',
  'game-schedule': 'enterprise',
  'show-schedule': 'enterprise',
  'scouting': 'enterprise',
  'notifications': 'enterprise'
};

export const EVENTS_FEATURE_TIERS: Record<string, string> = {
  'ticketing': 'events',
  'live-engagement': 'events',
  'networking': 'events',
  'analytics': 'events',
  'exhibitors': 'events'
};

export const getFeatureTierEmoji = (featureId: string, settingsType: 'consumer' | 'enterprise' | 'events'): string => {
  let tierKey: string | undefined;
  
  switch (settingsType) {
    case 'consumer':
      tierKey = CONSUMER_FEATURE_TIERS[featureId];
      break;
    case 'enterprise':
      tierKey = ENTERPRISE_FEATURE_TIERS[featureId];
      break;
    case 'events':
      tierKey = EVENTS_FEATURE_TIERS[featureId];
      break;
  }
  
  return tierKey ? FEATURE_TIERS[tierKey].emoji : '';
};

export const getTierLegend = (): FeatureTier[] => {
  return Object.values(FEATURE_TIERS);
};