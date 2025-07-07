
import React, { useState } from 'react';
import { Calendar, CreditCard, Users, Clock, Building, Badge, Network, Megaphone, Activity, BarChart } from 'lucide-react';
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

interface EventsSettingsProps {
  currentUserId: string;
}

export const EventsSettings = ({ currentUserId }: EventsSettingsProps) => {
  const [activeSection, setActiveSection] = useState('setup');

  const sections = [
    { id: 'setup', label: 'Event Setup', icon: Calendar },
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

  const renderSection = () => {
    switch (activeSection) {
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
      default: return <EventProfileSection />;
    }
  };

  return (
    <div className="flex h-full w-full min-w-0">
      {/* Sidebar */}
      <div className="w-80 flex-shrink-0 bg-white/5 backdrop-blur-md border-r border-white/10 p-6">
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
      <div className="flex-1 min-w-0 overflow-y-auto p-8">
        {renderSection()}
      </div>
    </div>
  );
};
