import { supabase } from '@/integrations/supabase/client';

export interface Broadcast {
  id: string;
  trip_id: string;
  message: string;
  priority: 'urgent' | 'reminder' | 'fyi';
  created_by: string;
  created_at: string;
  updated_at: string;
  scheduled_for?: string;
  is_sent: boolean;
  metadata: any;
}

export interface BroadcastReaction {
  id: string;
  broadcast_id: string;
  user_id: string;
  reaction_type: string;
  created_at: string;
}

export interface CreateBroadcastData {
  trip_id: string;
  message: string;
  priority?: 'urgent' | 'reminder' | 'fyi';
  scheduled_for?: string;
  metadata?: any;
}

export const broadcastService = {
  async createBroadcast(broadcastData: CreateBroadcastData): Promise<Broadcast | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('broadcasts')
        .insert({
          ...broadcastData,
          created_by: user.id,
          priority: broadcastData.priority || 'fyi',
          metadata: broadcastData.metadata || {},
          is_sent: !broadcastData.scheduled_for // If not scheduled, mark as sent immediately
        })
        .select()
        .single();

      if (error) throw error;
      return data as Broadcast;
    } catch (error) {
      console.error('Error creating broadcast:', error);
      return null;
    }
  },

  async getTripBroadcasts(tripId: string): Promise<Broadcast[]> {
    try {
      const { data, error } = await supabase
        .from('broadcasts')
        .select('*')
        .eq('trip_id', tripId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data || []) as Broadcast[];
    } catch (error) {
      console.error('Error fetching broadcasts:', error);
      return [];
    }
  },

  async updateBroadcast(broadcastId: string, updates: Partial<Broadcast>): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('broadcasts')
        .update(updates)
        .eq('id', broadcastId);

      return !error;
    } catch (error) {
      console.error('Error updating broadcast:', error);
      return false;
    }
  },

  async addReaction(broadcastId: string, reactionType: string): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('broadcast_reactions')
        .upsert({
          broadcast_id: broadcastId,
          user_id: user.id,
          reaction_type: reactionType
        }, {
          onConflict: 'broadcast_id,user_id'
        });

      return !error;
    } catch (error) {
      console.error('Error adding reaction:', error);
      return false;
    }
  },

  async removeReaction(broadcastId: string): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('broadcast_reactions')
        .delete()
        .eq('broadcast_id', broadcastId)
        .eq('user_id', user.id);

      return !error;
    } catch (error) {
      console.error('Error removing reaction:', error);
      return false;
    }
  },

  async getBroadcastReactions(broadcastId: string): Promise<BroadcastReaction[]> {
    try {
      const { data, error } = await supabase
        .from('broadcast_reactions')
        .select('*')
        .eq('broadcast_id', broadcastId);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching reactions:', error);
      return [];
    }
  },

  // Subscribe to real-time broadcast updates
  subscribeToBroadcasts(tripId: string, callback: (broadcast: Broadcast) => void) {
    const channel = supabase
      .channel(`broadcasts-${tripId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'broadcasts',
          filter: `trip_id=eq.${tripId}`
        },
        (payload) => callback(payload.new as Broadcast)
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  },

  // Subscribe to real-time reaction updates
  subscribeToReactions(broadcastId: string, callback: (reaction: BroadcastReaction) => void) {
    const channel = supabase
      .channel(`reactions-${broadcastId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'broadcast_reactions',
          filter: `broadcast_id=eq.${broadcastId}`
        },
        (payload) => {
          if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
            callback(payload.new as BroadcastReaction);
          }
        }
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }
};