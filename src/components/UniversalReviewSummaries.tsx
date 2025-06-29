
import React from 'react';
import { Globe } from 'lucide-react';
import { useTripVariant } from '../contexts/TripVariantContext';

export const UniversalReviewSummaries = () => {
  const { accentColors } = useTripVariant();
  return (
    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 shadow-xl hover:bg-white/15 transition-all duration-300">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className={`w-10 h-10 bg-gradient-to-r from-${accentColors.primary}/30 to-${accentColors.secondary}/30 backdrop-blur-sm rounded-xl flex items-center justify-center`}>
          <Globe size={24} className={`text-${accentColors.primary}`} />
        </div>
        <h2 className="text-xl font-semibold text-white">Universal Review Summaries</h2>
        <span className={`bg-gradient-to-r from-${accentColors.primary}/20 to-${accentColors.secondary}/20 backdrop-blur-sm border border-white/20 text-white text-xs font-medium px-3 py-1 rounded-full`}>
          Plus Required
        </span>
      </div>

      {/* Center Icon */}
      <div className="flex justify-center mb-8 mt-12">
        <div className="w-20 h-20 border-2 border-white/30 bg-white/5 backdrop-blur-sm rounded-full flex items-center justify-center">
          <Globe size={32} className="text-white/60" />
        </div>
      </div>

      {/* Upgrade Message */}
      <div className="text-center mb-8">
        <h3 className="text-xl text-white/90 mb-4 font-medium">
          Upgrade to Plus to analyze reviews from any platform
        </h3>
        <p className="text-white/70 text-sm leading-relaxed">
          Get AI summaries from Yelp, TripAdvisor, OpenTable, Instagram, TikTok, Facebook, and more
        </p>
      </div>

      {/* Upgrade Button */}
      <div className="flex justify-center">
        <button className={`bg-gradient-to-r ${accentColors.gradient} hover:from-${accentColors.primary}/80 hover:to-${accentColors.secondary}/80 text-white font-medium px-8 py-3 rounded-2xl transition-all duration-200 hover:scale-105 shadow-lg`}>
          Upgrade to Plus
        </button>
      </div>
    </div>
  );
};
