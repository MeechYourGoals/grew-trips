import { useState, useEffect } from 'react';
import { toast } from 'sonner';

import { supabase } from '../integrations/supabase/client';

interface UseInviteLinkProps {
  isOpen: boolean;
  tripId: string;
  tripName: string;
  requireApproval: boolean;
  expireIn7Days: boolean;
}

export const useInviteLink = ({ isOpen, tripId, tripName, requireApproval, expireIn7Days }: UseInviteLinkProps) => {
  const [copied, setCopied] = useState(false);
  const [inviteLink, setInviteLink] = useState('');
  const [loading, setLoading] = useState(false);

  // Generate mock invite link immediately when modal opens
  useEffect(() => {
    if (isOpen) {
      generateInviteLink();
    }
  }, [isOpen, requireApproval, expireIn7Days]);

  const generateInviteLink = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-invite', {
        body: {
          trip_id: tripId,
          require_approval: requireApproval,
          expire_in_days: expireIn7Days ? 7 : null,
        },
      });

      if (error) {
        throw new Error(error.message);
      }

      const token = data.invite_token as string;
      let inviteUrl = `https://junto.app/join/${token}`;

      const params = new URLSearchParams();
      if (requireApproval) params.append('approval', 'true');
      if (expireIn7Days) params.append('expires', '7d');

      if (params.toString()) {
        inviteUrl += `?${params.toString()}`;
      }

      setInviteLink(inviteUrl);
    } catch (err) {
      console.error('Failed to generate invite link:', err);
      toast.error('Could not create invite');
    } finally {
      setLoading(false);
    }
  };

  const regenerateInviteToken = () => {
    generateInviteLink();
    toast.success('New invite link generated!');
  };

  const handleCopyLink = async () => {
    if (!inviteLink) return;
    
    try {
      await navigator.clipboard.writeText(inviteLink);
      setCopied(true);
      toast.success('Link copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
      toast.error('Failed to copy link');
    }
  };

  const handleShare = async () => {
    if (!inviteLink) return;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Join my trip: ${tripName}`,
          text: `You're invited to join my trip "${tripName}"!`,
          url: inviteLink
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      handleCopyLink();
    }
  };

  const handleEmailInvite = () => {
    if (!inviteLink) return;
    
    const subject = encodeURIComponent(`Join my trip: ${tripName}`);
    const body = encodeURIComponent(
      `Hi there!\n\nYou're invited to join my trip "${tripName}"!\n\n` +
      `Click here to join: ${inviteLink}\n\n` +
      `If you have the Junto app installed, this link will open it directly. ` +
      `Otherwise, you can join through your browser!\n\nSee you there!`
    );
    window.open(`mailto:?subject=${subject}&body=${body}`);
  };

  const handleSMSInvite = () => {
    if (!inviteLink) return;
    
    const message = encodeURIComponent(
      `You're invited to join my trip "${tripName}"! ${inviteLink} (Opens in Junto app if installed)`
    );
    window.open(`sms:?body=${message}`);
  };

  return {
    copied,
    inviteLink,
    loading,
    regenerateInviteToken,
    handleCopyLink,
    handleShare,
    handleEmailInvite,
    handleSMSInvite
  };
};