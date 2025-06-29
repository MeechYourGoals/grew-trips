
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Crown, Copy, Eye } from 'lucide-react';
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
    console.log('Navigating to trip ID:', trip.id);
    navigate(`/tour/pro-${trip.id}`);
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

  return (
    <div className={`bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md border border-white/20 rounded-3xl p-6 hover:bg-white/15 transition-all duration-300 hover:scale-105 hover:shadow-xl group hover:border-${accentColors.primary}/50 relative overflow-hidden`}>
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
      <div className="mb-4 pr-12">
        <h3 className={`text-xl font-semibold text-white group-hover:text-${accentColors.secondary} transition-colors mb-2`}>
          {trip.title}
        </h3>
        <div className="flex flex-wrap gap-2">
          <Badge 
            className={`text-xs ${getCategoryColor(trip.category)} border`}
          >
            {trip.category}
          </Badge>
          {trip.tags && trip.tags.map((tag, index) => (
            <Badge key={index} className="text-xs bg-gray-500/20 text-gray-300 border-gray-500/30 border">
              {tag}
            </Badge>
          ))}
        </div>
      </div>

      {/* Location */}
      <div className="flex items-center gap-3 text-white/80 mb-4">
        <div className={`w-8 h-8 bg-${accentColors.primary}/20 backdrop-blur-sm rounded-lg flex items-center justify-center`}>
          <MapPin size={16} className={`text-${accentColors.primary}`} />
        </div>
        <span className="font-medium">{trip.location}</span>
      </div>

      {/* Date */}
      <div className="flex items-center gap-3 text-white/80 mb-6">
        <div className={`w-8 h-8 bg-${accentColors.secondary}/20 backdrop-blur-sm rounded-lg flex items-center justify-center`}>
          <Calendar size={16} className={`text-${accentColors.secondary}`} />
        </div>
        <span className="font-medium">{trip.dateRange}</span>
      </div>

      {/* Team Members with Roles */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-sm text-white/70 font-medium">Team Members:</span>
        </div>
        
        <div className="flex -space-x-3 mb-2">
          {trip.participants.map((participant, index) => (
            <Tooltip key={participant.id}>
              <TooltipTrigger>
                <img
                  src={participant.avatar}
                  alt={participant.name}
                  className={`w-10 h-10 rounded-full border-2 border-white/30 hover:scale-110 transition-transform duration-200 hover:border-${accentColors.primary}`}
                  style={{ zIndex: trip.participants.length - index }}
                />
              </TooltipTrigger>
              <TooltipContent>
                <p>{participant.name} - {participant.role}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>

        <div className="text-xs text-white/60">
          Roles: {trip.participants.map(p => p.role).join(', ')}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <Button
          onClick={handleViewTrip}
          className={`flex-1 bg-gradient-to-r from-${accentColors.primary}/20 to-${accentColors.secondary}/20 backdrop-blur-sm border border-white/20 hover:border-white/40 text-white hover:text-${accentColors.secondary} transition-all duration-300 font-medium hover:shadow-lg`}
          variant="ghost"
        >
          <Eye size={16} className="mr-2" />
          View Trip
        </Button>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              onClick={handleDuplicateTrip}
              className="bg-white/10 backdrop-blur-sm border border-white/20 hover:border-glass-green/40 text-white hover:text-glass-green transition-all duration-300"
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
      <div className="mt-4 pt-4 border-t border-white/10">
        <div className={`text-xs text-${accentColors.secondary}/80 flex items-center gap-1`}>
          <Crown size={12} />
          <span>Pro: Team roles, broadcasts, permissions</span>
        </div>
      </div>
    </div>
  );
};
