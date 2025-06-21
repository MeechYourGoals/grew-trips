
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
    <div className="mb-8">
      {/* Title and Collaborators */}
      <div className="flex justify-between items-start mb-4">
        <h1 className="text-4xl font-bold text-white">{trip.title}</h1>
        <div className="flex items-center gap-3">
          <span className="text-slate-300 text-sm">Trip Collaborators:</span>
          <div className="flex -space-x-3">
            {trip.collaborators.map((collaborator, index) => (
              <img
                key={collaborator.id}
                src={collaborator.avatar}
                alt={collaborator.name}
                className="w-10 h-10 rounded-full border-2 border-slate-800 hover:scale-110 transition-transform duration-200"
                style={{ zIndex: trip.collaborators.length - index }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Location */}
      <div className="flex items-center gap-2 text-slate-300 mb-2">
        <MapPin size={18} />
        <span className="text-lg">{trip.location}</span>
      </div>

      {/* Date Range */}
      <div className="flex items-center gap-2 text-slate-300 mb-4">
        <Calendar size={18} />
        <span className="text-lg">{trip.dateRange}</span>
      </div>

      {/* Description */}
      <p className="text-slate-400 text-lg">{trip.description}</p>
    </div>
  );
};
