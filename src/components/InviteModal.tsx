
import React, { useState, useEffect } from 'react';
import { X, Copy, Share, Mail, MessageCircle, Check, RotateCcw } from 'lucide-react';
import { supabase } from '../integrations/supabase/client';
import { useAuth } from '../hooks/useAuth';
import { toast } from 'sonner';

interface InviteModalProps {
  isOpen: boolean;
  onClose: () => void;
  tripName: string;
  tripId: string;
}

export const InviteModal = ({ isOpen, onClose, tripName, tripId }: InviteModalProps) => {
  const [copied, setCopied] = useState(false);
  const [inviteLink, setInviteLink] = useState('');
  const [loading, setLoading] = useState(false);
  const [requireApproval, setRequireApproval] = useState(false);
  const [expireIn7Days, setExpireIn7Days] = useState(false);
  const { user } = useAuth();

  // Generate mock invite link immediately when modal opens
  useEffect(() => {
    if (isOpen) {
      generateMockInviteLink();
    }
  }, [isOpen, requireApproval, expireIn7Days]);

  const generateMockInviteLink = () => {
    const mockToken = crypto.randomUUID();
    let baseUrl = 'https://tryps.app/join';
    
    // Create universal link that handles both app and web
    let inviteUrl = `${baseUrl}/${mockToken}`;
    
    // Add parameters for settings
    const params = new URLSearchParams();
    if (requireApproval) params.append('approval', 'true');
    if (expireIn7Days) params.append('expires', '7d');
    
    if (params.toString()) {
      inviteUrl += `?${params.toString()}`;
    }

    setInviteLink(inviteUrl);
    setLoading(false);
  };

  const regenerateInviteToken = () => {
    setLoading(true);
    // Generate new mock link
    generateMockInviteLink();
    toast.success('New invite link generated!');
  };

  if (!isOpen) return null;

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
      `If you have the Tryps app installed, this link will open it directly. ` +
      `Otherwise, you can join through your browser!\n\nSee you there!`
    );
    window.open(`mailto:?subject=${subject}&body=${body}`);
  };

  const handleSMSInvite = () => {
    if (!inviteLink) return;
    
    const message = encodeURIComponent(
      `You're invited to join my trip "${tripName}"! ${inviteLink} (Opens in Tryps app if installed)`
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
          <div className="flex items-center justify-between mb-2">
            <label className="block text-gray-300 text-sm">Share Link</label>
            <button
              onClick={regenerateInviteToken}
              disabled={loading}
              className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-300 transition-colors disabled:opacity-50"
            >
              <RotateCcw size={12} />
              Regenerate
            </button>
          </div>
          <div className="flex gap-2">
            <div className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-gray-300 text-sm font-mono truncate">
              {loading ? 'Loading invite link...' : inviteLink || 'Generating link...'}
            </div>
            <button
              onClick={handleCopyLink}
              disabled={loading || !inviteLink}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-xl transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
              <span className="hidden sm:inline">{copied ? 'Copied!' : 'Copy'}</span>
            </button>
          </div>
        </div>

        {/* Settings */}
        <div className="mb-6 space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-gray-300 text-sm">Require approval to join</label>
            <input
              type="checkbox"
              checked={requireApproval}
              onChange={(e) => setRequireApproval(e.target.checked)}
              className="rounded"
            />
          </div>
          <div className="flex items-center justify-between">
            <label className="text-gray-300 text-sm">Link expires in 7 days</label>
            <input
              type="checkbox"
              checked={expireIn7Days}
              onChange={(e) => setExpireIn7Days(e.target.checked)}
              className="rounded"
            />
          </div>
        </div>

        {/* Quick Share Options */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <button
            onClick={handleShare}
            disabled={loading || !inviteLink}
            className="flex items-center justify-center gap-3 bg-white/10 hover:bg-white/20 border border-white/20 text-white py-4 rounded-xl transition-colors disabled:opacity-50"
          >
            <Share size={20} />
            <span>Share</span>
          </button>
          
          <button
            onClick={handleEmailInvite}
            disabled={loading || !inviteLink}
            className="flex items-center justify-center gap-3 bg-white/10 hover:bg-white/20 border border-white/20 text-white py-4 rounded-xl transition-colors disabled:opacity-50"
          >
            <Mail size={20} />
            <span>Email</span>
          </button>
        </div>

        {/* SMS Option */}
        <button
          onClick={handleSMSInvite}
          disabled={loading || !inviteLink}
          className="w-full flex items-center justify-center gap-3 bg-white/10 hover:bg-white/20 border border-white/20 text-white py-4 rounded-xl transition-colors mb-6 disabled:opacity-50"
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
