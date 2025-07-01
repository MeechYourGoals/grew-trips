
import React from 'react';
import { MessageCircle, Users, Calendar, Camera, Radio, Link, MessageSquare, Receipt, FileText } from 'lucide-react';
import { useTripVariant } from '../contexts/TripVariantContext';
import { useIsMobile } from '../hooks/use-mobile';

interface MobileTripTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  tabs: Array<{
    id: string;
    label: string;
    icon: React.ComponentType<any>;
  }>;
}

export const MobileTripTabs = ({ activeTab, onTabChange, tabs }: MobileTripTabsProps) => {
  const { accentColors } = useTripVariant();
  const isMobile = useIsMobile();

  if (!isMobile) return null;

  return (
    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-2 mb-6">
      {/* Mobile Tab Navigation - Optimized Grid */}
      <div className="grid grid-cols-4 gap-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center justify-center gap-1 p-3 rounded-xl font-medium transition-all duration-200 min-h-[60px] ${
                isActive
                  ? `bg-gradient-to-r ${accentColors.gradient} text-white`
                  : 'bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Icon size={18} className="flex-shrink-0" />
              <span className="text-xs font-medium leading-tight text-center">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
