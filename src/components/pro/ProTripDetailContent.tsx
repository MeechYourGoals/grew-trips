
import React, { useState } from 'react';
import { Crown, Users, Package, Calendar as CalendarIcon, DollarSign, Shield, Tv, Award, FileCheck, Home } from 'lucide-react';
import { TripTabs } from '../TripTabs';
import { PlacesSection } from '../PlacesSection';
import { TripPreferences } from '../TripPreferences';
import { GeminiAIChat } from '../GeminiAIChat';
import { TripSearchTab } from '../TripSearchTab';
import { RosterTab } from './RosterTab';
import { RoomAssignmentsModal } from './RoomAssignmentsModal';
import { EquipmentTracking } from './EquipmentTracking';
import { TripPreferences as TripPreferencesType } from '../../types/consumer';
import { ProTripData } from '../../types/pro';
import { useTripVariant } from '../../contexts/TripVariantContext';

interface ProTripDetailContentProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onShowTripsPlusModal: () => void;
  tripId: string;
  basecamp: { name: string; address: string };
  tripPreferences: TripPreferencesType | undefined;
  onPreferencesChange: (preferences: TripPreferencesType) => void;
  tripData: ProTripData;
}

export const ProTripDetailContent = ({
  activeTab,
  onTabChange,
  onShowTripsPlusModal,
  tripId,
  basecamp,
  tripPreferences,
  onPreferencesChange,
  tripData
}: ProTripDetailContentProps) => {
  const { accentColors } = useTripVariant();
  const [showRoomModal, setShowRoomModal] = useState(false);

  // Mock user role - in real app this would come from auth context
  const userRole = 'admin'; // 'admin', 'staff', 'talent', 'player'

  const tabs = [
    { id: 'chat', label: 'Chat', icon: null },
    { id: 'places', label: 'Places', icon: null },
    { id: 'roster', label: 'Roster', icon: Users, proOnly: true },
    { id: 'equipment', label: 'Equipment', icon: Package, proOnly: true },
    { id: 'calendar', label: 'Calendar', icon: CalendarIcon, proOnly: true },
    { id: 'finance', label: 'Finance', icon: DollarSign, proOnly: true, restrictedRoles: ['talent', 'player'] },
    { id: 'medical', label: 'Medical', icon: Shield, proOnly: true },
    { id: 'compliance', label: 'Compliance', icon: FileCheck, proOnly: true, restrictedRoles: ['talent', 'player'] },
    { id: 'media', label: 'Media', icon: Tv, proOnly: true },
    { id: 'sponsors', label: 'Sponsors', icon: Award, proOnly: true },
    { id: 'ai-chat', label: 'AI Assistant', icon: null },
    { id: 'search', label: 'Search', icon: null }
  ];

  const visibleTabs = tabs.filter(tab => {
    // Check role-based restrictions
    if (tab.restrictedRoles && tab.restrictedRoles.includes(userRole)) {
      return false; // Hide tabs that are restricted for this role
    }
    return true;
  });

  const isReadOnly = (tabId: string) => {
    const tab = tabs.find(t => t.id === tabId);
    return tab?.restrictedRoles?.includes(userRole) === false && 
           (userRole === 'talent' || userRole === 'player') && 
           (tabId === 'finance' || tabId === 'compliance');
  };

  const handleUpdateRoomAssignments = (assignments: any[]) => {
    // In a real app, this would update the trip data
    console.log('Updated room assignments:', assignments);
  };

  const handleUpdateEquipment = (equipment: any[]) => {
    // In a real app, this would update the trip data
    console.log('Updated equipment:', equipment);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'chat':
        return <TripTabs activeTab="chat" onTabChange={() => {}} tripId={tripId} />;
      case 'places':
        return <PlacesSection />;
      case 'roster':
        return (
          <RosterTab
            roster={tripData.roster || []}
            userRole={userRole}
          />
        );
      case 'equipment':
        return (
          <EquipmentTracking
            equipment={tripData.equipment || []}
            onUpdateEquipment={handleUpdateEquipment}
          />
        );
      case 'calendar':
        return (
          <div className="space-y-6">
            <div className="bg-white/5 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
              <h3 className="text-lg font-bold text-white mb-4">Production Calendar</h3>
              <div className="text-center py-12">
                <CalendarIcon size={48} className="text-red-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-400 mb-2">Load-in/Load-out Scheduler</h3>
                <p className="text-gray-500 text-sm">Advanced scheduling with time-critical coordination coming soon</p>
              </div>
            </div>
          </div>
        );
      case 'finance':
        return (
          <div className="space-y-6">
            <div className="bg-white/5 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
              <h3 className="text-lg font-bold text-white mb-4">Financial Management</h3>
              {isReadOnly('finance') && (
                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3 mb-4">
                  <p className="text-yellow-400 text-sm">Read-only access for your role</p>
                </div>
              )}
              <div className="text-center py-12">
                <DollarSign size={48} className="text-red-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-400 mb-2">Per-diem & Settlement</h3>
                <p className="text-gray-500 text-sm">Per-diem automation and settlement tracking coming soon</p>
              </div>
            </div>
          </div>
        );
      case 'medical':
        return (
          <div className="space-y-6">
            <div className="bg-white/5 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
              <h3 className="text-lg font-bold text-white mb-4">Medical & Wellness</h3>
              <div className="text-center py-12">
                <Shield size={48} className="text-red-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-400 mb-2">Health Monitoring</h3>
                <p className="text-gray-500 text-sm">Injury status tracking and compliance monitoring coming soon</p>
              </div>
            </div>
          </div>
        );
      case 'compliance':
        return (
          <div className="space-y-6">
            <div className="bg-white/5 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
              <h3 className="text-lg font-bold text-white mb-4">Compliance Management</h3>
              {isReadOnly('compliance') && (
                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3 mb-4">
                  <p className="text-yellow-400 text-sm">Read-only access for your role</p>
                </div>
              )}
              <div className="text-center py-12">
                <FileCheck size={48} className="text-red-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-400 mb-2">Regulatory Compliance</h3>
                <p className="text-gray-500 text-sm">Visa, union, and safety compliance tracking coming soon</p>
              </div>
            </div>
          </div>
        );
      case 'media':
        return (
          <div className="space-y-6">
            <div className="bg-white/5 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
              <h3 className="text-lg font-bold text-white mb-4">Media & Press</h3>
              <div className="text-center py-12">
                <Tv size={48} className="text-red-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-400 mb-2">Media Coordination</h3>
                <p className="text-gray-500 text-sm">Interview scheduling and media coordination coming soon</p>
              </div>
            </div>
          </div>
        );
      case 'sponsors':
        return (
          <div className="space-y-6">
            <div className="bg-white/5 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
              <h3 className="text-lg font-bold text-white mb-4">Sponsor Management</h3>
              <div className="text-center py-12">
                <Award size={48} className="text-red-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-400 mb-2">Partnership Tracking</h3>
                <p className="text-gray-500 text-sm">Activation checklists and deliverable tracking coming soon</p>
              </div>
            </div>
          </div>
        );
      case 'ai-chat':
        return (
          <GeminiAIChat 
            tripId={tripId} 
            basecamp={basecamp}
            preferences={tripPreferences}
          />
        );
      case 'search':
        return <TripSearchTab tripId={tripId} />;
      default:
        return <TripTabs activeTab="chat" onTabChange={() => {}} tripId={tripId} />;
    }
  };

  return (
    <>
      {/* Enhanced Tab Navigation for Pro Trips */}
      <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
        {visibleTabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex-shrink-0 px-3 md:px-4 py-3 rounded-xl font-medium transition-all duration-200 text-sm md:text-base flex items-center gap-2 ${
                activeTab === tab.id
                  ? `bg-gradient-to-r ${accentColors.gradient} text-white`
                  : 'bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white'
              }`}
            >
              {Icon && <Icon size={16} />}
              {tab.label}
              {tab.proOnly && (
                <Crown size={14} className={`text-${accentColors.primary}`} />
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      {renderTabContent()}

      {/* Room Assignments Modal */}
      <RoomAssignmentsModal
        isOpen={showRoomModal}
        onClose={() => setShowRoomModal(false)}
        roomAssignments={tripData.roomAssignments || []}
        roster={tripData.roster || []}
        onUpdateAssignments={handleUpdateRoomAssignments}
      />
    </>
  );
};
