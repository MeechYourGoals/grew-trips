
import React from 'react';
import { Bell } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useTripVariant } from '../../contexts/TripVariantContext';

export const NotificationsSection = () => {
  const { user, updateNotificationSettings } = useAuth();
  const { accentColors } = useTripVariant();

  if (!user) return null;

  const handleNotificationToggle = (setting: string) => {
    updateNotificationSettings({
      [setting]: !user.notificationSettings[setting as keyof typeof user.notificationSettings]
    });
  };

  return (
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
                value ? `bg-${accentColors.primary}` : 'bg-gray-600'
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
