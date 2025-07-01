import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Users, Crown } from 'lucide-react';
import { useTripVariant } from '../contexts/TripVariantContext';
import { ProTripData } from '../types/pro-features';

interface MobileProTripCardProps {
  trip: ProTripData;
}

export const MobileProTripCard = ({ trip }: MobileProTripCardProps) => {
  const navigate = useNavigate();
  const { accentColors } = useTripVariant();

  return (
    <div
      onClick={() => navigate(`/trips-pro/${trip.id}`)}
      className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4 transition-all hover:scale-105 hover:shadow-lg cursor-pointer"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="text-lg font-semibold text-white line-clamp-1">{trip.title}</h3>
          <p className="text-gray-400 text-sm line-clamp-1">{trip.location}</p>
        </div>
        <div className={`bg-gradient-to-r ${accentColors.gradient} text-white px-3 py-1 rounded-full text-xs font-medium uppercase`}>
          PRO
        </div>
      </div>

      {/* Details */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-gray-400 text-sm">
          <Calendar size={14} />
          {trip.dateRange}
        </div>
        <div className="flex items-center gap-2 text-gray-400 text-sm">
          <MapPin size={14} />
          {trip.location}
        </div>
        <div className="flex items-center gap-2 text-gray-400 text-sm">
          <Users size={14} />
          {trip.participants.length} Participants
        </div>
      </div>
    </div>
  );
};
