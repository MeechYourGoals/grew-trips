
import React from 'react';
import { Crown, Sparkles } from 'lucide-react';
import { TripTabs } from '../TripTabs';
import { PlacesSection } from '../PlacesSection';
import { TripPreferences } from '../TripPreferences';
import { GeminiAIChat } from '../GeminiAIChat';
import { TripSearchTab } from '../TripSearchTab';
import { TripPreferences as TripPreferencesType } from '../../types/consumer';
import { useTripVariant } from '../../contexts/TripVariantContext';
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
  const { variant, accentColors } = useTripVariant();

  const tabs = [
    { id: 'chat', label: 'Home' },
    { id: 'places', label: 'Places' },
    { id: 'preferences', label: 'Preferences', premium: variant === 'consumer' }, // Always available for Pro
    { id: 'ai-chat', label: 'AI Assistant', premium: variant === 'consumer' }, // Always available for Pro
    { id: 'search', label: 'Search' } // New search tab - always available
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
      case 'search':
        return <TripSearchTab tripId={tripId} />;
      default:
        return <TripTabs activeTab="chat" onTabChange={() => {}} tripId={tripId} />;
    }
  };

  return (
    <>
      {/* Tab Navigation - Updated order: Home | Places | Preferences | AI Assistant | Search */}
      <div className="flex overflow-x-auto whitespace-nowrap scroll-smooth gap-2 mb-8 pb-2 -mx-2 px-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              if (tab.premium && !isPlus && variant === 'consumer') {
                onShowTripsPlusModal();
              } else {
                onTabChange(tab.id);
              }
            }}
            className={`flex-shrink-0 min-w-max px-4 md:px-6 py-3 rounded-xl font-medium transition-all duration-200 text-sm md:text-base flex items-center gap-2 ${
              activeTab === tab.id
                ? `bg-gradient-to-r ${accentColors.gradient} text-white`
                : 'bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white'
            }`}
          >
            {tab.label}
            {tab.premium && !isPlus && variant === 'consumer' && (
              <Crown size={16} className={`text-${accentColors.primary}`} />
            )}
            {((tab.premium && isPlus) || variant === 'pro') && (tab.id === 'preferences' || tab.id === 'ai-chat') && (
              <Sparkles size={16} className={`text-${accentColors.primary}`} />
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {renderTabContent()}
    </>
  );
};
