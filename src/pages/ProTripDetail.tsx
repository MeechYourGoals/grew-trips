
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { TripHeader } from '../components/TripHeader';
import { MessageInbox } from '../components/MessageInbox';
import { ProTripDetailHeader } from '../components/pro/ProTripDetailHeader';
import { ProTripDetailContent } from '../components/pro/ProTripDetailContent';
import { TripDetailModals } from '../components/trip/TripDetailModals';
import { TripVariantProvider } from '../contexts/TripVariantContext';
import { useAuth } from '../hooks/useAuth';
import { useMessages } from '../hooks/useMessages';
import { proTripMockData } from '../data/proTripMockData';
import { ProTripNotFound } from '../components/pro/ProTripNotFound';
import { TripPreferences as TripPreferencesType } from '../types/consumer';
import { ProTripCategory } from '../types/proCategories';

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

  console.log('ProTripDetail - proTripId from params:', proTripId);
  console.log('ProTripDetail - available mock data keys:', Object.keys(proTripMockData));

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
  console.log('ProTripDetail - found trip data:', tripData);
  
  // State for selected category - defaults to trip's original category
  const [selectedCategory, setSelectedCategory] = useState<ProTripCategory>(
    tripData.proTripCategory || 'Corporate & Business'
  );

  // Convert Pro trip data to standard trip format
  const trip = {
    id: parseInt(proTripId),
    title: tripData.title,
    location: tripData.location,
    dateRange: tripData.dateRange,
    description: tripData.description || `Professional ${tripData.category.toLowerCase()} in ${tripData.location}`,
    participants: tripData.participants.map(p => ({
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

  // Build comprehensive trip context
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
    collaborators: trip.participants,
    itinerary: tripData.itinerary,
    budget: tripData.budget,
    isPro: true,
    // Enhanced Pro features with role-based access
    proFeatures: {
      roster: true,
      logistics: true,
      schedule: true,
      finance: true,
      medical: true,
      media: true,
      sponsors: true,
      roleBasedAccess: true,
      permissionSystem: true
    }
  };

  return (
    <TripVariantProvider variant="pro">
      <div className="min-h-screen bg-black">
        <div className="container mx-auto px-6 py-8 max-w-7xl">
          {/* Top Navigation */}
          <ProTripDetailHeader
            tripContext={tripContext}
            showInbox={showInbox}
            onToggleInbox={() => setShowInbox(!showInbox)}
            onShowInvite={() => setShowInvite(true)}
            onShowTripSettings={() => setShowTripSettings(true)}
            onShowAuth={() => setShowAuth(true)}
          />

          {/* Message Inbox */}
          {showInbox && user && (
            <div className="mb-8">
              <MessageInbox />
            </div>
          )}

          {/* Trip Header with Category Selection */}
          <TripHeader 
            trip={trip}
            category={selectedCategory}
            tags={tripData.tags}
            onCategoryChange={setSelectedCategory}
          />

          {/* Enhanced Pro Content with Dynamic Category */}
          <ProTripDetailContent
            activeTab={activeTab}
            onTabChange={setActiveTab}
            onShowTripsPlusModal={() => setShowTripsPlusModal(true)}
            tripId={proTripId}
            basecamp={basecamp}
            tripPreferences={tripPreferences}
            onPreferencesChange={setTripPreferences}
            tripData={tripData}
            selectedCategory={selectedCategory}
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
