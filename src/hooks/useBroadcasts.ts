import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface Broadcast {
  id: string;
  trip_id: string;
  sender_id: string;
  sender_name: string;
  sender_avatar: string;
  content: string;
  location?: string;
  tag: 'chill' | 'logistics' | 'urgent';
  scheduled_time?: string;
  created_at: string;
  updated_at: string;
  reaction_counts: {
    coming: number;
    wait: number;
    cant: number;
  };
  user_reaction?: 'coming' | 'wait' | 'cant' | null;
}

export interface CreateBroadcastData {
  trip_id: string;
  content: string;
  location?: string;
  tag?: 'chill' | 'logistics' | 'urgent';
  scheduled_time?: string;
}

export const useBroadcasts = (tripId: string) => {
  const [broadcasts, setBroadcasts] = useState<Broadcast[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchBroadcasts = async (filters?: { tag?: string; sender_id?: string }) => {
    if (!user || !tripId) return;

    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (filters?.tag) params.append('tag', filters.tag);
      if (filters?.sender_id) params.append('sender_id', filters.sender_id);

      const { data, error } = await supabase.functions.invoke('broadcasts-fetch', {
        body: {},
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (error) {
        throw new Error(error.message);
      }

      setBroadcasts(data.broadcasts || []);
    } catch (err) {
      console.error('Error fetching broadcasts:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch broadcasts');
    } finally {
      setLoading(false);
    }
  };

  const createBroadcast = async (broadcastData: CreateBroadcastData): Promise<boolean> => {
    if (!user) {
      setError('User not authenticated');
      return false;
    }

    try {
      const { data, error } = await supabase.functions.invoke('broadcasts-create', {
        body: broadcastData,
      });

      if (error) {
        throw new Error(error.message);
      }

      // Refresh broadcasts after creation
      await fetchBroadcasts();
      return true;
    } catch (err) {
      console.error('Error creating broadcast:', err);
      setError(err instanceof Error ? err.message : 'Failed to create broadcast');
      return false;
    }
  };

  const reactToBroadcast = async (
    broadcastId: string, 
    reactionType: 'coming' | 'wait' | 'cant'
  ): Promise<boolean> => {
    if (!user) {
      setError('User not authenticated');
      return false;
    }

    try {
      const { data, error } = await supabase.functions.invoke('broadcasts-react', {
        body: {
          broadcast_id: broadcastId,
          reaction_type: reactionType,
        },
      });

      if (error) {
        throw new Error(error.message);
      }

      // Update local state optimistically
      setBroadcasts(prev => prev.map(broadcast => {
        if (broadcast.id === broadcastId) {
          return {
            ...broadcast,
            reaction_counts: data.counts,
            user_reaction: reactionType,
          };
        }
        return broadcast;
      }));

      return true;
    } catch (err) {
      console.error('Error reacting to broadcast:', err);
      setError(err instanceof Error ? err.message : 'Failed to save reaction');
      return false;
    }
  };

  useEffect(() => {
    if (tripId && user) {
      fetchBroadcasts();
    }
  }, [tripId, user]);

  // Set up real-time subscription for broadcasts
  useEffect(() => {
    if (!tripId || !user) return;

    const channel = supabase
      .channel(`broadcasts-${tripId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'broadcasts',
          filter: `trip_id=eq.${tripId}`,
        },
        () => {
          // Refresh broadcasts when changes occur
          fetchBroadcasts();
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'broadcast_reactions',
        },
        () => {
          // Refresh broadcasts when reactions change
          fetchBroadcasts();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [tripId, user]);

  return {
    broadcasts,
    loading,
    error,
    createBroadcast,
    reactToBroadcast,
    refreshBroadcasts: fetchBroadcasts,
  };
};