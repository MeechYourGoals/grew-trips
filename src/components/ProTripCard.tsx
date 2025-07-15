
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Crown, Copy, Eye, Users, Clock } from 'lucide-react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';
import { ProTripData } from '../types/pro';
import { useTripVariant } from '../contexts/TripVariantContext';

interface ProTripCardProps {
  trip: ProTripData;
}

export const ProTripCard = ({ trip }: ProTripCardProps) => {
  const navigate = useNavigate();
  const { accentColors } = useTripVariant();

  const handleViewTrip = () => {
    console.log('ProTripCard - Navigating to trip ID:', trip.id);
    console.log('ProTripCard - Full URL will be:', `/tour/pro/${trip.id}`);
    navigate(`/tour/pro/${trip.id}`);
  };

  const handleDuplicateTrip = () => {
    console.log('Duplicating trip:', trip.title);
    // This would open a modal or redirect to create a new trip with this template
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Sports – Team Trip': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'Conference': return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'Touring': return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      case 'Business Travel': return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
      case 'School Trips': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'Public Relations': return 'bg-pink-500/20 text-pink-300 border-pink-500/30';
      case 'Client Pursuits': return 'bg-red-500/20 text-red-300 border-red-500/30';
      case 'Residency': return 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30';
      case 'Tournament': return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  // Get next load-in event from schedule
  const getNextLoadIn = () => {
    if (!trip.schedule || trip.schedule.length === 0) return null;
    
    const now = new Date();
    const loadInEvents = trip.schedule
      .filter(event => event.type === 'load-in')
      .filter(event => new Date(event.startTime) > now)
      .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
    
    return loadInEvents.length > 0 ? loadInEvents[0] : null;
  };

  const nextLoadIn = getNextLoadIn();

  return (
    <div className={`bg-gradient-to-br from-card/90 to-card/80 backdrop-blur-md border border-border rounded-3xl p-6 hover:bg-card transition-all duration-300 hover:scale-105 hover:shadow-xl group hover:border-primary/50 relative overflow-hidden`}>
      {/* Crown Badge - Only show if roster exists and has members */}
      {trip.roster && trip.roster.length > 0 && (
        <div className="absolute top-4 left-4">
          <Tooltip>
            <TooltipTrigger>
              <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 p-2 rounded-lg shadow-lg">
                <Crown size={14} className="text-white" />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Professional Trip</p>
            </TooltipContent>
          </Tooltip>
        </div>
      )}

      {/* Pro Badge */}
      <div className="absolute top-4 right-4">
        <Tooltip>
          <TooltipTrigger>
            <div className={`bg-gradient-to-r ${accentColors.gradient} p-2 rounded-lg`}>
              <Crown size={16} className="text-white" />
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Pro Feature Demo</p>
          </TooltipContent>
        </Tooltip>
      </div>

      {/* Header */}
      <div className="mb-4 pr-12 pl-12">
        <h3 className={`text-xl font-semibold text-card-foreground group-hover:text-primary transition-colors mb-2`}>
          {trip.title}
        </h3>
        <div className="flex flex-wrap gap-2 mb-3">
          <Badge 
            className={`text-xs ${getCategoryColor(trip.category)} border`}
          >
            {trip.category}
          </Badge>
          {trip.tags && trip.tags.map((tag, index) => (
            <Badge key={index} className="text-xs bg-muted text-muted-foreground border-border border">
              {tag}
            </Badge>
          ))}
        </div>

        {/* New Pills - Roster and Next Load-In */}
        <div className="flex flex-wrap gap-2 mb-4">
          {trip.roster && trip.roster.length > 0 && (
            <div className="flex items-center gap-1 bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-xs border border-blue-500/30">
              <Users size={12} />
              <span>Team: {trip.roster.length}</span>
            </div>
          )}
          {nextLoadIn && (
            <div className="flex items-center gap-1 bg-orange-500/20 text-orange-300 px-3 py-1 rounded-full text-xs border border-orange-500/30">
              <Clock size={12} />
              <span>Next Load-In: {new Date(nextLoadIn.startTime).toLocaleDateString()}</span>
            </div>
          )}
        </div>
      </div>

      {/* Location */}
      <div className="flex items-center gap-3 text-muted-foreground mb-4">
        <div className={`w-8 h-8 bg-primary/20 backdrop-blur-sm rounded-lg flex items-center justify-center`}>
          <MapPin size={16} className={`text-primary`} />
        </div>
        <span className="font-medium">{trip.location}</span>
      </div>

      {/* Date */}
      <div className="flex items-center gap-3 text-muted-foreground mb-6">
        <div className={`w-8 h-8 bg-accent/20 backdrop-blur-sm rounded-lg flex items-center justify-center`}>
          <Calendar size={16} className={`text-accent`} />
        </div>
        <span className="font-medium">{trip.dateRange}</span>
      </div>

      {/* Team Members with Roles */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-sm text-muted-foreground font-medium">Team Members:</span>
        </div>
        
        <div className="flex -space-x-3 mb-2">
          {trip.participants.map((participant, index) => (
            <Tooltip key={participant.id}>
              <TooltipTrigger>
                <img
                  src={participant.avatar}
                  alt={participant.name}
                  className={`w-10 h-10 rounded-full border-2 border-border hover:scale-110 transition-transform duration-200 hover:border-primary`}
                  style={{ zIndex: trip.participants.length - index }}
                />
              </TooltipTrigger>
              <TooltipContent>
                <p>{participant.name} - {participant.role}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>

        <div className="text-xs text-muted-foreground">
          Roles: {trip.participants.map(p => p.role).join(', ')}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <Button
          onClick={handleViewTrip}
          className={`flex-1 bg-gradient-to-r from-primary/20 to-accent/20 backdrop-blur-sm border border-border hover:border-primary/40 text-card-foreground hover:text-primary transition-all duration-300 font-medium hover:shadow-lg`}
          variant="ghost"
        >
          <Eye size={16} className="mr-2" />
          View Trip
        </Button>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              onClick={handleDuplicateTrip}
              className="bg-secondary/20 backdrop-blur-sm border border-border hover:border-accent/40 text-card-foreground hover:text-accent transition-all duration-300"
              variant="ghost"
              size="icon"
            >
              <Copy size={16} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Duplicate as Template</p>
          </TooltipContent>
        </Tooltip>
      </div>

      {/* Pro Features Highlight */}
      <div className="mt-4 pt-4 border-t border-border">
        <div className={`text-xs text-muted-foreground flex items-center gap-1`}>
          <Crown size={12} />
          <span>Pro: Team roles, broadcasts, permissions</span>
        </div>
      </div>
    </div>
  );
};
