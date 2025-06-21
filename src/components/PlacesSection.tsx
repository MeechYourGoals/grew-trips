
import React from 'react';
import { MapPin, Plus } from 'lucide-react';

export const PlacesSection = () => {
  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Places to Visit</h2>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 transition-all duration-200 hover:scale-105 shadow-lg">
          <Plus size={18} />
          Add Place
        </button>
      </div>

      {/* Empty State */}
      <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-12 text-center">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-slate-700/50 rounded-full flex items-center justify-center">
            <MapPin size={32} className="text-slate-400" />
          </div>
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">No places added yet</h3>
        <p className="text-slate-400 mb-6">Start adding places to visit during your trip!</p>
        <button className="bg-slate-700 hover:bg-slate-600 text-white px-6 py-3 rounded-xl transition-colors">
          Add Place
        </button>
      </div>
    </div>
  );
};
