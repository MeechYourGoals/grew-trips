import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '../integrations/supabase/client';
import { useAuth } from './useAuth';

interface LocationData {
  lat: number;
  lng: number;
  accuracy?: number;
  heading?: number;
}

interface UseLiveLocationOptions {
  tripId: string;
  enabled: boolean;
  updateInterval?: number; // in milliseconds, default 10 seconds
}

export const useLiveLocation = ({ tripId, enabled, updateInterval = 10000 }: UseLiveLocationOptions) => {
  const { user } = useAuth();
  const [isSharing, setIsSharing] = useState(false);
  const [lastLocation, setLastLocation] = useState<LocationData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [permissionStatus, setPermissionStatus] = useState<'granted' | 'denied' | 'prompt' | 'unknown'>('unknown');
  
  const watchIdRef = useRef<number | null>(null);
  const lastUpdateRef = useRef<number>(0);
  const isUpdatingRef = useRef(false);

  // Check if we should update based on battery and visibility
  const shouldUpdate = useCallback(() => {
    // Don't update if document is hidden
    if (document.hidden) return false;
    
    // Check battery level if available (Note: Battery API is deprecated)
    // We'll skip battery check for now
    
    // Throttle updates
    const now = Date.now();
    if (now - lastUpdateRef.current < updateInterval) return false;
    
    return true;
  }, [updateInterval]);

  // Update location to server
  const updateLocation = useCallback(async (locationData: LocationData) => {
    if (!user || isUpdatingRef.current) return;
    
    isUpdatingRef.current = true;
    lastUpdateRef.current = Date.now();

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('No active session');

      const response = await fetch(`https://yiitqkjrbskxumriujrh.supabase.co/functions/v1/update-location`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          trip_id: tripId,
          ...locationData
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      setLastLocation(locationData);
      setError(null);
    } catch (err) {
      console.error('Failed to update location:', err);
      setError(err instanceof Error ? err.message : 'Failed to update location');
    } finally {
      isUpdatingRef.current = false;
    }
  }, [user, tripId]);

  // Request location permission
  const requestPermission = useCallback(async () => {
    if (!('geolocation' in navigator)) {
      setError('Geolocation is not supported');
      return false;
    }

    try {
      // Try to get permission status
      if ('permissions' in navigator) {
        const result = await navigator.permissions.query({ name: 'geolocation' });
        setPermissionStatus(result.state);
        
        if (result.state === 'denied') {
          setError('Location permission denied');
          return false;
        }
      }

      return true;
    } catch (err) {
      console.error('Permission check failed:', err);
      setPermissionStatus('unknown');
      return true; // Try anyway
    }
  }, []);

  // Start location sharing
  const startSharing = useCallback(async () => {
    if (!enabled || !user) return;

    const hasPermission = await requestPermission();
    if (!hasPermission) return;

    const options: PositionOptions = {
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 5000
    };

    const successCallback = (position: GeolocationPosition) => {
      if (!shouldUpdate()) return;

      const locationData: LocationData = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
        accuracy: position.coords.accuracy,
        heading: position.coords.heading || undefined
      };

      updateLocation(locationData);
    };

    const errorCallback = (error: GeolocationPositionError) => {
      console.error('Geolocation error:', error);
      let errorMessage = 'Failed to get location';
      
      switch (error.code) {
        case error.PERMISSION_DENIED:
          errorMessage = 'Location permission denied';
          setPermissionStatus('denied');
          break;
        case error.POSITION_UNAVAILABLE:
          errorMessage = 'Location unavailable';
          break;
        case error.TIMEOUT:
          errorMessage = 'Location request timed out';
          break;
      }
      
      setError(errorMessage);
      setIsSharing(false);
    };

    try {
      watchIdRef.current = navigator.geolocation.watchPosition(
        successCallback,
        errorCallback,
        options
      );
      
      setIsSharing(true);
      setError(null);
    } catch (err) {
      setError('Failed to start location sharing');
      setIsSharing(false);
    }
  }, [enabled, user, shouldUpdate, updateLocation, requestPermission]);

  // Stop location sharing
  const stopSharing = useCallback(() => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    setIsSharing(false);
    setError(null);
  }, []);

  // Effect to start/stop sharing based on enabled state
  useEffect(() => {
    if (enabled && user) {
      startSharing();
    } else {
      stopSharing();
    }

    return () => stopSharing();
  }, [enabled, user, startSharing, stopSharing]);

  // Handle visibility change
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && isSharing) {
        // Optionally reduce update frequency when hidden
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [isSharing]);

  return {
    isSharing,
    lastLocation,
    error,
    permissionStatus,
    startSharing,
    stopSharing
  };
};