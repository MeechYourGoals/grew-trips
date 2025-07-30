
import React, { useState } from 'react';
import { AddPlaceModal } from './AddPlaceModal';
import { WorkingGoogleMaps } from './WorkingGoogleMaps';
import { SetBasecampSquare } from './SetBasecampSquare';
import { TripPinsCard } from './TripPinsCard';
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
          <WorkingGoogleMaps className="w-full h-full" />
        </div>
      </div>

      {/* Basecamp and Trip Pins Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Set Basecamp Square */}
        <SetBasecampSquare 
          basecamp={basecamp}
          onBasecampSet={handleBasecampSet}
        />

        {/* Trip Pins Card */}
        <TripPinsCard
          places={places}
          basecamp={basecamp}
          onPlaceAdded={handlePlaceAdded}
          onPlaceRemoved={handlePlaceRemoved}
          onEventAdded={handleEventAdded}
          distanceUnit={distanceSettings.unit}
          preferredMode={distanceSettings.preferredMode}
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
