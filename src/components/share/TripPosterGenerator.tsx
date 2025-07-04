import React from 'react';
import { Calendar, MapPin, Users } from 'lucide-react';

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

interface TripPosterGeneratorProps {
  trip: Trip;
}

export const TripPosterGenerator = ({ trip }: TripPosterGeneratorProps) => {
  const taglines = [
    "Let's make memories!",
    "Adventure awaits!",
    "Ready for an epic trip?",
    "Join the adventure!"
  ];
  
  const randomTagline = taglines[Math.floor(Math.random() * taglines.length)];

  return (
    <div 
      id="trip-poster"
      className="relative w-[540px] h-[675px] bg-gradient-to-br from-primary/30 via-secondary/20 to-accent/30 rounded-3xl p-8 overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--secondary)) 50%, hsl(var(--accent)) 100%)',
        boxShadow: '0px 8px 32px rgba(0,0,0,0.25)'
      }}
    >
      {/* Background overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/30 to-black/40 rounded-3xl" />
      
      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-between text-white">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold mb-4 leading-tight">{trip.title}</h1>
          
          {/* Location */}
          <div className="flex items-center justify-center gap-3 mb-4">
            <MapPin size={24} className="text-primary-foreground" />
            <span className="text-2xl text-white/90">{trip.location}</span>
          </div>
          
          {/* Date */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <Calendar size={24} className="text-primary-foreground" />
            <span className="text-2xl text-white/90">{trip.dateRange}</span>
          </div>
        </div>

        {/* Travelers Section */}
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="flex items-center gap-3 mb-6">
            <Users size={28} className="text-primary-foreground" />
            <span className="text-3xl font-semibold">
              {trip.participants.length} Traveler{trip.participants.length !== 1 ? 's' : ''}
            </span>
          </div>
          
          {/* Avatars */}
          {trip.participants.length > 0 && (
            <div className="flex justify-center -space-x-4 mb-8">
              {trip.participants.slice(0, 5).map((participant, index) => (
                <div
                  key={participant.id}
                  className="relative"
                  style={{ zIndex: trip.participants.length - index }}
                >
                  <img
                    src={participant.avatar}
                    alt={participant.name}
                    className="w-16 h-16 rounded-full border-4 border-white shadow-lg"
                  />
                </div>
              ))}
              {trip.participants.length > 5 && (
                <div className="w-16 h-16 rounded-full bg-white/20 border-4 border-white flex items-center justify-center text-lg font-bold shadow-lg">
                  +{trip.participants.length - 5}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-xl italic text-white/90 mb-4">{randomTagline}</p>
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl py-3 px-6">
            <p className="text-lg font-medium">Plan your next adventure with us</p>
          </div>
        </div>
      </div>
    </div>
  );
};