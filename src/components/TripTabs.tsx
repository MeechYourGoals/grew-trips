
import React, { useState } from 'react';
import { Search, Send } from 'lucide-react';
import { TripChat } from './TripChat';
import { VenueIdeas } from './VenueIdeas';
import { CommentsWall } from './CommentsWall';
import { GroupCalendar } from './GroupCalendar';
import { Broadcasts } from './Broadcasts';
import { PhotoAlbum } from './PhotoAlbum';

interface TripTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const TripTabs = ({ activeTab, onTabChange }: TripTabsProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [message, setMessage] = useState('');

  const tabs = [
    { id: 'chat', label: 'Trip Chat' },
    { id: 'venues', label: 'Link Wall' },
    { id: 'calendar', label: 'Calendar' },
    { id: 'broadcasts', label: 'Broadcasts' },
    { id: 'wall', label: 'Comments Wall' },
    { id: 'photos', label: 'Photo Album' }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'chat':
        return <TripChat />;
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
    <div className="bg-white border border-gray-200 rounded-3xl overflow-hidden shadow-lg">
      {/* Tab Navigation */}
      <div className="flex bg-gray-50/80 overflow-x-auto border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex-shrink-0 px-6 py-4 text-center font-medium text-sm transition-all duration-200 border-b-2 ${
              activeTab === tab.id
                ? 'bg-white text-blue-600 border-blue-600'
                : 'text-gray-600 hover:text-gray-900 border-transparent hover:bg-white/50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Search Bar (for chat only) */}
      {activeTab === 'chat' && (
        <div className="p-6 bg-gray-50/50 border-b border-gray-200">
          <div className="relative">
            <Search size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search messages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-gray-300 rounded-2xl pl-12 pr-4 py-4 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
        </div>
      )}

      {/* Tab Content */}
      <div className="min-h-[400px]">
        {renderTabContent()}
      </div>

      {/* Message Input (for chat only) */}
      {activeTab === 'chat' && (
        <div className="p-6 bg-gray-50/50 border-t border-gray-200">
          <div className="flex gap-4 items-center">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <div className="w-3 h-3 bg-green-400 rounded-full"></div>
            </div>
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Type your message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full bg-white border border-gray-300 rounded-2xl px-6 py-4 pr-14 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              />
              <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-xl transition-colors shadow-lg">
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
