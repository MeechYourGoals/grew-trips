
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Trash, User, Plus, MoreHorizontal } from 'lucide-react';
import { InviteModal } from './InviteModal';
import { ShareTripModal } from './share/ShareTripModal';

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
  const [showShareModal, setShowShareModal] = useState(false);

  const handleViewTrip = () => {
    navigate(`/trip/${trip.id}`);
  };

  const handleEditItinerary = () => {
    navigate(`/trip/${trip.id}/edit-itinerary`);
  };

  return (
    <div className="group bg-card hover:bg-accent/10 backdrop-blur-xl border border-border hover:border-primary/30 rounded-3xl overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl shadow-foreground/20">
      {/* Trip Image/Header */}
      <div className="relative h-48 bg-gradient-to-br from-primary/20 via-primary/10 to-transparent p-6">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&h=200&fit=crop')] bg-cover bg-center opacity-20"></div>
        <div className="relative z-10 flex justify-between items-start h-full">
          <div className="flex-1">
            <h3 className="text-2xl font-bold text-card-foreground mb-2 group-hover:text-primary transition-colors">
              {trip.title}
            </h3>
            <div className="flex items-center gap-2 text-muted-foreground mb-3">
              <MapPin size={18} className="text-primary" />
              <span className="font-medium">{trip.location}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar size={18} className="text-primary" />
              <span className="font-medium">{trip.dateRange}</span>
            </div>
          </div>
          <button className="text-muted-foreground hover:text-destructive transition-colors opacity-0 group-hover:opacity-100 p-2 hover:bg-accent/10 rounded-xl">
            <MoreHorizontal size={20} />
          </button>
        </div>
      </div>

      {/* Trip Content */}
      <div className="p-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-card-foreground">{trip.id === 3 ? '200' : trip.participants.length}</div>
            <div className="text-sm text-muted-foreground">People</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-card-foreground">5</div>
            <div className="text-sm text-muted-foreground">Days</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-card-foreground">{trip.id === 3 ? '3' : '12'}</div>
            <div className="text-sm text-muted-foreground">Places</div>
          </div>
        </div>

        {/* Participants */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-muted-foreground font-medium">Travelers</span>
            <div className="flex gap-2">
              <button 
                onClick={() => setShowInviteModal(true)}
                className="text-primary hover:text-primary/80 transition-colors p-1 hover:bg-primary/10 rounded-lg"
                title="Invite people to trip"
              >
                <Plus size={16} />
              </button>
              <button className="text-muted-foreground hover:text-foreground transition-colors p-1 hover:bg-accent/10 rounded-lg">
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
                    className="w-10 h-10 rounded-full border-3 border-background hover:scale-110 transition-transform duration-200 hover:border-primary cursor-pointer"
                  />
                </div>
              ))}
            </div>
            {trip.participants.length > 4 && (
              <div className="w-10 h-10 rounded-full bg-secondary border-3 border-background flex items-center justify-center text-sm font-medium text-secondary-foreground ml-2">
                +{trip.participants.length - 4}
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button 
            onClick={handleViewTrip}
            className="w-full bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 text-primary-foreground font-semibold py-4 rounded-2xl transition-all duration-300 hover:scale-[1.02] shadow-lg hover:shadow-primary/25"
          >
            View Trip Details
          </button>
          
          <div className="grid grid-cols-2 gap-3">
            <button 
              onClick={handleEditItinerary}
              className="bg-secondary hover:bg-secondary/80 text-secondary-foreground py-3 rounded-xl transition-all duration-200 font-medium border border-border hover:border-border/80"
            >
              Edit Itinerary
            </button>
            <button 
              onClick={() => setShowShareModal(true)}
              className="bg-secondary hover:bg-secondary/80 text-secondary-foreground py-3 rounded-xl transition-all duration-200 font-medium border border-border hover:border-border/80"
            >
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

      <ShareTripModal 
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        trip={trip}
      />
    </div>
  );
};
