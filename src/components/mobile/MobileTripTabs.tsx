import React, { useRef, useEffect } from 'react';
import { MessageCircle, Calendar, ClipboardList, BarChart3, Camera } from 'lucide-react';
import { MobileTripChat } from './MobileTripChat';
import { MobileGroupCalendar } from './MobileGroupCalendar';
import { MobileTripTasks } from './MobileTripTasks';
import { CommentsWall } from '../CommentsWall';
import { MobileUnifiedMediaHub } from './MobileUnifiedMediaHub';
import { hapticService } from '../../services/hapticService';
import { useTripVariant } from '../../contexts/TripVariantContext';
import { TripPreferences as TripPreferencesType } from '../../types/consumer';

interface MobileTripTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  tripId: string;
  basecamp: { name: string; address: string };
  tripPreferences: TripPreferencesType | undefined;
  onPreferencesChange: (preferences: TripPreferencesType) => void;
}

export const MobileTripTabs = ({
  activeTab,
  onTabChange,
  tripId,
  basecamp,
  tripPreferences,
  onPreferencesChange
}: MobileTripTabsProps) => {
  const { accentColors } = useTripVariant();
  const contentRef = useRef<HTMLDivElement>(null);
  const tabsContainerRef = useRef<HTMLDivElement>(null);

  const tabs = [
    { id: 'chat', label: 'Chat', icon: MessageCircle },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'tasks', label: 'Tasks', icon: ClipboardList },
    { id: 'polls', label: 'Polls', icon: BarChart3 },
    { id: 'media', label: 'Media', icon: Camera }
  ];

  // Scroll active tab into view
  useEffect(() => {
    if (tabsContainerRef.current) {
      const activeButton = tabsContainerRef.current.querySelector(`[data-tab="${activeTab}"]`);
      if (activeButton) {
        activeButton.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      }
    }
  }, [activeTab]);

  const handleTabPress = async (tabId: string) => {
    await hapticService.light();
    onTabChange(tabId);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'chat':
        return <MobileTripChat tripId={tripId} />;
      case 'calendar':
        return <MobileGroupCalendar tripId={tripId} />;
      case 'tasks':
        return <MobileTripTasks tripId={tripId} />;
      case 'polls':
        return <CommentsWall />;
      case 'media':
        return <MobileUnifiedMediaHub tripId={tripId} />;
      default:
        return <MobileTripChat tripId={tripId} />;
    }
  };

  return (
    <>
      {/* Horizontal Scrollable Tab Bar - Sticky */}
      <div className="sticky top-[73px] z-40 bg-black/95 backdrop-blur-md border-b border-white/10">
        <div
          ref={tabsContainerRef}
          className="flex overflow-x-auto scrollbar-hide gap-2 px-4 py-3"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                data-tab={tab.id}
                onClick={() => handleTabPress(tab.id)}
                className={`
                  flex items-center justify-center gap-2 
                  px-4 py-2.5 min-w-max
                  rounded-lg font-medium text-sm
                  transition-all duration-200
                  flex-shrink-0
                  active:scale-95
                  ${
                    isActive
                      ? `bg-gradient-to-r ${accentColors.gradient} text-white shadow-lg`
                      : 'bg-white/10 text-gray-300'
                  }
                `}
              >
                <Icon size={18} className="flex-shrink-0" />
                <span className="whitespace-nowrap">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content - Full height with padding for bottom nav */}
      <div
        ref={contentRef}
        className="min-h-[calc(100vh-240px)] bg-black"
      >
        {renderTabContent()}
      </div>
    </>
  );
};
