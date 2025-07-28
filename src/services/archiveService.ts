import { Trip, tripsData } from '../data/tripsData';
import { ProTripData } from '../types/pro';
import { EventData } from '../types/events';
import { proTripMockData } from '../data/proTripMockData';
import { eventsMockData } from '../data/eventsMockData';
import { secureStorageService } from './secureStorageService';
import { useAuth } from '@/hooks/useAuth';

type TripType = 'consumer' | 'pro' | 'event';

interface ArchiveState {
  consumer: Set<string>;
  pro: Set<string>;
  event: Set<string>;
}

// Get current archive state from secure storage
const getArchiveState = async (userId?: string): Promise<ArchiveState> => {
  try {
    const archivedTrips = await secureStorageService.getArchivedTrips(userId);
    return {
      consumer: new Set(archivedTrips?.consumer || []),
      pro: new Set(archivedTrips?.pro || []),
      event: new Set(archivedTrips?.event || [])
    };
  } catch (error) {
    console.warn('Failed to get archive state:', error);
    return {
      consumer: new Set(),
      pro: new Set(),
      event: new Set()
    };
  }
};

// Save archive state to secure storage
const saveArchiveState = async (state: ArchiveState, userId?: string): Promise<void> => {
  try {
    const archivedTrips = {
      consumer: Array.from(state.consumer),
      pro: Array.from(state.pro),
      event: Array.from(state.event)
    };
    await secureStorageService.saveArchivedTrips(archivedTrips, userId);
  } catch (error) {
    console.warn('Failed to save archive state:', error);
  }
};

// Archive a trip
export const archiveTrip = async (tripId: string, tripType: TripType, userId?: string): Promise<void> => {
  const state = await getArchiveState(userId);
  state[tripType].add(tripId);
  await saveArchiveState(state, userId);
};

// Restore (unarchive) a trip
export const restoreTrip = async (tripId: string, tripType: TripType, userId?: string): Promise<void> => {
  const state = await getArchiveState(userId);
  state[tripType].delete(tripId);
  await saveArchiveState(state, userId);
};

// Check if a trip is archived
export const isTripArchived = async (tripId: string, tripType: TripType, userId?: string): Promise<boolean> => {
  const state = await getArchiveState(userId);
  return state[tripType].has(tripId);
};

// Get all archived trips
export const getArchivedTrips = async (userId?: string) => {
  const state = await getArchiveState(userId);
  
  // Get archived consumer trips
  const archivedConsumerTrips = tripsData.filter(trip => 
    state.consumer.has(trip.id.toString())
  );
  
  // Get archived pro trips
  const archivedProTrips = Object.values(proTripMockData).filter(trip => 
    state.pro.has(trip.id)
  );
  
  // Get archived events
  const archivedEvents = Object.values(eventsMockData).filter(event => 
    state.event.has(event.id)
  );
  
  return {
    consumer: archivedConsumerTrips,
    pro: archivedProTrips,
    events: archivedEvents,
    total: archivedConsumerTrips.length + archivedProTrips.length + archivedEvents.length
  };
};

// Filter active (non-archived) trips
export const filterActiveTrips = async <T extends { id: string | number }>(
  trips: T[], 
  tripType: TripType,
  userId?: string
): Promise<T[]> => {
  const state = await getArchiveState(userId);
  return trips.filter(trip => !state[tripType].has(trip.id.toString()));
};

// Get trip archive status for display
export const getTripArchiveStatus = async (tripId: string, tripType: TripType, userId?: string) => {
  const isArchived = await isTripArchived(tripId, tripType, userId);
  return {
    isArchived,
    canArchive: !isArchived,
    canRestore: isArchived
  };
};

// Bulk archive operations
export const bulkArchiveTrips = async (tripIds: string[], tripType: TripType, userId?: string): Promise<void> => {
  const state = await getArchiveState(userId);
  tripIds.forEach(id => state[tripType].add(id));
  await saveArchiveState(state, userId);
};

export const bulkRestoreTrips = async (tripIds: string[], tripType: TripType, userId?: string): Promise<void> => {
  const state = await getArchiveState(userId);
  tripIds.forEach(id => state[tripType].delete(id));
  await saveArchiveState(state, userId);
};

// Clear all archived trips (for admin/reset purposes)
export const clearAllArchivedTrips = async (userId?: string): Promise<void> => {
  if (userId) {
    await secureStorageService.saveArchivedTrips({ consumer: [], pro: [], event: [] }, userId);
  } else {
    localStorage.removeItem('trips_archive_state');
  }
};

// Analytics helpers
export const getArchiveAnalytics = async (userId?: string) => {
  const state = await getArchiveState(userId);
  const archived = await getArchivedTrips(userId);
  
  return {
    totalArchived: archived.total,
    archivedByType: {
      consumer: archived.consumer.length,
      pro: archived.pro.length,
      events: archived.events.length
    },
    archiveRate: {
      consumer: archived.consumer.length / tripsData.length,
      pro: archived.pro.length / Object.keys(proTripMockData).length,
      events: archived.events.length / Object.keys(eventsMockData).length
    }
  };
};