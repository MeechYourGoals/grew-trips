import { ProTripData } from '../types/pro';
import { EventData } from '../types/events';

export interface StatsData {
  total: number;
  upcoming: number;
  completed: number;
  inPlanning: number;
}

interface Trip {
  id: number;
  title: string;
  location: string;
  dateRange: string;
}

const parseDate = (dateString: string): Date | null => {
  // Handle different date formats: "Dec 15-22, 2024", "January 2025", etc.
  try {
    const currentYear = new Date().getFullYear();
    
    // Handle formats like "Dec 15-22, 2024"
    if (dateString.includes('-') && dateString.includes(',')) {
      const parts = dateString.split(',');
      const year = parseInt(parts[1].trim());
      const monthDay = parts[0].trim();
      const [monthPart] = monthDay.split(' ');
      const month = new Date(`${monthPart} 1, ${year}`).getMonth();
      return new Date(year, month, 1);
    }
    
    // Handle formats like "January 2025"
    if (dateString.includes(' ') && !dateString.includes('-')) {
      const [month, year] = dateString.split(' ');
      return new Date(parseInt(year), new Date(`${month} 1, ${year}`).getMonth(), 1);
    }
    
    // Fallback - try to parse as-is
    return new Date(dateString);
  } catch {
    return null;
  }
};

const getStatus = (dateRange: string): 'upcoming' | 'completed' | 'inPlanning' => {
  const now = new Date();
  const date = parseDate(dateRange);
  
  if (!date) return 'inPlanning';
  
  if (date > now) return 'upcoming';
  if (date < now) return 'completed';
  return 'inPlanning';
};

export const calculateTripStats = (trips: Trip[]): StatsData => {
  const stats = {
    total: trips.length,
    upcoming: 0,
    completed: 0,
    inPlanning: 0
  };

  trips.forEach(trip => {
    const status = getStatus(trip.dateRange);
    stats[status]++;
  });

  return stats;
};

export const calculateProTripStats = (proTrips: Record<string, ProTripData>): StatsData => {
  const trips = Object.values(proTrips);
  const stats = {
    total: trips.length,
    upcoming: 0,
    completed: 0,
    inPlanning: 0
  };

  trips.forEach(trip => {
    const status = getStatus(trip.dateRange);
    stats[status]++;
  });

  return stats;
};

export const calculateEventStats = (events: Record<string, EventData>): StatsData => {
  const eventList = Object.values(events);
  const stats = {
    total: eventList.length,
    upcoming: 0,
    completed: 0,
    inPlanning: 0
  };

  eventList.forEach(event => {
    const status = getStatus(event.dateRange);
    stats[status]++;
  });

  return stats;
};