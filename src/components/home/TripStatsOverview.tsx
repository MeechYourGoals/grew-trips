
import React from 'react';
import { StatsData } from '../../utils/tripStatsCalculator';

interface TripStatsOverviewProps {
  stats: StatsData;
  viewMode: string;
}

export const TripStatsOverview = ({ stats, viewMode }: TripStatsOverviewProps) => {
  const getLabel = () => {
    switch (viewMode) {
      case 'myTrips': return 'Trips';
      case 'tripsPro': return 'Pro Trips';
      case 'events': return 'Events';
      default: return 'Items';
    }
  };

  const label = getLabel();

  return (
    <div className="bg-gray-900/80 backdrop-blur-md border border-gray-700 rounded-2xl p-6 mb-8">
      <div className="grid grid-cols-4 gap-6">
        <div className="text-center">
          <div className="text-3xl font-bold text-white mb-2">{stats.total}</div>
          <div className="text-gray-400">Total {label}</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-yellow-500 mb-2">{stats.upcoming}</div>
          <div className="text-gray-400">Upcoming</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-green-500 mb-2">{stats.completed}</div>
          <div className="text-gray-400">Completed</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-blue-500 mb-2">{stats.inPlanning}</div>
          <div className="text-gray-400">In Planning</div>
        </div>
      </div>
    </div>
  );
};
