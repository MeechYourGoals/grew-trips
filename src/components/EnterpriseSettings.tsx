
import React, { useState } from 'react';
import { Building, Users, CreditCard, Shield, Settings, Bell, User, Crown, Wallet, Calendar, Package, Badge, DollarSign, Star, Users as UsersIcon, Heart } from 'lucide-react';
import { TravelWallet } from './TravelWallet';
import { OrganizationSection } from './enterprise/OrganizationSection';
import { BillingSection } from './enterprise/BillingSection';
import { SeatManagementSection } from './enterprise/SeatManagementSection';
import { EnterpriseProfileSection } from './enterprise/EnterpriseProfileSection';
import { EnterpriseNotificationsSection } from './enterprise/EnterpriseNotificationsSection';
import { EnterprisePrivacySection } from './enterprise/EnterprisePrivacySection';
import { EnterpriseGeneralSettings } from './enterprise/EnterpriseGeneralSettings';
import { GameSchedule } from './enterprise/GameSchedule';
import { ShowSchedule } from './enterprise/ShowSchedule';
import { EquipmentManager } from './enterprise/EquipmentManager';
import { CredentialControl } from './enterprise/CredentialControl';
import { SettlementPanel } from './enterprise/SettlementPanel';
import { SponsorDashboard } from './enterprise/SponsorDashboard';
import { ComplianceCenter } from './enterprise/ComplianceCenter';
import { ScoutingExport } from './enterprise/ScoutingExport';
import { WellnessLog } from './enterprise/WellnessLog';
import { TripCategory } from '../types/enterprise';

interface EnterpriseSettingsProps {
  organizationId: string;
  currentUserId: string;
  defaultSection?: string;
}

