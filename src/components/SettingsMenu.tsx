
import React, { useState } from 'react';
import { X, User, Bell, Crown, LogOut, Mail, Phone, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { ProUpgradeModal } from './ProUpgradeModal';

interface SettingsMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsMenu = ({ isOpen, onClose }: SettingsMenuProps) => {
  const { user, updateProfile, signOut } = useAuth();
  const [showProModal, setShowProModal] = useState(false);
  const [activeSection, setActiveSection] = useState('profile');

  if (!isOpen || !user) return null;

  const handleNotificationToggle = (setting: string) => {
    updateProfile({
      notificationSettings: {
        ...user.notificationSettings,
        [setting]: !user.notificationSettings[setting as keyof typeof user.notificationSettings]
      }
    });
  };

  const renderProfileSection = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-20 h-20 bg-gradient-to-r from-glass-orange to-glass-yellow rounded-full mx-auto mb-4 flex items-center justify-center">
          {user.avatar ? (
            <img src={user.avatar} alt="Profile" className="w-full h-full rounded-full" />
          ) : (
            <User size={32} className="text-white" />
          )}
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">{user.displayName}</h3>
        <p className="text-gray-400 text-sm">{user.email || user.phone}</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-gray-300 text-sm mb-2">Display Name</label>
          <input
            type="text"
            value={user.displayName}
            onChange={(e) => updateProfile({ displayName: e.target.value })}
            className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-glass-orange"
          />
        </div>

        <div>
          <label className="block text-gray-300 text-sm mb-2">Contact Method</label>
          <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl">
            {user.email ? <Mail size={16} className="text-gray-400" /> : <Phone size={16} className="text-gray-400" />}
            <span className="text-white">{user.email || user.phone}</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderNotificationsSection = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-white">Notification Preferences</h3>
      
      <div className="space-y-4">
        {Object.entries(user.notificationSettings).map(([key, value]) => (
          <div key={key} className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
            <div className="flex items-center gap-3">
              <Bell size={16} className="text-gray-400" />
              <span className="text-white capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
            </div>
            <button
              onClick={() => handleNotificationToggle(key)}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                value ? 'bg-glass-orange' : 'bg-gray-600'
              }`}
            >
              <div className={`absolute w-5 h-5 bg-white rounded-full top-0.5 transition-transform ${
                value ? 'translate-x-6' : 'translate-x-0.5'
              }`} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  const renderSubscriptionSection = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Subscription</h3>
        {user.isPro && (
          <div className="flex items-center gap-2 bg-gradient-to-r from-glass-orange/20 to-glass-yellow/20 px-3 py-1 rounded-full">
            <Crown size={14} className="text-glass-orange" />
            <span className="text-glass-orange text-sm font-medium">PRO</span>
          </div>
        )}
      </div>

      {user.isPro ? (
        <div className="bg-gradient-to-r from-glass-orange/10 to-glass-yellow/10 border border-glass-orange/20 rounded-xl p-6">
          <h4 className="text-white font-semibold mb-2">Trips Pro Active</h4>
          <p className="text-gray-300 text-sm mb-4">You have access to all premium features</p>
          <ul className="space-y-2 text-sm text-gray-300">
            <li>• Tour Dashboard & Multi-city Management</li>
            <li>• Team Management & Role Permissions</li>
            <li>• Broadcast System for Announcements</li>
            <li>• Advanced Analytics & Insights</li>
            <li>• Priority Support</li>
          </ul>
        </div>
      ) : (
        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
          <h4 className="text-white font-semibold mb-2">Free Plan</h4>
          <p className="text-gray-300 text-sm mb-4">Perfect for personal trips and small groups</p>
          <button
            onClick={() => setShowProModal(true)}
            className="w-full bg-gradient-to-r from-glass-orange to-glass-yellow text-white font-medium py-3 rounded-xl hover:scale-105 transition-transform"
          >
            Upgrade to Pro - $99/month
          </button>
        </div>
      )}
    </div>
  );

  const sections = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'subscription', label: 'Subscription', icon: Crown }
  ];

  return (
    <>
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50">
        <div className="h-full bg-white/10 backdrop-blur-md border-r border-white/20 w-full max-w-md">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/20">
            <h2 className="text-xl font-semibold text-white">Settings</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-white">
              <X size={24} />
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-white/20">
            {sections.map((section) => {
              const Icon = section.icon;
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`flex-1 flex items-center justify-center gap-2 p-4 text-sm font-medium transition-colors ${
                    activeSection === section.id
                      ? 'text-glass-orange border-b-2 border-glass-orange bg-white/5'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Icon size={16} />
                  <span className="hidden sm:inline">{section.label}</span>
                </button>
              );
            })}
          </div>

          {/* Content */}
          <div className="p-6 h-full overflow-y-auto pb-24">
            {activeSection === 'profile' && renderProfileSection()}
            {activeSection === 'notifications' && renderNotificationsSection()}
            {activeSection === 'subscription' && renderSubscriptionSection()}
          </div>

          {/* Sign Out Button */}
          <div className="absolute bottom-0 left-0 right-0 p-6 bg-white/5 border-t border-white/20">
            <button
              onClick={signOut}
              className="w-full flex items-center justify-center gap-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 font-medium py-3 rounded-xl transition-colors"
            >
              <LogOut size={16} />
              Sign Out
            </button>
          </div>
        </div>
      </div>

      <ProUpgradeModal 
        isOpen={showProModal} 
        onClose={() => setShowProModal(false)} 
      />
    </>
  );
};
