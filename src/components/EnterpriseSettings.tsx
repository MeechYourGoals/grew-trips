
import React, { useState } from 'react';
import { Building, Users, CreditCard, Shield, Settings, Bell, User, Crown, Wallet } from 'lucide-react';
import { TravelWallet } from './TravelWallet';
import { OrganizationSection } from './enterprise/OrganizationSection';
import { BillingSection } from './enterprise/BillingSection';
import { SeatManagementSection } from './enterprise/SeatManagementSection';
import { EnterpriseProfileSection } from './enterprise/EnterpriseProfileSection';
import { EnterpriseNotificationsSection } from './enterprise/EnterpriseNotificationsSection';
import { EnterprisePrivacySection } from './enterprise/EnterprisePrivacySection';
import { EnterpriseGeneralSettings } from './enterprise/EnterpriseGeneralSettings';

interface EnterpriseSettingsProps {
  organizationId: string;
  currentUserId: string;
  defaultSection?: string;
}

export const EnterpriseSettings = ({ organizationId, currentUserId, defaultSection = 'organization' }: EnterpriseSettingsProps) => {
  const [activeSection, setActiveSection] = useState(defaultSection);

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

  const sections = [
    { id: 'organization', label: 'Organization', icon: Building },
    { id: 'billing', label: 'Billing & Subscription', icon: CreditCard },
    { id: 'seats', label: 'Seat Management', icon: Users },
    { id: 'profile', label: 'Profile Settings', icon: User },
    { id: 'travel-wallet', label: 'Travel Wallet', icon: Wallet },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Privacy & Security', icon: Shield },
    { id: 'settings', label: 'General Settings', icon: Settings }
  ];

  const renderSection = () => {
    switch (activeSection) {
      case 'organization': 
        return <OrganizationSection organization={organization} />;
      case 'billing': 
        return <BillingSection organization={organization} />;
      case 'seats': 
        return <SeatManagementSection organization={organization} />;
      case 'profile': 
        return <EnterpriseProfileSection />;
      case 'travel-wallet': 
        return <div><TravelWallet userId={currentUserId} /></div>;
      case 'notifications': 
        return <EnterpriseNotificationsSection />;
      case 'privacy': 
        return <EnterprisePrivacySection />;
      case 'settings': 
        return <EnterpriseGeneralSettings />;
      default: 
        return <OrganizationSection organization={organization} />;
    }
  };

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
      <div className="flex-1 overflow-y-auto p-8">
        {renderSection()}
      </div>
    </div>
  );
};
