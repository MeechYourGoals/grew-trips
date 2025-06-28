
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MessageCircle, Settings, UserPlus, Sparkles, Crown } from 'lucide-react';
import { TripTabs } from '../components/TripTabs';
import { TripHeader } from '../components/TripHeader';
import { PlacesSection } from '../components/PlacesSection';
import { MessageInbox } from '../components/MessageInbox';
import { SettingsMenu } from '../components/SettingsMenu';
import { InviteModal } from '../components/InviteModal';
import { AuthModal } from '../components/AuthModal';
import { TripSettings } from '../components/TripSettings';
import { TripPreferences } from '../components/TripPreferences';
import { GeminiAIChat } from '../components/GeminiAIChat';
import { TripsPlusUpsellModal } from '../components/TripsPlusUpsellModal';
import { useAuth } from '../hooks/useAuth';
import { useConsumerSubscription } from '../hooks/useConsumerSubscription';
import { TripPreferences as TripPreferencesType } from '../types/consumer';

const TripDetail = () => {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isPlus } = useConsumerSubscription();
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

  const tabs = [
    { id: 'chat', label: 'Chat' },
    { id: 'places', label: 'Places' },
    { id: 'preferences', label: 'Preferences', premium: true },
    { id: 'ai-chat', label: 'AI Assistant', premium: true }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'chat':
        return <TripTabs activeTab="chat" onTabChange={() => {}} />;
      case 'places':
        return <PlacesSection />;
      case 'preferences':
        return (
          <TripPreferences 
            tripId={tripId || '1'} 
            onPreferencesChange={setTripPreferences} 
          />
        );
      case 'ai-chat':
        return (
          <GeminiAIChat 
            tripId={tripId || '1'} 
            basecamp={basecamp}
            preferences={tripPreferences}
          />
        );
      default:
        return <TripTabs activeTab="chat" onTabChange={() => {}} />;
    }
  };

  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto px-6 py-8 max-w-7xl">
        {/* Top Navigation */}
        <div className="flex items-center justify-between mb-8">
          <button 
            onClick={() => navigate('/')}
            className="flex items-center gap-3 text-gray-300 hover:text-white transition-colors group"
          >
            <div className="bg-gray-800 p-2 rounded-lg shadow-lg group-hover:shadow-red-500/20 transition-all border border-gray-700 hover:border-red-500/50">
              <ArrowLeft size={20} />
            </div>
            <span className="font-medium">Back to My Places</span>
          </button>

          <div className="flex items-center gap-3">
            {/* Trips Plus Badge */}
            {isPlus && (
              <div className="bg-gradient-to-r from-glass-orange/20 to-glass-yellow/20 backdrop-blur-sm border border-glass-orange/30 rounded-xl px-4 py-2 flex items-center gap-2">
                <Crown size={16} className="text-glass-orange" />
                <span className="text-glass-orange font-medium">TRIPS PLUS</span>
              </div>
            )}

            {user ? (
              <>
                <button
                  onClick={() => setShowInvite(true)}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl transition-colors flex items-center gap-2"
                >
                  <UserPlus size={16} />
                  <span className="hidden sm:inline">Invite</span>
                </button>
                
                <button
                  onClick={() => setShowInbox(!showInbox)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl transition-colors flex items-center gap-2"
                >
                  <MessageCircle size={16} />
                  <span className="hidden sm:inline">{showInbox ? 'Hide Inbox' : 'Messages'}</span>
                </button>

                <button
                  onClick={() => setShowTripSettings(true)}
                  className="bg-gray-700 hover:bg-gray-600 text-white p-2 rounded-xl transition-colors"
                >
                  <Settings size={20} />
                </button>
              </>
            ) : (
              <button
                onClick={() => setShowAuth(true)}
                className="bg-gradient-to-r from-glass-orange to-glass-yellow text-white px-6 py-2 rounded-xl transition-colors font-medium"
              >
                Sign In
              </button>
            )}
          </div>
        </div>

        {/* Message Inbox */}
        {showInbox && user && (
          <div className="mb-8">
            <MessageInbox />
          </div>
        )}

        {/* Trip Header */}
        <TripHeader trip={trip} />

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                if (tab.premium && !isPlus) {
                  setShowTripsPlusModal(true);
                } else {
                  setActiveTab(tab.id);
                }
              }}
              className={`flex-shrink-0 px-4 md:px-6 py-3 rounded-xl font-medium transition-all duration-200 text-sm md:text-base flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-glass-orange to-glass-yellow text-white'
                  : 'bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white'
              }`}
            >
              {tab.label}
              {tab.premium && !isPlus && (
                <Crown size={16} className="text-glass-orange" />
              )}
              {tab.premium && isPlus && (
                <Sparkles size={16} className="text-glass-orange" />
              )}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {renderTabContent()}
      </div>

      {/* Modals */}
      <SettingsMenu isOpen={showSettings} onClose={() => setShowSettings(false)} />
      <InviteModal 
        isOpen={showInvite} 
        onClose={() => setShowInvite(false)}
        tripName={trip.title}
        tripId={tripId || '1'}
      />
      <AuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} />
      <TripSettings
        isOpen={showTripSettings}
        onClose={() => setShowTripSettings(false)}
        tripId={tripId || '1'}
        tripName={trip.title}
        currentUserId={user?.id || '4'}
      />
      <TripsPlusUpsellModal
        isOpen={showTripsPlusModal}
        onClose={() => setShowTripsPlusModal(false)}
      />
    </div>
  );
};

export default TripDetail;