export const EnterpriseSettings = ({ organizationId, currentUserId, defaultSection = 'organization' }: EnterpriseSettingsProps) => {
  const [activeSection, setActiveSection] = useState(defaultSection);
  const [tripCategory, setTripCategory] = useState<TripCategory>('sports-pro');

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
      { id: 'billing', label: 'Billing & Subscription', icon: CreditCard }
    ];

    const categorySpecificSections: Record<TripCategory, any[]> = {
      'sports-pro': [
        { id: 'seats', label: 'Roster & Roles', icon: Users },
        { id: 'game-schedule', label: 'Game Schedule', icon: Calendar },
        { id: 'equipment', label: 'Equipment & Freight', icon: Package },
        { id: 'credentials', label: 'Credential & Badge Control', icon: Badge },
        { id: 'travel-wallet', label: 'Travel Wallet (Org)', icon: Wallet },
        { id: 'compliance', label: 'Compliance Center', icon: Shield },
        { id: 'notifications', label: 'Notifications & Broadcast', icon: Bell },
        { id: 'wellness', label: 'Wellness & Medical Log', icon: Heart },
        { id: 'privacy', label: 'General & Privacy', icon: Settings }
      ],
      'sports-college': [
        { id: 'seats', label: 'Roster & Roles', icon: Users },
        { id: 'game-schedule', label: 'Game Schedule', icon: Calendar },
        { id: 'equipment', label: 'Equipment & Freight', icon: Package },
        { id: 'credentials', label: 'Credential & Badge Control', icon: Badge },
        { id: 'travel-wallet', label: 'Travel Wallet (Org)', icon: Wallet },
        { id: 'compliance', label: 'Compliance Center', icon: Shield },
        { id: 'scouting', label: 'Scouting & CRM Export', icon: UsersIcon },
        { id: 'notifications', label: 'Notifications & Broadcast', icon: Bell },
        { id: 'wellness', label: 'Wellness & Medical Log', icon: Heart },
        { id: 'privacy', label: 'General & Privacy', icon: Settings }
      ],
      'sports-hs': [
        { id: 'seats', label: 'Roster & Roles (Staff)', icon: Users },
        { id: 'game-schedule', label: 'Game Schedule', icon: Calendar },
        { id: 'equipment', label: 'Equipment & Freight', icon: Package },
        { id: 'credentials', label: 'Credential & Badge Control', icon: Badge },
        { id: 'compliance', label: 'Compliance Center', icon: Shield },
        { id: 'notifications', label: 'Notifications & Broadcast', icon: Bell },
        { id: 'privacy', label: 'General & Privacy', icon: Settings }
      ],
      'sports-aau': [
        { id: 'seats', label: 'Roster & Roles', icon: Users },
        { id: 'game-schedule', label: 'Game Schedule', icon: Calendar },
        { id: 'equipment', label: 'Equipment & Freight', icon: Package },
        { id: 'credentials', label: 'Credential & Badge Control', icon: Badge },
        { id: 'travel-wallet', label: 'Travel Wallet (Org)', icon: Wallet },
        { id: 'compliance', label: 'Compliance Center', icon: Shield },
        { id: 'scouting', label: 'Scouting & CRM Export', icon: UsersIcon },
        { id: 'notifications', label: 'Notifications & Broadcast', icon: Bell },
        { id: 'wellness', label: 'Wellness & Medical Log', icon: Heart },
        { id: 'privacy', label: 'General & Privacy', icon: Settings }
      ],
      'tour-music': [
        { id: 'seats', label: 'Roster & Roles', icon: Users },
        { id: 'show-schedule', label: 'Show Schedule', icon: Calendar },
        { id: 'equipment', label: 'Equipment & Freight', icon: Package },
        { id: 'credentials', label: 'Credential & Badge Control', icon: Badge },
        { id: 'travel-wallet', label: 'Travel Wallet', icon: Wallet },
        { id: 'settlement', label: 'Settlement & Revenue', icon: DollarSign },
        { id: 'sponsors', label: 'Sponsor & Deliverables', icon: Star },
        { id: 'notifications', label: 'Notifications & Broadcast', icon: Bell },
        { id: 'privacy', label: 'General & Privacy', icon: Settings }
      ],
      'tour-comedy': [
        { id: 'seats', label: 'Roster & Roles', icon: Users },
        { id: 'show-schedule', label: 'Show Schedule', icon: Calendar },
        { id: 'equipment', label: 'Equipment & Freight', icon: Package },
        { id: 'credentials', label: 'Credential & Badge Control', icon: Badge },
        { id: 'travel-wallet', label: 'Travel Wallet', icon: Wallet },
        { id: 'settlement', label: 'Settlement & Revenue', icon: DollarSign },
        { id: 'sponsors', label: 'Sponsor & Deliverables', icon: Star },
        { id: 'notifications', label: 'Notifications & Broadcast', icon: Bell },
        { id: 'privacy', label: 'General & Privacy', icon: Settings }
      ],
      'tour-other': [
        { id: 'seats', label: 'Roster & Roles', icon: Users },
        { id: 'show-schedule', label: 'Show Schedule', icon: Calendar },
        { id: 'equipment', label: 'Equipment & Freight', icon: Package },
        { id: 'credentials', label: 'Credential & Badge Control', icon: Badge },
        { id: 'travel-wallet', label: 'Travel Wallet', icon: Wallet },
        { id: 'settlement', label: 'Settlement & Revenue', icon: DollarSign },
        { id: 'sponsors', label: 'Sponsor & Deliverables', icon: Star },
        { id: 'notifications', label: 'Notifications & Broadcast', icon: Bell },
        { id: 'privacy', label: 'General & Privacy', icon: Settings }
      ],
      'influencer': [
        { id: 'seats', label: 'Roster & Roles', icon: Users },
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
        { id: 'seats', label: 'Roster & Roles', icon: Users },
        { id: 'credentials', label: 'Credential & Badge Control', icon: Badge },
        { id: 'travel-wallet', label: 'Travel Wallet', icon: Wallet },
        { id: 'compliance', label: 'Compliance Center', icon: Shield },
        { id: 'scouting', label: 'Scouting & CRM Export', icon: UsersIcon },
        { id: 'notifications', label: 'Notifications & Broadcast', icon: Bell },
        { id: 'privacy', label: 'General & Privacy', icon: Settings }
      ],
      'biz': [
        { id: 'travel-wallet', label: 'Travel Wallet', icon: Wallet },
        { id: 'compliance', label: 'Compliance Center (Policy)', icon: Shield },
        { id: 'notifications', label: 'Notifications & Broadcast', icon: Bell },
        { id: 'privacy', label: 'General & Privacy', icon: Settings }
      ],
      'field': [
        { id: 'seats', label: 'Roster & Roles (Staff)', icon: Users },
        { id: 'credentials', label: 'Credential & Badge Control', icon: Badge },
        { id: 'compliance', label: 'Compliance Center', icon: Shield },
        { id: 'notifications', label: 'Notifications & Broadcast', icon: Bell },
        { id: 'privacy', label: 'General & Privacy', icon: Settings }
      ],
      'film': [
        { id: 'seats', label: 'Roster & Roles', icon: Users },
        { id: 'equipment', label: 'Equipment & Freight', icon: Package },
        { id: 'credentials', label: 'Credential & Badge Control', icon: Badge },
        { id: 'travel-wallet', label: 'Travel Wallet', icon: Wallet },
        { id: 'settlement', label: 'Settlement & Revenue', icon: DollarSign },
        { id: 'sponsors', label: 'Sponsor & Deliverables', icon: Star },
        { id: 'compliance', label: 'Compliance Center (Union)', icon: Shield },
        { id: 'notifications', label: 'Notifications & Broadcast', icon: Bell },
        { id: 'wellness', label: 'Wellness & Medical Log', icon: Heart },
        { id: 'privacy', label: 'General & Privacy', icon: Settings }
      ],
      'nonprofit': [
        { id: 'seats', label: 'Roster & Roles', icon: Users },
        { id: 'equipment', label: 'Equipment & Freight', icon: Package },
        { id: 'credentials', label: 'Credential & Badge Control', icon: Badge },
        { id: 'travel-wallet', label: 'Travel Wallet', icon: Wallet },
        { id: 'sponsors', label: 'Sponsor & Deliverables', icon: Star },
        { id: 'compliance', label: 'Compliance Center', icon: Shield },
        { id: 'notifications', label: 'Notifications & Broadcast', icon: Bell },
        { id: 'privacy', label: 'General & Privacy', icon: Settings }
      ]
    };

    return [...baseSections, ...categorySpecificSections[category]];
  };

  const renderSection = () => {
    switch (activeSection) {
      case 'organization': return <OrganizationSection organization={organization} />;
      case 'billing': return <BillingSection organization={organization} />;
      case 'seats': return <SeatManagementSection organization={organization} />;
      case 'profile': return <EnterpriseProfileSection />;
      case 'travel-wallet': return <div><TravelWallet userId={currentUserId} /></div>;
      case 'notifications': return <EnterpriseNotificationsSection />;
      case 'privacy': return <EnterprisePrivacySection />;
      case 'settings': return <EnterpriseGeneralSettings />;
      case 'game-schedule': return <GameSchedule />;
      case 'show-schedule': return <ShowSchedule />;
      case 'equipment': return <EquipmentManager />;
      case 'credentials': return <CredentialControl />;
      case 'settlement': return <SettlementPanel />;
      case 'sponsors': return <SponsorDashboard />;
      case 'compliance': return <ComplianceCenter />;
      case 'scouting': return <ScoutingExport />;
      case 'wellness': return <WellnessLog />;
      default: return <OrganizationSection organization={organization} />;
    }
  };

  const categoryOptions = [
    { value: 'sports-pro', label: 'Sports – Pro Team' },
    { value: 'sports-college', label: 'Sports – Collegiate' },
    { value: 'sports-hs', label: 'Sports – High School' },
    { value: 'sports-aau', label: 'Sports – AAU / Travel Circuit' },
    { value: 'tour-music', label: 'Tour – Music' },
    { value: 'tour-comedy', label: 'Tour – Comedy' },
    { value: 'tour-other', label: 'Tour – Other (theatre, dance)' },
    { value: 'influencer', label: 'Influencer / Creator Activation' },
    { value: 'retreat', label: 'Company Retreat' },
    { value: 'recruit', label: 'Recruiting Trip' },
    { value: 'biz', label: 'Business Travel (Sales / Exec)' },
    { value: 'field', label: 'School Field Trip' },
    { value: 'film', label: 'Film / TV Production' },
    { value: 'nonprofit', label: 'Non-Profit Mission (Humanitarian)' }
  ];

  const sections = getSidebarSections(tripCategory);

  // When integrated into dashboard, render without the full layout
  if (defaultSection !== 'organization') {
    return (
      <div className="w-full">
        {renderSection()}
      </div>
    );
  }

  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <div className="w-80 bg-white/5 backdrop-blur-md border-r border-white/10 p-6">
        <h2 className="text-xl font-bold text-white mb-6">Enterprise Settings</h2>
        
        {/* Trip Category Selector */}
        <div className="mb-6">
          <label className="block text-sm text-gray-300 mb-2">Trip Category</label>
          <select
            value={tripCategory}
            onChange={(e) => {
              setTripCategory(e.target.value as TripCategory);
              setActiveSection('organization'); // Reset to first section when category changes
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

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-8">
        {renderSection()}
      </div>
    </div>
  );
};
