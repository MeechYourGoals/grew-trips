
import React, { useState } from 'react';
import { MapPin, Plus } from 'lucide-react';
import { AddPlaceModal } from './AddPlaceModal';
import { GoogleMapsEmbed } from './GoogleMapsEmbed';

export const PlacesSection = () => {
  const [isAddPlaceModalOpen, setIsAddPlaceModalOpen] = useState(false);

  return (
    <div className="mb-12">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-white">Places to Visit</h2>
        <button 
          onClick={() => setIsAddPlaceModalOpen(true)}
          className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-6 py-4 rounded-2xl flex items-center gap-3 transition-all duration-300 hover:scale-105 shadow-xl shadow-red-500/25 font-semibold border border-red-500/50"
        >
          <Plus size={20} />
          Add Place
        </button>
      </div>

      {/* Two Equal-Sized Squares */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-96">
        {/* Left Square - Add Place Section */}
        <div className="bg-gray-900 border border-gray-800 rounded-3xl p-8 flex flex-col justify-center items-center text-center shadow-2xl shadow-black/50">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-r from-red-900/50 to-yellow-900/50 rounded-full flex items-center justify-center border border-red-500/30">
              <MapPin size={40} className="text-red-400" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-white mb-3">No places added yet</h3>
          <p className="text-gray-400 mb-8 max-w-md mx-auto leading-relaxed">Start adding places to visit during your trip! Create your perfect itinerary.</p>
          <button 
            onClick={() => setIsAddPlaceModalOpen(true)}
            className="bg-gray-800 hover:bg-gray-700 text-white px-8 py-4 rounded-2xl transition-all duration-200 shadow-lg border border-gray-700 hover:border-red-500/50 font-medium"
          >
            Add Place
          </button>
        </div>

        {/* Right Square - Google Maps */}
        <div className="bg-gray-900 border border-gray-800 rounded-3xl p-4 shadow-2xl shadow-black/50">
          <GoogleMapsEmbed className="w-full h-full" />
        </div>
      </div>

      <AddPlaceModal 
        isOpen={isAddPlaceModalOpen}
        onClose={() => setIsAddPlaceModalOpen(false)}
      />
    </div>
  );
};
