import { Trip, tripsData } from '../data/tripsData';
import { ProTripData } from '../types/pro';
import { EventData } from '../types/events';
import { proTripMockData } from '../data/proTripMockData';
import { eventsMockData } from '../data/eventsMockData';

type TripType = 'consumer' | 'pro' | 'event';

interface ArchiveState {
  consumer: Set<string>;
  pro: Set<string>;
  event: Set<string>;
}

// Local storage keys
const ARCHIVE_STORAGE_KEY = 'trips_archive_state';

// Get current archive state from localStorage
const getArchiveState = (): ArchiveState => {
  try {
    const stored = localStorage.getItem(ARCHIVE_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return {
        consumer: new Set(parsed.consumer || []),
        pro: new Set(parsed.pro || []),
        event: new Set(parsed.event || [])
      };
    }
  } catch (error) {
    console.warn('Failed to parse archive state from localStorage:', error);
  }
  
  return {
    consumer: new Set(),
    pro: new Set(),
    event: new Set()
  };
};

// Save archive state to localStorage
const saveArchiveState = (state: ArchiveState): void => {
  try {
    const serializable = {
      consumer: Array.from(state.consumer),
      pro: Array.from(state.pro),
      event: Array.from(state.event)
    };
    localStorage.setItem(ARCHIVE_STORAGE_KEY, JSON.stringify(serializable));
  } catch (error) {
    console.warn('Failed to save archive state to localStorage:', error);
  }
};

// Archive a trip
export const archiveTrip = (tripId: string, tripType: TripType): void => {
  const state = getArchiveState();
  state[tripType].add(tripId);
  saveArchiveState(state);
};

// Restore (unarchive) a trip
export const restoreTrip = (tripId: string, tripType: TripType): void => {
  const state = getArchiveState();
  state[tripType].delete(tripId);
  saveArchiveState(state);
};

// Check if a trip is archived
export const isTripArchived = (tripId: string, tripType: TripType): boolean => {
  const state = getArchiveState();
  return state[tripType].has(tripId);
};

// Get all archived trips
export const getArchivedTrips = (userId?: string) => {
  const state = getArchiveState();
  
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
export const filterActiveTrips = <T extends { id: string | number }>(
  trips: T[], 
  tripType: TripType
): T[] => {
  const state = getArchiveState();
  return trips.filter(trip => !state[tripType].has(trip.id.toString()));
};

// Get trip archive status for display
export const getTripArchiveStatus = (tripId: string, tripType: TripType) => {
  const isArchived = isTripArchived(tripId, tripType);
  return {
    isArchived,
    canArchive: !isArchived,
    canRestore: isArchived
  };
};

// Bulk archive operations
export const bulkArchiveTrips = (tripIds: string[], tripType: TripType): void => {
  const state = getArchiveState();
  tripIds.forEach(id => state[tripType].add(id));
  saveArchiveState(state);
};

export const bulkRestoreTrips = (tripIds: string[], tripType: TripType): void => {
  const state = getArchiveState();
  tripIds.forEach(id => state[tripType].delete(id));
  saveArchiveState(state);
};

// Clear all archived trips (for admin/reset purposes)
export const clearAllArchivedTrips = (): void => {
  localStorage.removeItem(ARCHIVE_STORAGE_KEY);
};

// Analytics helpers
export const getArchiveAnalytics = () => {
  const state = getArchiveState();
  const archived = getArchivedTrips();
  
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