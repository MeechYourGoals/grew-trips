
import React from 'react';
import { MapPin, Calendar } from 'lucide-react';

interface Collaborator {
  id: number;
  name: string;
  avatar: string;
}

interface Trip {
  id: number;
  title: string;
  location: string;
  dateRange: string;
  description: string;
  collaborators: Collaborator[];
}

interface TripHeaderProps {
  trip: Trip;
}

export const TripHeader = ({ trip }: TripHeaderProps) => {
  return (
    <div className="mb-12 bg-gray-900 rounded-3xl p-8 shadow-2xl shadow-black/50 border border-gray-800">
      {/* Title and Collaborators */}
      <div className="flex justify-between items-start mb-6">
        <h1 className="text-4xl font-bold text-white leading-tight">{trip.title}</h1>
        <div className="flex items-center gap-4">
          <span className="text-gray-400 text-sm font-medium">Trip Collaborators:</span>
          <div className="flex -space-x-3">
            {trip.collaborators.map((collaborator, index) => (
              <div
                key={collaborator.id}
                className="relative group"
                style={{ zIndex: trip.collaborators.length - index }}
              >
                <img
                  src={collaborator.avatar}
                  alt={collaborator.name}
                  className="w-12 h-12 rounded-full border-3 border-gray-800 hover:scale-110 transition-transform duration-200 shadow-lg hover:border-red-500"
                />
                <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap border border-gray-700">
                  {collaborator.name}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Location */}
      <div className="flex items-center gap-3 text-gray-300 mb-3">
        <div className="bg-red-900/30 p-2 rounded-lg border border-red-500/30">
          <MapPin size={20} className="text-red-400" />
        </div>
        <span className="text-lg font-medium">{trip.location}</span>
      </div>

      {/* Date Range */}
      <div className="flex items-center gap-3 text-gray-300 mb-6">
        <div className="bg-yellow-900/30 p-2 rounded-lg border border-yellow-500/30">
          <Calendar size={20} className="text-yellow-400" />
        </div>
        <span className="text-lg font-medium">{trip.dateRange}</span>
      </div>

      {/* Description */}
      <p className="text-gray-400 text-lg leading-relaxed">{trip.description}</p>
    </div>
  );
};
