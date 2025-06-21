
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
    <div className="mb-12 bg-white rounded-3xl p-8 shadow-lg shadow-gray-200/50 border border-gray-200">
      {/* Title and Collaborators */}
      <div className="flex justify-between items-start mb-6">
        <h1 className="text-4xl font-bold text-gray-900 leading-tight">{trip.title}</h1>
        <div className="flex items-center gap-4">
          <span className="text-gray-600 text-sm font-medium">Trip Collaborators:</span>
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
                  className="w-12 h-12 rounded-full border-3 border-white hover:scale-110 transition-transform duration-200 shadow-lg"
                />
                <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                  {collaborator.name}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Location */}
      <div className="flex items-center gap-3 text-gray-700 mb-3">
        <div className="bg-blue-100 p-2 rounded-lg">
          <MapPin size={20} className="text-blue-600" />
        </div>
        <span className="text-lg font-medium">{trip.location}</span>
      </div>

      {/* Date Range */}
      <div className="flex items-center gap-3 text-gray-700 mb-6">
        <div className="bg-purple-100 p-2 rounded-lg">
          <Calendar size={20} className="text-purple-600" />
        </div>
        <span className="text-lg font-medium">{trip.dateRange}</span>
      </div>

      {/* Description */}
      <p className="text-gray-600 text-lg leading-relaxed">{trip.description}</p>
    </div>
  );
};
