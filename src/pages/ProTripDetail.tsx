
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { ProTripHeader } from '../components/ProTripHeader';
import { ProTripDetailHeader } from '../components/pro/ProTripDetailHeader';
import { TripDetailContent } from '../components/trip/TripDetailContent';
import { TripDetailModals } from '../components/trip/TripDetailModals';
import { MessageInbox } from '../components/MessageInbox';
import { useAuth } from '../hooks/useAuth';
import { useMessages } from '../hooks/useMessages';
import { proTripMockData } from '../data/proTripMockData';
import { getTripLabels } from '../utils/tripLabels';
import { ProTripNotFound } from '../components/pro/ProTripNotFound';
import { TripPreferences as TripPreferencesType } from '../types/consumer';

const ProTripDetail = () => {
  const { proTripId } = useParams<{ proTripId?: string }>();
  const { user } = useAuth();
  const { getMessagesForTrip } = useMessages();
  const [activeTab, setActiveTab] = useState('chat');
  const [showInbox, setShowInbox] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showInvite, setShowInvite] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [showTripSettings, setShowTripSettings] = useState(false);
  const [showTripsPlusModal, setShowTripsPlusModal] = useState(false);
  const [tripPreferences, setTripPreferences] = useState<TripPreferencesType | undefined>();

  console.log('ProTripDetail - proTripId from URL:', proTripId);
  console.log('ProTripDetail - Available trip IDs:', Object.keys(proTripMockData));

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

  // Mock basecamp data for Pro trips
  const basecamp = {
    name: "Enterprise Headquarters",
    address: `${tripData.location}, Business District`
  };

  // Get trip messages for context
  const tripMessages = getMessagesForTrip(proTripId);

  // Mock data for Pro trip context
  const mockBroadcasts = [
    { id: 1, senderName: "Team Lead", content: `${tripData.category} schedule confirmed for all participants`, timestamp: "2025-01-15T15:30:00Z" },
    { id: 2, senderName: "Operations", content: `Budget approved for ${tripData.title} - all expenses covered`, timestamp: "2025-01-15T10:00:00Z" }
  ];

  const mockLinks = [
    { id: 1, title: "Executive Accommodation", url: "https://enterprise-stays.com/premium", category: "Accommodation" },
    { id: 2, title: "Corporate Event Venue", url: "https://venues.com/corporate", category: "Venues" },
    { id: 3, title: "Team Building Activities", url: "https://team-events.com/pro", category: "Activities" }
  ];

  // Build comprehensive Pro trip context with all the same data structure as regular trips
  const tripContext = {
    id: proTripId,
    title: tripData.title,
    location: tripData.location,
    dateRange: tripData.dateRange,
    basecamp,
    preferences: tripPreferences,
    calendar: tripData.itinerary,
    broadcasts: mockBroadcasts,
    links: mockLinks,
    messages: tripMessages,
    collaborators: tripData.participants,
    itinerary: tripData.itinerary,
    budget: tripData.budget,
    isPro: true
  };

  // Convert trip data to the format expected by TripHeader
  const trip = {
    id: parseInt(proTripId),
    title: tripData.title,
    location: tripData.location,
    dateRange: tripData.dateRange,
    description: tripData.description || `Professional ${tripData.category.toLowerCase()} in ${tripData.location}`,
    collaborators: tripData.participants.map(p => ({
      id: p.id,
      name: p.name,
      avatar: p.avatar
    }))
  };

  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto px-6 py-8 max-w-7xl">
        {/* Pro Trip Header */}
        <ProTripDetailHeader
          tripContext={tripContext}
          showInbox={showInbox}
          onToggleInbox={() => setShowInbox(!showInbox)}
          onShowInvite={() => setShowInvite(true)}
          onShowTripSettings={() => setShowTripSettings(true)}
          onShowAuth={() => setShowAuth(true)}
        />

        {/* Message Inbox - same as regular trips */}
        {showInbox && user && (
          <div className="mb-8">
            <MessageInbox />
          </div>
        )}

        {/* Trip Header with Pro styling preserved */}
        <ProTripHeader tripData={tripData} />

        {/* Main Content - Now using the same TripDetailContent as regular trips */}
        <TripDetailContent
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onShowTripsPlusModal={() => setShowTripsPlusModal(true)}
          tripId={proTripId}
          basecamp={basecamp}
          tripPreferences={tripPreferences}
          onPreferencesChange={setTripPreferences}
        />
      </div>

      {/* All the same modals as regular trips */}
      <TripDetailModals
        showSettings={showSettings}
        onCloseSettings={() => setShowSettings(false)}
        showInvite={showInvite}
        onCloseInvite={() => setShowInvite(false)}
        showAuth={showAuth}
        onCloseAuth={() => setShowAuth(false)}
        showTripSettings={showTripSettings}
        onCloseTripSettings={() => setShowTripSettings(false)}
        showTripsPlusModal={showTripsPlusModal}
        onCloseTripsPlusModal={() => setShowTripsPlusModal(false)}
        tripName={tripData.title}
        tripId={proTripId}
        userId={user?.id}
      />
    </div>
  );
};

export default ProTripDetail;
