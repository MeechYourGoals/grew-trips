import { supabase } from '@/integrations/supabase/client';

export interface Trip {
  id: string;
  name: string;
  description?: string;
  start_date?: string;
  end_date?: string;
  destination?: string;
  cover_image_url?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  is_archived: boolean;
  trip_type: string;
  basecamp_name?: string;
  basecamp_address?: string;
}

export interface CreateTripData {
  id: string;
  name: string;
  description?: string;
  start_date?: string;
  end_date?: string;
  destination?: string;
  cover_image_url?: string;
  trip_type?: string;
  basecamp_name?: string;
  basecamp_address?: string;
}

export const tripService = {
  async createTrip(tripData: CreateTripData): Promise<Trip | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('trips')
        .insert({
          ...tripData,
          created_by: user.id
        })
        .select()
        .single();

      if (error) throw error;

      // Create trip member entry for creator
      await supabase
        .from('trip_members')
        .insert({
          trip_id: data.id,
          user_id: user.id,
          role: 'admin'
        });

      return data;
    } catch (error) {
      console.error('Error creating trip:', error);
      return null;
    }
  },

  async getUserTrips(): Promise<Trip[]> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('trips')
        .select('*')
        .eq('is_archived', false)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching trips:', error);
      return [];
    }
  },

  async getTripById(tripId: string): Promise<Trip | null> {
    try {
      const { data, error } = await supabase
        .from('trips')
        .select('*')
        .eq('id', tripId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching trip:', error);
      return null;
    }
  },

  async updateTrip(tripId: string, updates: Partial<Trip>): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('trips')
        .update(updates)
        .eq('id', tripId);

      return !error;
    } catch (error) {
      console.error('Error updating trip:', error);
      return false;
    }
  },

  async archiveTrip(tripId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('trips')
        .update({ is_archived: true })
        .eq('id', tripId);

      return !error;
    } catch (error) {
      console.error('Error archiving trip:', error);
      return false;
    }
  },

  async getTripMembers(tripId: string) {
    try {
      const { data, error } = await supabase
        .from('trip_members')
        .select(`
          id,
          user_id,
          role,
          created_at,
          profiles:user_id (
            display_name,
            avatar_url,
            email
          )
        `)
        .eq('trip_id', tripId);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching trip members:', error);
      return [];
    }
  },

  async addTripMember(tripId: string, userId: string, role: string = 'member'): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('trip_members')
        .insert({
          trip_id: tripId,
          user_id: userId,
          role: role
        });

      return !error;
    } catch (error) {
      console.error('Error adding trip member:', error);
      return false;
    }
  }
};