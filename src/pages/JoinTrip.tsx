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
    document.title = 'Join Trip - Chravel';
    
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
    const deepLinkUrl = `chravel://join-trip/${token}`;
    
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
      // Fetch real invite data from database
      const { data: invite, error } = await supabase
        .from('trip_invites')
        .select('*')
        .eq('code', token)
        .single();

      if (error || !invite) {
        console.error('Error fetching invite:', error);
        setError('Invalid invite link');
        setLoading(false);
        return;
      }

      // Check if invite is still valid
      if (!invite.is_active) {
        setError('This invite link has been deactivated');
        setLoading(false);
        return;
      }

      if (invite.expires_at && new Date(invite.expires_at) < new Date()) {
        setError('This invite link has expired');
        setLoading(false);
        return;
      }

      if (invite.max_uses && invite.current_uses >= invite.max_uses) {
        setError('This invite link has reached its maximum number of uses');
        setLoading(false);
        return;
      }

      setIsMockInvite(false);
      setInviteData({
        trip_id: invite.trip_id,
        invite_token: token,
        created_at: invite.created_at,
        require_approval: false, // Not implemented yet
        expires_at: invite.expires_at,
        max_uses: invite.max_uses,
        current_uses: invite.current_uses,
        is_active: invite.is_active,
        code: invite.code,
        id: invite.id,
        created_by: invite.created_by
      });
      setLoading(false);

    } catch (error) {
      console.error('Error fetching invite data:', error);
      setError('Failed to load invite details');
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
      // Call the join-trip edge function
      const { data, error } = await supabase.functions.invoke('join-trip', {
        body: { inviteCode: token }
      });

      if (error) {
        console.error('Error joining trip:', error);
        toast.error(error.message || 'Failed to join trip');
        setJoining(false);
        return;
      }

      if (!data.success) {
        toast.error(data.message || 'Failed to join trip');
        setJoining(false);
        return;
      }

      // Success! Show message and redirect to trip
      toast.success(data.message || 'Successfully joined the trip!');
      
      // Redirect based on trip type
      setTimeout(() => {
        if (data.trip_type === 'pro') {
          navigate(`/tour/pro/${data.trip_id}`);
        } else if (data.trip_type === 'event') {
          navigate(`/event/${data.trip_id}`);
        } else {
          navigate(`/trip/${data.trip_id}`);
        }
      }, 1000);

    } catch (error) {
      console.error('Error joining trip:', error);
      toast.error('An unexpected error occurred. Please try again.');
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
              Trip Invitation
            </h3>
            <div className="space-y-2 text-sm text-gray-300">
              <div className="flex items-center gap-2">
                <MapPin size={16} className="text-yellow-400" />
                <span>Trip ID: {inviteData?.trip_id}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={16} className="text-yellow-400" />
                <span>Invited {inviteData?.created_at ? new Date(inviteData.created_at).toLocaleDateString() : 'Recently'}</span>
              </div>
              {inviteData?.expires_at && (
                <div className="flex items-center gap-2">
                  <Calendar size={16} className="text-yellow-400" />
                  <span>Expires: {new Date(inviteData.expires_at).toLocaleDateString()}</span>
                </div>
              )}
              {inviteData?.max_uses && (
                <div className="flex items-center gap-2 text-gray-400 text-xs">
                  <span>Uses: {inviteData.current_uses || 0} / {inviteData.max_uses}</span>
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