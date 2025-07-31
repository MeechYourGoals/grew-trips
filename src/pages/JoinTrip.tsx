import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../integrations/supabase/client';
import { useAuth } from '../hooks/useAuth';
import { toast } from 'sonner';
import { Loader2, Users, MapPin, Calendar } from 'lucide-react';

interface InviteData {
  trip_id: string;
  invite_token?: string;
  created_at: string;
  require_approval?: boolean;
  expires_at?: string | null;
  max_uses?: number;
  current_uses?: number;
  is_active?: boolean;
  code?: string;
  id?: string;
  created_by?: string;
  updated_at?: string;
}

const JoinTrip = () => {
  const { token } = useParams<{ token?: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [inviteData, setInviteData] = useState<InviteData | null>(null);
  const [error, setError] = useState<string>('');
  const [isMockInvite, setIsMockInvite] = useState(false);

  // Set document head for rich link previews
  useEffect(() => {
    // Update page title and meta tags for social sharing
    document.title = 'Join Trip - Tryps';
    
    // Add Open Graph meta tags
    const updateMetaTag = (property: string, content: string) => {
      let meta = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement;
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('property', property);
        document.head.appendChild(meta);
      }
      meta.content = content;
    };

    const updateMetaName = (name: string, content: string) => {
      let meta = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement;
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('name', name);
        document.head.appendChild(meta);
      }
      meta.content = content;
    };

    updateMetaTag('og:title', 'Join an Amazing Trip!');
    updateMetaTag('og:description', 'You\'ve been invited to join a trip. Click to see details and join the adventure!');
    updateMetaTag('og:type', 'website');
    updateMetaTag('og:image', 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200&h=630&fit=crop');
    updateMetaName('twitter:card', 'summary_large_image');
    updateMetaName('twitter:title', 'Join an Amazing Trip!');
    updateMetaName('twitter:description', 'You\'ve been invited to join a trip. Click to see details and join the adventure!');
    updateMetaName('twitter:image', 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200&h=630&fit=crop');
  }, []);

  useEffect(() => {
    if (token) {
      // Check if this is coming from our universal link
      checkDeepLinkAndFetchInvite();
    } else {
      setError('Invalid invite link');
      setLoading(false);
    }
  }, [token]);

  const checkDeepLinkAndFetchInvite = async () => {
    if (!token) return;

    // Try to open the app via deep link first
    const deepLinkUrl = `tryps://join-trip/${token}`;
    
    // Check if we're on mobile and try to open the app
    if (/Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
      // Attempt to open the app
      const startTime = Date.now();
      window.location.href = deepLinkUrl;
      
      // If user comes back to browser after a short time, app probably isn't installed
      setTimeout(() => {
        if (Date.now() - startTime < 2000) {
          // App likely not installed, continue with web flow
          fetchInviteData();
        }
      }, 1500);
    } else {
      // Desktop or app not available, proceed with web flow
      fetchInviteData();
    }
  };

  const fetchInviteData = async () => {
    if (!token) return;

    try {
      // For now, treat all invites as mock since we're focusing on basecamp functionality
      setIsMockInvite(true);
      setInviteData({
        trip_id: 'mock-trip-' + token.substring(0, 8),
        invite_token: token,
        created_at: new Date().toISOString(),
        require_approval: new URLSearchParams(window.location.search).has('approval'),
        expires_at: new URLSearchParams(window.location.search).has('expires') ? 
          new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() : null
      });
      setLoading(false);
      return;

    } catch (error) {
      console.error('Error fetching invite data:', error);
      // Fallback to mock invite
      setIsMockInvite(true);
      setInviteData({
        trip_id: 'mock-trip-' + token.substring(0, 8),
        invite_token: token,
        created_at: new Date().toISOString()
      });
      setLoading(false);
    }
  };

  const handleJoinTrip = async () => {
    if (!user) {
      toast.error('Please log in to join this trip');
      return;
    }

    if (!token || !inviteData) return;

    setJoining(true);
    try {
      // Handle mock invites differently
      if (isMockInvite) {
        // Simulate joining for mock invites
        setTimeout(() => {
          toast.success('Demo: Successfully joined the trip!');
          // For mock invites, redirect to home since the trip doesn't exist
          navigate('/');
        }, 1000);
        return;
      }

      // For now, all real invites are handled as mock
      toast.success('Demo: Successfully joined the trip!');
      navigate('/');
    } catch (error) {
      console.error('Error joining trip:', error);
      toast.error('Failed to join trip');
    } finally {
      setJoining(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-white mx-auto mb-4" />
          <p className="text-gray-400">Loading invite details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold text-white mb-4">Invalid Invite</h1>
          <p className="text-gray-400 mb-6">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl transition-colors"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 max-w-md w-full">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">You're Invited!</h1>
          <p className="text-gray-400">Join this amazing trip with your friends</p>
        </div>

        {/* Enhanced Trip Preview Card */}
        <div className="bg-gradient-to-br from-yellow-600/20 via-yellow-500/10 to-transparent border border-yellow-500/20 rounded-2xl p-4 mb-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&h=200&fit=crop')] bg-cover bg-center opacity-10 rounded-2xl"></div>
          <div className="relative z-10">
            <h3 className="text-lg font-semibold text-white mb-3">
              {isMockInvite ? 'Demo Trip Invitation' : 'Trip to Explore'}
            </h3>
            <div className="space-y-2 text-sm text-gray-300">
              <div className="flex items-center gap-2">
                <MapPin size={16} className="text-yellow-400" />
                <span>
                  {isMockInvite ? 
                    `Demo Trip (ID: ${inviteData?.trip_id})` : 
                    `Trip ID: ${inviteData?.trip_id}`
                  }
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={16} className="text-yellow-400" />
                <span>Invited {inviteData?.created_at ? new Date(inviteData.created_at).toLocaleDateString() : 'Recently'}</span>
              </div>
              {isMockInvite && (
                <div className="mt-3 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                  <p className="text-blue-400 text-xs">
                    This is a demo invite link. In the full app, this would connect to a real trip with full details and participant photos.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {!user ? (
          <div className="space-y-4">
            <p className="text-gray-300 text-center">Please log in to join this trip</p>
            <div className="space-y-3">
              <button
                onClick={() => navigate('/login')}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white py-3 px-6 rounded-xl transition-all duration-200 font-medium"
              >
                Log In
              </button>
              <button
                onClick={() => navigate('/signup')}
                className="w-full bg-white/10 hover:bg-white/20 border border-white/20 text-white py-3 px-6 rounded-xl transition-colors"
              >
                Sign Up
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <button
              onClick={handleJoinTrip}
              disabled={joining}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white py-4 px-6 rounded-xl transition-all duration-200 font-medium disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {joining ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Joining...
                </>
              ) : (
                'Join Trip'
              )}
            </button>
            
            <button
              onClick={() => navigate('/')}
              className="w-full bg-white/10 hover:bg-white/20 border border-white/20 text-white py-3 px-6 rounded-xl transition-colors"
            >
              Go to Dashboard
            </button>
          </div>
        )}

        {inviteData?.require_approval && (
          <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
            <p className="text-yellow-400 text-sm text-center">
              This trip requires approval from the organizer
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default JoinTrip;