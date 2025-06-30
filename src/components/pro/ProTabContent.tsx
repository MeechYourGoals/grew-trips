
import React from 'react';
import { CalendarIcon, DollarSign, Shield, FileCheck, Tv, Award } from 'lucide-react';
import { TripTabs } from '../TripTabs';
import { PlacesSection } from '../PlacesSection';
import { GeminiAIChat } from '../GeminiAIChat';
import { TripSearchTab } from '../TripSearchTab';
import { RosterTab } from './RosterTab';
import { EquipmentTracking } from './EquipmentTracking';
import { TripPreferences as TripPreferencesType } from '../../types/consumer';
import { ProTripData } from '../../types/pro';
import { isReadOnlyTab } from './ProTabsConfig';

interface ProTabContentProps {
  activeTab: string;
  tripId: string;
  basecamp: { name: string; address: string };
  tripPreferences: TripPreferencesType | undefined;
  tripData: ProTripData;
  userRole: string;
  onUpdateRoomAssignments: (assignments: any[]) => void;
  onUpdateEquipment: (equipment: any[]) => void;
}

export const ProTabContent = ({
  activeTab,
  tripId,
  basecamp,
  tripPreferences,
  tripData,
  userRole,
  onUpdateRoomAssignments,
  onUpdateEquipment
}: ProTabContentProps) => {
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
            onUpdateEquipment={onUpdateEquipment}
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
              {isReadOnlyTab('finance', userRole) && (
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
              {isReadOnlyTab('compliance', userRole) && (
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

  return <>{renderTabContent()}</>;
};
