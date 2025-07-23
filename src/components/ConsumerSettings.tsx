
import React, { useState } from 'react';
import { User, Bell, CreditCard, Shield, Settings, Wallet, Calendar, Link, ChevronDown } from 'lucide-react';
import { TravelWallet } from './TravelWallet';
import { ConsumerProfileSection } from './consumer/ConsumerProfileSection';
import { ConsumerBillingSection } from './consumer/ConsumerBillingSection';
import { ConsumerNotificationsSection } from './consumer/ConsumerNotificationsSection';
import { ConsumerPrivacySection } from './consumer/ConsumerPrivacySection';
import { ConsumerGeneralSettings } from './consumer/ConsumerGeneralSettings';
import { ConsumerCalendarSync } from './consumer/ConsumerCalendarSync';
import { ConsumerConnectedAccounts } from './consumer/ConsumerConnectedAccounts';
import { useIsMobile } from '../hooks/use-mobile';

interface ConsumerSettingsProps {
  currentUserId: string;
}

export const ConsumerSettings = ({ currentUserId }: ConsumerSettingsProps) => {
  const [activeSection, setActiveSection] = useState('profile');
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const isMobile = useIsMobile();

  const sections = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'billing', label: 'Billing & Subscription', icon: CreditCard },
    { id: 'travel-wallet', label: 'Travel Wallet', icon: Wallet },
    { id: 'calendar-sync', label: 'Calendar Sync', icon: Calendar },
    { id: 'connected-accounts', label: 'Connected Accounts', icon: Link },
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
      case 'calendar-sync': return <ConsumerCalendarSync />;
      case 'connected-accounts': return <ConsumerConnectedAccounts />;
      case 'notifications': return <ConsumerNotificationsSection />;
      case 'privacy': return <ConsumerPrivacySection />;
      case 'settings': return <ConsumerGeneralSettings />;
      default: return <ConsumerProfileSection />;
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
              <span>{currentSection?.label}</span>
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
                    {section.label}
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

      {/* Desktop Main Content */}
      <div className="flex-1 min-w-0 overflow-y-auto">
        <div className="p-8 pb-24">
          {renderSection()}
        </div>
      </div>
    </div>
  );
};
