
import React, { useState } from 'react';
import { MapPin, Plus } from 'lucide-react';
import { AddPlaceModal } from './AddPlaceModal';
import { GoogleMapsEmbed } from './GoogleMapsEmbed';
import { EnhancedFindMyFriends } from './EnhancedFindMyFriends';
import { SetBasecampSquare } from './SetBasecampSquare';
import { AddToCalendarButton } from './AddToCalendarButton';
import { BasecampLocation, PlaceWithDistance, DistanceCalculationSettings } from '../types/basecamp';
import { DistanceCalculator } from '../utils/distanceCalculator';
import { useTripVariant } from '../contexts/TripVariantContext';
import { AddToCalendarData } from '../types/calendar';
import { useFeatureToggle, DEFAULT_FEATURES } from '../hooks/useFeatureToggle';
import { usePlacesLinkSync } from '../hooks/usePlacesLinkSync';
import { Badge } from './ui/badge';

interface PlacesSectionProps {
  tripId?: string;
  tripName?: string;
}

export const PlacesSection = ({ tripId = '1', tripName = 'Your Trip' }: PlacesSectionProps) => {
  const { variant } = useTripVariant();
  const { isFeatureEnabled } = useFeatureToggle({ 
    trip_type: variant === 'consumer' ? 'consumer' : 'pro',
    enabled_features: [...DEFAULT_FEATURES] 
  });
  const [isAddPlaceModalOpen, setIsAddPlaceModalOpen] = useState(false);
  const [basecamp, setBasecamp] = useState<BasecampLocation | undefined>();
  const [places, setPlaces] = useState<PlaceWithDistance[]>([]);
  const [distanceSettings] = useState<DistanceCalculationSettings>({
    preferredMode: 'driving',
    unit: 'miles',
    showDistances: true
  });

  const { createLinkFromPlace, removeLinkByPlaceId } = usePlacesLinkSync();

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
    
    // Create corresponding link
    createLinkFromPlace(newPlace);
  };

  const handlePlaceRemoved = (placeId: string) => {
    setPlaces(prev => prev.filter(place => place.id !== placeId));
    removeLinkByPlaceId(placeId);
  };

  const handleEventAdded = (eventData: AddToCalendarData) => {
    console.log('Event added to calendar:', eventData);
  };

  return (
    <div className="mb-12">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white">Places</h2>
      </div>

      {/* Hero Map Section - Full Width */}
      <div className="mb-8">
        <div className="bg-gray-900 border border-gray-800 rounded-3xl overflow-hidden shadow-2xl shadow-black/50 h-96">
          <GoogleMapsEmbed className="w-full h-full" />
        </div>
      </div>

      {/* Basecamp and Trip Pins Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Set Basecamp Square */}
        <SetBasecampSquare 
          basecamp={basecamp}
          onBasecampSet={handleBasecampSet}
        />

        {/* Trip Pins Square */}
        <div className="bg-gray-900 border border-gray-800 rounded-3xl p-8 flex flex-col shadow-2xl shadow-black/50 min-h-[500px]">
          {places.length === 0 ? (
            <div className="flex flex-col justify-center items-center text-center h-full">
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 bg-gradient-to-r from-red-900/50 to-yellow-900/50 rounded-full flex items-center justify-center border border-red-500/30">
                  <MapPin size={40} className="text-red-400" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Trip Pins</h3>
              <p className="text-gray-400 mb-8 max-w-md mx-auto leading-relaxed">
                Start saving locations you want to visit or remember for your trip. Explore the map above and add places that catch your eye—they'll appear here.
              </p>
              <button 
                onClick={() => setIsAddPlaceModalOpen(true)}
                className="bg-gray-800 hover:bg-gray-700 text-white px-8 py-4 rounded-2xl transition-all duration-200 shadow-lg border border-gray-700 hover:border-red-500/50 font-medium"
              >
                Save Pin
              </button>
              <p className="text-xs text-gray-500 mt-4 max-w-sm">
                Places you add will be saved to Links for easy access during your trip.
              </p>
            </div>
          ) : (
            <div className="h-full overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Trip Pins ({places.length})</h3>
                <button 
                  onClick={() => setIsAddPlaceModalOpen(true)}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium"
                >
                  <Plus size={16} className="inline mr-1" />
                  Save Pin
                </button>
              </div>
              <div className="space-y-3">
                {places.map((place) => (
                  <div key={place.id} className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="text-white font-medium">{place.name}</h4>
                          <Badge variant="secondary" className="text-xs bg-blue-500/20 text-blue-300 border-blue-500/30">
                            Linked to Trip
                          </Badge>
                        </div>
                        <p className="text-gray-400 text-sm capitalize">{place.category}</p>
                        {place.distanceFromBasecamp && (
                          <div className="mt-2">
                            <span className="inline-flex items-center gap-1 bg-green-500/20 text-green-300 px-2 py-1 rounded-lg text-xs">
                              <MapPin size={12} />
                              {place.distanceFromBasecamp[distanceSettings.preferredMode]?.toFixed(1)} {place.distanceFromBasecamp.unit} from Basecamp
                            </span>
                          </div>
                        )}
                        <div className="mt-3 flex gap-2">
                          <AddToCalendarButton
                            placeName={place.name}
                            placeAddress={place.address}
                            category="activity"
                            onEventAdded={handleEventAdded}
                            variant="pill"
                          />
                          <button 
                            onClick={() => handlePlaceRemoved(place.id)}
                            className="text-red-400 hover:text-red-300 text-xs px-2 py-1 rounded bg-red-500/10 hover:bg-red-500/20 transition-colors"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Find My Friends Section - Full Width */}
      <div className="mb-8">
        <EnhancedFindMyFriends 
          tripId={tripId} 
          tripName={tripName}
        />
      </div>

      {/* Modals */}
      <AddPlaceModal 
        isOpen={isAddPlaceModalOpen}
        onClose={() => setIsAddPlaceModalOpen(false)}
        onPlaceAdded={handlePlaceAdded}
        basecamp={basecamp}
      />
    </div>
  );
};
