
import React, { useState } from 'react';
import { Crown, Users, Package, Calendar, DollarSign, Shield, Tv, Award } from 'lucide-react';
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

  const tabs = [
    { id: 'chat', label: 'Chat', icon: null },
    { id: 'roster', label: 'Roster & Roles', icon: Users, proOnly: true },
    { id: 'logistics', label: 'Logistics', icon: Package, proOnly: true },
    { id: 'schedule', label: 'Schedule', icon: Calendar, proOnly: true },
    { id: 'finance', label: 'Finance', icon: DollarSign, proOnly: true },
    { id: 'medical', label: 'Medical', icon: Shield, proOnly: true },
    { id: 'media', label: 'Media', icon: Tv, proOnly: true },
    { id: 'sponsors', label: 'Sponsors', icon: Award, proOnly: true },
    { id: 'places', label: 'Places', icon: null },
    { id: 'preferences', label: 'Preferences', icon: null },
    { id: 'ai-chat', label: 'AI Assistant', icon: null },
    { id: 'search', label: 'Search', icon: null }
  ];

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
      case 'roster':
        return (
          <RosterTab
            roster={tripData.roster || []}
            userRole="admin"
          />
        );
      case 'logistics':
        return (
          <div className="space-y-6">
            <div className="bg-white/5 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
              <h3 className="text-lg font-bold text-white mb-4">Logistics Management</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={() => setShowRoomModal(true)}
                  className="bg-red-600/20 hover:bg-red-600/30 border border-red-500/30 rounded-xl p-4 text-left transition-colors"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <Users className="text-red-400" size={20} />
                    <span className="text-white font-medium">Room Assignments</span>
                  </div>
                  <p className="text-gray-400 text-sm">
                    Manage rooming lists and occupancy ({tripData.roomAssignments?.length || 0} rooms)
                  </p>
                </button>
              </div>
            </div>
            <EquipmentTracking
              equipment={tripData.equipment || []}
              onUpdateEquipment={handleUpdateEquipment}
            />
          </div>
        );
      case 'schedule':
        return (
          <div className="text-center py-12">
            <Calendar size={48} className="text-red-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-400 mb-2">Load-in/Load-out Scheduler</h3>
            <p className="text-gray-500 text-sm">Advanced scheduling with time-critical coordination coming soon</p>
          </div>
        );
      case 'finance':
        return (
          <div className="text-center py-12">
            <DollarSign size={48} className="text-red-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-400 mb-2">Financial Management</h3>
            <p className="text-gray-500 text-sm">Per-diem automation and settlement tracking coming soon</p>
          </div>
        );
      case 'medical':
        return (
          <div className="text-center py-12">
            <Shield size={48} className="text-red-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-400 mb-2">Medical & Wellness</h3>
            <p className="text-gray-500 text-sm">Injury status tracking and compliance monitoring coming soon</p>
          </div>
        );
      case 'media':
        return (
          <div className="text-center py-12">
            <Tv size={48} className="text-red-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-400 mb-2">Media & Press</h3>
            <p className="text-gray-500 text-sm">Interview scheduling and media coordination coming soon</p>
          </div>
        );
      case 'sponsors':
        return (
          <div className="text-center py-12">
            <Award size={48} className="text-red-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-400 mb-2">Sponsor Management</h3>
            <p className="text-gray-500 text-sm">Activation checklists and deliverable tracking coming soon</p>
          </div>
        );
      case 'places':
        return <PlacesSection />;
      case 'preferences':
        return (
          <TripPreferences 
            tripId={tripId} 
            onPreferencesChange={onPreferencesChange} 
          />
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
        {tabs.map((tab) => {
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
