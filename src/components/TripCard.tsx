import React from 'react';
import { Calendar, MapPin, Trash, User, Plus } from 'lucide-react';

interface Participant {
  id: number;
  name: string;
  avatar: string;
}

interface Trip {
  id: number;
  title: string;
  location: string;
  dateRange: string;
  participants: Participant[];
}

interface TripCardProps {
  trip: Trip;
}

export const TripCard = ({ trip }: TripCardProps) => {
  return (
    <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 hover:bg-slate-800/60 transition-all duration-300 hover:scale-105 hover:shadow-xl group">
      {/* Header with delete button */}
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">
          {trip.title}
        </h3>
        <button className="text-slate-400 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100">
          <Trash size={18} />
        </button>
      </div>

      {/* Location */}
      <div className="flex items-center gap-2 text-slate-300 mb-4">
        <MapPin size={16} />
        <span>{trip.location}</span>
      </div>

      {/* Date */}
      <div className="flex items-center gap-2 text-slate-300 mb-6">
        <Calendar size={16} />
        <span>{trip.dateRange}</span>
      </div>

      {/* Participants */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-sm text-slate-400">People on this trip:</span>
          <button className="text-blue-400 hover:text-blue-300 transition-colors">
            <Plus size={16} />
          </button>
          <button className="text-slate-400 hover:text-slate-300 transition-colors">
            <User size={16} />
          </button>
        </div>
        
        <div className="flex -space-x-3">
          {trip.participants.map((participant, index) => (
            <img
              key={participant.id}
              src={participant.avatar}
              alt={participant.name}
              className="w-10 h-10 rounded-full border-2 border-slate-800 hover:scale-110 transition-transform duration-200"
              style={{ zIndex: trip.participants.length - index }}
            />
          ))}
        </div>
      </div>

      {/* View Trip Button */}
      <button className="w-full bg-slate-700/50 hover:bg-blue-600/20 border border-slate-600 hover:border-blue-500/50 text-slate-300 hover:text-blue-400 py-3 rounded-xl transition-all duration-200 font-medium">
        View Trip
      </button>
    </div>
  );
};
