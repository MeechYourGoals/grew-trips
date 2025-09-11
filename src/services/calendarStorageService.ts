import { TripEvent, CreateEventData } from './calendarService';

class CalendarStorageService {
  private getStorageKey(tripId: string): string {
    return `calendar_events_${tripId}`;
  }

  // Get all events for a trip
  getEvents(tripId: string): TripEvent[] {
    try {
      const stored = localStorage.getItem(this.getStorageKey(tripId));
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading calendar events from localStorage:', error);
      return [];
    }
  }

  // Save events for a trip
  private saveEvents(tripId: string, events: TripEvent[]): void {
    try {
      localStorage.setItem(this.getStorageKey(tripId), JSON.stringify(events));
    } catch (error) {
      console.error('Error saving calendar events to localStorage:', error);
    }
  }

  // Create a new event
  createEvent(eventData: CreateEventData): TripEvent {
    const events = this.getEvents(eventData.trip_id);
    
    const newEvent: TripEvent = {
      id: `demo-event-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      trip_id: eventData.trip_id,
      title: eventData.title,
      description: eventData.description,
      start_time: eventData.start_time,
      end_time: eventData.end_time,
      location: eventData.location,
      event_category: eventData.event_category || 'other',
      include_in_itinerary: eventData.include_in_itinerary ?? true,
      source_type: eventData.source_type || 'manual',
      source_data: eventData.source_data || {},
      created_by: 'demo-user',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    events.push(newEvent);
    events.sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime());
    this.saveEvents(eventData.trip_id, events);
    return newEvent;
  }

  // Update an event
  updateEvent(tripId: string, eventId: string, updates: Partial<TripEvent>): TripEvent | null {
    const events = this.getEvents(tripId);
    const eventIndex = events.findIndex(e => e.id === eventId);
    
    if (eventIndex === -1) return null;

    const updatedEvent = {
      ...events[eventIndex],
      ...updates,
      updated_at: new Date().toISOString()
    };
    
    events[eventIndex] = updatedEvent;
    events.sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime());
    this.saveEvents(tripId, events);
    return updatedEvent;
  }

  // Delete an event
  deleteEvent(tripId: string, eventId: string): boolean {
    const events = this.getEvents(tripId);
    const filteredEvents = events.filter(e => e.id !== eventId);
    
    if (filteredEvents.length !== events.length) {
      this.saveEvents(tripId, filteredEvents);
      return true;
    }
    
    return false;
  }

  // Clear all events for a trip (useful for demo reset)
  clearEvents(tripId: string): void {
    localStorage.removeItem(this.getStorageKey(tripId));
  }

  // Clear all demo calendar data
  clearAllDemoEvents(): void {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith('calendar_events_')) {
        localStorage.removeItem(key);
      }
    });
  }
}

export const calendarStorageService = new CalendarStorageService();