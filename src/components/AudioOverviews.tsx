
import React from 'react';
import { Volume2, Lock } from 'lucide-react';

export const AudioOverviews = () => {
  return (
    <div className="bg-gradient-to-br from-gray-800/40 to-gray-700/40 border border-gray-600/30 rounded-2xl p-8 shadow-xl">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <Volume2 size={24} className="text-purple-400" />
        <h2 className="text-xl font-bold text-white">Audio Overviews</h2>
        <span className="bg-gradient-to-r from-purple-500 to-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full">
          Premium Feature
        </span>
      </div>

      {/* Center Icon */}
      <div className="flex justify-center mb-8 mt-12">
        <div className="w-20 h-20 border-4 border-gray-400 rounded-full flex items-center justify-center">
          <Lock size={32} className="text-gray-400" />
        </div>
      </div>

      {/* Upgrade Message */}
      <div className="text-center mb-8">
        <h3 className="text-xl text-gray-300 mb-4 font-medium">
          Upgrade to premium to access audio summaries
        </h3>
      </div>

      {/* Upgrade Button */}
      <div className="flex justify-center">
        <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-8 py-3 rounded-xl transition-all duration-200 hover:scale-105">
          Upgrade to Premium
        </button>
      </div>
    </div>
  );
};
