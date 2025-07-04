
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Trash, User, Plus, MoreHorizontal } from 'lucide-react';
import { InviteModal } from './InviteModal';

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
  const [showInviteModal, setShowInviteModal] = useState(false);

  const handleViewTrip = () => {
    navigate(`/trip/${trip.id}`);
  };

  const handleEditItinerary = () => {
    navigate(`/trip/${trip.id}/edit-itinerary`);
  };

  return (
    <div className="group bg-white/5 hover:bg-white/10 backdrop-blur-xl border border-white/10 hover:border-yellow-500/30 rounded-3xl overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl shadow-black/20">
      {/* Trip Image/Header */}
      <div className="relative h-48 bg-gradient-to-br from-yellow-600/20 via-yellow-500/10 to-transparent p-6">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&h=200&fit=crop')] bg-cover bg-center opacity-20"></div>
        <div className="relative z-10 flex justify-between items-start h-full">
          <div className="flex-1">
            <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-yellow-300 transition-colors">
              {trip.title}
            </h3>
            <div className="flex items-center gap-2 text-white/80 mb-3">
              <MapPin size={18} className="text-yellow-400" />
              <span className="font-medium">{trip.location}</span>
            </div>
            <div className="flex items-center gap-2 text-white/80">
              <Calendar size={18} className="text-yellow-400" />
              <span className="font-medium">{trip.dateRange}</span>
            </div>
          </div>
          <button className="text-white/60 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100 p-2 hover:bg-white/10 rounded-xl">
            <MoreHorizontal size={20} />
          </button>
        </div>
      </div>

      {/* Trip Content */}
      <div className="p-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-white">{trip.participants.length}</div>
            <div className="text-sm text-gray-400">People</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-white">5</div>
            <div className="text-sm text-gray-400">Days</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-white">12</div>
            <div className="text-sm text-gray-400">Places</div>
          </div>
        </div>

        {/* Participants */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-gray-400 font-medium">Travelers</span>
            <div className="flex gap-2">
              <button 
                onClick={() => setShowInviteModal(true)}
                className="text-yellow-400 hover:text-yellow-300 transition-colors p-1 hover:bg-yellow-400/10 rounded-lg"
                title="Invite people to trip"
              >
                <Plus size={16} />
              </button>
              <button className="text-gray-400 hover:text-gray-300 transition-colors p-1 hover:bg-white/10 rounded-lg">
                <User size={16} />
              </button>
            </div>
          </div>
          
          <div className="flex items-center">
            <div className="flex -space-x-3">
              {trip.participants.slice(0, 4).map((participant, index) => (
                <div
                  key={participant.id}
                  className="relative"
                  style={{ zIndex: trip.participants.length - index }}
                >
                  <img
                    src={participant.avatar}
                    alt={participant.name}
                    className="w-10 h-10 rounded-full border-3 border-gray-900 hover:scale-110 transition-transform duration-200 hover:border-yellow-400 cursor-pointer"
                  />
                </div>
              ))}
            </div>
            {trip.participants.length > 4 && (
              <div className="w-10 h-10 rounded-full bg-gray-700 border-3 border-gray-900 flex items-center justify-center text-sm font-medium text-white ml-2">
                +{trip.participants.length - 4}
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button 
            onClick={handleViewTrip}
            className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black font-semibold py-4 rounded-2xl transition-all duration-300 hover:scale-[1.02] shadow-lg hover:shadow-yellow-500/25"
          >
            View Trip Details
          </button>
          
          <div className="grid grid-cols-2 gap-3">
            <button 
              onClick={handleEditItinerary}
              className="bg-gray-800/50 hover:bg-gray-700/50 text-white py-3 rounded-xl transition-all duration-200 font-medium border border-gray-700 hover:border-gray-600"
            >
              Edit Itinerary
            </button>
            <button className="bg-gray-800/50 hover:bg-gray-700/50 text-white py-3 rounded-xl transition-all duration-200 font-medium border border-gray-700 hover:border-gray-600">
              Share Trip
            </button>
          </div>
        </div>
      </div>

      <InviteModal 
        isOpen={showInviteModal}
        onClose={() => setShowInviteModal(false)}
        tripName={trip.title}
        tripId={trip.id.toString()}
      />
    </div>
  );
};
