
import React from 'react';
import { Send } from 'lucide-react';

export const VibeSection = () => {
  return (
    <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <Send size={24} className="text-blue-400" />
        <h2 className="text-2xl font-bold">Vibe With Me</h2>
      </div>

      {/* Description */}
      <p className="text-slate-300 mb-6 leading-relaxed">
        Broadcast your plans to your close friends and invite them to join you.
      </p>

      {/* Broadcast Button */}
      <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-medium transition-all duration-200 hover:scale-105 shadow-lg mb-6 flex items-center justify-center gap-2">
        <Send size={18} />
        Broadcast Vibe
      </button>

      {/* Recent Broadcasts */}
      <div>
        <h3 className="text-lg font-semibold mb-4 text-slate-200">Recent Broadcasts</h3>
        <div className="text-center py-8">
          <div className="text-slate-400 text-sm">
            You haven't broadcasted any vibes yet.
          </div>
        </div>
      </div>
    </div>
  );
};
