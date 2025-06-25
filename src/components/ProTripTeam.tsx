
import React from 'react';
import { Users } from 'lucide-react';
import { ProTripData } from '../data/proTripMockData';

interface ProTripTeamProps {
  tripData: ProTripData;
  teamLabel: string;
}

export const ProTripTeam = ({ tripData, teamLabel }: ProTripTeamProps) => {
  return (
    <div className="bg-gray-900/80 backdrop-blur-md border border-gray-700 rounded-2xl p-6">
      <div className="flex items-center gap-3 mb-6">
        <Users className="text-glass-orange" size={24} />
        <h2 className="text-xl font-semibold text-white">{teamLabel}</h2>
      </div>
      
      <div className="space-y-4">
        {tripData.participants.map((participant) => (
          <div key={participant.id} className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-xl">
            <img
              src={participant.avatar}
              alt={participant.name}
              className="w-10 h-10 rounded-full border-2 border-gray-600"
            />
            <div>
              <div className="text-white font-medium">{participant.name}</div>
              <div className="text-gray-400 text-sm">{participant.role}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
