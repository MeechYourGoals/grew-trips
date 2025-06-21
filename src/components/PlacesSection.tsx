
import React, { useState } from 'react';
import { MapPin, Plus } from 'lucide-react';
import { AddPlaceModal } from './AddPlaceModal';

export const PlacesSection = () => {
  const [isAddPlaceModalOpen, setIsAddPlaceModalOpen] = useState(false);

  return (
    <div className="mb-12">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Places to Visit</h2>
        <button 
          onClick={() => setIsAddPlaceModalOpen(true)}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-4 rounded-2xl flex items-center gap-3 transition-all duration-300 hover:scale-105 shadow-xl shadow-blue-500/25 font-semibold"
        >
          <Plus size={20} />
          Add Place
        </button>
      </div>

      {/* Empty State */}
      <div className="bg-white border border-gray-200 rounded-3xl p-16 text-center shadow-lg shadow-gray-200/50">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
            <MapPin size={40} className="text-blue-600" />
          </div>
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-3">No places added yet</h3>
        <p className="text-gray-600 mb-8 max-w-md mx-auto leading-relaxed">Start adding places to visit during your trip! Create your perfect itinerary.</p>
        <button 
          onClick={() => setIsAddPlaceModalOpen(true)}
          className="bg-white hover:bg-gray-50 text-gray-900 px-8 py-4 rounded-2xl transition-all duration-200 shadow-lg shadow-gray-200/50 border border-gray-200 hover:shadow-xl font-medium"
        >
          Add Place
        </button>
      </div>

      <AddPlaceModal 
        isOpen={isAddPlaceModalOpen}
        onClose={() => setIsAddPlaceModalOpen(false)}
      />
    </div>
  );
};
