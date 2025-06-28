
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { TripHeader } from '../components/TripHeader';
import { MessageInbox } from '../components/MessageInbox';
import { TripDetailHeader } from '../components/trip/TripDetailHeader';
import { TripDetailContent } from '../components/trip/TripDetailContent';
import { TripDetailModals } from '../components/trip/TripDetailModals';
import { useAuth } from '../hooks/useAuth';
import { useMessages } from '../hooks/useMessages';
import { TripPreferences as TripPreferencesType } from '../types/consumer';

const TripDetail = () => {
  const { tripId } = useParams();
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

  // Sample trip data - this would come from your database
  const trip = {
    id: 1,
    title: "Summer in Paris",
    location: "Paris, France",
    dateRange: "Jul 14 - Jul 21, 2025",
    description: "Family vacation exploring the City of Light",
    collaborators: [
      { id: 1, name: "Emma", avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=40&h=40&fit=crop&crop=face" },
      { id: 2, name: "Jake", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face" },
      { id: 3, name: "Sarah", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face" }
    ]
  };

  // Mock basecamp data
  const basecamp = {
    name: "Central Paris Hotel",
    address: "123 Rue de Rivoli, 75001 Paris, France"
  };

  // Get trip messages for context
  const tripMessages = getMessagesForTrip(tripId || '1');

  // Mock data for trip context
  const mockBroadcasts = [
    { id: 1, senderName: "Emma", content: "Just booked our dinner reservation at Le Comptoir du 7ème for 7:30 PM tonight!", timestamp: "2025-01-15T15:30:00Z" },
    { id: 2, senderName: "Jake", content: "Weather looks great tomorrow - perfect for the Eiffel Tower visit at 2 PM", timestamp: "2025-01-15T10:00:00Z" }
  ];

  const mockLinks = [
    { id: 1, title: "Our Airbnb in Montmartre", url: "https://airbnb.com/rooms/123", category: "Accommodation" },
    { id: 2, title: "Louvre Museum Tickets", url: "https://louvre.fr/tickets", category: "Attractions" },
    { id: 3, title: "Best Bakeries Near Us", url: "https://timeout.com/paris/bakeries", category: "Food" }
  ];

  const mockItinerary = [
    {
      date: "2025-07-14",
      events: [
        { title: "Arrival & Check-in", location: "Central Paris Hotel", time: "14:00" },
        { title: "Dinner at Le Comptoir du 7ème", location: "8 Avenue Bosquet", time: "19:30" }
      ]
    },
    {
      date: "2025-07-15", 
      events: [
        { title: "Louvre Museum Visit", location: "Musée du Louvre", time: "10:00" },
        { title: "Eiffel Tower", location: "Champ de Mars", time: "14:00" }
      ]
    }
  ];

  // Build comprehensive trip context
  const tripContext = {
    id: tripId || '1',
    title: trip.title,
    location: trip.location,
    dateRange: trip.dateRange,
    basecamp,
    preferences: tripPreferences,
    calendar: mockItinerary,
    broadcasts: mockBroadcasts,
    links: mockLinks,
    messages: tripMessages,
    collaborators: trip.collaborators,
    itinerary: mockItinerary,
    isPro: false
  };

  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto px-6 py-8 max-w-7xl">
        {/* Top Navigation */}
        <TripDetailHeader
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

        {/* Trip Header */}
        <TripHeader trip={trip} />

        {/* Main Content */}
        <TripDetailContent
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onShowTripsPlusModal={() => setShowTripsPlusModal(true)}
          tripId={tripId || '1'}
          basecamp={basecamp}
          tripPreferences={tripPreferences}
          onPreferencesChange={setTripPreferences}
        />
      </div>

      {/* Modals */}
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
        tripName={trip.title}
        tripId={tripId || '1'}
        userId={user?.id}
      />
    </div>
  );
};

export default TripDetail;
