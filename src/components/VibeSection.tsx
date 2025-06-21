
import React, { useState } from 'react';
import { Send } from 'lucide-react';

export const VibeSection = () => {
  const [broadcastText, setBroadcastText] = useState('');

  return (
    <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <Send size={24} className="text-blue-400" />
        <h2 className="text-2xl font-bold">Broadcast</h2>
      </div>

      {/* Description */}
      <p className="text-slate-300 mb-6 leading-relaxed">
        Quick updates for the group that expire and don't clutter the chat wall
      </p>

      {/* Text Entry Field */}
      <div className="mb-4">
        <textarea
          value={broadcastText}
          onChange={(e) => setBroadcastText(e.target.value)}
          placeholder="What's happening..."
          maxLength={140}
          rows={3}
          className="w-full bg-slate-800/50 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 resize-none"
        />
        <div className="text-right text-xs text-slate-400 mt-1">
          {broadcastText.length}/140
        </div>
      </div>

      {/* Broadcast Button */}
      <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-medium transition-all duration-200 hover:scale-105 shadow-lg mb-6 flex items-center justify-center gap-2">
        <Send size={18} />
        Broadcast
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
