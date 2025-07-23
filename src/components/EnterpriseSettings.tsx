import React, { useState } from 'react';
import { Building, Users, CreditCard, Settings, Bell, User, Crown, Wallet, Calendar, Package, Badge, DollarSign, Star, Users as UsersIcon, Heart, ChevronDown } from 'lucide-react';
import { TravelWallet } from './TravelWallet';
import { OrganizationSection } from './enterprise/OrganizationSection';
import { BillingSection } from './enterprise/BillingSection';
import { SeatManagementSection } from './enterprise/SeatManagementSection';
import { EnterpriseProfileSection } from './enterprise/EnterpriseProfileSection';
import { EnterpriseNotificationsSection } from './enterprise/EnterpriseNotificationsSection';
import { EnterprisePrivacySection } from './enterprise/EnterprisePrivacySection';
import { EnterpriseGeneralSettings } from './enterprise/EnterpriseGeneralSettings';
import { IntegrationsSection } from './enterprise/IntegrationsSection';
import { GameSchedule } from './enterprise/GameSchedule';
import { ShowSchedule } from './enterprise/ShowSchedule';
import { CredentialControl } from './enterprise/CredentialControl';
import { SettlementPanel } from './enterprise/SettlementPanel';
import { SponsorDashboard } from './enterprise/SponsorDashboard';
import { ScoutingExport } from './enterprise/ScoutingExport';
import { PlayerAvailability } from './enterprise/PlayerAvailability';
import { TripCategory } from '../types/enterprise';
import { useIsMobile } from '../hooks/use-mobile';

interface EnterpriseSettingsProps {
  organizationId: string;
  currentUserId: string;
  defaultSection?: string;
}

