
import React from 'react';
import { Calendar } from 'lucide-react';
import { ProTripData } from '../data/proTripMockData';

interface ProTripScheduleProps {
  tripData: ProTripData;
  scheduleLabel: string;
}

export const ProTripSchedule = ({ tripData, scheduleLabel }: ProTripScheduleProps) => {
  return (
    <div className="bg-gray-900/80 backdrop-blur-md border border-gray-700 rounded-2xl p-6">
      <div className="flex items-center gap-3 mb-6">
        <Calendar className="text-glass-yellow" size={24} />
        <h2 className="text-xl font-semibold text-white">{scheduleLabel}</h2>
      </div>
      
      <div className="space-y-6">
        {tripData.itinerary.map((day, index) => (
          <div key={index}>
            <div className="text-glass-yellow font-medium mb-3">{day.date}</div>
            <div className="space-y-3">
              {day.events.map((event, eventIndex) => (
                <div key={eventIndex} className="flex gap-3 p-3 bg-gray-800/50 rounded-xl">
                  <div className="text-gray-400 text-sm min-w-[60px]">{event.time}</div>
                  <div className="flex-1">
                    <div className="text-white font-medium">{event.title}</div>
                    <div className="text-gray-400 text-sm">{event.location}</div>
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
