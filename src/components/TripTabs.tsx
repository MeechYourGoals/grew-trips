
import React, { useState } from 'react';
import { MessageCircle, Users, Calendar, Camera, Radio, Link, BarChart3, FileText, ClipboardList, Lock } from 'lucide-react';
import { TripChat } from './TripChat';
import { GroupCalendar } from './GroupCalendar';
import { PhotoAlbum } from './PhotoAlbum';
import { Broadcasts } from './Broadcasts';
import { VenueIdeas } from './VenueIdeas';
import { CommentsWall } from './CommentsWall';
import { FilesTab } from './FilesTab';
import { TripTasksTab } from './todo/TripTasksTab';
import { UnifiedMediaHub } from './UnifiedMediaHub';
import { EnhancedMediaAggregatedLinks } from './EnhancedMediaAggregatedLinks';
import { useTripVariant } from '../contexts/TripVariantContext';
import { useFeatureToggle } from '../hooks/useFeatureToggle';

interface TripTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  tripId?: string;
  tripData?: {
    enabled_features?: string[];
    trip_type?: 'consumer' | 'pro' | 'event';
  };
}

export const TripTabs = ({ activeTab: parentActiveTab, onTabChange: parentOnTabChange, tripId = '1', tripData }: TripTabsProps) => {
  const [activeTab, setActiveTab] = useState('chat');
  const { accentColors } = useTripVariant();
  const features = useFeatureToggle(tripData || {});

  const tabs = [
    { id: 'chat', label: 'Chat', icon: MessageCircle, enabled: features.showChat },
    { id: 'calendar', label: 'Calendar', icon: Calendar, enabled: features.showCalendar },
    { id: 'todo', label: 'To-Do List', icon: ClipboardList, enabled: features.showTodo },
    { id: 'polls', label: 'Polls', icon: BarChart3, enabled: features.showPolls },
    { id: 'media', label: 'Media', icon: Camera, enabled: features.showPhotos },
    { id: 'links', label: 'Links', icon: Link, enabled: features.showLinks },
    { id: 'files', label: 'Files', icon: FileText, enabled: features.showFiles }
  ];

  const handleTabChange = (tab: string, enabled: boolean) => {
    if (enabled) {
      setActiveTab(tab);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'chat':
        return <TripChat />;
      // Broadcasts case removed
      case 'links':
        return <EnhancedMediaAggregatedLinks tripId={tripId} />;
      case 'polls':
        return <CommentsWall />;
      case 'todo':
        return <TripTasksTab tripId={tripId} />;
      case 'calendar':
        return <GroupCalendar />;
      case 'media':
        return <UnifiedMediaHub tripId={tripId} />;
      case 'files':
        return <FilesTab tripId={tripId} />;
      default:
        return <TripChat />;
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8">
      {/* Tab Navigation - Responsive Center + Scroll */}
      <div className="mb-8">
        <div className="flex overflow-x-auto whitespace-nowrap scroll-smooth gap-2 pb-2 -mx-2 px-2 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 justify-center">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            const enabled = tab.enabled;
            
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id, enabled)}
                disabled={!enabled}
                className={`
                  flex items-center justify-center gap-2 
                  px-4 py-3 min-h-[44px] min-w-max
                  rounded-lg font-medium text-sm
                  transition-all duration-200
                  flex-shrink-0
                  ${
                    isActive && enabled
                      ? `bg-gradient-to-r ${accentColors.gradient} text-white shadow-md`
                      : enabled
                      ? 'bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white hover:shadow-sm'
                      : 'bg-white/5 text-gray-500 cursor-not-allowed opacity-50'
                  }
                  ${enabled ? 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent' : ''}
                `}
              >
                <Icon size={16} className="flex-shrink-0" />
                <span className="whitespace-nowrap">{tab.label}</span>
                {!enabled && <Lock size={12} className="ml-1 flex-shrink-0" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px]">
        {renderTabContent()}
      </div>
    </div>
  );
};
