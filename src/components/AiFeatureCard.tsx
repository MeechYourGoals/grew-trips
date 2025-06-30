
import React from 'react';
import { Globe, Volume2, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTripVariant } from '../contexts/TripVariantContext';

interface AiFeatureCardProps {
  feature: 'reviews' | 'audio';
  planRequired: 'plus' | 'premium';
}

export const AiFeatureCard = ({ feature, planRequired }: AiFeatureCardProps) => {
  const { accentColors } = useTripVariant();
  const navigate = useNavigate();

  const handleClick = () => {
    if (feature === 'reviews') {
      navigate('/ai/review-analysis');
    } else {
      navigate('/ai/audio-overviews');
    }
  };

  const config = {
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

  const currentConfig = config[feature];
  const Icon = currentConfig.icon;

  return (
    <div 
      onClick={handleClick}
      className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 shadow-xl hover:bg-white/15 transition-all duration-300 cursor-pointer group"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className={`w-10 h-10 bg-gradient-to-r from-${accentColors.primary}/30 to-${accentColors.secondary}/30 backdrop-blur-sm rounded-xl flex items-center justify-center`}>
          <Icon size={24} className={`text-${accentColors.primary}`} />
        </div>
        <h2 className="text-xl font-semibold text-white">{currentConfig.title}</h2>
        <span className={`bg-gradient-to-r from-${accentColors.primary}/20 to-${accentColors.secondary}/20 backdrop-blur-sm border border-white/20 text-white text-xs font-medium px-3 py-1 rounded-full`}>
          Avail to Plus/Pro Subscribers
        </span>
      </div>

      {/* Description */}
      <div className="space-y-6">
        <div className="mb-8">
          <p className="text-white/90 leading-relaxed mb-6">
            {currentConfig.description}
          </p>
        </div>

        {/* Call to Action */}
        <div className="flex items-center justify-between">
          <div className="text-sm text-white/70">
            Click to open full interface
          </div>
          <div className="flex items-center gap-2 text-yellow-500 group-hover:translate-x-1 transition-transform">
            <span className="font-medium">Open Tool</span>
            <ArrowRight size={16} />
          </div>
        </div>
      </div>
    </div>
  );
};
