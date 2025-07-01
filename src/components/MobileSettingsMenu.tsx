
import React, { useState } from 'react';
import { X, User, Bell, Crown, LogOut, ArrowLeft, ChevronRight } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { ProfileSection } from './settings/ProfileSection';
import { NotificationsSection } from './settings/NotificationsSection';
import { SubscriptionSection } from './settings/SubscriptionSection';
import { useTripVariant } from '../contexts/TripVariantContext';

interface MobileSettingsMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onShowProModal: () => void;
}

export const MobileSettingsMenu = ({ isOpen, onClose, onShowProModal }: MobileSettingsMenuProps) => {
  const { user, signOut } = useAuth();
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const { accentColors } = useTripVariant();

  if (!isOpen || !user) return null;

  // Mock organization data
  const userOrganization = {
    id: 'org-123',
    name: 'Acme Entertainment Group',
    role: 'owner',
    hasProAccess: true
  };

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
            onShowProModal={onShowProModal}
            onShowEnterpriseSettings={() => {}}
          />
        );
      default:
        return null;
    }
  };

  // Main menu view
  if (!activeSection) {
    return (
      <div className="fixed inset-0 bg-black/95 backdrop-blur-sm z-50">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/20">
            <h2 className="text-xl font-semibold text-white">Settings</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-white p-2">
              <X size={24} />
            </button>
          </div>

          {/* Profile Card */}
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center gap-4">
              <div className={`w-16 h-16 bg-gradient-to-r ${accentColors.gradient} rounded-full flex items-center justify-center`}>
                {user.avatar ? (
                  <img src={user.avatar} alt="Profile" className="w-full h-full rounded-full" />
                ) : (
                  <User size={24} className="text-white" />
                )}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">{user.displayName}</h3>
                <p className="text-gray-400 text-sm">{user.email || user.phone}</p>
              </div>
            </div>
          </div>

          {/* Menu Options */}
          <div className="flex-1 p-6">
            <div className="space-y-2">
              {sections.map((section) => {
                const Icon = section.icon;
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className="w-full flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 rounded-xl transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Icon size={20} className="text-gray-400" />
                      <span className="text-white font-medium">{section.label}</span>
                    </div>
                    <ChevronRight size={20} className="text-gray-400" />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sign Out */}
          <div className="p-6 border-t border-white/10">
            <button
              onClick={signOut}
              className="w-full flex items-center justify-center gap-3 bg-red-500/20 hover:bg-red-500/30 text-red-400 font-medium py-4 rounded-xl transition-colors"
            >
              <LogOut size={20} />
              Sign Out
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Section detail view
  return (
    <div className="fixed inset-0 bg-black/95 backdrop-blur-sm z-50">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center gap-4 p-6 border-b border-white/20">
          <button
            onClick={() => setActiveSection(null)}
            className="text-gray-400 hover:text-white p-2"
          >
            <ArrowLeft size={20} />
          </button>
          <h2 className="text-xl font-semibold text-white">
            {sections.find(s => s.id === activeSection)?.label}
          </h2>
        </div>

        {/* Section Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {renderSection()}
        </div>
      </div>
    </div>
  );
};
