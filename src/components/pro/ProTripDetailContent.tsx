
import React from 'react';
import { Crown, Users, Package, Calendar, DollarSign, Shield, Tv, Trophy } from 'lucide-react';
import { TripTabs } from '../TripTabs';
import { PlacesSection } from '../PlacesSection';
import { TripPreferences } from '../TripPreferences';
import { GeminiAIChat } from '../GeminiAIChat';
import { TripSearchTab } from '../TripSearchTab';
import { RosterTab } from './RosterTab';
import { EquipmentTracking } from './EquipmentTracking';
import { TripPreferences as TripPreferencesType } from '../../types/consumer';
import { ProTripData } from '../../types/pro';
import { useTripVariant } from '../../contexts/TripVariantContext';

interface ProTripDetailContentProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onShowTripsPlusModal: () => void;
  tripId: string;
  basecamp: { name: string; address: string };
  tripPreferences: TripPreferencesType | undefined;
  onPreferencesChange: (preferences: TripPreferencesType) => void;
  tripData: ProTripData;
}

export const ProTripDetailContent = ({
  activeTab,
  onTabChange,
  onShowTripsPlusModal,
  tripId,
  basecamp,
  tripPreferences,
  onPreferencesChange,
  tripData
}: ProTripDetailContentProps) => {
  const { accentColors } = useTripVariant();

  const tabs = [
    { id: 'chat', label: 'Chat', icon: null },
    { id: 'roster', label: 'Roster', icon: Users, proOnly: true },
    { id: 'equipment', label: 'Equipment', icon: Package, proOnly: true },
    { id: 'schedule', label: 'Schedule', icon: Calendar, proOnly: true },
    { id: 'finance', label: 'Finance', icon: DollarSign, proOnly: true },
    { id: 'compliance', label: 'Compliance', icon: Shield, proOnly: true },
    { id: 'media', label: 'Media', icon: Tv, proOnly: true },
    { id: 'places', label: 'Places', icon: null },
    { id: 'preferences', label: 'Preferences', icon: null },
    { id: 'ai-chat', label: 'AI Assistant', icon: null },
    { id: 'search', label: 'Search', icon: null }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'chat':
        return <TripTabs activeTab="chat" onTabChange={() => {}} tripId={tripId} />;
      case 'roster':
        return (
          <RosterTab
            roster={tripData.roster || []}
            userRole="admin" // This would come from user context
          />
        );
      case 'equipment':
        return (
          <EquipmentTracking
            equipment={tripData.equipment || []}
            userRole="admin" // This would come from user context
          />
        );
      case 'schedule':
        return (
          <div className="p-6">
            <div className="text-center py-12">
              <Calendar size={48} className="text-red-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-400 mb-2">Load-in/Load-out Scheduler</h3>
              <p className="text-gray-500 text-sm">Advanced scheduling for sound-check, practice, and equipment management</p>
            </div>
          </div>
        );
      case 'finance':
        return (
          <div className="p-6">
            <div className="text-center py-12">
              <DollarSign size={48} className="text-red-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-400 mb-2">Financial Management</h3>
              <p className="text-gray-500 text-sm">Per-diem automation, settlement tracking, and expense management</p>
            </div>
          </div>
        );
      case 'compliance':
        return (
          <div className="p-6">
            <div className="text-center py-12">
              <Shield size={48} className="text-red-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-400 mb-2">Compliance & Welfare</h3>
              <p className="text-gray-500 text-sm">Medical logs, regulatory compliance, and team welfare tracking</p>
            </div>
          </div>
        );
      case 'media':
        return (
          <div className="p-6">
            <div className="text-center py-12">
              <Tv size={48} className="text-red-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-400 mb-2">Media & PR Management</h3>
              <p className="text-gray-500 text-sm">Interview scheduling, press routing, and sponsor activation tracking</p>
            </div>
          </div>
        );
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
      {/* Enhanced Tab Navigation for Pro */}
      <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex-shrink-0 px-3 md:px-4 py-3 rounded-xl font-medium transition-all duration-200 text-sm md:text-base flex items-center gap-2 ${
                activeTab === tab.id
                  ? `bg-gradient-to-r ${accentColors.gradient} text-white`
                  : 'bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white'
              }`}
            >
              {Icon && <Icon size={16} />}
              {tab.label}
              {tab.proOnly && (
                <Crown size={14} className={`text-${accentColors.primary}`} />
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      {renderTabContent()}
    </>
  );
};
