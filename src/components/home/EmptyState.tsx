
import React from 'react';
import { MapPin } from 'lucide-react';

interface EmptyStateProps {
  viewMode: string;
  onCreateTrip: () => void;
}

export const EmptyState = ({ viewMode, onCreateTrip }: EmptyStateProps) => {
  return (
    <div className="text-center py-16">
      <div className="w-24 h-24 bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 rounded-full flex items-center justify-center mx-auto mb-6">
        <MapPin size={40} className="text-yellow-500" />
      </div>
      <h3 className="text-2xl font-bold text-white mb-3">
        {viewMode === 'myTrips' ? 'No trips yet' : 'No professional trips yet'}
      </h3>
      <p className="text-gray-400 mb-8 max-w-md mx-auto">
        {viewMode === 'myTrips' 
          ? 'Start planning your next adventure! Create your first trip and invite friends to join.'
          : 'Manage professional trips, tours, and events with advanced collaboration tools.'
        }
      </p>
      <button
        onClick={onCreateTrip}
        className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black px-8 py-4 rounded-2xl font-semibold transition-all duration-300 hover:scale-105 shadow-lg"
      >
        Create Your First Trip
      </button>
    </div>
  );
};
