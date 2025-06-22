
import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { TripChat } from './TripChat';
import { TourChat } from './TourChat';
import { VenueIdeas } from './VenueIdeas';
import { CommentsWall } from './CommentsWall';
import { GroupCalendar } from './GroupCalendar';
import { Broadcasts } from './Broadcasts';
import { PhotoAlbum } from './PhotoAlbum';
import { useParams } from 'react-router-dom';

interface TripTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  isProTour?: boolean;
}

export const TripTabs = ({ activeTab, onTabChange, isProTour = false }: TripTabsProps) => {
  const { tourId } = useParams();
  const [searchQuery, setSearchQuery] = useState('');

  const baseTabs = [
    { id: 'chat', label: 'Trip Chat' },
    { id: 'venues', label: 'Link Wall' },
    { id: 'calendar', label: 'Calendar' },
    { id: 'wall', label: 'Comments Wall' },
    { id: 'photos', label: 'Photo Album' }
  ];

  const proTabs = [
    { id: 'chat', label: 'Trip Chat' },
    { id: 'tour-chat', label: 'Tour Chat' },
    { id: 'venues', label: 'Link Wall' },
    { id: 'calendar', label: 'Calendar' },
    { id: 'broadcasts', label: 'Broadcasts' },
    { id: 'wall', label: 'Comments Wall' },
    { id: 'photos', label: 'Photo Album' }
  ];

  const tabs = isProTour ? proTabs : baseTabs;

  const renderTabContent = () => {
    switch (activeTab) {
      case 'chat':
        return <TripChat />;
      case 'tour-chat':
        return <TourChat />;
      case 'venues':
        return <VenueIdeas />;
      case 'calendar':
        return <GroupCalendar />;
      case 'broadcasts':
        return <Broadcasts />;
      case 'wall':
        return <CommentsWall />;
      case 'photos':
        return <PhotoAlbum />;
      default:
        return <TripChat />;
    }
  };

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-3xl overflow-hidden shadow-2xl shadow-black/50">
      {/* Tab Navigation */}
      <div className="flex bg-gray-800/50 overflow-x-auto border-b border-gray-800">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex-shrink-0 px-6 py-4 text-center font-medium text-sm transition-all duration-200 border-b-2 ${
              activeTab === tab.id
                ? 'bg-gray-900 text-red-400 border-red-500'
                : 'text-gray-400 hover:text-white border-transparent hover:bg-gray-800'
            }`}
          >
            {tab.label}
            {tab.id === 'tour-chat' && isProTour && (
              <span className="ml-2 text-xs bg-glass-orange/20 text-glass-orange px-2 py-1 rounded">
                PRO
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Global Search Bar */}
      <div className="p-6 bg-gray-800/30 border-b border-gray-800">
        <div className="relative">
          <Search size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search across all trips and messages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-2xl pl-12 pr-4 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
          />
        </div>
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px]">
        {renderTabContent()}
      </div>
    </div>
  );
};
