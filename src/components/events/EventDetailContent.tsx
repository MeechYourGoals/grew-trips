
import React from 'react';
import { Crown, Sparkles, Users, Calendar, UserCheck, Network, TrendingUp } from 'lucide-react';
import { TripTabs } from '../TripTabs';
import { PlacesSection } from '../PlacesSection';
import { TripPreferences } from '../TripPreferences';
import { OpenAIChat } from '../OpenAIChat';
import { TripSearchTab } from '../TripSearchTab';
import { RegistrationTab } from './RegistrationTab';
import { AgendaBuilder } from './AgendaBuilder';
import { NetworkingHub } from './NetworkingHub';
import { SpeakerDirectory } from './SpeakerDirectory';
import { TripPreferences as TripPreferencesType } from '../../types/consumer';
import { EventData } from '../../types/events';
import { useTripVariant } from '../../contexts/TripVariantContext';

interface EventDetailContentProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onShowTripsPlusModal: () => void;
  tripId: string;
  basecamp: { name: string; address: string };
  tripPreferences: TripPreferencesType | undefined;
  onPreferencesChange: (preferences: TripPreferencesType) => void;
  eventData: EventData;
  tripContext: any;
}

export const EventDetailContent = ({
  activeTab,
  onTabChange,
  onShowTripsPlusModal,
  tripId,
  basecamp,
  tripPreferences,
  onPreferencesChange,
  eventData,
  tripContext
}: EventDetailContentProps) => {
  const { accentColors } = useTripVariant();

  const tabs = [
    { id: 'chat', label: 'Chat', icon: null },
    { id: 'registration', label: 'Registration', icon: UserCheck, eventOnly: true },
    { id: 'agenda', label: 'Agenda', icon: Calendar, eventOnly: true },
    { id: 'speakers', label: 'Speakers', icon: Users, eventOnly: true },
    { id: 'networking', label: 'Networking', icon: Network, eventOnly: true },
    { id: 'places', label: 'Places', icon: null },
    { id: 'preferences', label: 'Preferences', icon: null },
    { id: 'ai-chat', label: 'AI Assistant', icon: null },
    { id: 'search', label: 'Search', icon: null },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp, eventOnly: true, organinerOnly: true }
  ];

  const visibleTabs = tabs.filter(tab => {
    if (tab.organinerOnly && eventData.userRole !== 'organizer') return false;
    return true;
  });

  const renderTabContent = () => {
    switch (activeTab) {
      case 'chat':
        return <TripTabs activeTab="chat" onTabChange={() => {}} tripId={tripId} />;
      case 'registration':
        return (
          <RegistrationTab
            eventId={tripId}
            capacity={eventData.capacity || eventData.attendanceExpected}
            registeredCount={eventData.attendanceExpected}
            checkedInCount={eventData.checkedInCount || Math.floor(eventData.attendanceExpected * 0.3)}
            registrationStatus={eventData.registrationStatus || 'open'}
            userRole={eventData.userRole || 'attendee'}
          />
        );
      case 'agenda':
        return (
          <AgendaBuilder
            tracks={eventData.tracks || []}
            sessions={eventData.sessions || []}
            speakers={eventData.speakers || []}
            userRole={eventData.userRole || 'attendee'}
          />
        );
      case 'speakers':
        return (
          <SpeakerDirectory
            speakers={eventData.speakers || []}
            userRole={eventData.userRole || 'attendee'}
          />
        );
      case 'networking':
        return (
          <NetworkingHub
            eventId={tripId}
            userRole={eventData.userRole || 'attendee'}
          />
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
          <OpenAIChat
            tripId={tripId}
            basecamp={basecamp}
            preferences={tripPreferences}
          />
        );
      case 'search':
        return <TripSearchTab tripId={tripId} />;
      case 'analytics':
        return (
          <div className="p-6">
            <div className="text-center py-12">
              <TrendingUp size={48} className="text-blue-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-400 mb-2">Event Analytics</h3>
              <p className="text-gray-500 text-sm">Real-time event insights and attendee analytics coming soon</p>
            </div>
          </div>
        );
      default:
        return <TripTabs activeTab="chat" onTabChange={() => {}} tripId={tripId} />;
    }
  };

  return (
    <>
      {/* Enhanced Tab Navigation for Events */}
      <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
        {visibleTabs.map((tab) => {
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
              {tab.eventOnly && (
                <Sparkles size={14} className={`text-${accentColors.primary}`} />
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
