
import React from 'react';
import { Calendar, MapPin, Crown } from 'lucide-react';
import { ProTripData } from '../data/proTripMockData';

interface ProTripHeaderProps {
  tripData: ProTripData;
}

export const ProTripHeader = ({ tripData }: ProTripHeaderProps) => {
  return (
    <div className="bg-gradient-to-r from-gray-900/90 to-gray-800/90 backdrop-blur-md border border-gray-700 rounded-3xl p-8 mb-8">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h1 className="text-4xl font-bold text-white mb-4">{tripData.title}</h1>
          <p className="text-gray-300 mb-6">{tripData.description}</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center gap-3">
              <MapPin className="text-glass-orange" size={20} />
              <div>
                <div className="text-sm text-gray-400">Location</div>
                <div className="text-white font-medium">{tripData.location}</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Calendar className="text-glass-yellow" size={20} />
              <div>
                <div className="text-sm text-gray-400">Date Range</div>
                <div className="text-white font-medium">{tripData.dateRange}</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Crown className="text-glass-green" size={20} />
              <div>
                <div className="text-sm text-gray-400">Category</div>
                <div className="text-white font-medium">{tripData.category}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
