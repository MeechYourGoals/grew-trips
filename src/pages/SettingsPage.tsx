
import React from 'react';
import { 
  Bell, 
  Lock, 
  User, 
  Smartphone, 
  Globe, 
  CreditCard, 
  HelpCircle, 
  LogOut,
  ChevronRight
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Switch } from '../components/ui/switch';
import { useAuth } from '../hooks/useAuth';

const SettingsPage = () => {
  const { user } = useAuth();

  const settingsGroups = [
    {
      title: 'Account',
      items: [
        { icon: User, label: 'Profile Information', hasArrow: true },
        { icon: Lock, label: 'Privacy & Security', hasArrow: true },
        { icon: CreditCard, label: 'Billing & Subscription', hasArrow: true }
      ]
    },
    {
      title: 'Preferences',
      items: [
        { icon: Bell, label: 'Notifications', hasArrow: true },
        { icon: Smartphone, label: 'Mobile App Settings', hasArrow: true },
        { icon: Globe, label: 'Language & Region', hasArrow: true }
      ]
    },
    {
      title: 'Support',
      items: [
        { icon: HelpCircle, label: 'Help Center', hasArrow: true },
        { icon: HelpCircle, label: 'Contact Support', hasArrow: true }
      ]
    }
  ];

  const toggleSettings = [
    { label: 'Push Notifications', enabled: true },
    { label: 'Email Updates', enabled: false },
    { label: 'Location Services', enabled: true },
    { label: 'Auto-save Photos', enabled: true }
  ];

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Settings</h1>
        <p className="text-gray-400">Manage your account and preferences</p>
      </div>

      {/* Quick Toggles */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4">Quick Settings</h2>
        <div className="bg-gray-900/50 border border-gray-800 rounded-lg">
          {toggleSettings.map((setting, index) => (
            <div key={index} className={`flex items-center justify-between p-4 ${
              index < toggleSettings.length - 1 ? 'border-b border-gray-800' : ''
            }`}>
              <span className="text-white">{setting.label}</span>
              <Switch defaultChecked={setting.enabled} />
            </div>
          ))}
        </div>
      </div>

      {/* Settings Groups */}
      {settingsGroups.map((group, groupIndex) => (
        <div key={groupIndex} className="mb-8">
          <h2 className="text-lg font-semibold mb-4">{group.title}</h2>
          <div className="bg-gray-900/50 border border-gray-800 rounded-lg">
            {group.items.map((item, index) => {
              const Icon = item.icon;
              return (
                <button
                  key={index}
                  className={`w-full flex items-center justify-between p-4 text-left hover:bg-gray-800/50 transition-colors ${
                    index < group.items.length - 1 ? 'border-b border-gray-800' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon size={20} className="text-gray-400" />
                    <span className="text-white">{item.label}</span>
                  </div>
                  {item.hasArrow && <ChevronRight size={16} className="text-gray-400" />}
                </button>
              );
            })}
          </div>
        </div>
      ))}

      {/* Account Info */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4">Account</h2>
        <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-4">
          <p className="text-sm text-gray-400 mb-1">Signed in as</p>
          <p className="text-white font-medium">{user?.email || 'user@example.com'}</p>
        </div>
      </div>

      {/* Sign Out */}
      <Button 
        variant="destructive" 
        className="w-full h-12 mb-8"
        size="lg"
      >
        <LogOut className="mr-2" size={18} />
        Sign Out
      </Button>

      {/* App Version */}
      <div className="text-center text-gray-500 text-sm">
        <p>App Version 1.0.0</p>
        <p>© 2024 Ravel</p>
      </div>
    </div>
  );
};

export default SettingsPage;
