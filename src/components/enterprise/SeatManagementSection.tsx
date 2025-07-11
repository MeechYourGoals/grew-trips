
import React, { useState } from 'react';
import { Users, UserPlus, Upload, Send } from 'lucide-react';
import { Button } from '../ui/button';
import { AddMemberModal } from './AddMemberModal';
import { BulkUploadModal } from './BulkUploadModal';
import { RosterManagementTable } from './RosterManagementTable';
import { InvitationManager } from './InvitationManager';
import { RosterMember, TripCategory, InvitationBatch } from '../../types/enterprise';

interface SeatManagementSectionProps {
  organization: {
    seatLimit: number;
    seatsUsed: number;
  };
  tripCategory?: TripCategory;
}

export const SeatManagementSection = ({ organization, tripCategory = 'biz' }: SeatManagementSectionProps) => {
  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [showInviteManager, setShowInviteManager] = useState(false);

  // Mock data - in real app, this would come from props/state
  const [members, setMembers] = useState<RosterMember[]>([
    {
      id: '1',
      name: 'Sarah Johnson',
      email: 'sarah@acme.com',
      role: 'Admin',
      status: 'active',
      invitationSent: true,
      contactMethod: 'email',
      joinedAt: '2024-01-15T00:00:00Z',
      invitedAt: '2024-01-10T00:00:00Z'
    },
    {
      id: '2',
      name: 'Mike Chen',
      email: 'mike@acme.com',
      phone: '+1-555-0123',
      role: 'Member',
      status: 'active',
      invitationSent: true,
      contactMethod: 'both',
      joinedAt: '2024-02-01T00:00:00Z',
      invitedAt: '2024-01-28T00:00:00Z'
    },
    {
      id: '3',
      name: 'Lisa Rodriguez',
      email: 'lisa@acme.com',
      role: 'Member',
      status: 'pending',
      invitationSent: true,
      contactMethod: 'email',
      invitedAt: '2024-02-15T00:00:00Z'
    }
  ]);

  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);

  // Handlers
  const handleAddMember = (memberData: Omit<RosterMember, 'id' | 'status' | 'invitationSent'>) => {
    const newMember: RosterMember = {
      ...memberData,
      id: Date.now().toString(),
      status: memberData.invitedAt ? 'invited' : 'pending',
      invitationSent: !!memberData.invitedAt
    };
    setMembers(prev => [...prev, newMember]);
  };

  const handleBulkAdd = (memberDataList: Omit<RosterMember, 'id' | 'status' | 'invitationSent'>[]) => {
    const newMembers = memberDataList.map((memberData, index) => ({
      ...memberData,
      id: (Date.now() + index).toString(),
      status: 'invited' as const,
      invitationSent: true
    }));
    setMembers(prev => [...prev, ...newMembers]);
  };

  const handleMemberSelect = (memberId: string, selected: boolean) => {
    setSelectedMembers(prev => 
      selected 
        ? [...prev, memberId]
        : prev.filter(id => id !== memberId)
    );
  };

  const handleSelectAll = (selected: boolean) => {
    setSelectedMembers(selected ? members.map(m => m.id) : []);
  };

  const handleEditMember = (member: RosterMember) => {
    // Implementation for editing member
    console.log('Edit member:', member);
  };

  const handleDeleteMember = (memberId: string) => {
    setMembers(prev => prev.filter(m => m.id !== memberId));
    setSelectedMembers(prev => prev.filter(id => id !== memberId));
  };

  const handleResendInvite = (memberId: string) => {
    setMembers(prev => prev.map(m => 
      m.id === memberId 
        ? { ...m, invitedAt: new Date().toISOString(), invitationSent: true }
        : m
    ));
  };

  const handleSendBatchInvitations = async (batch: InvitationBatch) => {
    // Update member statuses
    setMembers(prev => prev.map(m => 
      batch.members.includes(m.id)
        ? { ...m, status: 'invited', invitationSent: true, invitedAt: new Date().toISOString() }
        : m
    ));
    console.log('Sending batch invitations:', batch);
  };

  const handleClearSelection = () => {
    setSelectedMembers([]);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold text-white">Roster & Roles</h3>
        <div className="flex items-center gap-2">
          {selectedMembers.length > 0 && (
            <Button
              onClick={() => setShowInviteManager(true)}
              size="sm"
              className="bg-primary/20 hover:bg-primary/30 text-primary border border-primary/30"
            >
              <Send size={16} className="mr-2" />
              Manage Invites ({selectedMembers.length})
            </Button>
          )}
        </div>
      </div>
      
      <div className="bg-white/5 border border-white/10 rounded-xl p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <h4 className="text-lg font-semibold text-white">Team Members</h4>
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={() => setShowAddModal(true)}
              size="sm"
              className="bg-primary hover:bg-primary/80"
            >
              <UserPlus size={16} className="mr-2" />
              Add Member
            </Button>
            <Button
              onClick={() => setShowBulkModal(true)}
              size="sm"
              variant="outline"
            >
              <Upload size={16} className="mr-2" />
              Bulk Upload
            </Button>
          </div>
        </div>
        
        {/* Seat Usage Overview */}
        <div className="grid md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white/5 rounded-lg p-4">
            <div className="text-2xl font-bold text-white">{members.length}</div>
            <div className="text-sm text-gray-400">Total Members</div>
          </div>
          <div className="bg-white/5 rounded-lg p-4">
            <div className="text-2xl font-bold text-green-400">
              {organization.seatLimit - members.length}
            </div>
            <div className="text-sm text-gray-400">Available Seats</div>
          </div>
          <div className="bg-white/5 rounded-lg p-4">
            <div className="text-2xl font-bold text-blue-400">{organization.seatLimit}</div>
            <div className="text-sm text-gray-400">Seat Limit</div>
          </div>
        </div>

        {/* Enhanced Member Table */}
        <RosterManagementTable
          members={members}
          selectedMembers={selectedMembers}
          onMemberSelect={handleMemberSelect}
          onSelectAll={handleSelectAll}
          onEditMember={handleEditMember}
          onDeleteMember={handleDeleteMember}
          onResendInvite={handleResendInvite}
        />
      </div>

      {/* Invitation Manager */}
      {showInviteManager && (
        <InvitationManager
          selectedMembers={selectedMembers}
          members={members}
          onSendBatchInvitations={handleSendBatchInvitations}
          onClearSelection={handleClearSelection}
        />
      )}

      {/* Modals */}
      <AddMemberModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAddMember={handleAddMember}
        tripCategory={tripCategory}
      />

      <BulkUploadModal
        isOpen={showBulkModal}
        onClose={() => setShowBulkModal(false)}
        onBulkAdd={handleBulkAdd}
        tripCategory={tripCategory}
      />
    </div>
  );
};
