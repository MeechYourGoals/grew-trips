
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { TripSettings } from '../components/TripSettings';
import { ProTripHeader } from '../components/ProTripHeader';
import { ProTripOverview } from '../components/ProTripOverview';
import { ProTripTeam } from '../components/ProTripTeam';
import { ProTripSchedule } from '../components/ProTripSchedule';
import { ProTripItinerary } from '../components/ProTripItinerary';
import { ProTripBudgetDetailed } from '../components/ProTripBudgetDetailed';
import { ProTripNotFound } from '../components/pro/ProTripNotFound';
import { ProTripDetailHeader } from '../components/pro/ProTripDetailHeader';
import { ProTripQuickActions } from '../components/pro/ProTripQuickActions';
import { proTripMockData } from '../data/proTripMockData';
import { getTripLabels } from '../utils/tripLabels';

const ProTripDetail = () => {
  const { proTripId } = useParams<{ proTripId?: string }>();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  console.log('ProTripDetail - proTripId from URL:', proTripId);
  console.log('ProTripDetail - Available trip IDs:', Object.keys(proTripMockData));
  console.log('ProTripDetail - Mock data keys:', Object.keys(proTripMockData));

  if (!proTripId) {
    console.log('ProTripDetail - No proTripId provided');
    return (
      <ProTripNotFound message="No trip ID provided." />
    );
  }

  if (!(proTripId in proTripMockData)) {
    console.log('ProTripDetail - Trip ID not found in mock data:', proTripId);
    return (
      <ProTripNotFound 
        message="The requested trip could not be found."
        details={`Trip ID: ${proTripId}`}
        availableIds={Object.keys(proTripMockData)}
      />
    );
  }

  const tripData = proTripMockData[proTripId];
  console.log('ProTripDetail - Found trip data:', tripData?.title);
  
  const labels = getTripLabels(tripData.category);

  // Build comprehensive Pro trip context
  const tripContext = {
    id: proTripId,
    title: tripData.title,
    location: tripData.location,
    dateRange: tripData.dateRange,
    collaborators: tripData.participants,
    itinerary: tripData.itinerary,
    budget: tripData.budget,
    broadcasts: [],
    links: [],
    messages: [],
    isPro: true
  };

  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto px-6 py-8 max-w-7xl">
        {/* Header */}
        <ProTripDetailHeader 
          tripContext={tripContext}
          onSettingsOpen={() => setIsSettingsOpen(true)}
        />

        {/* Trip Header */}
        <ProTripHeader tripData={tripData} />

        {/* Overview Stats */}
        <ProTripOverview tripData={tripData} />

        {/* Main Content Sections */}
        <div className="space-y-8">
          {/* Team Section */}
          <ProTripTeam tripData={tripData} teamLabel={labels.team} />

          {/* Complete Itinerary */}
          <ProTripItinerary tripData={tripData} />

          {/* Detailed Budget */}
          <ProTripBudgetDetailed tripData={tripData} />

          {/* Quick Schedule Overview */}
          <ProTripSchedule tripData={tripData} scheduleLabel={labels.schedule} />
        </div>

        {/* Quick Actions */}
        <ProTripQuickActions />
      </div>

      {/* Trip Settings Modal */}
      <TripSettings
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        tripId={tripData.id}
        tripName={tripData.title}
        currentUserId="current-user"
      />
    </div>
  );
};

export default ProTripDetail;
