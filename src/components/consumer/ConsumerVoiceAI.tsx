
import React from 'react';
import { Brain, Calendar } from 'lucide-react';

export const ConsumerVoiceAI = () => {
  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold text-white flex items-center gap-2">
        <Brain size={24} className="text-glass-orange" />
        AI Features
      </h3>

      {/* Smart Calendar Detection - Only Feature Remaining */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-6">
        <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Calendar size={20} className="text-glass-orange" />
          Calendar Intelligence
        </h4>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
            <div>
              <div className="text-white font-medium">Smart Calendar Detection</div>
              <div className="text-sm text-gray-400">Automatically detect dates and events in messages</div>
            </div>
            <button className="relative w-12 h-6 rounded-full bg-glass-orange">
              <div className="absolute w-5 h-5 bg-white rounded-full top-0.5 translate-x-6 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
