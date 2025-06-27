
import React, { useState } from 'react';
import { MapPin, Plus, Home } from 'lucide-react';
import { AddPlaceModal } from './AddPlaceModal';
import { GoogleMapsEmbed } from './GoogleMapsEmbed';
import { BasecampSelector } from './BasecampSelector';
import { BasecampLocation, PlaceWithDistance, DistanceCalculationSettings } from '../types/basecamp';
import { DistanceCalculator } from '../utils/distanceCalculator';

export const PlacesSection = () => {
  const [isAddPlaceModalOpen, setIsAddPlaceModalOpen] = useState(false);
  const [isBasecampModalOpen, setIsBasecampModalOpen] = useState(false);
  const [basecamp, setBasecamp] = useState<BasecampLocation | undefined>();
  const [places, setPlaces] = useState<PlaceWithDistance[]>([]);
  const [distanceSettings] = useState<DistanceCalculationSettings>({
    preferredMode: 'driving',
    unit: 'miles',
    showDistances: true
  });

  const handleBasecampSet = async (newBasecamp: BasecampLocation) => {
    console.log('Setting basecamp:', newBasecamp);
    setBasecamp(newBasecamp);
    
    // Recalculate distances for existing places
    if (places.length > 0) {
      const updatedPlaces = await Promise.all(
        places.map(async (place) => {
          const distance = await DistanceCalculator.calculateDistance(
            newBasecamp,
            place,
            distanceSettings
          );
          
          return {
            ...place,
            distanceFromBasecamp: distance ? {
              ...place.distanceFromBasecamp,
              [distanceSettings.preferredMode]: distance,
              unit: distanceSettings.unit
            } : undefined
          };
        })
      );
      setPlaces(updatedPlaces);
    }
  };

  const handlePlaceAdded = async (newPlace: PlaceWithDistance) => {
    console.log('Adding place:', newPlace);
    
    // Calculate distance if basecamp is set
    if (basecamp && distanceSettings.showDistances) {
      const distance = await DistanceCalculator.calculateDistance(
        basecamp,
        newPlace,
        distanceSettings
      );
      
      if (distance) {
        newPlace.distanceFromBasecamp = {
          [distanceSettings.preferredMode]: distance,
          unit: distanceSettings.unit
        };
      }
    }
    
    setPlaces([...places, newPlace]);
  };

  return (
    <div className="mb-12">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-white">Places to Visit</h2>
        <div className="flex gap-3">
          {/* Basecamp Button */}
          <button 
            onClick={() => setIsBasecampModalOpen(true)}
            className={`${
              basecamp 
                ? 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 shadow-green-500/25' 
                : 'bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 shadow-gray-500/25'
            } text-white px-6 py-4 rounded-2xl flex items-center gap-3 transition-all duration-300 hover:scale-105 shadow-xl font-semibold border border-opacity-50`}
          >
            <Home size={20} />
            {basecamp ? 'Update Basecamp' : 'Set Basecamp'}
          </button>
          
          {/* Add Place Button */}
          <button 
            onClick={() => setIsAddPlaceModalOpen(true)}
            className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-6 py-4 rounded-2xl flex items-center gap-3 transition-all duration-300 hover:scale-105 shadow-xl shadow-red-500/25 font-semibold border border-red-500/50"
          >
            <Plus size={20} />
            Add Place
          </button>
        </div>
      </div>

      {/* Basecamp Info Banner */}
      {basecamp && (
        <div className="bg-green-500/10 border border-green-500/30 rounded-2xl p-4 mb-6">
          <div className="flex items-center gap-3">
            <Home size={20} className="text-green-400" />
            <div>
              <h4 className="text-white font-semibold">
                Basecamp: {basecamp.name || 'Your Home Base'}
              </h4>
              <p className="text-green-300 text-sm">{basecamp.address}</p>
            </div>
          </div>
        </div>
      )}

      {/* Two Equal-Sized Squares Side by Side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-96">
        {/* Left Square - Add Place Section or Places List */}
        <div className="bg-gray-900 border border-gray-800 rounded-3xl p-8 flex flex-col shadow-2xl shadow-black/50">
          {places.length === 0 ? (
            // Empty state
            <div className="flex flex-col justify-center items-center text-center h-full">
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 bg-gradient-to-r from-red-900/50 to-yellow-900/50 rounded-full flex items-center justify-center border border-red-500/30">
                  <MapPin size={40} className="text-red-400" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">No places added yet</h3>
              <p className="text-gray-400 mb-8 max-w-md mx-auto leading-relaxed">
                Start adding places to visit during your trip! 
                {!basecamp && ' Set a basecamp first to see distances.'}
              </p>
              <button 
                onClick={() => setIsAddPlaceModalOpen(true)}
                className="bg-gray-800 hover:bg-gray-700 text-white px-8 py-4 rounded-2xl transition-all duration-200 shadow-lg border border-gray-700 hover:border-red-500/50 font-medium"
              >
                Add Place
              </button>
            </div>
          ) : (
            // Places list
            <div className="h-full overflow-y-auto">
              <h3 className="text-lg font-semibold text-white mb-4">Added Places ({places.length})</h3>
              <div className="space-y-3">
                {places.map((place) => (
                  <div key={place.id} className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="text-white font-medium mb-1">{place.name}</h4>
                        <p className="text-gray-400 text-sm capitalize">{place.category}</p>
                        {place.distanceFromBasecamp && (
                          <div className="mt-2">
                            <span className="inline-flex items-center gap-1 bg-green-500/20 text-green-300 px-2 py-1 rounded-lg text-xs">
                              <MapPin size={12} />
                              {place.distanceFromBasecamp[distanceSettings.preferredMode]?.toFixed(1)} {place.distanceFromBasecamp.unit} from Basecamp
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Square - Google Maps */}
        <div className="bg-gray-900 border border-gray-800 rounded-3xl p-4 shadow-2xl shadow-black/50">
          <GoogleMapsEmbed className="w-full h-full" />
        </div>
      </div>

      {/* Modals */}
      <AddPlaceModal 
        isOpen={isAddPlaceModalOpen}
        onClose={() => setIsAddPlaceModalOpen(false)}
        onPlaceAdded={handlePlaceAdded}
        basecamp={basecamp}
      />
      
      <BasecampSelector
        isOpen={isBasecampModalOpen}
        onClose={() => setIsBasecampModalOpen(false)}
        onBasecampSet={handleBasecampSet}
        currentBasecamp={basecamp}
      />
    </div>
  );
};
