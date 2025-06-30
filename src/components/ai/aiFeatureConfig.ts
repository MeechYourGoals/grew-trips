
import { Globe, Volume2 } from 'lucide-react';
import { AiFeatureConfig, AiFeatureType } from './types';

export const aiFeatureConfig: Record<AiFeatureType, AiFeatureConfig> = {
  reviews: {
    icon: Globe,
    title: 'Universal Review Summaries',
    description: 'Get AI summaries from Yelp, TripAdvisor, OpenTable, Instagram, TikTok, Facebook, and more',
    route: '/ai/review-analysis'
  },
  audio: {
    icon: Volume2,
    title: 'Audio Overviews',
    description: 'Generate AI-powered audio summaries using Google Notebook LM',
    route: '/ai/audio-overviews'
  }
};
