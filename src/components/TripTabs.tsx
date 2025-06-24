
import React from 'react';
import { MessageCircle, Users, Calendar, Camera, Radio } from 'lucide-react';
import { TripChat } from './TripChat';
import { GroupCalendar } from './GroupCalendar';
import { PhotoAlbum } from './PhotoAlbum';
import { Broadcasts } from './Broadcasts';

interface TripTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const TripTabs = ({ activeTab, onTabChange }: TripTabsProps) => {
  const tabs = [
    { id: 'chat', label: 'Chat', icon: MessageCircle },
    { id: 'broadcasts', label: 'Broadcasts', icon: Radio },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'photos', label: 'Photos', icon: Camera }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'chat':
        return <TripChat />;
      case 'broadcasts':
        return <Broadcasts />;
      case 'calendar':
        return <GroupCalendar />;
      case 'photos':
        return <PhotoAlbum />;
      default:
        return <TripChat />;
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8">
      {/* Tab Navigation */}
      <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex-shrink-0 flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-glass-orange to-glass-yellow text-white'
                  : 'bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white'
              }`}
            >
              <Icon size={16} />
              {tab.label}
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
