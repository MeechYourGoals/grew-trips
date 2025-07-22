
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Users, Crown } from 'lucide-react';
import { useIsMobile } from '../hooks/use-mobile';
import { ProTripData } from '../types/pro';
import { useTripVariant } from '../contexts/TripVariantContext';
import { TravelerTooltip } from './ui/traveler-tooltip';

interface MobileProTripCardProps {
  trip: ProTripData;
}

export const MobileProTripCard = ({ trip }: MobileProTripCardProps) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { accentColors } = useTripVariant();

  const handleViewTrip = () => {
    console.log('MobileProTripCard - Navigating to trip ID:', trip.id);
    console.log('MobileProTripCard - Full URL will be:', `/tour/pro/${trip.id}`);
    navigate(`/tour/pro/${trip.id}`);
  };

  if (!isMobile) return null;

  // Ensure all participants have proper avatar URLs
  const participantsWithAvatars = trip.participants.map((participant, index) => ({
    ...participant,
    avatar: participant.avatar || `https://images.unsplash.com/photo-${1649972904349 + index}-6e44c42644a7?w=40&h=40&fit=crop&crop=face`
  }));

  return (
    <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl overflow-hidden transition-all duration-300 shadow-lg hover:scale-[1.02]">
      {/* Pro Badge */}
      <div className={`absolute top-3 right-3 z-10 bg-gradient-to-r ${accentColors.gradient} px-2 py-1 rounded-full flex items-center gap-1`}>
        <Crown size={12} className="text-black" />
        <span className="text-xs font-bold text-black">PRO</span>
      </div>

      {/* Mobile Header - Removed category display */}
      <div className={`relative h-36 bg-gradient-to-br from-${accentColors.primary}/10 to-${accentColors.secondary}/10 p-4`}>
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=400&h=200&fit=crop')] bg-cover bg-center opacity-10"></div>
        <div className="relative z-10 h-full flex flex-col justify-between">
          <div className="flex-1">
            <h3 className="text-lg font-bold text-white mb-3 line-clamp-2">
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
        {/* Team Members */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Users size={14} className={`text-${accentColors.primary}`} />
              <span className="text-sm text-gray-300 font-medium">Team</span>
            </div>
            <span className="text-xs text-gray-500">{participantsWithAvatars.length} members</span>
          </div>
          
          <div className="flex items-center">
            <div className="flex -space-x-2">
              {participantsWithAvatars.slice(0, 3).map((participant, index) => (
                <TravelerTooltip key={participant.id} name={`${participant.name} - ${participant.role}`}>
                  <div
                    className="relative"
                    style={{ zIndex: participantsWithAvatars.length - index }}
                  >
                    <img
                      src={participant.avatar}
                      alt={`${participant.name} - ${participant.role}`}
                      className="w-8 h-8 rounded-full border-2 border-gray-900"
                    />
                  </div>
                </TravelerTooltip>
              ))}
            </div>
            {participantsWithAvatars.length > 3 && (
              <div className="w-8 h-8 rounded-full bg-gray-700 border-2 border-gray-900 flex items-center justify-center text-xs font-medium text-white ml-1">
                +{participantsWithAvatars.length - 3}
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
