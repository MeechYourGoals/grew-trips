import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../integrations/supabase/client';
import { useAuth } from '../hooks/useAuth';
import { toast } from 'sonner';
import { Loader2, Users, MapPin, Calendar } from 'lucide-react';

const JoinTrip = () => {
  const { token } = useParams<{ token?: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [inviteData, setInviteData] = useState<any>(null);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (token) {
      fetchInviteData();
    } else {
      setError('Invalid invite link');
      setLoading(false);
    }
  }, [token]);

  const fetchInviteData = async () => {
    if (!token) return;

    try {
      const { data, error } = await supabase
        .from('trip_invites')
        .select('*')
        .eq('invite_token', token)
        .eq('is_active', true)
        .maybeSingle();

      if (error || !data) {
        setError('Invalid or expired invite link');
        setLoading(false);
        return;
      }

      // Check if invite is expired
      if (data.expires_at && new Date(data.expires_at) < new Date()) {
        setError('This invite link has expired');
        setLoading(false);
        return;
      }

      // Check if invite has reached max uses
      if (data.max_uses && data.current_uses >= data.max_uses) {
        setError('This invite link has reached its maximum number of uses');
        setLoading(false);
        return;
      }

      setInviteData(data);
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
      const { data, error } = await supabase.rpc('join_trip_via_invite', {
        invite_token_param: token
      });

      if (error) {
        console.error('Error joining trip:', error);
        toast.error('Failed to join trip');
        return;
      }

      const result = typeof data === 'string' ? JSON.parse(data) : data;

      if (result.success) {
        toast.success('Successfully joined the trip!');
        // Navigate to the trip page
        navigate(`/trip/${result.trip_id}`);
      } else {
        toast.error(result.error || 'Failed to join trip');
      }
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

        {/* Trip Preview */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 mb-6">
          <h3 className="text-lg font-semibold text-white mb-3">Trip to Explore</h3>
          <div className="space-y-2 text-sm text-gray-300">
            <div className="flex items-center gap-2">
              <MapPin size={16} className="text-blue-400" />
              <span>Trip ID: {inviteData?.trip_id}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar size={16} className="text-blue-400" />
              <span>Invited {new Date(inviteData?.created_at).toLocaleDateString()}</span>
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