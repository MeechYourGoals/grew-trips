
import React, { useState } from 'react';
import { RoomAssignmentsModal } from './RoomAssignmentsModal';
import { ProTabNavigation } from './ProTabNavigation';
import { ProTabContent } from './ProTabContent';
import { getVisibleTabs } from './ProTabsConfig';
import { TripPreferences as TripPreferencesType } from '../../types/consumer';
import { ProTripData } from '../../types/pro';

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
  const [showRoomModal, setShowRoomModal] = useState(false);

  // Mock user role - in real app this would come from auth context
  const userRole = 'admin'; // 'admin', 'staff', 'talent', 'player'

  const visibleTabs = getVisibleTabs(userRole);

  const handleUpdateRoomAssignments = (assignments: any[]) => {
    // In a real app, this would update the trip data
    console.log('Updated room assignments:', assignments);
  };

  const handleUpdateEquipment = (equipment: any[]) => {
    // In a real app, this would update the trip data
    console.log('Updated equipment:', equipment);
  };

  return (
    <>
      {/* Enhanced Tab Navigation for Pro Trips */}
      <ProTabNavigation
        tabs={visibleTabs}
        activeTab={activeTab}
        onTabChange={onTabChange}
      />

      {/* Tab Content */}
      <ProTabContent
        activeTab={activeTab}
        tripId={tripId}
        basecamp={basecamp}
        tripPreferences={tripPreferences}
        tripData={tripData}
        userRole={userRole}
        onUpdateRoomAssignments={handleUpdateRoomAssignments}
        onUpdateEquipment={handleUpdateEquipment}
      />

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
