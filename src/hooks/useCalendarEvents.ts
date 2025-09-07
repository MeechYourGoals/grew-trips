import { useState, useEffect } from 'react';
import { calendarService, TripEvent, CreateEventData } from '@/services/calendarService';
import { CalendarEvent } from '@/types/calendar';

export const useCalendarEvents = (tripId?: string) => {
  const [events, setEvents] = useState<TripEvent[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (tripId) {
      loadEvents();
    }
  }, [tripId]);

  const loadEvents = async () => {
    if (!tripId) return;

    setLoading(true);
    try {
      const tripEvents = await calendarService.getTripEvents(tripId);
      setEvents(tripEvents);
    } catch (error) {
      console.error('Error loading events:', error);
    } finally {
      setLoading(false);
    }
  };

  const createEvent = async (eventData: CreateEventData): Promise<TripEvent | null> => {
    const newEvent = await calendarService.createEvent(eventData);
    if (newEvent) {
      setEvents(prevEvents => [...prevEvents, newEvent]);
    }
    return newEvent;
  };

  const createEventFromCalendar = async (calendarEvent: CalendarEvent): Promise<TripEvent | null> => {
    if (!tripId) return null;
    
    const eventData = calendarService.convertFromCalendarEvent(calendarEvent, tripId);
    return createEvent(eventData);
  };

  const updateEvent = async (eventId: string, updates: Partial<TripEvent>): Promise<boolean> => {
    const success = await calendarService.updateEvent(eventId, updates);
    if (success) {
      setEvents(prevEvents => 
        prevEvents.map(event => 
          event.id === eventId ? { ...event, ...updates } : event
        )
      );
    }
    return success;
  };

  const deleteEvent = async (eventId: string): Promise<boolean> => {
    const success = await calendarService.deleteEvent(eventId);
    if (success) {
      setEvents(prevEvents => prevEvents.filter(event => event.id !== eventId));
    }
    return success;
  };

  // Convert to CalendarEvent format for components that expect it
  const getCalendarEvents = (): CalendarEvent[] => {
    return events.map(event => calendarService.convertToCalendarEvent(event));
  };

  return {
    events,
    loading,
    createEvent,
    createEventFromCalendar,
    updateEvent,
    deleteEvent,
    refreshEvents: loadEvents,
    getCalendarEvents
  };
};