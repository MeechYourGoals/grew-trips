
import React from 'react';
import { Crown, Sparkles } from 'lucide-react';
import { TripTabs } from '../TripTabs';
import { PlacesSection } from '../PlacesSection';
import { TripPreferences } from '../TripPreferences';
import { GeminiAIChat } from '../GeminiAIChat';
import { TripPreferences as TripPreferencesType } from '../../types/consumer';
import { useConsumerSubscription } from '../../hooks/useConsumerSubscription';

interface TripDetailContentProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onShowTripsPlusModal: () => void;
  tripId: string;
  basecamp: { name: string; address: string };
  tripPreferences: TripPreferencesType | undefined;
  onPreferencesChange: (preferences: TripPreferencesType) => void;
}

export const TripDetailContent = ({
  activeTab,
  onTabChange,
  onShowTripsPlusModal,
  tripId,
  basecamp,
  tripPreferences,
  onPreferencesChange
}: TripDetailContentProps) => {
  const { isPlus } = useConsumerSubscription();

  const tabs = [
    { id: 'chat', label: 'Chat' },
    { id: 'places', label: 'Places' },
    { id: 'preferences', label: 'Preferences', premium: true },
    { id: 'ai-chat', label: 'AI Assistant', premium: true }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'chat':
        return <TripTabs activeTab="chat" onTabChange={() => {}} tripId={tripId} />;
      case 'places':
        return <PlacesSection />;
      case 'preferences':
        return (
          <TripPreferences 
            tripId={tripId} 
            onPreferencesChange={onPreferencesChange} 
          />
        );
      case 'ai-chat':
        return (
          <GeminiAIChat 
            tripId={tripId} 
            basecamp={basecamp}
            preferences={tripPreferences}
          />
        );
      default:
        return <TripTabs activeTab="chat" onTabChange={() => {}} tripId={tripId} />;
    }
  };

  return (
    <>
      {/* Tab Navigation */}
      <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              if (tab.premium && !isPlus) {
                onShowTripsPlusModal();
              } else {
                onTabChange(tab.id);
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
    </>
  );
};
