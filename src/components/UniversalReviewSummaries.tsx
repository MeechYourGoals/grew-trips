
import React from 'react';
import { Globe } from 'lucide-react';

export const UniversalReviewSummaries = () => {
  return (
    <div className="bg-gradient-to-br from-blue-900/40 to-blue-800/40 border border-blue-600/30 rounded-2xl p-8 shadow-xl">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <Globe size={24} className="text-blue-400" />
        <h2 className="text-xl font-bold text-white">Universal Review Summaries</h2>
        <span className="bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full">
          Plus Required
        </span>
      </div>

      {/* Center Icon */}
      <div className="flex justify-center mb-8 mt-12">
        <div className="w-20 h-20 border-4 border-gray-400 rounded-full flex items-center justify-center">
          <Globe size={32} className="text-gray-400" />
        </div>
      </div>

      {/* Upgrade Message */}
      <div className="text-center mb-8">
        <h3 className="text-xl text-gray-300 mb-4 font-medium">
          Upgrade to Plus to analyze reviews from any platform
        </h3>
        <p className="text-gray-400 text-sm leading-relaxed">
          Get AI summaries from Yelp, TripAdvisor, OpenTable, Instagram, TikTok, Facebook, and more
        </p>
      </div>

      {/* Upgrade Button */}
      <div className="flex justify-center">
        <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-8 py-3 rounded-xl transition-all duration-200 hover:scale-105">
          Upgrade to Plus
        </button>
      </div>
    </div>
  );
};
