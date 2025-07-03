
import React, { useState } from 'react';
import { RoomAssignmentsModal } from './RoomAssignmentsModal';
import { ProTabNavigation } from './ProTabNavigation';
import { ProTabContent } from './ProTabContent';
import { RoleSwitcher } from './RoleSwitcher';
import { getVisibleTabs } from './ProTabsConfig';
import { useAuth } from '../../hooks/useAuth';
import { TripPreferences as TripPreferencesType } from '../../types/consumer';
import { ProTripData } from '../../types/pro';
import { ProTripCategory } from '../../types/proCategories';

interface ProTripDetailContentProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onShowTripsPlusModal: () => void;
  tripId: string;
  basecamp: { name: string; address: string };
  tripPreferences: TripPreferencesType | undefined;
  onPreferencesChange: (preferences: TripPreferencesType) => void;
  tripData: ProTripData;
  selectedCategory: ProTripCategory;
}

export const ProTripDetailContent = ({
  activeTab,
  onTabChange,
  onShowTripsPlusModal,
  tripId,
  basecamp,
  tripPreferences,
  onPreferencesChange,
  tripData,
  selectedCategory
}: ProTripDetailContentProps) => {
  const [showRoomModal, setShowRoomModal] = useState(false);
  const { user } = useAuth();

  const userRole = user?.proRole || 'staff';
  const userPermissions = user?.permissions || ['read'];

  const visibleTabs = getVisibleTabs(userRole, userPermissions, selectedCategory);

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
      {/* Role Switcher for Testing - Now Dynamic */}
      <RoleSwitcher category={selectedCategory} />

      {/* Category-Specific Tab Navigation */}
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
        category={selectedCategory}
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
