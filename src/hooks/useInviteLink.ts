import { useState, useEffect } from 'react';
import { toast } from 'sonner';

interface UseInviteLinkProps {
  isOpen: boolean;
  tripName: string;
  requireApproval: boolean;
  expireIn7Days: boolean;
  tripId?: string;
  proTripId?: string;
}

export const useInviteLink = ({ isOpen, tripName, requireApproval, expireIn7Days, tripId, proTripId }: UseInviteLinkProps) => {
  const [copied, setCopied] = useState(false);
  const [inviteLink, setInviteLink] = useState('');
  const [loading, setLoading] = useState(false);

  // Generate real trip link immediately when modal opens
  useEffect(() => {
    if (isOpen) {
      generateTripLink();
    }
  }, [isOpen, requireApproval, expireIn7Days, tripId, proTripId]);

  const generateTripLink = () => {
    let baseUrl = 'https://chravel.app';
    let tripUrl = '';
    
    // Generate actual trip URL based on trip type
    if (proTripId) {
      tripUrl = `${baseUrl}/tour/pro/${proTripId}`;
    } else if (tripId) {
      tripUrl = `${baseUrl}/trip/${tripId}`;
    } else {
      // Fallback to join link if no specific trip ID
      const mockToken = crypto.randomUUID();
      tripUrl = `${baseUrl}/join/${mockToken}`;
    }
    
    // Add parameters for settings
    const params = new URLSearchParams();
    if (requireApproval) params.append('approval', 'true');
    if (expireIn7Days) params.append('expires', '7d');
    
    if (params.toString()) {
      tripUrl += `?${params.toString()}`;
    }

    setInviteLink(tripUrl);
    setLoading(false);
  };

  const regenerateInviteToken = () => {
    setLoading(true);
    // Generate new trip link
    generateTripLink();
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
      `If you have the Chravel app installed, this link will open it directly. ` +
      `Otherwise, you can join through your browser!\n\nSee you there!`
    );
    window.open(`mailto:?subject=${subject}&body=${body}`);
  };

  const handleSMSInvite = () => {
    if (!inviteLink) return;
    
    const message = encodeURIComponent(
      `You're invited to join my trip "${tripName}"! ${inviteLink} (Opens in Chravel app if installed)`
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