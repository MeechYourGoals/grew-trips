
import React from 'react';
import { Calendar, Clock, MapPin, Mic, Users, Briefcase, Trophy, Music, Utensils, Plane } from 'lucide-react';
import { ProTripData } from '../data/proTripMockData';

interface ProTripItineraryProps {
  tripData: ProTripData;
}

export const ProTripItinerary = ({ tripData }: ProTripItineraryProps) => {
  const getEventIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'meeting': return <Users size={16} className="text-glass-blue" />;
      case 'presentation': return <Briefcase size={16} className="text-glass-orange" />;
      case 'performance': return <Mic size={16} className="text-glass-purple" />;
      case 'game': case 'match': return <Trophy size={16} className="text-glass-green" />;
      case 'meal': return <Utensils size={16} className="text-glass-yellow" />;
      case 'transport': return <Plane size={16} className="text-glass-blue" />;
      case 'activity': case 'workshop': return <Music size={16} className="text-glass-purple" />;
      case 'technical': return <Briefcase size={16} className="text-glass-orange" />;
      case 'networking': case 'event': return <Users size={16} className="text-glass-green" />;
      default: return <Clock size={16} className="text-gray-400" />;
    }
  };

  const getEventTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'meeting': return 'bg-glass-blue/20 text-glass-blue border-glass-blue/30';
      case 'presentation': return 'bg-glass-orange/20 text-glass-orange border-glass-orange/30';
      case 'performance': return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      case 'game': case 'match': return 'bg-glass-green/20 text-glass-green border-glass-green/30';
      case 'meal': return 'bg-glass-yellow/20 text-glass-yellow border-glass-yellow/30';
      case 'transport': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'activity': case 'workshop': return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      case 'technical': return 'bg-orange-500/20 text-orange-300 border-orange-500/30';
      case 'networking': case 'event': return 'bg-green-500/20 text-green-300 border-green-500/30';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  return (
    <div className="bg-gray-900/80 backdrop-blur-md border border-gray-700 rounded-3xl p-8">
      <div className="flex items-center gap-3 mb-8">
        <Calendar className="text-glass-yellow" size={28} />
        <h2 className="text-2xl font-semibold text-white">Complete Itinerary</h2>
      </div>
      
      <div className="space-y-8">
        {tripData.itinerary.map((day, dayIndex) => (
          <div key={dayIndex} className="relative">
            {/* Date Header */}
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-gradient-to-r from-glass-orange to-glass-yellow p-3 rounded-xl">
                <Calendar size={20} className="text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">{day.date}</h3>
                <p className="text-gray-400">{day.events.length} events scheduled</p>
              </div>
            </div>

            {/* Timeline */}
            <div className="ml-8 border-l-2 border-gray-700 pl-8 space-y-6">
              {day.events.map((event, eventIndex) => (
                <div key={eventIndex} className="relative">
                  {/* Timeline dot */}
                  <div className="absolute -left-[41px] w-4 h-4 bg-glass-orange rounded-full border-4 border-gray-900"></div>
                  
                  {/* Event card */}
                  <div className="bg-gray-800/50 border border-gray-600 rounded-xl p-6 hover:bg-gray-800/70 transition-all duration-200">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gray-700/50 rounded-lg flex items-center justify-center">
                          {getEventIcon(event.type)}
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold text-white mb-1">{event.title}</h4>
                          <div className="flex items-center gap-2 text-gray-400 mb-2">
                            <Clock size={14} />
                            <span className="font-medium">{event.time}</span>
                          </div>
                        </div>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs font-medium border ${getEventTypeColor(event.type)}`}>
                        {event.type}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 text-gray-300">
                      <MapPin size={16} className="text-glass-orange" />
                      <span>{event.location}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
