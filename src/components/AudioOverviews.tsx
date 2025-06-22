
import React from 'react';
import { Volume2, Lock } from 'lucide-react';

export const AudioOverviews = () => {
  return (
    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 shadow-xl hover:bg-white/15 transition-all duration-300">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-gradient-to-r from-glass-green/30 to-glass-yellow/30 backdrop-blur-sm rounded-xl flex items-center justify-center">
          <Volume2 size={24} className="text-glass-green" />
        </div>
        <h2 className="text-xl font-semibold text-white">Audio Overviews</h2>
        <span className="bg-gradient-to-r from-glass-green/20 to-glass-yellow/20 backdrop-blur-sm border border-white/20 text-white text-xs font-medium px-3 py-1 rounded-full">
          Premium Feature
        </span>
      </div>

      {/* Center Icon */}
      <div className="flex justify-center mb-8 mt-12">
        <div className="w-20 h-20 border-2 border-white/30 bg-white/5 backdrop-blur-sm rounded-full flex items-center justify-center">
          <Lock size={32} className="text-white/60" />
        </div>
      </div>

      {/* Upgrade Message */}
      <div className="text-center mb-8">
        <h3 className="text-xl text-white/90 mb-4 font-medium">
          Upgrade to premium to access audio summaries
        </h3>
      </div>

      {/* Upgrade Button */}
      <div className="flex justify-center">
        <button className="bg-gradient-to-r from-glass-green to-glass-yellow hover:from-glass-green/80 hover:to-glass-yellow/80 text-white font-medium px-8 py-3 rounded-2xl transition-all duration-200 hover:scale-105 shadow-lg">
          Upgrade to Premium
        </button>
      </div>
    </div>
  );
};
