
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
    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-6 hover:bg-white/15 transition-all duration-300 hover:scale-105 hover:shadow-xl group hover:border-white/30">
      {/* Header with delete button */}
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-semibold text-white group-hover:text-glass-yellow transition-colors">
          {trip.title}
        </h3>
        <button className="text-white/60 hover:text-glass-orange transition-colors opacity-0 group-hover:opacity-100">
          <Trash size={18} />
        </button>
      </div>

      {/* Location */}
      <div className="flex items-center gap-3 text-white/80 mb-4">
        <div className="w-8 h-8 bg-glass-orange/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
          <MapPin size={16} className="text-glass-orange" />
        </div>
        <span className="font-medium">{trip.location}</span>
      </div>

      {/* Date */}
      <div className="flex items-center gap-3 text-white/80 mb-6">
        <div className="w-8 h-8 bg-glass-yellow/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
          <Calendar size={16} className="text-glass-yellow" />
        </div>
        <span className="font-medium">{trip.dateRange}</span>
      </div>

      {/* Participants */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-sm text-white/70 font-medium">People on this trip:</span>
          <button className="text-glass-yellow hover:text-glass-orange transition-colors">
            <Plus size={16} />
          </button>
          <button className="text-white/60 hover:text-white/80 transition-colors">
            <User size={16} />
          </button>
        </div>
        
        <div className="flex -space-x-3">
          {trip.participants.map((participant, index) => (
            <img
              key={participant.id}
              src={participant.avatar}
              alt={participant.name}
              className="w-10 h-10 rounded-full border-2 border-white/30 hover:scale-110 transition-transform duration-200 hover:border-glass-orange"
              style={{ zIndex: trip.participants.length - index }}
            />
          ))}
        </div>
      </div>

      {/* View Trip Button */}
      <button 
        onClick={handleViewTrip}
        className="w-full bg-gradient-to-r from-glass-orange/20 to-glass-yellow/20 backdrop-blur-sm border border-white/20 hover:border-white/40 text-white hover:text-glass-yellow py-3 rounded-2xl transition-all duration-300 font-medium hover:shadow-lg"
      >
        View Trip
      </button>
    </div>
  );
};
