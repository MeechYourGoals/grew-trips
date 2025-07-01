import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Users, Crown, Building, Briefcase, GraduationCap, Clapperboard } from 'lucide-react';
import { useTripVariant } from '../contexts/TripVariantContext';
import { ProTripData } from '../types/pro-features';

interface ProTripCardProps {
  trip: ProTripData;
}

export const ProTripCard = ({ trip }: ProTripCardProps) => {
  const navigate = useNavigate();
  const { accentColors } = useTripVariant();

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Sports & Athletics':
        return <Briefcase size={16} />;
      case 'Music & Entertainment Tours':
        return <Building size={16} />;
      case 'Corporate & Business':
        return <GraduationCap size={16} />;
      case 'Education & Academic':
        return <Clapperboard size={16} />;
      case 'TV/Film Production':
        return <Clapperboard size={16} />;
      case 'Startup & Tech':
        return <Clapperboard size={16} />;
      default:
        return <Briefcase size={16} />;
    }
  };

  return (
    <div
      onClick={() => navigate(`/pro/trip/${trip.id}`)}
      className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-colors cursor-pointer"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-white">{trip.title}</h3>
          <p className="text-gray-400 text-sm flex items-center gap-2">
            {getCategoryIcon(trip.proTripCategory || 'Corporate & Business')}
            {trip.proTripCategory || 'Business Trip'}
          </p>
        </div>
        <div className={`bg-gradient-to-r ${accentColors.gradient} text-white px-3 py-1 rounded-full text-xs font-medium uppercase`}>
          PRO
        </div>
      </div>

      {/* Details */}
      <div className="space-y-3">
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
