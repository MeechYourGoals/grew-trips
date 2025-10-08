// AI & ML Types

export interface AiQuery {
  id: string;
  tripId: string;
  userId: string;
  query: string;
  response: string;
  sources: AiSource[];
  confidence: number;
  timestamp: string;
  feedback?: 'positive' | 'negative';
  metadata?: Record<string, unknown>;
}

export interface AiSource {
  type: 'message' | 'file' | 'link' | 'event' | 'photo';
  id: string;
  title: string;
  excerpt: string;
  relevance: number;
  url?: string;
}

export interface AiSuggestion {
  id: string;
  type: 'activity' | 'restaurant' | 'accommodation' | 'timing' | 'route';
  title: string;
  description: string;
  confidence: number;
  reasoning: string;
  actionable: boolean;
  action?: {
    type: 'add_to_itinerary' | 'create_event' | 'send_message';
    data: Record<string, unknown>;
  };
}

export interface AiContextWindow {
  tripData: boolean;
  messages: boolean;
  files: boolean;
  photos: boolean;
  links: boolean;
  calendar: boolean;
  preferences: boolean;
  location: boolean;
  weather: boolean;
}

export interface AiCapability {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  requiresPro: boolean;
  category: 'planning' | 'communication' | 'analysis' | 'automation';
}

export interface AiFeatureConfig {
  icon: React.ComponentType;
  title: string;
  description: string;
  route: string;
}

export type AiFeatureType = 'reviews' | 'suggestions' | 'planning' | 'analysis';
export type PlanType = 'plus' | 'premium';

export interface AiAnalytics {
  totalQueries: number;
  avgResponseTime: number;
  successRate: number;
  topQueries: string[];
  userSatisfaction: number;
}
