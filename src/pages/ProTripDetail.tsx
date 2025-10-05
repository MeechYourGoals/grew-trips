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
import { useDemoMode } from '../hooks/useDemoMode';
import { proTripMockData } from '../data/proTripMockData';
import { ProTripNotFound } from '../components/pro/ProTripNotFound';
import { TripPreferences as TripPreferencesType } from '../types/consumer';
import { ProTripCategory } from '../types/proCategories';

const ProTripDetail = () => {
  const { proTripId } = useParams<{ proTripId?: string }>();
  const { user } = useAuth();
  const { getMessagesForTrip } = useMessages();
  const { isDemoMode } = useDemoMode();
  const [activeTab, setActiveTab] = useState('chat');
  const [showInbox, setShowInbox] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showInvite, setShowInvite] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [showTripSettings, setShowTripSettings] = useState(false);
  const [showTripsPlusModal, setShowTripsPlusModal] = useState(false);
  const [tripPreferences, setTripPreferences] = useState<TripPreferencesType | undefined>();

  // Gate demo content
  if (!isDemoMode) {
    return (
      <ProTripNotFound 
        message="Demo Mode is disabled"
        details="Turn on Demo Mode to view sample professional trips and explore all features."
      />
    );
  }

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

  // Transform trip data to match consumer trip structure
  const participants = tripData.participants || [];

  const trip = {
    id: tripData.id,
    name: tripData.title,
    description: tripData.description || '',
    destination: tripData.location,
    start_date: tripData.dateRange.split(' - ')[0],
    end_date: tripData.dateRange.split(' - ')[1],
    created_by: 'demo-user',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    is_archived: false,
    trip_type: 'pro' as const
  };

  const basecamp = {
    name: tripData.basecamp_name || '',
    address: tripData.basecamp_address || ''
  };

  const broadcasts = tripData.broadcasts || [];
  const links = tripData.links || [];

  const tripContext = {
    ...trip,
    basecamp,
    broadcasts,
    links,
    proTripCategory: tripData.proTripCategory,
    budget: tripData.budget,
    schedule: tripData.schedule,
    roster: tripData.roster,
    roomAssignments: tripData.roomAssignments,
    perDiem: tripData.perDiem,
    settlement: tripData.settlement,
    medical: tripData.medical,
    compliance: tripData.compliance,
    media: tripData.media,
    sponsors: tripData.sponsors
  };

  return (
    <TripVariantProvider variant="pro">
      <div className="min-h-screen bg-black text-white">
        <ProTripDetailHeader
          tripContext={tripContext}
          showInbox={showInbox}
          onToggleInbox={() => setShowInbox(!showInbox)}
          onShowInvite={() => setShowInvite(true)}
          onShowTripSettings={() => setShowTripSettings(true)}
          onShowAuth={() => setShowAuth(true)}
        />

        {showInbox && (
          <MessageInbox />
        )}

        <TripHeader
          trip={{
            id: parseInt(tripData.id) || 0,
            title: tripData.title,
            location: tripData.location,
            dateRange: tripData.dateRange,
            description: tripData.description || '',
            participants: tripData.participants
          }}
          category={tripData.proTripCategory as ProTripCategory}
          tags={tripData.tags}
          onCategoryChange={() => {}}
        />

        <ProTripDetailContent
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onShowTripsPlusModal={() => setShowTripsPlusModal(true)}
          tripId={proTripId}
          basecamp={basecamp}
          tripPreferences={tripPreferences}
          onPreferencesChange={setTripPreferences}
          tripData={tripData}
          selectedCategory={tripData.proTripCategory as ProTripCategory}
        />

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
