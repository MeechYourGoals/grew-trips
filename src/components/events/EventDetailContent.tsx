
import React from 'react';
import { Sparkles, Users, Calendar, Network, ClipboardList, MessageCircle, MessageSquare } from 'lucide-react';
import { TripChat } from '../TripChat';
import { PerplexityChat } from '../PerplexityChat';
import { GroupCalendar } from '../GroupCalendar';

import { RegistrationTab } from './RegistrationTab';
import { AgendaBuilder } from './AgendaBuilder';
import { SpeakerDirectory } from './SpeakerDirectory';
import { LiveQAPanel } from './LiveQAPanel';
import { EnhancedNetworkingHub } from './EnhancedNetworkingHub';
import { TripTasksTab } from '../todo/TripTasksTab';

import { EventData } from '../../types/events';
import { useTripVariant } from '../../contexts/TripVariantContext';

interface EventDetailContentProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onShowTripsPlusModal: () => void;
  tripId: string;
  basecamp: { name: string; address: string };
  eventData: EventData;
  tripContext: any;
}

export const EventDetailContent = ({
  activeTab,
  onTabChange,
  onShowTripsPlusModal,
  tripId,
  basecamp,
  eventData,
  tripContext
}: EventDetailContentProps) => {
  const { accentColors } = useTripVariant();

  const tabs = [
    { id: 'chat', label: 'Chat', icon: MessageCircle },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'todo', label: 'Tasks', icon: ClipboardList },
    { id: 'agenda', label: 'Agenda', icon: Calendar, eventOnly: true },
    { id: 'speakers', label: 'Speakers', icon: Users, eventOnly: true },
    { id: 'networking', label: 'Networking', icon: Network, eventOnly: true },
    { id: 'live-qa', label: 'Live Q&A', icon: MessageSquare, eventOnly: true },
    { id: 'ai-chat', label: 'Concierge', icon: Sparkles }
  ];

  const visibleTabs = tabs;

  const renderTabContent = () => {
    switch (activeTab) {
      case 'chat':
        return <TripChat groupChatEnabled={true} />;
      case 'calendar':
        return <GroupCalendar />;
      case 'todo':
        return <TripTasksTab tripId={tripId} />;
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
          <EnhancedNetworkingHub
            eventId={tripId}
            attendees={eventData.participants.map(p => ({
              id: p.id.toString(),
              name: p.name,
              avatar: p.avatar,
              role: p.role,
              company: 'Sample Company',
              bio: 'Passionate about innovation and networking.',
              interests: ['technology', 'innovation', 'startups']
            }))}
          />
        );
      case 'live-qa':
        return (
          <LiveQAPanel
            sessionId="current-session"
            eventId={tripId}
            userRole={(eventData.userRole === 'exhibitor' ? 'attendee' : eventData.userRole) || 'attendee'}
          />
        );
      case 'ai-chat':
        return (
          <PerplexityChat 
            tripId={tripId}
            basecamp={basecamp}
          />
        );
      default:
        return <TripChat groupChatEnabled={true} />;
    }
  };

  return (
    <>
      {/* Enhanced Tab Navigation for Events */}
      <div className="flex overflow-x-auto whitespace-nowrap scroll-smooth gap-2 mb-8 pb-2 -mx-2 px-2 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 justify-center">
        {visibleTabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex-shrink-0 min-w-max px-4 py-3 rounded-lg font-medium transition-all duration-200 text-sm flex items-center gap-2 ${
                activeTab === tab.id
                  ? `bg-gradient-to-r ${accentColors.gradient} text-white shadow-md`
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
