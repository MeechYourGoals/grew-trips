import React, { useState } from 'react';
import { InvitationManager } from './InvitationManager';

interface EventInvitationsSectionProps {
  eventData?: any;
  onEventDataChange?: (data: any) => void;
}

export const EventInvitationsSection = ({ eventData = {}, onEventDataChange }: EventInvitationsSectionProps) => {
  const [invitations, setInvitations] = useState(eventData.invitations || []);

  const handleInvitationsUpdate = (updatedInvitations: any[]) => {
    setInvitations(updatedInvitations);
    onEventDataChange?.({ ...eventData, invitations: updatedInvitations });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold text-white mb-2">Invitations</h3>
        <p className="text-gray-300">Manage event invitations and send them to your attendees.</p>
      </div>

      <InvitationManager
        eventData={eventData}
        onInvitationsUpdate={handleInvitationsUpdate}
      />
    </div>
  );
};