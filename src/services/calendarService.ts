import { supabase } from '@/integrations/supabase/client';
import { CalendarEvent } from '@/types/calendar';

export interface TripEvent {
  id: string;
  trip_id: string;
  title: string;
  description?: string;
  start_time: string;
  end_time?: string;
  location?: string;
  event_category: string;
  include_in_itinerary: boolean;
  source_type: string;
  source_data: any;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface CreateEventData {
  trip_id: string;
  title: string;
  description?: string;
  start_time: string;
  end_time?: string;
  location?: string;
  event_category?: string;
  include_in_itinerary?: boolean;
  source_type?: string;
  source_data?: any;
}

export const calendarService = {
  async createEvent(eventData: CreateEventData): Promise<TripEvent | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('trip_events')
        .insert({
          ...eventData,
          created_by: user.id,
          event_category: eventData.event_category || 'other',
          include_in_itinerary: eventData.include_in_itinerary ?? true,
          source_type: eventData.source_type || 'manual',
          source_data: eventData.source_data || {}
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating event:', error);
      return null;
    }
  },

  async getTripEvents(tripId: string): Promise<TripEvent[]> {
    try {
      const { data, error } = await supabase
        .from('trip_events')
        .select('*')
        .eq('trip_id', tripId)
        .order('start_time', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching events:', error);
      return [];
    }
  },

  async updateEvent(eventId: string, updates: Partial<TripEvent>): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('trip_events')
        .update(updates)
        .eq('id', eventId);

      return !error;
    } catch (error) {
      console.error('Error updating event:', error);
      return false;
    }
  },

  async deleteEvent(eventId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('trip_events')
        .delete()
        .eq('id', eventId);

      return !error;
    } catch (error) {
      console.error('Error deleting event:', error);
      return false;
    }
  },

  // Convert database event to CalendarEvent format
  convertToCalendarEvent(tripEvent: TripEvent): CalendarEvent {
    return {
      id: tripEvent.id,
      title: tripEvent.title,
      date: new Date(tripEvent.start_time),
      time: new Date(tripEvent.start_time).toLocaleTimeString('en-US', { 
        hour12: false, 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      location: tripEvent.location,
      description: tripEvent.description,
      createdBy: tripEvent.created_by,
      include_in_itinerary: tripEvent.include_in_itinerary,
      event_category: tripEvent.event_category as any,
      source_type: tripEvent.source_type as any,
      source_data: tripEvent.source_data
    };
  },

  // Convert CalendarEvent to database format
  convertFromCalendarEvent(calendarEvent: CalendarEvent, tripId: string): CreateEventData {
    const startTime = new Date(calendarEvent.date);
    const [hours, minutes] = calendarEvent.time.split(':');
    startTime.setHours(parseInt(hours), parseInt(minutes));

    return {
      trip_id: tripId,
      title: calendarEvent.title,
      description: calendarEvent.description,
      start_time: startTime.toISOString(),
      location: calendarEvent.location,
      event_category: calendarEvent.event_category || 'other',
      include_in_itinerary: calendarEvent.include_in_itinerary,
      source_type: calendarEvent.source_type || 'manual',
      source_data: calendarEvent.source_data || {}
    };
  }
};