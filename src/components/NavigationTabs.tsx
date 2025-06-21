
import React from 'react';

interface NavigationTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const NavigationTabs = ({ activeTab, onTabChange }: NavigationTabsProps) => {
  return (
    <div className="flex gap-4">
      <button
        onClick={() => onTabChange('places')}
        className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
          activeTab === 'places'
            ? 'bg-blue-600 text-white shadow-lg'
            : 'bg-slate-800/50 text-slate-300 hover:bg-slate-800 hover:text-white'
        }`}
      >
        Completed Trips
      </button>
      <button
        onClick={() => onTabChange('trips')}
        className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
          activeTab === 'trips'
            ? 'bg-blue-600 text-white shadow-lg'
            : 'bg-slate-800/50 text-slate-300 hover:bg-slate-800 hover:text-white'
        }`}
      >
        Current & Upcoming Trips
      </button>
    </div>
  );
};
