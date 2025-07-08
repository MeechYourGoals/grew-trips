
import React from 'react';
import { Bell } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export const ConsumerNotificationsSection = () => {
  const { user, updateNotificationSettings } = useAuth();

  // Create mock user for demo mode when no real user is authenticated
  const mockUser = {
    id: 'demo-user-123',
    email: 'demo@example.com',
    displayName: 'Demo User',
    notificationSettings: {
      messages: true,
      broadcasts: true,
      tripUpdates: true,
      email: true,
      push: false
    }
  };

  const currentUser = user || mockUser;
  const currentUpdateNotificationSettings = user ? updateNotificationSettings : () => console.log('Demo mode - notification settings update clicked');

  const handleNotificationToggle = (setting: string) => {
    currentUpdateNotificationSettings({
      [setting]: !currentUser.notificationSettings[setting as keyof typeof currentUser.notificationSettings]
    });
  };

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold text-white">Notification Preferences</h3>
      
      <div className="space-y-4">
        {Object.entries(currentUser.notificationSettings).map(([key, value]) => (
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
};
