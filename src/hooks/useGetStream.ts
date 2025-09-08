import { useState, useEffect } from 'react';
import { StreamChat, Channel } from 'stream-chat';
import { getStreamService } from '@/services/getStreamService';
import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';
import { PrivacyMode } from '../types/privacy';

export const useGetStream = () => {
  const [client, setClient] = useState<StreamChat | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const initializeGetStream = async () => {
      if (!user) {
        await getStreamService.disconnectUser();
        setClient(null);
        return;
      }

      setIsConnecting(true);
      setError(null);

      try {
        // Get user profile for display name and avatar
        const { data: profile } = await supabase
          .from('profiles')
          .select('display_name, avatar_url')
          .eq('user_id', user.id)
          .single();

        const userName = profile?.display_name || user.email?.split('@')[0] || 'Unknown User';
        const userAvatar = profile?.avatar_url;

        const streamClient = await getStreamService.initialize(
          user.id,
          userName,
          userAvatar
        );

        setClient(streamClient);
      } catch (err) {
        console.error('Failed to initialize GetStream:', err);
        setError(err instanceof Error ? err.message : 'Failed to connect to chat');
      } finally {
        setIsConnecting(false);
      }
    };

    initializeGetStream();

    // Cleanup on unmount
    return () => {
      getStreamService.disconnectUser();
    };
  }, [user]);

  const getTripChannel = async (tripId: string, privacyMode?: PrivacyMode): Promise<Channel | null> => {
    if (!client) return null;

    try {
      return await getStreamService.getOrCreateTripChannel(tripId, privacyMode);
    } catch (err) {
      console.error('Failed to get trip channel:', err);
      setError(err instanceof Error ? err.message : 'Failed to access chat channel');
      return null;
    }
  };

  return {
    client,
    isConnecting,
    error,
    getTripChannel,
    isReady: !!client && !isConnecting,
  };
};