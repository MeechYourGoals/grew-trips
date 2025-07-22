
import React from 'react';
import { StatsData } from '../../utils/tripStatsCalculator';

interface TripStatsOverviewProps {
  stats: StatsData;
  viewMode: string;
  activeFilter?: string;
  onFilterClick: (filter: string) => void;
}

export const TripStatsOverview = ({ stats, viewMode, activeFilter, onFilterClick }: TripStatsOverviewProps) => {
  const getLabel = () => {
    switch (viewMode) {
      case 'myTrips': return 'Trips';
      case 'tripsPro': return 'Pro Trips';
      case 'events': return 'Events';
      default: return 'Items';
    }
  };

  const label = getLabel();

  const getStatButtonClass = (filterType: string) => {
    const baseClass = "text-center cursor-pointer transition-all duration-200 p-2 rounded-lg hover:bg-white/5";
    return activeFilter === filterType 
      ? `${baseClass} bg-white/10 border border-white/20` 
      : baseClass;
  };

  return (
    <div className="bg-gray-900/80 backdrop-blur-md border border-gray-700 rounded-2xl p-6 mb-8">
      <div className="grid grid-cols-4 gap-6">
        <button 
          onClick={() => onFilterClick('total')}
          className={getStatButtonClass('total')}
        >
          <div className="text-3xl font-bold text-white mb-2">{stats.total}</div>
          <div className="text-gray-400">Total {label}</div>
          {activeFilter === 'total' && <div className="w-full h-0.5 bg-white/40 mt-2 rounded"></div>}
        </button>
        
        <button 
          onClick={() => onFilterClick('upcoming')}
          className={getStatButtonClass('upcoming')}
        >
          <div className="text-3xl font-bold text-yellow-500 mb-2">{stats.upcoming}</div>
          <div className="text-gray-400">Upcoming</div>
          {activeFilter === 'upcoming' && <div className="w-full h-0.5 bg-yellow-500 mt-2 rounded"></div>}
        </button>
        
        <button 
          onClick={() => onFilterClick('completed')}
          className={getStatButtonClass('completed')}
        >
          <div className="text-3xl font-bold text-green-500 mb-2">{stats.completed}</div>
          <div className="text-gray-400">Completed</div>
          {activeFilter === 'completed' && <div className="w-full h-0.5 bg-green-500 mt-2 rounded"></div>}
        </button>
        
        <button 
          onClick={() => onFilterClick('inProgress')}
          className={getStatButtonClass('inProgress')}
        >
          <div className="text-3xl font-bold text-blue-500 mb-2 relative">
            {stats.inProgress}
            {stats.inProgress > 0 && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
            )}
          </div>
          <div className="text-gray-400">In Progress</div>
          {activeFilter === 'inProgress' && <div className="w-full h-0.5 bg-blue-500 mt-2 rounded"></div>}
        </button>
      </div>
    </div>
  );
};
