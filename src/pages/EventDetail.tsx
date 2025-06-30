
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
import { eventsMockData } from '../data/eventsMockData';
import { ProTripNotFound } from '../components/pro/ProTripNotFound';
import { TripPreferences as TripPreferencesType } from '../types/consumer';

const EventDetail = () => {
  const { eventId } = useParams<{ eventId?: string }>();
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

  console.log('EventDetail - eventId from params:', eventId);
  console.log('EventDetail - available mock data keys:', Object.keys(eventsMockData));

  if (!eventId) {
    return (
      <ProTripNotFound message="No event ID provided." />
    );
  }

  if (!(eventId in eventsMockData)) {
    return (
      <ProTripNotFound 
        message="The requested event could not be found."
        details={`Event ID: ${eventId}`}
        availableIds={Object.keys(eventsMockData)}
      />
    );
  }

  const eventData = eventsMockData[eventId];
  console.log('EventDetail - found event data:', eventData);

  // Convert Event data to standard trip format
  const trip = {
    id: parseInt(eventId.replace(/\D/g, '') || '1'),
    title: eventData.title,
    location: eventData.location,
    dateRange: eventData.dateRange,
    description: eventData.description || `Professional ${eventData.category.toLowerCase()} event in ${eventData.location}`,
    collaborators: eventData.participants.map(p => ({
      id: p.id,
      name: p.name,
      avatar: p.avatar
    }))
  };

  // Mock basecamp data for Events
  const basecamp = {
    name: "Event Headquarters",
    address: `${eventData.location}, Main Venue`
  };

  // Get event messages for context
  const tripMessages = getMessagesForTrip(eventId);

  // Mock data for Event context - same structure as standard trips
  const mockBroadcasts = [
    { id: 1, senderName: "Event Coordinator", content: `${eventData.category} schedule confirmed for all attendees`, timestamp: "2025-01-15T15:30:00Z" },
    { id: 2, senderName: "Operations", content: `Welcome to ${eventData.title} - check your itinerary for updates`, timestamp: "2025-01-15T10:00:00Z" }
  ];

  const mockLinks = [
    { id: 1, title: "Official Event Website", url: "https://event-official.com/info", category: "Information" },
    { id: 2, title: "Venue Information", url: "https://venues.com/events", category: "Venue" },
    { id: 3, title: "Networking Hub", url: "https://networking.events.com", category: "Networking" }
  ];

  // Build comprehensive trip context - same as standard trips
  const tripContext = {
    id: eventId,
    title: eventData.title,
    location: eventData.location,
    dateRange: eventData.dateRange,
    basecamp,
    preferences: tripPreferences,
    calendar: eventData.itinerary,
    broadcasts: mockBroadcasts,
    links: mockLinks,
    messages: tripMessages,
    collaborators: trip.collaborators,
    itinerary: eventData.itinerary,
    budget: eventData.budget,
    isPro: false,
    isEvent: true,
    groupChatEnabled: eventData.groupChatEnabled
  };

  return (
    <TripVariantProvider variant="events">
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
            tripId={eventId}
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
          tripName={eventData.title}
          tripId={eventId}
          userId={user?.id}
        />
      </div>
    </TripVariantProvider>
  );
};

export default EventDetail;
