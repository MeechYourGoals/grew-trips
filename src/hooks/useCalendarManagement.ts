import { useState } from 'react';
import { CalendarEvent, AddToCalendarData } from '@/types/calendar';

export type ViewMode = 'calendar' | 'itinerary';

export const useCalendarManagement = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('calendar');
  const [newEvent, setNewEvent] = useState<AddToCalendarData>({
    title: '',
    date: new Date(),
    time: '12:00',
    location: '',
    description: '',
    category: 'other',
    include_in_itinerary: true
  });

  const getEventsForDate = (date: Date): CalendarEvent[] => {
    return events.filter(event => 
      event.date.toDateString() === date.toDateString()
    );
  };

  const handleAddEvent = () => {
    if (!newEvent.title || !selectedDate) return;

    const event: CalendarEvent = {
      id: Date.now().toString(),
      title: newEvent.title,
      date: selectedDate,
      time: newEvent.time,
      location: newEvent.location,
      description: newEvent.description,
      createdBy: 'current-user',
      include_in_itinerary: newEvent.include_in_itinerary ?? true,
      event_category: newEvent.category,
      source_type: 'manual',
      source_data: {}
    };

    setEvents(prev => [...prev, event].sort((a, b) => 
      a.date.getTime() - b.date.getTime()
    ));

    resetForm();
  };

  const deleteEvent = (eventId: string) => {
    setEvents(prev => prev.filter(e => e.id !== eventId));
  };

  const updateEventField = <K extends keyof AddToCalendarData>(
    field: K, 
    value: AddToCalendarData[K]
  ) => {
    setNewEvent(prev => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setNewEvent({
      title: '',
      date: selectedDate || new Date(),
      time: '12:00',
      location: '',
      description: '',
      category: 'other',
      include_in_itinerary: true
    });
    setShowAddEvent(false);
  };

  const toggleViewMode = () => {
    setViewMode(prev => prev === 'calendar' ? 'itinerary' : 'calendar');
  };

  return {
    selectedDate,
    setSelectedDate,
    events,
    setEvents,
    showAddEvent,
    setShowAddEvent,
    viewMode,
    setViewMode,
    toggleViewMode,
    newEvent,
    updateEventField,
    getEventsForDate,
    handleAddEvent,
    deleteEvent,
    resetForm
  };
};
