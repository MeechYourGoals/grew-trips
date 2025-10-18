
import React from 'react';
import { Sparkles, Users, Calendar, ClipboardList, MessageCircle, MessageSquare, Camera, DollarSign, MapPin, BarChart3 } from 'lucide-react';
import { TripChat } from '../TripChat';
import { AIConciergeChat } from '../AIConciergeChat';
import { GroupCalendar } from '../GroupCalendar';
import { UnifiedMediaHub } from '../UnifiedMediaHub';
import { PaymentsTab } from '../payments/PaymentsTab';
import { PlacesSection } from '../PlacesSection';
import { CommentsWall } from '../CommentsWall';

import { AgendaBuilder } from './AgendaBuilder';
import { SpeakerDirectory } from './SpeakerDirectory';
import { LiveQAPanel } from './LiveQAPanel';
import { TripTasksTab } from '../todo/TripTasksTab';

import { EventData } from '../../types/events';
import { TripContext } from '@/types';
import { useTripVariant } from '../../contexts/TripVariantContext';

interface EventDetailContentProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onShowTripsPlusModal: () => void;
  tripId: string;
  basecamp: { name: string; address: string };
  eventData: EventData;
  tripContext: TripContext;
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

  // 🆕 Updated tab order: Chat, Calendar, Concierge, Media, Payments, Places, Polls, Tasks, [Event-specific tabs]
  const tabs = [
    { id: 'chat', label: 'Chat', icon: MessageCircle },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'ai-chat', label: 'Concierge', icon: Sparkles },
    { id: 'media', label: 'Media', icon: Camera },
    { id: 'payments', label: 'Payments', icon: DollarSign },
    { id: 'places', label: 'Places', icon: MapPin },
    { id: 'polls', label: 'Polls', icon: BarChart3 },
    { id: 'todo', label: 'Tasks', icon: ClipboardList },
    { id: 'agenda', label: 'Agenda', icon: Calendar, eventOnly: true },
    { id: 'speakers', label: 'Speakers', icon: Users, eventOnly: true },
    { id: 'live-qa', label: 'Live Q&A', icon: MessageSquare, eventOnly: true }
  ];

  const visibleTabs = tabs;

  const renderTabContent = () => {
    switch (activeTab) {
      case 'chat':
        return <TripChat enableGroupChat={true} showBroadcasts={true} isEvent={true} tripId={tripId} />;
      case 'calendar':
        return <GroupCalendar tripId={tripId} />;
      case 'todo':
        return <TripTasksTab tripId={tripId} />;
      case 'media':
        return <UnifiedMediaHub tripId={tripId} />;
      case 'payments':
        return <PaymentsTab tripId={tripId} />;
      case 'places':
        return <PlacesSection tripId={tripId} />;
      case 'polls':
        return <CommentsWall tripId={tripId} />;
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
          <AIConciergeChat 
            tripId={tripId}
            basecamp={basecamp}
          />
        );
      default:
        return <TripChat enableGroupChat={true} showBroadcasts={true} isEvent={true} tripId={tripId} />;
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
