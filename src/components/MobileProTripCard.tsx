
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Users, Crown } from 'lucide-react';
import { useIsMobile } from '../hooks/use-mobile';
import { ProTripData } from '../types/pro';
import { useTripVariant } from '../contexts/TripVariantContext';

interface MobileProTripCardProps {
  trip: ProTripData;
}

export const MobileProTripCard = ({ trip }: MobileProTripCardProps) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { accentColors } = useTripVariant();

  const handleViewTrip = () => {
    navigate(`/tour/pro-${trip.id}`);
  };

  if (!isMobile) return null;

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Touring': return 'from-blue-500/20 to-blue-600/20 border-blue-500/30';
      case 'Sports – Team Trip': return 'from-green-500/20 to-green-600/20 border-green-500/30';
      case 'Residency': return 'from-purple-500/20 to-purple-600/20 border-purple-500/30';
      case 'Conference': return 'from-orange-500/20 to-orange-600/20 border-orange-500/30';
      case 'Business Travel': return 'from-yellow-500/20 to-yellow-600/20 border-yellow-500/30';
      case 'Tournament': return 'from-red-500/20 to-red-600/20 border-red-500/30';
      default: return 'from-gray-500/20 to-gray-600/20 border-gray-500/30';
    }
  };

  return (
    <div className={`bg-gradient-to-br ${getCategoryColor(trip.category)} backdrop-blur-xl border rounded-2xl overflow-hidden transition-all duration-300 shadow-lg hover:scale-[1.02]`}>
      {/* Pro Badge */}
      <div className={`absolute top-3 right-3 z-10 bg-gradient-to-r ${accentColors.gradient} px-2 py-1 rounded-full flex items-center gap-1`}>
        <Crown size={12} className="text-black" />
        <span className="text-xs font-bold text-black">PRO</span>
      </div>

      {/* Mobile Header */}
      <div className={`relative h-36 bg-gradient-to-br from-${accentColors.primary}/10 to-${accentColors.secondary}/10 p-4`}>
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=400&h=200&fit=crop')] bg-cover bg-center opacity-10"></div>
        <div className="relative z-10 h-full flex flex-col justify-between">
          <div className="flex-1">
            <div className="inline-block bg-black/20 backdrop-blur-sm px-2 py-1 rounded-lg mb-2">
              <span className="text-xs font-medium text-white">{trip.category}</span>
            </div>
            <h3 className="text-lg font-bold text-white mb-2 line-clamp-2">
              {trip.title}
            </h3>
            <div className="flex items-center gap-2 text-white/80 text-sm mb-1">
              <MapPin size={14} className={`text-${accentColors.primary}`} />
              <span className="font-medium truncate">{trip.location}</span>
            </div>
            <div className="flex items-center gap-2 text-white/80 text-sm">
              <Calendar size={14} className={`text-${accentColors.primary}`} />
              <span className="font-medium">{trip.dateRange}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Content */}
      <div className="p-4">
        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-4">
          {trip.tags.slice(0, 2).map((tag, index) => (
            <span key={index} className="bg-white/10 backdrop-blur-sm px-2 py-1 rounded-md text-xs text-white">
              {tag}
            </span>
          ))}
          {trip.tags.length > 2 && (
            <span className="bg-white/10 backdrop-blur-sm px-2 py-1 rounded-md text-xs text-white">
              +{trip.tags.length - 2}
            </span>
          )}
        </div>

        {/* Team Members */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Users size={14} className={`text-${accentColors.primary}`} />
              <span className="text-sm text-gray-300 font-medium">Team</span>
            </div>
            <span className="text-xs text-gray-500">{trip.participants.length} members</span>
          </div>
          
          <div className="flex items-center">
            <div className="flex -space-x-2">
              {trip.participants.slice(0, 3).map((participant, index) => (
                <div
                  key={participant.id}
                  className="relative"
                  style={{ zIndex: trip.participants.length - index }}
                >
                  <img
                    src={participant.avatar}
                    alt={participant.name}
                    className="w-8 h-8 rounded-full border-2 border-gray-900"
                  />
                </div>
              ))}
            </div>
            {trip.participants.length > 3 && (
              <div className="w-8 h-8 rounded-full bg-gray-700 border-2 border-gray-900 flex items-center justify-center text-xs font-medium text-white ml-1">
                +{trip.participants.length - 3}
              </div>
            )}
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={handleViewTrip}
          className={`w-full bg-gradient-to-r ${accentColors.gradient} hover:from-${accentColors.primary}/80 hover:to-${accentColors.secondary}/80 text-black font-semibold py-4 rounded-xl transition-all duration-300 shadow-lg`}
        >
          Manage Tour
        </button>
      </div>
    </div>
  );
};
