
import React, { useState } from 'react';
import { Calendar, MapPin, Users, Plus, Settings } from 'lucide-react';
import { InviteModal } from './InviteModal';
import { useAuth } from '../hooks/useAuth';

interface TripHeaderProps {
  trip: {
    id: number;
    title: string;
    location: string;
    dateRange: string;
    description: string;
    collaborators: Array<{
      id: number;
      name: string;
      avatar: string;
    }>;
  };
  onManageUsers?: () => void;
}

export const TripHeader = ({ trip, onManageUsers }: TripHeaderProps) => {
  const { user } = useAuth();
  const [showInvite, setShowInvite] = useState(false);

  return (
    <>
      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 mb-8">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
          {/* Trip Info */}
          <div className="flex-1">
            <h1 className="text-4xl font-bold text-white mb-4">{trip.title}</h1>
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
              <div className="flex items-center gap-2 text-gray-300">
                <MapPin size={18} className="text-glass-orange" />
                <span>{trip.location}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-300">
                <Calendar size={18} className="text-glass-orange" />
                <span>{trip.dateRange}</span>
              </div>
            </div>
            <p className="text-gray-300 text-lg leading-relaxed">
              {trip.description}
            </p>
          </div>

          {/* Collaborators */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 min-w-[280px]">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Users size={20} className="text-glass-orange" />
                <h3 className="text-white font-semibold">Trip Collaborators</h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-400 text-sm">{trip.collaborators.length}</span>
                {onManageUsers && (
                  <button
                    onClick={onManageUsers}
                    className="text-gray-400 hover:text-glass-orange transition-colors p-1 rounded-lg hover:bg-white/10"
                    title="Manage users"
                  >
                    <Settings size={16} />
                  </button>
                )}
              </div>
            </div>
            
            <div className="space-y-3 mb-4">
              {trip.collaborators.map((collaborator) => (
                <div key={collaborator.id} className="flex items-center gap-3">
                  <img
                    src={collaborator.avatar}
                    alt={collaborator.name}
                    className="w-10 h-10 rounded-full border-2 border-white/20"
                  />
                  <span className="text-white font-medium">{collaborator.name}</span>
                </div>
              ))}
            </div>

            {user && (
              <button
                onClick={() => setShowInvite(true)}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-glass-orange to-glass-yellow hover:from-glass-orange/80 hover:to-glass-yellow/80 text-white font-medium py-3 rounded-xl transition-all duration-200 hover:scale-105"
              >
                <Plus size={16} />
                Invite to Trip
              </button>
            )}
          </div>
        </div>
      </div>

      <InviteModal 
        isOpen={showInvite} 
        onClose={() => setShowInvite(false)}
        tripName={trip.title}
        tripId={trip.id.toString()}
      />
    </>
  );
};
