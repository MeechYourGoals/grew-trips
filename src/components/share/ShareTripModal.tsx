
import React, { useEffect, useState } from 'react';
import { X, Copy, Mail, MessageCircle, Share2, Check } from 'lucide-react';
import { Button } from '../ui/button';
import { useInviteLink } from '../../hooks/useInviteLink';
import { toast } from 'sonner';

interface Participant {
  id: number;
  name: string;
  avatar: string;
}

interface Trip {
  id: number;
  title: string;
  location: string;
  dateRange: string;
  participants: Participant[];
}

interface ShareTripModalProps {
  isOpen: boolean;
  onClose: () => void;
  trip: Trip;
}

export const ShareTripModal = ({ isOpen, onClose, trip }: ShareTripModalProps) => {
  const [emailRecipient, setEmailRecipient] = useState('');
  const [phoneRecipient, setPhoneRecipient] = useState('');
  const [copied, setCopied] = useState(false);

  const {
    inviteLink,
    loading,
    handleCopyLink,
    handleEmailInvite,
    handleSMSInvite,
    handleShare
  } = useInviteLink({ 
    isOpen, 
    tripName: trip.title, 
    requireApproval: false, 
    expireIn7Days: false 
  });

  // Handle ESC key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleCopyLinkClick = async () => {
    await handleCopyLink();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleEmailShare = () => {
    if (!emailRecipient.trim()) {
      toast.error('Please enter an email address');
      return;
    }
    handleEmailInvite();
    setEmailRecipient('');
    toast.success(`Invite sent to ${emailRecipient}!`);
  };

  const handleSMSShare = () => {
    if (!phoneRecipient.trim()) {
      toast.error('Please enter a phone number');
      return;
    }
    handleSMSInvite();
    setPhoneRecipient('');
    toast.success(`Invite sent to ${phoneRecipient}!`);
  };

  const handleNativeShare = async () => {
    await handleShare();
    toast.success('Share options opened!');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-background/95 backdrop-blur-md border border-border rounded-3xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Share Trip</h2>
            <p className="text-muted-foreground">Invite others to join "{trip.title}"</p>
          </div>
          <Button 
            onClick={onClose} 
            variant="ghost" 
            size="icon" 
            title="Close"
            className="hover:bg-destructive/20 hover:text-destructive text-foreground w-12 h-12"
          >
            <X size={28} />
          </Button>
        </div>

        {/* Trip Preview Card */}
        <div className="bg-gradient-to-br from-yellow-600/20 via-yellow-500/10 to-transparent rounded-2xl p-4 mb-6 border border-yellow-500/20">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&h=200&fit=crop')] bg-cover bg-center opacity-10 rounded-2xl"></div>
          <div className="relative z-10">
            <h3 className="text-lg font-bold text-white mb-2">{trip.title}</h3>
            <p className="text-white/80 text-sm mb-2">{trip.location}</p>
            <p className="text-white/80 text-sm mb-3">{trip.dateRange}</p>
            <div className="flex -space-x-2">
              {trip.participants.slice(0, 4).map((participant, index) => (
                <img
                  key={participant.id}
                  src={participant.avatar}
                  alt={participant.name}
                  className="w-8 h-8 rounded-full border-2 border-white"
                  style={{ zIndex: trip.participants.length - index }}
                />
              ))}
              {trip.participants.length > 4 && (
                <div className="w-8 h-8 rounded-full bg-white/20 border-2 border-white flex items-center justify-center text-xs font-medium text-white">
                  +{trip.participants.length - 4}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Invite Link */}
        <div className="mb-6">
          <label className="block text-foreground text-sm font-medium mb-2">Invite Link</label>
          <div className="flex gap-2">
            <div className="flex-1 bg-muted border border-border rounded-xl px-4 py-3 text-foreground text-sm font-mono truncate">
              {loading ? 'Generating invite link...' : inviteLink || 'Loading...'}
            </div>
            <Button
              onClick={handleCopyLinkClick}
              disabled={loading || !inviteLink}
              className="px-4 py-3"
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
              <span className="hidden sm:inline ml-2">{copied ? 'Copied!' : 'Copy'}</span>
            </Button>
          </div>
        </div>

        {/* Email Sharing */}
        <div className="mb-4">
          <label className="block text-foreground text-sm font-medium mb-2">Send via Email</label>
          <div className="flex gap-2">
            <input
              type="email"
              value={emailRecipient}
              onChange={(e) => setEmailRecipient(e.target.value)}
              placeholder="Enter email address"
              className="flex-1 bg-muted border border-border rounded-xl px-4 py-3 text-foreground text-sm"
            />
            <Button
              onClick={handleEmailShare}
              disabled={loading || !inviteLink}
              variant="outline"
            >
              <Mail size={16} />
              <span className="hidden sm:inline ml-2">Send</span>
            </Button>
          </div>
        </div>

        {/* SMS Sharing */}
        <div className="mb-6">
          <label className="block text-foreground text-sm font-medium mb-2">Send via Text</label>
          <div className="flex gap-2">
            <input
              type="tel"
              value={phoneRecipient}
              onChange={(e) => setPhoneRecipient(e.target.value)}
              placeholder="Enter phone number"
              className="flex-1 bg-muted border border-border rounded-xl px-4 py-3 text-foreground text-sm"
            />
            <Button
              onClick={handleSMSShare}
              disabled={loading || !inviteLink}
              variant="outline"
            >
              <MessageCircle size={16} />
              <span className="hidden sm:inline ml-2">Send</span>
            </Button>
          </div>
        </div>

        {/* Quick Share Options */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Button
            onClick={handleNativeShare}
            disabled={loading || !inviteLink}
            variant="outline"
            className="flex items-center justify-center gap-2"
          >
            <Share2 size={20} />
            <span>Share via Apps</span>
          </Button>
          
          <Button
            onClick={handleCopyLinkClick}
            disabled={loading || !inviteLink}
            variant="outline"
            className="flex items-center justify-center gap-2"
          >
            {copied ? <Check size={20} /> : <Copy size={20} />}
            <span>{copied ? 'Copied!' : 'Copy Link'}</span>
          </Button>
        </div>

        <p className="text-xs text-muted-foreground text-center mt-4">
          Anyone with this link can request to join your trip
        </p>
      </div>
    </div>
  );
};
