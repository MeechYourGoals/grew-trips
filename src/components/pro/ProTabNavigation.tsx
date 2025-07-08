
import React from 'react';
import { Crown, Lock } from 'lucide-react';
import { useTripVariant } from '../../contexts/TripVariantContext';
import { useAuth } from '../../hooks/useAuth';
import { ProTab, isReadOnlyTab } from './ProTabsConfig';
import { ProTripCategory } from '../../types/proCategories';

interface ProTabNavigationProps {
  tabs: ProTab[];
  activeTab: string;
  onTabChange: (tab: string) => void;
  category: ProTripCategory;
}

export const ProTabNavigation = ({ tabs, activeTab, onTabChange, category }: ProTabNavigationProps) => {
  const { accentColors } = useTripVariant();
  const { user } = useAuth();

  const userRole = user?.proRole || 'staff';
  const userPermissions = user?.permissions || ['read'];

  return (
    <div className="flex overflow-x-auto whitespace-nowrap scroll-smooth gap-2 mb-8 pb-2 -mx-2 px-2">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isReadOnly = isReadOnlyTab(tab.id, userRole, userPermissions);
        const displayLabel =
          tab.id === 'roster' && category === 'Content' ? 'Cast' : tab.label;
        
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex-shrink-0 min-w-max px-3 md:px-4 py-3 rounded-xl font-medium transition-all duration-200 text-sm md:text-base flex items-center gap-2 ${
              activeTab === tab.id
                ? `bg-gradient-to-r ${accentColors.gradient} text-white`
                : 'bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white'
            } ${isReadOnly ? 'opacity-75' : ''}`}
          >
            {Icon && <Icon size={16} />}
            {displayLabel}
            {tab.proOnly && (
              <Crown size={14} className={`text-${accentColors.primary}`} />
            )}
            {isReadOnly && (
              <Lock size={12} className="text-gray-400" />
            )}
          </button>
        );
      })}
    </div>
  );
};
