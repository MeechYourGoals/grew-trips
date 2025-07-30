
import React, { useState } from 'react';
import { useInviteLink } from '../hooks/useInviteLink';
import { InviteModalHeader } from './invite/InviteModalHeader';
import { InviteLinkSection } from './invite/InviteLinkSection';
import { InviteSettingsSection } from './invite/InviteSettingsSection';
import { ShareOptionsSection } from './invite/ShareOptionsSection';
import { InviteInstructions } from './invite/InviteInstructions';

interface InviteModalProps {
  isOpen: boolean;
  onClose: () => void;
  tripName: string;
  tripId: string;
}

export const InviteModal = ({ isOpen, onClose, tripName, tripId }: InviteModalProps) => {
  const [requireApproval, setRequireApproval] = useState(false);
  const [expireIn7Days, setExpireIn7Days] = useState(false);

  const {
    copied,
    inviteLink,
    loading,
    regenerateInviteToken,
    handleCopyLink,
    handleShare,
    handleEmailInvite,
    handleSMSInvite
  } = useInviteLink({ isOpen, tripId, tripName, requireApproval, expireIn7Days });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 max-w-md w-full">
        <InviteModalHeader tripName={tripName} onClose={onClose} />
        
        <InviteLinkSection
          inviteLink={inviteLink}
          loading={loading}
          copied={copied}
          onCopyLink={handleCopyLink}
          onRegenerate={regenerateInviteToken}
        />
        
        <InviteSettingsSection
          requireApproval={requireApproval}
          expireIn7Days={expireIn7Days}
          onRequireApprovalChange={setRequireApproval}
          onExpireIn7DaysChange={setExpireIn7Days}
        />
        
        <ShareOptionsSection
          loading={loading}
          inviteLink={inviteLink}
          onShare={handleShare}
          onEmailInvite={handleEmailInvite}
          onSMSInvite={handleSMSInvite}
        />
        
        <InviteInstructions />
      </div>
    </div>
  );
};
