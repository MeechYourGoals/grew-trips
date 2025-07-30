import React, { useState } from 'react';
import { Home, MapPin, Edit3, Clock, Navigation } from 'lucide-react';
import { BasecampSelector } from './BasecampSelector';
import { BasecampLocation } from '../types/basecamp';
import { useBasecamp } from '@/contexts/BasecampContext';

interface SetBasecampSquareProps {
  // Optional props for backward compatibility
  basecamp?: BasecampLocation;
  onBasecampSet?: (basecamp: BasecampLocation) => void;
}

export const SetBasecampSquare = ({ basecamp: propBasecamp, onBasecampSet: propOnBasecampSet }: SetBasecampSquareProps) => {
  const { basecamp: contextBasecamp, setBasecamp: setContextBasecamp, isBasecampSet } = useBasecamp();
  
  // Use context basecamp if available, otherwise fall back to props
  const basecamp = contextBasecamp || propBasecamp;
  
  const handleBasecampSet = (newBasecamp: BasecampLocation) => {
    // Always update context
    setContextBasecamp(newBasecamp);
    // Also call prop callback if provided (for backward compatibility)
    propOnBasecampSet?.(newBasecamp);
  };
  const [isModalOpen, setIsModalOpen] = useState(false);

  const formatAddress = (address: string) => {
    const parts = address.split(',');
    if (parts.length > 2) {
      return `${parts[0]}, ${parts[parts.length - 2]?.trim()}, ${parts[parts.length - 1]?.trim()}`;
    }
    return address;
  };

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6 shadow-2xl shadow-black/50 min-h-[500px] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
            basecamp 
              ? 'bg-gradient-to-r from-green-600 to-green-700' 
              : 'bg-gradient-to-r from-gray-600 to-gray-700'
          }`}>
            <Home size={20} className="text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Set Basecamp</h3>
            <p className="text-gray-400 text-sm">
              {basecamp ? 'Basecamp configured' : 'Choose your home base'}
            </p>
          </div>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="text-gray-400 hover:text-white transition-colors"
        >
          <Edit3 size={20} />
        </button>
      </div>

      {basecamp ? (
        /* Basecamp Details */
        <div className="flex-1 space-y-6">
          {/* Main Info Card */}
          <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                <Home size={16} className="text-green-400" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-white font-semibold mb-1">
                  {basecamp.name || 'Your Home Base'}
                </h4>
                <p className="text-green-300 text-sm leading-relaxed">
                  {formatAddress(basecamp.address)}
                </p>
              </div>
            </div>
          </div>

          {/* Basecamp Features */}
          <div className="space-y-3">
            <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
              <div className="flex items-center gap-3">
                <MapPin size={16} className="text-blue-400" />
                <div>
                  <p className="text-white font-medium text-sm">Distance Calculations</p>
                  <p className="text-gray-400 text-xs">All places show distance from basecamp</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
              <div className="flex items-center gap-3">
                <Navigation size={16} className="text-purple-400" />
                <div>
                  <p className="text-white font-medium text-sm">Route Planning</p>
                  <p className="text-gray-400 text-xs">Optimized routes from your base</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
              <div className="flex items-center gap-3">
                <Clock size={16} className="text-orange-400" />
                <div>
                  <p className="text-white font-medium text-sm">Travel Time Estimates</p>
                  <p className="text-gray-400 text-xs">Plan your daily itinerary efficiently</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-3">
            <button
              onClick={() => setIsModalOpen(true)}
              className="w-full bg-gray-800 hover:bg-gray-700 text-white py-3 px-4 rounded-xl transition-all duration-200 border border-gray-700 hover:border-green-500/50 font-medium text-sm"
            >
              Update Basecamp Location
            </button>
            
            <div className="grid grid-cols-2 gap-3">
              <button className="bg-gray-800/50 hover:bg-gray-800 text-gray-300 py-2 px-3 rounded-lg transition-colors border border-gray-700 text-xs">
                View on Map
              </button>
              <button className="bg-gray-800/50 hover:bg-gray-800 text-gray-300 py-2 px-3 rounded-lg transition-colors border border-gray-700 text-xs">
                Get Directions
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* No Basecamp Set */
        <div className="flex-1 flex flex-col justify-center items-center text-center">
          <div className="w-20 h-20 bg-gradient-to-r from-gray-800 to-gray-900 rounded-full flex items-center justify-center border border-gray-700 mb-6">
            <Home size={32} className="text-gray-400" />
          </div>
          
          <h4 className="text-xl font-bold text-white mb-3">Set Your Basecamp</h4>
          <p className="text-gray-400 mb-6 max-w-sm mx-auto leading-relaxed">
            Choose a central location for your trip. We'll calculate distances and travel times from this point to all your destinations.
          </p>
          
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-8 py-4 rounded-xl transition-all duration-300 hover:scale-105 shadow-xl shadow-green-500/25 font-semibold border border-green-500/50"
          >
            Choose Basecamp
          </button>
          
          <div className="mt-8 space-y-2 text-sm text-gray-500">
            <p>• Hotels, vacation rentals, or meeting spots work great</p>
            <p>• Used for distance calculations and route planning</p>
            <p>• Can be updated anytime during your trip</p>
          </div>
        </div>
      )}

        <BasecampSelector
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onBasecampSet={handleBasecampSet}
          currentBasecamp={basecamp}
        />
    </div>
  );
};