
import React, { useState } from 'react';
import { Calendar, CreditCard, Users, Clock, Building, Network, Megaphone, Activity, BarChart, Settings, Send, ChevronDown } from 'lucide-react';
import { EventSetupSection } from './events/EventSetupSection';
import { EventProfileSection } from './events/EventProfileSection';
import { TicketingBillingSection } from './events/TicketingBillingSection';
import { AttendeeTypesSection } from './events/AttendeeTypesSection';
import { AgendaBuilderSection } from './events/AgendaBuilderSection';
import { ExhibitorsSponsorSection } from './events/ExhibitorsSponsorSection';
import { NetworkingRulesSection } from './events/NetworkingRulesSection';
import { SegmentedBroadcastsSection } from './events/SegmentedBroadcastsSection';
import { LiveEngagementSection } from './events/LiveEngagementSection';
import { EventAnalyticsSection } from './events/EventAnalyticsSection';
import { ChatControlsSection } from './events/ChatControlsSection';
import { HeatMapDashboard } from './events/HeatMapDashboard';
import { EmergencyBroadcast } from './events/EmergencyBroadcast';
import { useIsMobile } from '../hooks/use-mobile';

interface EventsSettingsProps {
  currentUserId: string;
}

export const EventsSettings = ({ currentUserId }: EventsSettingsProps) => {
  const [activeSection, setActiveSection] = useState('setup');
  const [eventData, setEventData] = useState({});
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const isMobile = useIsMobile();

  const sections = [
    { id: 'setup', label: 'Event Setup', icon: Calendar },
    { id: 'profile', label: 'Event Profile', icon: Calendar },
    { id: 'chat', label: 'Chat Controls', icon: Users },
    { id: 'ticketing', label: 'Ticketing & Billing', icon: CreditCard },
    { id: 'attendees', label: 'Attendee Types', icon: Users },
    { id: 'agenda', label: 'Agenda Builder', icon: Clock },
    { id: 'exhibitors', label: 'Exhibitors & Sponsors', icon: Building },
    { id: 'networking', label: 'Communication Rules', icon: Network },
    { id: 'broadcasts', label: 'Segmented Broadcasts', icon: Megaphone },
    { id: 'emergency', label: 'Emergency Broadcast', icon: Activity },
    { id: 'engagement', label: 'Live Engagement', icon: Activity },
    { id: 'heatmap', label: 'Heat Map Dashboard', icon: BarChart },
    { id: 'analytics', label: 'Event Analytics', icon: BarChart }
  ];

  const handleEventDataChange = (data: any) => {
    setEventData(prev => ({ ...prev, ...data }));
  };

  const renderSection = () => {
    switch (activeSection) {
      case 'setup': return <EventSetupSection eventData={eventData} onEventDataChange={handleEventDataChange} />;
      case 'profile': return <EventProfileSection />;
      case 'chat': return <ChatControlsSection />;
      case 'ticketing': return <TicketingBillingSection />;
      case 'attendees': return <AttendeeTypesSection />;
      case 'agenda': return <AgendaBuilderSection />;
      case 'exhibitors': return <ExhibitorsSponsorSection />;
      case 'networking': return <NetworkingRulesSection />;
      case 'broadcasts': return <SegmentedBroadcastsSection />;
      case 'emergency': return <EmergencyBroadcast />;
      case 'engagement': return <LiveEngagementSection />;
      case 'heatmap': return <HeatMapDashboard />;
      case 'analytics': return <EventAnalyticsSection />;
      default: return <EventSetupSection eventData={eventData} onEventDataChange={handleEventDataChange} />;
    }
  };

  const currentSection = sections.find(s => s.id === activeSection);

  if (isMobile) {
    return (
      <div className="flex flex-col h-full w-full min-w-0">
        {/* Mobile Section Selector */}
        <div className="flex-shrink-0 p-4 border-b border-white/20">
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="w-full flex items-center justify-between p-3 bg-white/10 rounded-xl text-white"
          >
            <div className="flex items-center gap-3">
              {currentSection && <currentSection.icon size={20} />}
              <span className="text-sm">{currentSection?.label}</span>
            </div>
            <ChevronDown 
              size={20} 
              className={`transform transition-transform ${showMobileMenu ? 'rotate-180' : ''}`}
            />
          </button>
          
          {showMobileMenu && (
            <div className="mt-2 bg-white/10 rounded-xl overflow-hidden">
              {sections.map((section) => {
                const Icon = section.icon;
                return (
                  <button
                    key={section.id}
                    onClick={() => {
                      setActiveSection(section.id);
                      setShowMobileMenu(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                      activeSection === section.id
                        ? 'bg-glass-orange/20 text-glass-orange'
                        : 'text-gray-300 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <Icon size={20} />
                    <span className="text-sm">{section.label}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Mobile Content */}
        <div className="flex-1 min-w-0 overflow-y-auto">
          <div className="p-4">
            {renderSection()}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full w-full min-w-0">
      {/* Desktop Sidebar */}
      <div className="w-80 flex-shrink-0 bg-white/5 backdrop-blur-md border-r border-white/10 p-6 overflow-y-auto">
        <h2 className="text-xl font-bold text-white mb-6">Events Settings</h2>
        <div className="space-y-2">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                  activeSection === section.id
                    ? 'bg-glass-orange/20 text-glass-orange border border-glass-orange/30'
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                }`}
              >
                <Icon size={20} />
                <span className="text-sm">{section.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Desktop Main Content */}
      <div className="flex-1 min-w-0 overflow-y-auto">
        <div className="p-8 pb-24">
          {renderSection()}
        </div>
      </div>
    </div>
  );
};
