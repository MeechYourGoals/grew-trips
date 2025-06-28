
import React, { useState } from 'react';
import { MessageCircle, Users, Calendar, Camera, Radio, Link, MessageSquare, Receipt } from 'lucide-react';
import { TripChat } from './TripChat';
import { GroupCalendar } from './GroupCalendar';
import { PhotoAlbum } from './PhotoAlbum';
import { Broadcasts } from './Broadcasts';
import { VenueIdeas } from './VenueIdeas';
import { CommentsWall } from './CommentsWall';
import { ReceiptsTab } from './receipts/ReceiptsTab';

interface TripTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  tripId?: string;
}

export const TripTabs = ({ activeTab: parentActiveTab, onTabChange: parentOnTabChange, tripId = '1' }: TripTabsProps) => {
  const [activeTab, setActiveTab] = useState('chat');

  const tabs = [
    { id: 'chat', label: 'Chat', icon: MessageCircle },
    { id: 'broadcasts', label: 'Broadcasts', icon: Radio },
    { id: 'links', label: 'Links', icon: Link },
    { id: 'comments', label: 'Comments', icon: MessageSquare },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'photos', label: 'Photos', icon: Camera },
    { id: 'receipts', label: 'Receipts', icon: Receipt }
  ];

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'chat':
        return <TripChat />;
      case 'broadcasts':
        return <Broadcasts />;
      case 'links':
        return <VenueIdeas />;
      case 'comments':
        return <CommentsWall />;
      case 'calendar':
        return <GroupCalendar />;
      case 'photos':
        return <PhotoAlbum />;
      case 'receipts':
        return <ReceiptsTab tripId={tripId} />;
      default:
        return <TripChat />;
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8">
      {/* Tab Navigation */}
      <div className="grid grid-cols-7 gap-2 mb-8">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-glass-orange to-glass-yellow text-white'
                  : 'bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white'
              }`}
            >
              <Icon size={16} />
              <span className="hidden sm:inline text-xs">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px]">
        {renderTabContent()}
      </div>
    </div>
  );
};
