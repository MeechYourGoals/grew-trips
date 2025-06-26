
import React, { useState } from 'react';
import { User, Bell, CreditCard, Shield, Settings, Wallet, Camera, Upload } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { SUBSCRIPTION_TIERS } from '../types/pro';
import { TravelWallet } from './TravelWallet';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';

interface ConsumerSettingsProps {
  currentUserId: string;
}

export const ConsumerSettings = ({ currentUserId }: ConsumerSettingsProps) => {
  const { user, updateProfile } = useAuth();
  const [activeSection, setActiveSection] = useState('profile');
  const [expandedPlan, setExpandedPlan] = useState<string | null>('individual');

  if (!user) return null;

  const sections = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'billing', label: 'Billing & Subscription', icon: CreditCard },
    { id: 'travel-wallet', label: 'Travel Wallet', icon: Wallet },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Privacy & Security', icon: Shield },
    { id: 'settings', label: 'General Settings', icon: Settings }
  ];

  const consumerTiers = {
    individual: {
      name: 'Individual',
      price: 0,
      features: [
        'Create up to 3 trips',
        'Invite up to 10 people per trip',
        'Basic itinerary planning',
        'Photo sharing',
        'Basic chat functionality',
        'Mobile app access'
      ]
    },
    ...SUBSCRIPTION_TIERS
  };

  const handleNotificationToggle = (setting: string) => {
    updateProfile({
      notificationSettings: {
        ...user.notificationSettings,
        [setting]: !user.notificationSettings[setting as keyof typeof user.notificationSettings]
      }
    });
  };

  const handleProfileUpdate = (field: string, value: string) => {
    updateProfile({ [field]: value });
  };

  const renderProfileSection = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-r from-glass-orange to-glass-yellow rounded-xl flex items-center justify-center">
          <User size={24} className="text-white" />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-white">Profile Settings</h3>
          <p className="text-gray-400">Manage your personal profile and preferences</p>
        </div>
      </div>

      {/* Profile Photo */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-6">
        <h4 className="text-lg font-semibold text-white mb-4">Profile Photo</h4>
        <div className="flex items-center gap-6">
          <div className="relative">
            <div className="w-24 h-24 bg-gradient-to-r from-glass-orange to-glass-yellow rounded-full flex items-center justify-center">
              {user.avatar ? (
                <img src={user.avatar} alt="Profile" className="w-full h-full rounded-full object-cover" />
              ) : (
                <User size={32} className="text-white" />
              )}
            </div>
            <button className="absolute -bottom-2 -right-2 bg-glass-orange hover:bg-glass-orange/80 text-white p-2 rounded-full transition-colors">
              <Camera size={16} />
            </button>
          </div>
          <div>
            <button className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white px-4 py-2 rounded-lg transition-colors">
              <Upload size={16} />
              Upload Photo
            </button>
            <p className="text-sm text-gray-400 mt-2">JPG, PNG or GIF. Max size 5MB.</p>
          </div>
        </div>
      </div>

      {/* Personal Information */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-6">
        <h4 className="text-lg font-semibold text-white mb-4">Personal Information</h4>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm text-gray-300 mb-2">Display Name</label>
            <input
              type="text"
              value={user.displayName}
              onChange={(e) => handleProfileUpdate('displayName', e.target.value)}
              className="w-full bg-gray-800/50 border border-gray-600 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-glass-orange/50"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-2">Email</label>
            <input
              type="email"
              value={user.email || ''}
              disabled
              className="w-full bg-gray-700/50 border border-gray-600 text-gray-400 rounded-lg px-4 py-3"
            />
          </div>
        </div>
        
        <div className="mt-6">
          <label className="block text-sm text-gray-300 mb-2">Bio</label>
          <textarea
            placeholder="Tell people a bit about yourself..."
            className="w-full bg-gray-800/50 border border-gray-600 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-glass-orange/50 resize-none"
            rows={3}
          />
        </div>
      </div>
    </div>
  );

  const renderBillingSection = () => (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold text-white">Billing & Subscription</h3>
      
      {/* Current Plan */}
      <div className="bg-gradient-to-r from-blue-500/10 to-blue-600/10 border border-blue-500/20 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="text-xl font-bold text-white">Individual Plan</h4>
            <p className="text-blue-400">Free Forever</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-white">$0/month</div>
          </div>
        </div>
        
        <div className="mb-6">
          <h5 className="font-semibold text-white mb-3">Current Plan Features</h5>
          <ul className="space-y-2 text-sm text-gray-300">
            {consumerTiers.individual.features.map((feature, index) => (
              <li key={index} className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                {feature}
              </li>
            ))}
          </ul>
        </div>

        <button className="bg-glass-orange hover:bg-glass-orange/80 text-white px-6 py-3 rounded-lg font-medium transition-colors">
          Upgrade to Pro
        </button>
      </div>

      {/* Available Plans */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-6">
        <h4 className="text-lg font-semibold text-white mb-4">Available Plans</h4>
        <div className="space-y-4">
          {Object.entries(consumerTiers).map(([key, tier]) => (
            <Collapsible key={key} open={expandedPlan === key} onOpenChange={() => setExpandedPlan(expandedPlan === key ? null : key)}>
              <CollapsibleTrigger className="w-full">
                <div className={`border rounded-lg p-4 transition-colors hover:bg-white/5 ${
                  key === 'individual' ? 'border-blue-500/50 bg-blue-500/10' : 'border-white/10 bg-white/5'
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="text-left">
                      <h5 className="font-semibold text-white">{tier.name}</h5>
                      <div className="text-xl font-bold text-white">${tier.price}/month</div>
                    </div>
                    <div className="flex items-center gap-2">
                      {key === 'individual' && <div className="text-sm text-blue-400 font-medium">Current Plan</div>}
                      <div className="text-gray-400">
                        {expandedPlan === key ? '−' : '+'}
                      </div>
                    </div>
                  </div>
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-2">
                <div className="bg-white/5 rounded-lg p-4 ml-4">
                  <h6 className="font-medium text-white mb-3">Features Included:</h6>
                  <ul className="space-y-2 text-sm text-gray-300">
                    {tier.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-glass-orange rounded-full mt-2 flex-shrink-0"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  {key !== 'individual' && (
                    <button className="mt-4 bg-glass-orange hover:bg-glass-orange/80 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                      Upgrade to {tier.name}
                    </button>
                  )}
                </div>
              </CollapsibleContent>
            </Collapsible>
          ))}
        </div>
      </div>
    </div>
  );

  const renderNotificationsSection = () => (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold text-white">Notification Preferences</h3>
      
      <div className="space-y-4">
        {Object.entries(user.notificationSettings).map(([key, value]) => (
          <div key={key} className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
            <div className="flex items-center gap-3">
              <Bell size={16} className="text-gray-400" />
              <div>
                <span className="text-white capitalize font-medium">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </span>
                <p className="text-sm text-gray-400">
                  {key === 'messages' && 'Get notified when someone sends you a message'}
                  {key === 'broadcasts' && 'Receive important announcements from trip organizers'}
                  {key === 'tripUpdates' && 'Stay informed about changes to your trips'}
                  {key === 'email' && 'Receive notifications via email'}
                  {key === 'push' && 'Get push notifications on your mobile device'}
                </p>
              </div>
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

  const renderPrivacySection = () => (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold text-white">Privacy & Security</h3>
      
      {/* Display Name Privacy */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-6">
        <h4 className="text-lg font-semibold text-white mb-4">Display Name Settings</h4>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
            <div>
              <div className="text-white font-medium">Use Real Name</div>
              <div className="text-sm text-gray-400">Show your real name to other users</div>
            </div>
            <button className="relative w-12 h-6 bg-gray-600 rounded-full transition-colors">
              <div className="absolute w-5 h-5 bg-white rounded-full top-0.5 translate-x-0.5 transition-transform" />
            </button>
          </div>
          <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
            <div>
              <div className="text-white font-medium">Use Display Name Only</div>
              <div className="text-sm text-gray-400">Show only your chosen display name</div>
            </div>
            <button className="relative w-12 h-6 bg-glass-orange rounded-full transition-colors">
              <div className="absolute w-5 h-5 bg-white rounded-full top-0.5 translate-x-6 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {/* Contact Information Privacy */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-6">
        <h4 className="text-lg font-semibold text-white mb-4">Contact Information</h4>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
            <div>
              <div className="text-white font-medium">Share Phone Number with Trip Members</div>
              <div className="text-sm text-gray-400">Allow trip members to see your phone number for direct contact</div>
            </div>
            <button className="relative w-12 h-6 bg-gray-600 rounded-full transition-colors">
              <div className="absolute w-5 h-5 bg-white rounded-full top-0.5 translate-x-0.5 transition-transform" />
            </button>
          </div>
          <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
            <div>
              <div className="text-white font-medium">Allow Direct Messages</div>
              <div className="text-sm text-gray-400">Let other users send you direct messages</div>
            </div>
            <button className="relative w-12 h-6 bg-glass-orange rounded-full transition-colors">
              <div className="absolute w-5 h-5 bg-white rounded-full top-0.5 translate-x-6 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {/* Account Security */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-6">
        <h4 className="text-lg font-semibold text-white mb-4">Account Security</h4>
        <div className="space-y-4">
          <button className="w-full flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 rounded-lg transition-colors">
            <div className="text-left">
              <div className="text-white font-medium">Change Password</div>
              <div className="text-sm text-gray-400">Update your account password</div>
            </div>
            <div className="text-glass-orange">→</div>
          </button>
          <button className="w-full flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 rounded-lg transition-colors">
            <div className="text-left">
              <div className="text-white font-medium">Two-Factor Authentication</div>
              <div className="text-sm text-gray-400">Add an extra layer of security to your account</div>
            </div>
            <div className="text-glass-orange">Set Up</div>
          </button>
          <button className="w-full flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 rounded-lg transition-colors">
            <div className="text-left">
              <div className="text-white font-medium">Login History</div>
              <div className="text-sm text-gray-400">View recent login activity</div>
            </div>
            <div className="text-glass-orange">→</div>
          </button>
        </div>
      </div>
    </div>
  );

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold text-white">General Settings</h3>
      
      {/* App Preferences */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-6">
        <h4 className="text-lg font-semibold text-white mb-4">App Preferences</h4>
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-300 mb-2">Language</label>
            <select className="w-full bg-gray-800/50 border border-gray-600 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-glass-orange/50">
              <option>English</option>
              <option>Spanish</option>
              <option>French</option>
              <option>German</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-2">Time Zone</label>
            <select className="w-full bg-gray-800/50 border border-gray-600 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-glass-orange/50">
              <option>Pacific Time (PT)</option>
              <option>Mountain Time (MT)</option>
              <option>Central Time (CT)</option>
              <option>Eastern Time (ET)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-2">Date Format</label>
            <select className="w-full bg-gray-800/50 border border-gray-600 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-glass-orange/50">
              <option>MM/DD/YYYY</option>
              <option>DD/MM/YYYY</option>
              <option>YYYY-MM-DD</option>
            </select>
          </div>
        </div>
      </div>

      {/* Data & Storage */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-6">
        <h4 className="text-lg font-semibold text-white mb-4">Data & Storage</h4>
        <div className="space-y-4">
          <button className="w-full flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 rounded-lg transition-colors">
            <div className="text-left">
              <div className="text-white font-medium">Download My Data</div>
              <div className="text-sm text-gray-400">Export all your trip data and personal information</div>
            </div>
            <div className="text-glass-orange">Download</div>
          </button>
          <button className="w-full flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 rounded-lg transition-colors">
            <div className="text-left">
              <div className="text-white font-medium">Clear Cache</div>
              <div className="text-sm text-gray-400">Clear stored app data to free up space</div>
            </div>
            <div className="text-glass-orange">Clear</div>
          </button>
        </div>
      </div>

      {/* Account Management */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-6">
        <h4 className="text-lg font-semibold text-white mb-4">Account Management</h4>
        <div className="space-y-4">
          <button className="w-full flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 rounded-lg transition-colors">
            <div className="text-left">
              <div className="text-white font-medium">Deactivate Account</div>
              <div className="text-sm text-gray-400">Temporarily disable your account</div>
            </div>
            <div className="text-yellow-500">Deactivate</div>
          </button>
          <button className="w-full flex items-center justify-between p-4 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-lg transition-colors">
            <div className="text-left">
              <div className="text-red-400 font-medium">Delete Account</div>
              <div className="text-sm text-gray-400">Permanently delete your account and all data</div>
            </div>
            <div className="text-red-400">Delete</div>
          </button>
        </div>
      </div>
    </div>
  );

  const renderTravelWalletSection = () => (
    <div>
      <TravelWallet userId={currentUserId} />
    </div>
  );

  const renderSection = () => {
    switch (activeSection) {
      case 'profile': return renderProfileSection();
      case 'billing': return renderBillingSection();
      case 'travel-wallet': return renderTravelWalletSection();
      case 'notifications': return renderNotificationsSection();
      case 'privacy': return renderPrivacySection();
      case 'settings': return renderGeneralSettings();
      default: return renderProfileSection();
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
