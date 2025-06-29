
import React, { useState } from 'react';
import { X, User, Bell, Crown, LogOut } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { ProUpgradeModal } from './ProUpgradeModal';
import { EnterpriseSettings } from './EnterpriseSettings';
import { ConsumerSettings } from './ConsumerSettings';
import { ProfileSection } from './settings/ProfileSection';
import { useTripVariant } from '../contexts/TripVariantContext';
import { NotificationsSection } from './settings/NotificationsSection';
import { SubscriptionSection } from './settings/SubscriptionSection';

interface SettingsMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsMenu = ({ isOpen, onClose }: SettingsMenuProps) => {
  const { user, signOut } = useAuth();
  const [showProModal, setShowProModal] = useState(false);
  const [activeSection, setActiveSection] = useState('profile');
  const [settingsType, setSettingsType] = useState<'consumer' | 'enterprise'>('consumer');
  const { accentColors } = useTripVariant();

  if (!isOpen || !user) return null;

  // Mock organization data - would come from your auth context
  const userOrganization = {
    id: 'org-123',
    name: 'Acme Entertainment Group',
    role: 'owner',
    hasProAccess: true
  };

  // If enterprise section is active and user has pro access, show full enterprise settings
  if (activeSection === 'enterprise' && userOrganization?.hasProAccess) {
    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50">
        <div className="h-full bg-white/10 backdrop-blur-md border-r border-white/20 w-full">
          <div className="flex items-center justify-between p-6 border-b border-white/20">
            <h2 className="text-xl font-semibold text-white">Enterprise Settings</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-white">
              <X size={24} />
            </button>
          </div>
          <EnterpriseSettings 
            organizationId={userOrganization.id} 
            currentUserId={user.id} 
          />
        </div>
      </div>
    );
  }

  const sections = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'subscription', label: 'Subscription', icon: Crown }
  ];

  const renderSection = () => {
    switch (activeSection) {
      case 'profile':
        return <ProfileSection userOrganization={userOrganization} />;
      case 'notifications':
        return <NotificationsSection />;
      case 'subscription':
        return (
          <SubscriptionSection 
            userOrganization={userOrganization}
            onShowProModal={() => setShowProModal(true)}
            onShowEnterpriseSettings={() => setActiveSection('enterprise')}
          />
        );
      default:
        return <ProfileSection userOrganization={userOrganization} />;
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50">
        {/* REMOVED max-w-md constraint to fix the settings width issue */}
        <div className="h-full bg-white/10 backdrop-blur-md border-r border-white/20 w-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/20">
            <h2 className="text-xl font-semibold text-white">Settings</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-white">
              <X size={24} />
            </button>
          </div>

          {/* Settings Type Toggle */}
          <div className="p-6 border-b border-white/20">
            <div className="bg-white/10 rounded-xl p-1 flex">
              <button
                onClick={() => setSettingsType('consumer')}
                className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                  settingsType === 'consumer'
                    ? `bg-${accentColors.primary} text-white`
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Consumer
              </button>
              <button
                onClick={() => setSettingsType('enterprise')}
                className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                  settingsType === 'enterprise'
                    ? `bg-${accentColors.primary} text-white`
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Enterprise
              </button>
            </div>
          </div>

          {/* Render appropriate settings based on toggle */}
          {settingsType === 'consumer' ? (
            <div className="h-full">
              <ConsumerSettings currentUserId={user.id} />
            </div>
          ) : (
            <div className="h-full">
              <EnterpriseSettings 
                organizationId={userOrganization?.id || 'default-org'} 
                currentUserId={user.id} 
              />
            </div>
          )}

          {/* Sign Out Button - Only show for consumer settings */}
          {settingsType === 'consumer' && (
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-white/5 border-t border-white/20">
              <button
                onClick={signOut}
                className="w-full flex items-center justify-center gap-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 font-medium py-3 rounded-xl transition-colors"
              >
                <LogOut size={16} />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>

      <ProUpgradeModal 
        isOpen={showProModal} 
        onClose={() => setShowProModal(false)} 
      />
    </>
  );
};
