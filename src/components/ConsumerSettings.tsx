
import React, { useState } from 'react';
import { User, Bell, CreditCard, Shield, Settings, Wallet } from 'lucide-react';
import { TravelWallet } from './TravelWallet';
import { ConsumerProfileSection } from './consumer/ConsumerProfileSection';
import { ConsumerBillingSection } from './consumer/ConsumerBillingSection';
import { ConsumerNotificationsSection } from './consumer/ConsumerNotificationsSection';
import { ConsumerPrivacySection } from './consumer/ConsumerPrivacySection';
import { ConsumerGeneralSettings } from './consumer/ConsumerGeneralSettings';

interface ConsumerSettingsProps {
  currentUserId: string;
}

export const ConsumerSettings = ({ currentUserId }: ConsumerSettingsProps) => {
  const [activeSection, setActiveSection] = useState('profile');

  const sections = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'billing', label: 'Billing & Subscription', icon: CreditCard },
    { id: 'travel-wallet', label: 'Travel Wallet', icon: Wallet },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Privacy & Security', icon: Shield },
    { id: 'settings', label: 'General Settings', icon: Settings }
  ];

  const renderTravelWalletSection = () => (
    <div>
      <TravelWallet userId={currentUserId} />
    </div>
  );

  const renderSection = () => {
    switch (activeSection) {
      case 'profile': return <ConsumerProfileSection />;
      case 'billing': return <ConsumerBillingSection />;
      case 'travel-wallet': return renderTravelWalletSection();
      case 'notifications': return <ConsumerNotificationsSection />;
      case 'privacy': return <ConsumerPrivacySection />;
      case 'settings': return <ConsumerGeneralSettings />;
      default: return <ConsumerProfileSection />;
    }
  };

  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <div className="w-80 bg-white/5 backdrop-blur-md border-r border-white/10 p-6">
        <h2 className="text-xl font-bold text-white mb-6">Consumer Settings</h2>
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
