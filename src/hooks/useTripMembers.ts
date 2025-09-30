import { useState, useEffect } from 'react';
import { tripService } from '@/services/tripService';
import { supabase } from '@/integrations/supabase/client';
import { getTripById } from '@/data/tripsData';
import { useDemoMode } from './useDemoMode';

interface TripMember {
  id: string;
  name: string;
  avatar?: string;
}

export const useTripMembers = (tripId?: string) => {
  const [tripMembers, setTripMembers] = useState<TripMember[]>([]);
  const [loading, setLoading] = useState(false);
  const { isDemoMode } = useDemoMode();

  const formatTripMembers = (dbMembers: any[]): TripMember[] => {
    return dbMembers.map(member => ({
      id: member.user_id,
      name: member.profiles?.display_name || member.profiles?.first_name || 'Unknown User',
      avatar: member.profiles?.avatar_url
    }));
  };

  const getMockFallbackMembers = (tripId: string): TripMember[] => {
    const numericTripId = parseInt(tripId);
    const trip = getTripById(numericTripId);
    
    if (trip && trip.participants) {
      return trip.participants.map(participant => ({
        id: participant.id.toString(),
        name: participant.name,
        avatar: participant.avatar
      }));
    }
    
    // Default fallback if no trip found
    return [
      { id: 'user1', name: 'You' },
      { id: 'user2', name: 'Trip Organizer' }
    ];
  };

  const loadTripMembers = async (tripId: string) => {
    setLoading(true);
    
    try {
      if (isDemoMode) {
        // Mock members for demo mode
        setTripMembers([
          { id: 'mock-1', name: 'Sarah Chen', avatar: '/images/avatars/blank-01.png' },
          { id: 'mock-2', name: 'Marcus Johnson', avatar: '/images/avatars/blank-02.png' },
          { id: 'mock-3', name: 'Emma Williams', avatar: '/images/avatars/blank-03.png' }
        ]);
        setLoading(false);
        return;
      }

      // Try to fetch from database first
      const dbMembers = await tripService.getTripMembers(tripId);
      
      if (dbMembers && dbMembers.length > 0) {
        const formattedMembers = formatTripMembers(dbMembers);
        setTripMembers(formattedMembers);
      } else {
        // Fallback to mock data if no database members
        const mockMembers = getMockFallbackMembers(tripId);
        setTripMembers(mockMembers);
      }
    } catch (error) {
      console.error('Error fetching trip members:', error);
      // Fallback to mock data on error
      const mockMembers = getMockFallbackMembers(tripId);
      setTripMembers(mockMembers);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (tripId) {
      loadTripMembers(tripId);
    }
  }, [tripId]);

  // Real-time subscription for trip members - only when database queries succeed
  useEffect(() => {
    if (!tripId) return;

    let channel: any;

    // Only create subscription if we have a valid trip ID and database connection
    const createSubscription = async () => {
      try {
        // Test if we can connect to the database first
        const { data } = await supabase.from('trip_members').select('id').limit(1);
        
        if (data !== null) {
          channel = supabase
            .channel(`trip-members-${tripId}`)
            .on(
              'postgres_changes',
              {
                event: '*',
                schema: 'public',
                table: 'trip_members',
                filter: `trip_id=eq.${tripId}`
              },
              () => {
                // Reload members when changes occur
                loadTripMembers(tripId);
              }
            )
            .subscribe();
        }
      } catch (error) {
        console.log('Database subscription not available, using local data only');
      }
    };

    createSubscription();

    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [tripId]);

  return {
    tripMembers,
    loading,
    refreshMembers: () => tripId && loadTripMembers(tripId)
  };
};