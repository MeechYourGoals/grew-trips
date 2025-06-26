
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, User, MoreHorizontal } from 'lucide-react';
import { useIsMobile } from '../hooks/use-mobile';

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

interface MobileTripCardProps {
  trip: Trip;
}

export const MobileTripCard = ({ trip }: MobileTripCardProps) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const handleViewTrip = () => {
    navigate(`/trip/${trip.id}`);
  };

  const handleEditItinerary = () => {
    navigate(`/trip/${trip.id}/edit-itinerary`);
  };

  if (!isMobile) return null;

  return (
    <div className="bg-white/5 hover:bg-white/10 backdrop-blur-xl border border-white/10 hover:border-yellow-500/30 rounded-2xl overflow-hidden transition-all duration-300 shadow-lg">
      {/* Mobile Header */}
      <div className="relative h-32 bg-gradient-to-br from-yellow-600/20 via-yellow-500/10 to-transparent p-4">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&h=200&fit=crop')] bg-cover bg-center opacity-20"></div>
        <div className="relative z-10 flex justify-between items-start h-full">
          <div className="flex-1">
            <h3 className="text-lg font-bold text-white mb-2 line-clamp-2">
              {trip.title}
            </h3>
            <div className="flex items-center gap-2 text-white/80 text-sm mb-1">
              <MapPin size={14} className="text-yellow-400" />
              <span className="font-medium truncate">{trip.location}</span>
            </div>
            <div className="flex items-center gap-2 text-white/80 text-sm">
              <Calendar size={14} className="text-yellow-400" />
              <span className="font-medium">{trip.dateRange}</span>
            </div>
          </div>
          <button className="text-white/60 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg">
            <MoreHorizontal size={18} />
          </button>
        </div>
      </div>

      {/* Mobile Content */}
      <div className="p-4">
        {/* Stats Row */}
        <div className="flex justify-between items-center mb-4">
          <div className="text-center">
            <div className="text-xl font-bold text-white">{trip.participants.length}</div>
            <div className="text-xs text-gray-400">People</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-white">5</div>
            <div className="text-xs text-gray-400">Days</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-white">12</div>
            <div className="text-xs text-gray-400">Places</div>
          </div>
        </div>

        {/* Participants */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400 font-medium">Travelers</span>
            <span className="text-xs text-gray-500">{trip.participants.length} people</span>
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

        {/* Action Buttons */}
        <div className="space-y-3">
          <button 
            onClick={handleViewTrip}
            className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black font-semibold py-4 rounded-xl transition-all duration-300 shadow-lg"
          >
            View Trip Details
          </button>
          
          <div className="grid grid-cols-2 gap-2">
            <button 
              onClick={handleEditItinerary}
              className="bg-gray-800/50 hover:bg-gray-700/50 text-white py-3 px-4 rounded-lg transition-all duration-200 font-medium border border-gray-700 hover:border-gray-600 text-sm"
            >
              Edit Itinerary
            </button>
            <button className="bg-gray-800/50 hover:bg-gray-700/50 text-white py-3 px-4 rounded-lg transition-all duration-200 font-medium border border-gray-700 hover:border-gray-600 text-sm">
              Share Trip
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
