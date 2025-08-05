// Utility functions for calculating trip statistics

import { ProTripData } from '../types/pro';
import { EventData } from '../types/events';

// Generic trip interface for consumer trips
interface GenericTrip {
  participants: Array<{ id: number | string; name: string; role?: string }>;
  dateRange: string;
  itinerary?: Array<{ location?: string; venue?: string; place?: string }>;
}

// Calculate number of people
export const calculatePeopleCount = (
  trip: GenericTrip | ProTripData | EventData
): string => {
  const count = trip.participants?.length || 0;
  if (count === 0) return "—";
  if (count > 99) return "99+";
  return count.toString();
};

// Calculate number of days
export const calculateDaysCount = (dateRange: string): string => {
  if (!dateRange) return "—";
  
  try {
    // Handle various date range formats
    if (dateRange.includes(" - ")) {
      const [startStr, endStr] = dateRange.split(" - ");
      const start = new Date(startStr);
      const end = new Date(endStr);
      
      if (isNaN(start.getTime()) || isNaN(end.getTime())) return "—";
      
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 to include both start and end days
      
      return diffDays.toString();
    }
    
    // Single date
    return "1";
  } catch (error) {
    return "—";
  }
};

// Calculate number of places for consumer trips
export const calculatePlacesCount = (trip: GenericTrip): string => {
  if (!trip.itinerary || trip.itinerary.length === 0) return "—";
  
  const uniquePlaces = new Set<string>();
  
  trip.itinerary.forEach((item) => {
    const place = item.location || item.venue || item.place;
    if (place) {
      uniquePlaces.add(place.toLowerCase().trim());
    }
  });
  
  const count = uniquePlaces.size;
  return count > 0 ? count.toString() : "—";
};

// Calculate number of places for pro trips
export const calculateProTripPlacesCount = (trip: ProTripData): string => {
  const uniquePlaces = new Set<string>();
  
  // Check schedule locations
  if (trip.schedule) {
    trip.schedule.forEach((event) => {
      if (event.location) {
        uniquePlaces.add(event.location.toLowerCase().trim());
      }
    });
  }
  
  // Check itinerary locations
  if (trip.itinerary) {
    trip.itinerary.forEach((day) => {
      if (day.events) {
        day.events.forEach((event) => {
          if (event.location) {
            uniquePlaces.add(event.location.toLowerCase().trim());
          }
        });
      }
    });
  }
  
  // Fallback to main trip location if no specific places found
  if (uniquePlaces.size === 0 && trip.location) {
    uniquePlaces.add(trip.location.toLowerCase().trim());
  }
  
  const count = uniquePlaces.size;
  return count > 0 ? count.toString() : "—";
};

// Calculate number of places for events
export const calculateEventPlacesCount = (event: EventData): string => {
  const uniquePlaces = new Set<string>();
  
  // Check sessions for locations
  if (event.sessions) {
    event.sessions.forEach((session) => {
      if (session.location) {
        uniquePlaces.add(session.location.toLowerCase().trim());
      }
    });
  }
  
  // Check itinerary for locations
  if (event.itinerary) {
    event.itinerary.forEach((day) => {
      if (day.events) {
        day.events.forEach((evt) => {
          if (evt.location) {
            uniquePlaces.add(evt.location.toLowerCase().trim());
          }
        });
      }
    });
  }
  
  // Fallback to main event location
  if (uniquePlaces.size === 0 && event.location) {
    uniquePlaces.add(event.location.toLowerCase().trim());
  }
  
  const count = uniquePlaces.size;
  return count > 0 ? count.toString() : "—";
};