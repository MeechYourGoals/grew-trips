import { EventSetupData, EventInvitation } from '@/types';

interface EventInvitationsSectionProps {
  eventData?: EventSetupData;
  onEventDataChange?: (data: EventSetupData) => void;
}

export const EventInvitationsSection = ({ eventData = {}, onEventDataChange }: EventInvitationsSectionProps) => {
  const [invitations, setInvitations] = useState<EventInvitation[]>(eventData.invitations || []);

  const handleInvitationsUpdate = (updatedInvitations: EventInvitation[]) => {
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