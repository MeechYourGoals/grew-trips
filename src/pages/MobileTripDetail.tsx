import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MoreVertical, Users } from 'lucide-react';
import { MobileTripTabs } from '../components/mobile/MobileTripTabs';
import { MobileErrorBoundary } from '../components/mobile/MobileErrorBoundary';
import { TripHeader } from '../components/TripHeader';
import { useAuth } from '../hooks/useAuth';
import { useKeyboardHandler } from '../hooks/useKeyboardHandler';
import { hapticService } from '../services/hapticService';

import { getTripById, generateTripMockData } from '../data/tripsData';

export const MobileTripDetail = () => {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('chat');
  const [tripDescription, setTripDescription] = useState<string>('');

  // Keyboard handling for mobile inputs
  useKeyboardHandler({
    preventZoom: true,
    adjustViewport: true
  });

  // Get trip data
  const tripIdNum = tripId ? parseInt(tripId, 10) : null;
  const trip = tripIdNum ? getTripById(tripIdNum) : null;
  
  React.useEffect(() => {
    if (trip && !tripDescription) {
      setTripDescription(trip.description);
    }
  }, [trip, tripDescription]);
  
  const tripWithUpdatedDescription = trip ? {
    ...trip,
    description: tripDescription || trip.description
  } : null;
  
  if (!tripWithUpdatedDescription) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Trip Not Found</h1>
          <p className="text-gray-400 mb-6">The trip you're looking for doesn't exist.</p>
          <button
            onClick={() => {
              hapticService.light();
              navigate('/');
            }}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl transition-colors active:scale-95"
          >
            Back to My Trips
          </button>
        </div>
      </div>
    );
  }

  const mockData = generateTripMockData(trip);
  const basecamp = mockData.basecamp;

  const handleBack = () => {
    hapticService.light();
    navigate('/');
  };

  const handleTabChange = (tab: string) => {
    hapticService.light();
    setActiveTab(tab);
  };

  return (
    <MobileErrorBoundary>
      <div className="min-h-screen bg-black pb-mobile-nav-height">
      {/* Mobile Header - Sticky */}
      <div className="sticky top-0 z-50 bg-black/95 backdrop-blur-md border-b border-white/10">
        <div className="flex items-center justify-between px-4 py-3">
          <button
            onClick={handleBack}
            className="p-2 -ml-2 active:scale-95 transition-transform"
          >
            <ArrowLeft size={24} className="text-white" />
          </button>
          
          <div className="flex-1 text-center">
            <h1 className="text-lg font-semibold text-white truncate px-2">
              {trip.title}
            </h1>
            <p className="text-xs text-gray-400 truncate px-2">
              {trip.location}
            </p>
          </div>
          
          <button
            onClick={() => hapticService.light()}
            className="p-2 -mr-2 active:scale-95 transition-transform"
          >
            <MoreVertical size={24} className="text-white" />
          </button>
        </div>
      </div>

      {/* Trip Cover & Info */}
      <div className="px-4 pt-4">
        <TripHeader 
          trip={tripWithUpdatedDescription} 
          onDescriptionUpdate={setTripDescription}
        />
      </div>

      {/* Participants Preview */}
      <div className="px-4 py-3 flex items-center gap-2 border-b border-white/10">
        <Users size={16} className="text-gray-400" />
        <span className="text-sm text-gray-300">
          {trip.participants.length} travelers
        </span>
      </div>

      {/* Mobile Tabs - Swipeable */}
      <MobileTripTabs
        activeTab={activeTab}
        onTabChange={handleTabChange}
        tripId={tripId || '1'}
        basecamp={basecamp}
      />
      </div>
    </MobileErrorBoundary>
  );
};
