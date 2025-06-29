import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { TripHeader } from '../components/TripHeader';
import { MessageInbox } from '../components/MessageInbox';
import { TripDetailHeader } from '../components/trip/TripDetailHeader';
import { TripDetailContent } from '../components/trip/TripDetailContent';
import { TripDetailModals } from '../components/trip/TripDetailModals';
import { TripVariantProvider } from '../contexts/TripVariantContext';
import { useAuth } from '../hooks/useAuth';
import { useMessages } from '../hooks/useMessages';
import { proTripMockData } from '../data/proTripMockData';
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


  if (!proTripId) {
    return (
      <ProTripNotFound message="No trip ID provided." />
    );
  }

  if (!(proTripId in proTripMockData)) {
    return (
      <ProTripNotFound 
        message="The requested trip could not be found."
        details={`Trip ID: ${proTripId}`}
        availableIds={Object.keys(proTripMockData)}
      />
    );
  }

  const tripData = proTripMockData[proTripId];

  // Convert Pro trip data to standard trip format
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

  // Mock basecamp data for Pro trips
  const basecamp = {
    name: "Enterprise Headquarters",
    address: `${tripData.location}, Business District`
  };

  // Get trip messages for context
  const tripMessages = getMessagesForTrip(proTripId);

  // Mock data for Pro trip context - same structure as standard trips
  const mockBroadcasts = [
    { id: 1, senderName: "Team Lead", content: `${tripData.category} schedule confirmed for all participants`, timestamp: "2025-01-15T15:30:00Z" },
    { id: 2, senderName: "Operations", content: `Budget approved for ${tripData.title} - all expenses covered`, timestamp: "2025-01-15T10:00:00Z" }
  ];

  const mockLinks = [
    { id: 1, title: "Executive Accommodation", url: "https://enterprise-stays.com/premium", category: "Accommodation" },
    { id: 2, title: "Corporate Event Venue", url: "https://venues.com/corporate", category: "Venues" },
    { id: 3, title: "Team Building Activities", url: "https://team-events.com/pro", category: "Activities" }
  ];

  // Build comprehensive trip context - same as standard trips
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
    collaborators: trip.collaborators,
    itinerary: tripData.itinerary,
    budget: tripData.budget,
    isPro: true
  };

  return (
    <TripVariantProvider variant="pro">
      <div className="min-h-screen bg-black">
        <div className="container mx-auto px-6 py-8 max-w-7xl">
          {/* Top Navigation - same as standard trips */}
          <TripDetailHeader
            tripContext={tripContext}
            showInbox={showInbox}
            onToggleInbox={() => setShowInbox(!showInbox)}
            onShowInvite={() => setShowInvite(true)}
            onShowTripSettings={() => setShowTripSettings(true)}
            onShowAuth={() => setShowAuth(true)}
          />

          {/* Message Inbox - same as standard trips */}
          {showInbox && user && (
            <div className="mb-8">
              <MessageInbox />
            </div>
          )}

          {/* Trip Header - same as standard trips */}
          <TripHeader trip={trip} />

          {/* Main Content - same as standard trips */}
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

        {/* All the same modals as standard trips */}
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
    </TripVariantProvider>
  );
};

export default ProTripDetail;
