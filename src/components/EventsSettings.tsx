
import React, { useState } from 'react';
import { Calendar, CreditCard, Users, Clock, Building, Badge, Network, Megaphone, Activity, BarChart, Settings, Send } from 'lucide-react';
import { EventProfileSection } from './events/EventProfileSection';
import { TicketingBillingSection } from './events/TicketingBillingSection';
import { AttendeeTypesSection } from './events/AttendeeTypesSection';
import { AgendaBuilderSection } from './events/AgendaBuilderSection';
import { ExhibitorsSponsorSection } from './events/ExhibitorsSponsorSection';
import { BadgeAccessSection } from './events/BadgeAccessSection';
import { NetworkingRulesSection } from './events/NetworkingRulesSection';
import { SegmentedBroadcastsSection } from './events/SegmentedBroadcastsSection';
import { LiveEngagementSection } from './events/LiveEngagementSection';
import { EventAnalyticsSection } from './events/EventAnalyticsSection';
import { ChatControlsSection } from './events/ChatControlsSection';
import { HeatMapDashboard } from './events/HeatMapDashboard';
import { EmergencyBroadcast } from './events/EmergencyBroadcast';
import { EventSetupWizard } from './events/EventSetupWizard';
import { EventBasicsSection } from './events/EventBasicsSection';
import { EventScheduleSection } from './events/EventScheduleSection';
import { EventInvitationsSection } from './events/EventInvitationsSection';

interface EventsSettingsProps {
  currentUserId: string;
}

export const EventsSettings = ({ currentUserId }: EventsSettingsProps) => {
  const [activeSection, setActiveSection] = useState('basics');
  const [eventData, setEventData] = useState({});

  const sections = [
    { id: 'basics', label: 'Event Basics', icon: Calendar },
    { id: 'schedule', label: 'Setup & Schedule', icon: Settings },
    { id: 'invitations', label: 'Invitations', icon: Send },
    { id: 'setup', label: 'Event Setup Wizard', icon: Calendar },
    { id: 'profile', label: 'Event Profile', icon: Calendar },
    { id: 'chat', label: 'Chat Controls', icon: Users },
    { id: 'ticketing', label: 'Ticketing & Billing', icon: CreditCard },
    { id: 'attendees', label: 'Attendee Types', icon: Users },
    { id: 'agenda', label: 'Agenda Builder', icon: Clock },
    { id: 'exhibitors', label: 'Exhibitors & Sponsors', icon: Building },
    { id: 'badges', label: 'Badge & Access', icon: Badge },
    { id: 'networking', label: 'Networking Rules', icon: Network },
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
      case 'basics': return <EventBasicsSection eventData={eventData} onEventDataChange={handleEventDataChange} />;
      case 'schedule': return <EventScheduleSection eventData={eventData} onEventDataChange={handleEventDataChange} />;
      case 'invitations': return <EventInvitationsSection eventData={eventData} onEventDataChange={handleEventDataChange} />;
      case 'setup': return <EventSetupWizard onComplete={() => {}} onCancel={() => {}} />;
      case 'profile': return <EventProfileSection />;
      case 'chat': return <ChatControlsSection />;
      case 'ticketing': return <TicketingBillingSection />;
      case 'attendees': return <AttendeeTypesSection />;
      case 'agenda': return <AgendaBuilderSection />;
      case 'exhibitors': return <ExhibitorsSponsorSection />;
      case 'badges': return <BadgeAccessSection />;
      case 'networking': return <NetworkingRulesSection />;
      case 'broadcasts': return <SegmentedBroadcastsSection />;
      case 'emergency': return <EmergencyBroadcast />;
      case 'engagement': return <LiveEngagementSection />;
      case 'heatmap': return <HeatMapDashboard />;
      case 'analytics': return <EventAnalyticsSection />;
      default: return <EventBasicsSection eventData={eventData} onEventDataChange={handleEventDataChange} />;
    }
  };

  return (
    <div className="flex h-full w-full min-w-0">
      {/* Sidebar */}
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
                {section.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 min-w-0 overflow-y-auto">
        <div className="p-8 pb-24">
          {renderSection()}
        </div>
      </div>
    </div>
  );
};
