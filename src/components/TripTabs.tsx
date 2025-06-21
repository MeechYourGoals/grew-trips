
import React, { useState } from 'react';
import { Search, Send } from 'lucide-react';
import { TripChat } from './TripChat';
import { VenueIdeas } from './VenueIdeas';
import { CommentsWall } from './CommentsWall';

interface TripTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const TripTabs = ({ activeTab, onTabChange }: TripTabsProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [message, setMessage] = useState('');

  const tabs = [
    { id: 'chat', label: 'Trip Chat' },
    { id: 'venues', label: 'Venue Ideas' },
    { id: 'wall', label: 'Comments Wall' }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'chat':
        return <TripChat />;
      case 'venues':
        return <VenueIdeas />;
      case 'wall':
        return <CommentsWall />;
      default:
        return <TripChat />;
    }
  };

  return (
    <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-2xl overflow-hidden">
      {/* Tab Navigation */}
      <div className="flex bg-slate-900/50">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex-1 px-6 py-4 text-center font-medium transition-all duration-200 ${
              activeTab === tab.id
                ? 'bg-blue-600 text-white'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Search Bar (for chat) */}
      {activeTab === 'chat' && (
        <div className="p-4 bg-slate-900/30 border-b border-slate-700/50">
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search messages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-800/50 border border-slate-600 rounded-lg pl-10 pr-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>
      )}

      {/* Tab Content */}
      <div className="min-h-[400px]">
        {renderTabContent()}
      </div>

      {/* Message Input (for chat) */}
      {activeTab === 'chat' && (
        <div className="p-4 bg-slate-900/30 border-t border-slate-700/50">
          <div className="flex gap-3 items-center">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            </div>
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Type your message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full bg-slate-800/50 border border-slate-600 rounded-lg px-4 py-3 pr-12 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
              />
              <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition-colors">
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
