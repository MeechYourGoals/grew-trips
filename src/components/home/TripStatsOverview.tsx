
import React from 'react';

interface TripStatsOverviewProps {
  totalTrips: number;
}

export const TripStatsOverview = ({ totalTrips }: TripStatsOverviewProps) => {
  return (
    <div className="bg-gray-900/80 backdrop-blur-md border border-gray-700 rounded-2xl p-6 mb-8">
      <div className="grid grid-cols-4 gap-6">
        <div className="text-center">
          <div className="text-3xl font-bold text-white mb-2">{totalTrips}</div>
          <div className="text-gray-400">Total Trips</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-yellow-500 mb-2">3</div>
          <div className="text-gray-400">Upcoming</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-green-500 mb-2">2</div>
          <div className="text-gray-400">Completed</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-blue-500 mb-2">1</div>
          <div className="text-gray-400">In Planning</div>
        </div>
      </div>
    </div>
  );
};
