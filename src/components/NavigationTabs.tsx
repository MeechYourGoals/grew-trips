
import React from 'react';

interface NavigationTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const NavigationTabs = ({ activeTab, onTabChange }: NavigationTabsProps) => {
  return (
    <div className="flex gap-1 bg-gray-100 p-1 rounded-2xl mb-8">
      <button
        onClick={() => onTabChange('places')}
        className={`flex-1 px-6 py-4 rounded-xl font-semibold text-sm transition-all duration-300 ${
          activeTab === 'places'
            ? 'bg-white text-gray-900 shadow-lg shadow-gray-200/50'
            : 'text-gray-600 hover:text-gray-900'
        }`}
      >
        Completed Trips
      </button>
      <button
        onClick={() => onTabChange('trips')}
        className={`flex-1 px-6 py-4 rounded-xl font-semibold text-sm transition-all duration-300 ${
          activeTab === 'trips'
            ? 'bg-white text-gray-900 shadow-lg shadow-gray-200/50'
            : 'text-gray-600 hover:text-gray-900'
        }`}
      >
        Current & Upcoming Trips
      </button>
    </div>
  );
};
