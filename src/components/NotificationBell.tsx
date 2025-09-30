
import React, { useState } from 'react';
import { Bell, MessageCircle, Calendar, Radio, X, FilePlus, Image, BarChart2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getDemoMode } from '@/utils/demoMode';

interface Notification {
  id: string;
  type: 'message' | 'broadcast' | 'calendar' | 'poll' | 'files' | 'photos';
  title: string;
  description: string;
  tripId: string;
  tripName: string;
  timestamp: string;
  isRead: boolean;
  isHighPriority?: boolean;
}

export const NotificationBell = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState<Notification[]>(getDemoMode() ? [
    {
      id: '1',
      type: 'message',
      title: 'New message in Spring Break Cancun',
      description: 'Sarah Chen: Super excited for this trip!',
      tripId: '1',
      tripName: 'Spring Break Cancun',
      timestamp: '2 minutes ago',
      isRead: false,
      isHighPriority: false
    },
    {
      id: '2',
      type: 'broadcast',
      title: 'Broadcast in Spring Break Cancun',
      description: 'Marcus Johnson: Just booked my flight',
      tripId: '1',
      tripName: 'Spring Break Cancun',
      timestamp: '1 hour ago',
      isRead: false,
      isHighPriority: true
    }
  ] : []);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleNotificationClick = (notification: Notification) => {
    setNotifications(prev => 
      prev.map(n => n.id === notification.id ? { ...n, isRead: true } : n)
    );

    if (notification.type === 'message') {
      navigate(`/trip/${notification.tripId}?tab=chat`);
    } else if (notification.type === 'calendar') {
      navigate(`/trip/${notification.tripId}?tab=calendar`);
    } else {
      navigate(`/trip/${notification.tripId}`);
    }

    setIsOpen(false);
  };

  const getNotificationIcon = (type: string, isHighPriority?: boolean) => {
    const iconClass = isHighPriority ? 'text-red-400' : 'text-gray-400';
    
    switch (type) {
      case 'message':
        return <MessageCircle size={16} className={iconClass} />;
      case 'broadcast':
        return <Radio size={16} className={iconClass} />;
      case 'calendar':
        return <Calendar size={16} className={iconClass} />;
      case 'poll':
        return <BarChart2 size={16} className={iconClass} />;
      case 'files':
        return <FilePlus size={16} className={iconClass} />;
      case 'photos':
        return <Image size={16} className={iconClass} />;
      default:
        return <Bell size={16} className={iconClass} />;
    }
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-gray-900/80 backdrop-blur-md border border-gray-700 hover:bg-gray-800/80 hover:border-gray-600 text-white p-3 rounded-2xl transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl relative"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-bold">
            {unreadCount > 9 ? '9+' : unreadCount}
          </div>
        )}
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          
          <div className="absolute right-0 top-full mt-2 w-96 bg-gray-900/95 backdrop-blur-md border border-gray-700 rounded-2xl shadow-2xl z-50 max-h-96 overflow-hidden">
            <div className="p-4 border-b border-gray-700 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">Notifications</h3>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-sm text-glass-orange hover:text-glass-yellow transition-colors"
                  >
                    Mark all read
                  </button>
                )}
                <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white transition-colors">
                  <X size={16} />
                </button>
              </div>
            </div>

            <div className="max-h-80 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-6 text-center text-gray-400">
                  <Bell size={32} className="mx-auto mb-2 opacity-50" />
                  <p>No notifications yet</p>
                </div>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    onClick={() => handleNotificationClick(notification)}
                    className={`p-4 border-b border-gray-700/50 hover:bg-gray-800/50 cursor-pointer transition-colors ${
                      !notification.isRead ? 'bg-gray-800/30' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-1">
                        {getNotificationIcon(notification.type, notification.isHighPriority)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className={`text-sm font-medium ${!notification.isRead ? 'text-white' : 'text-gray-300'}`}>
                            {notification.title}
                          </p>
                          {notification.isHighPriority && (
                            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                          )}
                          {!notification.isRead && (
                            <div className="w-2 h-2 bg-glass-orange rounded-full"></div>
                          )}
                        </div>
                        <p className="text-xs text-gray-400 mb-1 truncate">
                          {notification.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <p className="text-xs text-gray-500">{notification.tripName}</p>
                          <p className="text-xs text-gray-500">{notification.timestamp}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
