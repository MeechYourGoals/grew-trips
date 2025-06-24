
import React, { useState } from 'react';
import { Settings, Users, Shield, Trash2, X } from 'lucide-react';
import { TripUserManagement } from './TripUserManagement';

interface TripUser {
  id: string;
  name: string;
  avatar: string;
  role?: 'owner' | 'admin' | 'member';
  joinedAt: string;
}

interface TripSettingsProps {
  isOpen: boolean;
  onClose: () => void;
  tripId: string;
  tripName: string;
  currentUserId: string;
}

export const TripSettings = ({ isOpen, onClose, tripId, tripName, currentUserId }: TripSettingsProps) => {
  const [activeTab, setActiveTab] = useState<'users' | 'general' | 'danger'>('users');

  // Mock users data - this would come from your backend
  const [users, setUsers] = useState<TripUser[]>([
    {
      id: '1',
      name: 'Emma Wilson',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=40&h=40&fit=crop&crop=face',
      role: 'owner',
      joinedAt: '2024-01-15'
    },
    {
      id: '2',
      name: 'Jake Thompson',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face',
      role: 'admin',
      joinedAt: '2024-01-16'
    },
    {
      id: '3',
      name: 'Sarah Chen',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face',
      role: 'member',
      joinedAt: '2024-01-18'
    },
    {
      id: '4',
      name: 'You',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face',
      role: 'member',
      joinedAt: '2024-01-20'
    }
  ]);

  if (!isOpen) return null;

  const handleUserRemoved = (userId: string) => {
    setUsers(users.filter(user => user.id !== userId));
    console.log(`User ${userId} removed from trip ${tripId}`);
  };

  const handleLeaveTrip = () => {
    console.log(`Current user left trip ${tripId}`);
    onClose();
    // Navigate back to trips list or show confirmation
  };

  const tabs = [
    { id: 'users', label: 'Members', icon: Users },
    { id: 'general', label: 'General', icon: Settings },
    { id: 'danger', label: 'Danger Zone', icon: Trash2 }
  ];

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50">
      <div className="flex h-full">
        {/* Sidebar */}
        <div className="w-80 bg-white/5 backdrop-blur-md border-r border-white/10 p-6">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold text-white">Trip Settings</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <div className="space-y-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                    activeTab === tab.id
                      ? 'bg-glass-orange/20 text-glass-orange border border-glass-orange/30'
                      : 'text-gray-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Icon size={20} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-8">
            {activeTab === 'users' && (
              <TripUserManagement
                tripId={tripId}
                tripName={tripName}
                users={users}
                currentUserId={currentUserId}
                onUserRemoved={handleUserRemoved}
                onLeaveTrip={handleLeaveTrip}
              />
            )}

            {activeTab === 'general' && (
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">General Settings</h3>
                <p className="text-gray-400">General trip settings will be implemented here.</p>
              </div>
            )}

            {activeTab === 'danger' && (
              <div className="bg-white/10 backdrop-blur-md border border-red-500/20 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-red-300 mb-4">Danger Zone</h3>
                <p className="text-gray-400 mb-6">These actions are irreversible.</p>
                <button className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl transition-colors">
                  Delete Trip
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