export const EnterpriseSettings = ({ organizationId, currentUserId, defaultSection = 'organization' }: EnterpriseSettingsProps) => {
  const [activeSection, setActiveSection] = useState(defaultSection);
  const [tripCategory, setTripCategory] = useState<TripCategory>('sports-pro');
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const isMobile = useIsMobile();

  // Mock organization data
  const organization = {
    id: organizationId,
    name: 'Acme Entertainment Group',
    displayName: 'Acme Entertainment',
    subscriptionTier: 'growing' as const,
    subscriptionStatus: 'active' as const,
    seatLimit: 25,
    seatsUsed: 18,
    billingEmail: 'billing@acme.com',
    subscriptionEndsAt: '2025-12-15',
    currentUserRole: 'owner'
  };

  // Category-specific sidebar configuration
  const getSidebarSections = (category: TripCategory) => {
    const baseSections = [
      { id: 'organization', label: 'Organization Profile', icon: Building },
      { id: 'integrations', label: 'Integrations', icon: Settings },
      { id: 'billing', label: 'Billing & Subscription', icon: CreditCard }
    ];

    const categorySpecificSections: Record<TripCategory, any[]> = {
      'sports-pro': [
        { id: 'seats', label: 'Team & Roles', icon: Users },
        { id: 'game-schedule', label: 'Game Schedule', icon: Calendar },
        { id: 'credentials', label: 'Credential & Badge Control', icon: Badge },
        { id: 'travel-wallet', label: 'Travel Wallet (Org)', icon: Wallet },
        { id: 'notifications', label: 'Notifications & Broadcast', icon: Bell },
        { id: 'availability', label: 'Player Availability', icon: Heart },
        { id: 'privacy', label: 'General & Privacy', icon: Settings }
      ],
      'sports-college': [
        { id: 'seats', label: 'Team & Roles', icon: Users },
        { id: 'game-schedule', label: 'Game Schedule', icon: Calendar },
        { id: 'credentials', label: 'Credential & Badge Control', icon: Badge },
        { id: 'travel-wallet', label: 'Travel Wallet (Org)', icon: Wallet },
        { id: 'scouting', label: 'Scouting & CRM Export', icon: UsersIcon },
        { id: 'notifications', label: 'Notifications & Broadcast', icon: Bell },
        { id: 'availability', label: 'Player Availability', icon: Heart },
        { id: 'privacy', label: 'General & Privacy', icon: Settings }
      ],
      'sports-hs-aau': [
        { id: 'seats', label: 'Team & Roles (Staff)', icon: Users },
        { id: 'game-schedule', label: 'Game Schedule', icon: Calendar },
        { id: 'credentials', label: 'Credential & Badge Control', icon: Badge },
        { id: 'travel-wallet', label: 'Travel Wallet (Org)', icon: Wallet },
        { id: 'scouting', label: 'Scouting & CRM Export', icon: UsersIcon },
        { id: 'notifications', label: 'Notifications & Broadcast', icon: Bell },
        { id: 'availability', label: 'Player Availability', icon: Heart },
        { id: 'privacy', label: 'General & Privacy', icon: Settings }
      ],
      'tour-music': [
        { id: 'seats', label: 'Team & Roles', icon: Users },
        { id: 'show-schedule', label: 'Show Schedule', icon: Calendar },
        { id: 'credentials', label: 'Credential & Badge Control', icon: Badge },
        { id: 'travel-wallet', label: 'Travel Wallet', icon: Wallet },
        { id: 'settlement', label: 'Settlement & Revenue', icon: DollarSign },
        { id: 'sponsors', label: 'Sponsor & Deliverables', icon: Star },
        { id: 'notifications', label: 'Notifications & Broadcast', icon: Bell },
        { id: 'privacy', label: 'General & Privacy', icon: Settings }
      ],
      'tour-comedy': [
        { id: 'seats', label: 'Team & Roles', icon: Users },
        { id: 'show-schedule', label: 'Show Schedule', icon: Calendar },
        { id: 'credentials', label: 'Credential & Badge Control', icon: Badge },
        { id: 'travel-wallet', label: 'Travel Wallet', icon: Wallet },
        { id: 'settlement', label: 'Settlement & Revenue', icon: DollarSign },
        { id: 'sponsors', label: 'Sponsor & Deliverables', icon: Star },
        { id: 'notifications', label: 'Notifications & Broadcast', icon: Bell },
        { id: 'privacy', label: 'General & Privacy', icon: Settings }
      ],
      'tour-other': [
        { id: 'seats', label: 'Team & Roles', icon: Users },
        { id: 'show-schedule', label: 'Show Schedule', icon: Calendar },
        { id: 'credentials', label: 'Credential & Badge Control', icon: Badge },
        { id: 'travel-wallet', label: 'Travel Wallet', icon: Wallet },
        { id: 'settlement', label: 'Settlement & Revenue', icon: DollarSign },
        { id: 'sponsors', label: 'Sponsor & Deliverables', icon: Star },
        { id: 'notifications', label: 'Notifications & Broadcast', icon: Bell },
        { id: 'privacy', label: 'General & Privacy', icon: Settings }
      ],
      'influencer': [
        { id: 'seats', label: 'Team & Roles', icon: Users },
        { id: 'credentials', label: 'Credential & Badge Control', icon: Badge },
        { id: 'travel-wallet', label: 'Travel Wallet', icon: Wallet },
        { id: 'settlement', label: 'Settlement & Revenue', icon: DollarSign },
        { id: 'sponsors', label: 'Sponsor & Deliverables', icon: Star },
        { id: 'notifications', label: 'Notifications & Broadcast', icon: Bell },
        { id: 'privacy', label: 'General & Privacy', icon: Settings }
      ],
      'retreat': [
        { id: 'travel-wallet', label: 'Travel Wallet', icon: Wallet },
        { id: 'notifications', label: 'Notifications & Broadcast', icon: Bell },
        { id: 'privacy', label: 'General & Privacy', icon: Settings }
      ],
      'recruit': [
        { id: 'seats', label: 'Team & Roles', icon: Users },
        { id: 'credentials', label: 'Credential & Badge Control', icon: Badge },
        { id: 'travel-wallet', label: 'Travel Wallet', icon: Wallet },
        { id: 'scouting', label: 'Scouting & CRM Export', icon: UsersIcon },
        { id: 'notifications', label: 'Notifications & Broadcast', icon: Bell },
        { id: 'privacy', label: 'General & Privacy', icon: Settings }
      ],
      'biz': [
        { id: 'travel-wallet', label: 'Travel Wallet', icon: Wallet },
        { id: 'notifications', label: 'Notifications & Broadcast', icon: Bell },
        { id: 'privacy', label: 'General & Privacy', icon: Settings }
      ],
      'field': [
        { id: 'seats', label: 'Team & Roles (Staff)', icon: Users },
        { id: 'credentials', label: 'Credential & Badge Control', icon: Badge },
        { id: 'notifications', label: 'Notifications & Broadcast', icon: Bell },
        { id: 'privacy', label: 'General & Privacy', icon: Settings }
      ],
      'film': [
        { id: 'seats', label: 'Team & Roles', icon: Users },
        { id: 'credentials', label: 'Credential & Badge Control', icon: Badge },
        { id: 'travel-wallet', label: 'Travel Wallet', icon: Wallet },
        { id: 'settlement', label: 'Settlement & Revenue', icon: DollarSign },
        { id: 'sponsors', label: 'Sponsor & Deliverables', icon: Star },
        { id: 'notifications', label: 'Notifications & Broadcast', icon: Bell },
        { id: 'availability', label: 'Player Availability', icon: Heart },
        { id: 'privacy', label: 'General & Privacy', icon: Settings }
      ],
      'nonprofit': [
        { id: 'seats', label: 'Team & Roles', icon: Users },
        { id: 'credentials', label: 'Credential & Badge Control', icon: Badge },
        { id: 'travel-wallet', label: 'Travel Wallet', icon: Wallet },
        { id: 'sponsors', label: 'Sponsor & Deliverables', icon: Star },
        { id: 'notifications', label: 'Notifications & Broadcast', icon: Bell },
        { id: 'privacy', label: 'General & Privacy', icon: Settings }
      ]
    };

    return [...baseSections, ...categorySpecificSections[category]];
  };

  const renderSection = () => {
    switch (activeSection) {
      case 'organization': return <OrganizationSection organization={organization} />;
      case 'integrations': return <IntegrationsSection />;
      case 'billing': return <BillingSection organization={organization} />;
      case 'seats': return <SeatManagementSection organization={organization} tripCategory={tripCategory} />;
      case 'profile': return <EnterpriseProfileSection />;
      case 'travel-wallet': return <div><TravelWallet userId={currentUserId} /></div>;
      case 'notifications': return <EnterpriseNotificationsSection />;
      case 'privacy': return <EnterprisePrivacySection />;
      case 'settings': return <EnterpriseGeneralSettings />;
      case 'game-schedule': return <GameSchedule />;
      case 'show-schedule': return <ShowSchedule />;
      case 'credentials': return <CredentialControl />;
      case 'settlement': return <SettlementPanel />;
      case 'sponsors': return <SponsorDashboard />;
      case 'scouting': return <ScoutingExport />;
      case 'availability': return <PlayerAvailability tripCategory={tripCategory} />;
      default: return <OrganizationSection organization={organization} />;
    }
  };

  const categoryOptions = [
    { value: 'sports-pro', label: 'Sports – Pro Team' },
    { value: 'sports-college', label: 'Sports – Collegiate' },
    { value: 'sports-hs-aau', label: 'Sports – High School & AAU' },
    { value: 'tour-music', label: 'Tour – Music' },
    { value: 'tour-comedy', label: 'Tour – Comedy' },
    { value: 'tour-other', label: 'Tour – Podcasts, Creators, etc.' },
    { value: 'influencer', label: 'Influencer / Creator Activation' },
    { value: 'retreat', label: 'Company Retreat' },
    { value: 'recruit', label: 'Recruiting Trip' },
    { value: 'biz', label: 'Business Travel (Sales / Exec)' },
    { value: 'field', label: 'School Field Trip' },
    { value: 'film', label: 'Content' },
    { value: 'nonprofit', label: 'Non-Profit Mission (Humanitarian)' }
  ];

  const sections = getSidebarSections(tripCategory);
  const currentSection = sections.find(s => s.id === activeSection);

  // When integrated into dashboard, render without the full layout
  if (defaultSection !== 'organization') {
    return (
      <div className="w-full">
        {renderSection()}
      </div>
    );
  }

  if (isMobile) {
    return (
      <div className="flex flex-col h-full w-full min-w-0">
        {/* Mobile Trip Category Selector */}
        <div className="flex-shrink-0 p-4 border-b border-white/20">
          <label className="block text-sm text-gray-300 mb-2">Trip Category</label>
          <select
            value={tripCategory}
            onChange={(e) => {
              setTripCategory(e.target.value as TripCategory);
              setActiveSection('organization');
            }}
            className="w-full bg-gray-800/50 border border-gray-600 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-glass-orange/50 mb-3"
          >
            {categoryOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

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

  // Desktop layout (unchanged)
  return (
    <div className="flex h-full w-full min-w-0">
      {/* Desktop Sidebar */}
      <div className="w-80 flex-shrink-0 bg-white/5 backdrop-blur-md border-r border-white/10 p-6 overflow-y-auto">
        <h2 className="text-xl font-bold text-white mb-6">Enterprise Settings</h2>
        
        {/* Trip Category Selector */}
        <div className="mb-6">
          <label className="block text-sm text-gray-300 mb-2">Trip Category</label>
          <select
            value={tripCategory}
            onChange={(e) => {
              setTripCategory(e.target.value as TripCategory);
              setActiveSection('organization');
            }}
            className="w-full bg-gray-800/50 border border-gray-600 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-glass-orange/50"
          >
            {categoryOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

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
