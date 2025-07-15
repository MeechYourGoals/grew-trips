
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Users, Settings } from 'lucide-react';
import { EventData } from '../types/events';
import { useTripVariant } from '../contexts/TripVariantContext';

interface EventCardProps {
  event: EventData;
}

export const EventCard = ({ event }: EventCardProps) => {
  const navigate = useNavigate();
  const { accentColors } = useTripVariant();

  const handleViewEvent = () => {
    console.log('EventCard - Navigating to event ID:', event.id);
    console.log('EventCard - Full URL will be:', `/event/${event.id}`);
    navigate(`/event/${event.id}`);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Technology & Culture': return 'from-purple-500/20 to-purple-600/20 border-purple-500/30';
      case 'Economics & Policy': return 'from-green-500/20 to-green-600/20 border-green-500/30';
      case 'Fintech': return 'from-yellow-500/20 to-yellow-600/20 border-yellow-500/30';
      case 'Media & Entertainment': return 'from-pink-500/20 to-pink-600/20 border-pink-500/30';
      case 'Marketing & CX': return 'from-orange-500/20 to-orange-600/20 border-orange-500/30';
      case 'Personal Finance': return 'from-emerald-500/20 to-emerald-600/20 border-emerald-500/30';
      case 'Music Awards': return 'from-violet-500/20 to-violet-600/20 border-violet-500/30';
      case 'Startup Showcase': return 'from-cyan-500/20 to-cyan-600/20 border-cyan-500/30';
      case 'Creator Economy': return 'from-rose-500/20 to-rose-600/20 border-rose-500/30';
      case 'Film Awards': return 'from-amber-500/20 to-amber-600/20 border-amber-500/30';
      case 'Sports Ceremony': return 'from-indigo-500/20 to-indigo-600/20 border-indigo-500/30';
      default: return 'from-blue-500/20 to-blue-600/20 border-blue-500/30';
    }
  };

  return (
    <div className={`bg-gradient-to-br ${getCategoryColor(event.category)} backdrop-blur-xl border rounded-3xl overflow-hidden transition-all duration-300 shadow-lg hover:scale-[1.02] relative group`}>
      {/* Events Badge */}
      <div className={`absolute top-4 right-4 z-10 bg-gradient-to-r ${accentColors.gradient} px-3 py-1 rounded-full flex items-center gap-1`}>
        <Calendar size={14} className="text-white" />
        <span className="text-sm font-bold text-white">EVENTS</span>
      </div>

      {/* Header */}
      <div className={`relative h-48 bg-gradient-to-br from-${accentColors.primary}/20 to-${accentColors.secondary}/20 p-6`}>
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=600&h=300&fit=crop')] bg-cover bg-center opacity-20"></div>
        <div className="relative z-10 h-full flex flex-col justify-between">
          <div>
            <div className="inline-block bg-black/20 backdrop-blur-sm px-3 py-1 rounded-lg mb-3">
              <span className="text-sm font-medium text-white">{event.category}</span>
            </div>
            <h3 className="text-2xl font-bold text-white mb-2 line-clamp-2">
              {event.title}
            </h3>
            <div className="flex items-center gap-2 text-white/80 mb-2">
              <MapPin size={16} className={`text-${accentColors.primary}`} />
              <span className="font-medium">{event.location}</span>
            </div>
            <div className="flex items-center gap-2 text-white/80">
              <Calendar size={16} className={`text-${accentColors.primary}`} />
              <span className="font-medium">{event.dateRange}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {event.tags.slice(0, 3).map((tag, index) => (
            <span key={index} className="bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full text-sm text-white">
              {tag}
            </span>
          ))}
          {event.tags.length > 3 && (
            <span className="bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full text-sm text-white">
              +{event.tags.length - 3}
            </span>
          )}
        </div>

        {/* Team Members */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Users size={18} className={`text-${accentColors.primary}`} />
              <span className="text-white font-medium">Organizers</span>
            </div>
            <span className="text-gray-400 text-sm">{event.participants.length} members</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex -space-x-3">
              {event.participants.slice(0, 4).map((participant) => (
                <div
                  key={participant.id}
                  className="relative"
                  title={`${participant.name} - ${participant.role}`}
                >
                  <img
                    src={participant.avatar}
                    alt={participant.name}
                    className="w-10 h-10 rounded-full border-2 border-gray-900"
                  />
                </div>
              ))}
            </div>
            {event.participants.length > 4 && (
              <div className="w-10 h-10 rounded-full bg-gray-700 border-2 border-gray-900 flex items-center justify-center text-sm font-medium text-white">
                +{event.participants.length - 4}
              </div>
            )}
          </div>
        </div>

        {/* Group Chat Status */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Settings size={16} className="text-gray-400" />
            <span className="text-gray-400 text-sm">Group Chat</span>
          </div>
          <span className={`text-sm font-medium ${event.groupChatEnabled ? 'text-green-400' : 'text-gray-500'}`}>
            {event.groupChatEnabled ? 'Enabled' : 'Disabled'}
          </span>
        </div>

        {/* Action Button */}
        <button
          onClick={handleViewEvent}
          className={`w-full bg-gradient-to-r ${accentColors.gradient} hover:from-${accentColors.primary}/80 hover:to-${accentColors.secondary}/80 text-white font-semibold py-4 rounded-xl transition-all duration-300 shadow-lg`}
        >
          Manage Event
        </button>
      </div>
    </div>
  );
};
