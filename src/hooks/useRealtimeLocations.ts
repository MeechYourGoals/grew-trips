import { useEffect, useCallback } from 'react';
import { supabase } from '../integrations/supabase/client';
import { useLocationStore, UserLocation } from '../stores/locationStore';

interface UseRealtimeLocationsOptions {
  tripId: string;
  enabled: boolean;
}

export const useRealtimeLocations = ({ tripId, enabled }: UseRealtimeLocationsOptions) => {
  const { updateLocation, removeLocation, clearLocations, setSubscribed, getLocationsByTrip } = useLocationStore();

  const handleLocationUpdate = useCallback((payload: any) => {
    const locationData = payload.new as UserLocation;
    if (locationData.trip_id === tripId) {
      updateLocation(locationData);
    }
  }, [tripId, updateLocation]);

  const handleLocationDelete = useCallback((payload: any) => {
    const locationData = payload.old as UserLocation;
    if (locationData.trip_id === tripId) {
      removeLocation(locationData.user_id);
    }
  }, [tripId, removeLocation]);

  useEffect(() => {
    if (!enabled) {
      setSubscribed(false);
      clearLocations();
      return;
    }

    const channel = supabase
      .channel(`realtime-locations-${tripId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'realtime_locations',
          filter: `trip_id=eq.${tripId}`
        },
        handleLocationUpdate
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'realtime_locations',
          filter: `trip_id=eq.${tripId}`
        },
        handleLocationUpdate
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'realtime_locations',
          filter: `trip_id=eq.${tripId}`
        },
        handleLocationDelete
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          setSubscribed(true);
          // Load existing locations
          loadExistingLocations();
        } else if (status === 'CLOSED') {
          setSubscribed(false);
        }
      });

    const loadExistingLocations = async () => {
      try {
        // For now, we'll rely on realtime updates to populate locations
        // Since the realtime_locations table doesn't exist in the current Supabase types
        console.log('Loading existing locations for trip:', tripId);
      } catch (err) {
        console.error('Error loading existing locations:', err);
      }
    };

    return () => {
      channel.unsubscribe();
      setSubscribed(false);
    };
  }, [enabled, tripId, handleLocationUpdate, handleLocationDelete, setSubscribed, clearLocations, updateLocation]);

  return {
    locations: getLocationsByTrip(tripId)
  };
};