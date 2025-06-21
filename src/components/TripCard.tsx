
import React from 'react';
import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();

  const handleViewTrip = () => {
    navigate(`/trip/${trip.id}`);
  };

  return (
    <div className="bg-black border border-red-600/30 rounded-2xl p-6 hover:bg-gray-900/50 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-red-500/20 group hover:border-red-500/50">
      {/* Header with delete button */}
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-bold text-white group-hover:text-yellow-400 transition-colors">
          {trip.title}
        </h3>
        <button className="text-gray-400 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100">
          <Trash size={18} />
        </button>
      </div>

      {/* Location */}
      <div className="flex items-center gap-2 text-gray-300 mb-4">
        <MapPin size={16} className="text-red-400" />
        <span>{trip.location}</span>
      </div>

      {/* Date */}
      <div className="flex items-center gap-2 text-gray-300 mb-6">
        <Calendar size={16} className="text-yellow-400" />
        <span>{trip.dateRange}</span>
      </div>

      {/* Participants */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-sm text-gray-400">People on this trip:</span>
          <button className="text-yellow-400 hover:text-yellow-300 transition-colors">
            <Plus size={16} />
          </button>
          <button className="text-gray-400 hover:text-gray-300 transition-colors">
            <User size={16} />
          </button>
        </div>
        
        <div className="flex -space-x-3">
          {trip.participants.map((participant, index) => (
            <img
              key={participant.id}
              src={participant.avatar}
              alt={participant.name}
              className="w-10 h-10 rounded-full border-2 border-red-600/50 hover:scale-110 transition-transform duration-200 hover:border-yellow-400"
              style={{ zIndex: trip.participants.length - index }}
            />
          ))}
        </div>
      </div>

      {/* View Trip Button */}
      <button 
        onClick={handleViewTrip}
        className="w-full bg-red-600/20 hover:bg-red-600/40 border border-red-600/50 hover:border-red-500 text-white hover:text-yellow-400 py-3 rounded-xl transition-all duration-200 font-medium"
      >
        View Trip
      </button>
    </div>
  );
};
