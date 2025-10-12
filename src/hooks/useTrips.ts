import { useState, useEffect } from 'react';
import { tripService, Trip, CreateTripData } from '@/services/tripService';
import { useAuth } from './useAuth';

export const useTrips = () => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    loadTrips();
  }, [user]);

  const loadTrips = async () => {
    if (!user) {
      setTrips([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const userTrips = await tripService.getUserTrips();
      setTrips(userTrips);
    } catch (error) {
      console.error('Error loading trips:', error);
    } finally {
      setLoading(false);
    }
  };

  const createTrip = async (tripData: CreateTripData): Promise<Trip | null> => {
    // CRITICAL: Validate user authentication state
    if (!user || !user.id) {
      console.error('[useTrips] Cannot create trip: No authenticated user or missing user ID', { user });
      return null;
    }
    
    console.log('[useTrips] Creating trip with data:', tripData, 'User ID:', user.id);
    const newTrip = await tripService.createTrip(tripData);
    
    if (newTrip) {
      console.log('[useTrips] Trip created successfully:', newTrip);
      setTrips(prevTrips => [newTrip, ...prevTrips]);
    } else {
      console.error('[useTrips] Trip creation returned null');
    }
    return newTrip;
  };

  const updateTrip = async (tripId: string, updates: Partial<Trip>): Promise<boolean> => {
    const success = await tripService.updateTrip(tripId, updates);
    if (success) {
      setTrips(prevTrips => 
        prevTrips.map(trip => 
          trip.id === tripId ? { ...trip, ...updates } : trip
        )
      );
    }
    return success;
  };

  const archiveTrip = async (tripId: string): Promise<boolean> => {
    const success = await tripService.archiveTrip(tripId);
    if (success) {
      setTrips(prevTrips => prevTrips.filter(trip => trip.id !== tripId));
    }
    return success;
  };

  return {
    trips,
    loading,
    createTrip,
    updateTrip,
    archiveTrip,
    refreshTrips: loadTrips
  };
};