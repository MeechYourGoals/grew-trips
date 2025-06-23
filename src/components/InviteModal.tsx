
import React, { useState } from 'react';
import { X, Copy, Share, Mail, MessageCircle, Check } from 'lucide-react';

interface InviteModalProps {
  isOpen: boolean;
  onClose: () => void;
  tripName: string;
  tripId: string;
}

export const InviteModal = ({ isOpen, onClose, tripName, tripId }: InviteModalProps) => {
  const [copied, setCopied] = useState(false);
  const inviteLink = `https://trips.lovable.app/join/${tripId}?invite=abc123`;

  if (!isOpen) return null;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Join my trip: ${tripName}`,
          text: `You're invited to join my trip "${tripName}" on Trips!`,
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
    const subject = encodeURIComponent(`Join my trip: ${tripName}`);
    const body = encodeURIComponent(
      `Hi there!\n\nYou're invited to join my trip "${tripName}" on Trips.\n\nClick here to join: ${inviteLink}\n\nSee you there!`
    );
    window.open(`mailto:?subject=${subject}&body=${body}`);
  };

  const handleSMSInvite = () => {
    const message = encodeURIComponent(
      `You're invited to join my trip "${tripName}" on Trips! ${inviteLink}`
    );
    window.open(`sms:?body=${message}`);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 max-w-md w-full">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white">Invite to Trip</h2>
            <p className="text-gray-400 text-sm">{tripName}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={24} />
          </button>
        </div>

        {/* Invite Link */}
        <div className="mb-6">
          <label className="block text-gray-300 text-sm mb-2">Share Link</label>
          <div className="flex gap-2">
            <div className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-gray-300 text-sm font-mono truncate">
              {inviteLink}
            </div>
            <button
              onClick={handleCopyLink}
              className="bg-glass-orange hover:bg-glass-orange/80 text-white px-4 py-3 rounded-xl transition-colors flex items-center gap-2"
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
              <span className="hidden sm:inline">{copied ? 'Copied!' : 'Copy'}</span>
            </button>
          </div>
        </div>

        {/* Quick Share Options */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <button
            onClick={handleShare}
            className="flex items-center justify-center gap-3 bg-white/10 hover:bg-white/20 border border-white/20 text-white py-4 rounded-xl transition-colors"
          >
            <Share size={20} />
            <span>Share</span>
          </button>
          
          <button
            onClick={handleEmailInvite}
            className="flex items-center justify-center gap-3 bg-white/10 hover:bg-white/20 border border-white/20 text-white py-4 rounded-xl transition-colors"
          >
            <Mail size={20} />
            <span>Email</span>
          </button>
        </div>

        {/* SMS Option */}
        <button
          onClick={handleSMSInvite}
          className="w-full flex items-center justify-center gap-3 bg-white/10 hover:bg-white/20 border border-white/20 text-white py-4 rounded-xl transition-colors mb-6"
        >
          <MessageCircle size={20} />
          <span>Text Message</span>
        </button>

        {/* Instructions */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
          <h4 className="text-white font-medium mb-2">How it works</h4>
          <ul className="text-gray-300 text-sm space-y-1">
            <li>• Share the link with friends you want to invite</li>
            <li>• They'll be able to join your trip instantly</li>
            <li>• Collaborators can chat, add places, and more</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
