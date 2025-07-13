
import React, { useState } from 'react';
import { Calendar } from './ui/calendar';
import { Button } from './ui/button';
import { Plus, Clock, MapPin, Edit3, Trash2, List, Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { ItineraryView } from './ItineraryView';
import { CalendarEvent } from '../types/calendar';

// Updated to use CalendarEvent type from types/calendar.ts
interface TripEvent extends CalendarEvent {}

const mockEvents: TripEvent[] = [
  {
    id: '1',
    title: 'Dinner at L\'Ami Jean',
    date: new Date(2025, 6, 16), // July 16, 2025
    time: '20:00',
    location: '27 Rue Malar, Paris',
    description: 'Traditional French bistro',
    createdBy: 'Emma',
    include_in_itinerary: true,
    event_category: 'dining',
    source_type: 'manual'
  },
  {
    id: '2',
    title: 'Seine River Cruise',
    date: new Date(2025, 6, 17), // July 17, 2025
    time: '19:30',
    location: 'Port de la Bourdonnais',
    description: 'Evening cruise with dinner',
    createdBy: 'Jake',
    include_in_itinerary: true,
    event_category: 'entertainment',
    source_type: 'manual'
  },
  {
    id: '3',
    title: 'Louvre Museum Visit',
    date: new Date(2025, 6, 18), // July 18, 2025
    time: '10:00',
    location: 'Louvre Museum',
    description: 'Pre-booked timed entry tickets',
    createdBy: 'Sarah',
    include_in_itinerary: true,
    event_category: 'activity',
    source_type: 'manual'
  }
];

export const GroupCalendar = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [events, setEvents] = useState<TripEvent[]>(mockEvents);
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [viewMode, setViewMode] = useState<'calendar' | 'itinerary'>('calendar');
  const [newEvent, setNewEvent] = useState({
    title: '',
    time: '',
    location: '',
    description: ''
  });

  const getEventsForDate = (date: Date) => {
    return events.filter(event => 
      event.date.toDateString() === date.toDateString()
    );
  };

  const selectedDateEvents = selectedDate ? getEventsForDate(selectedDate) : [];

  const handleAddEvent = () => {
    if (!newEvent.title || !newEvent.time || !selectedDate) return;

    const event: TripEvent = {
      id: Date.now().toString(),
      title: newEvent.title,
      date: selectedDate,
      time: newEvent.time,
      location: newEvent.location,
      description: newEvent.description,
      createdBy: 'You', // In real app, this would be the current user
      include_in_itinerary: true,
      event_category: 'other',
      source_type: 'manual'
    };

    setEvents([...events, event]);
    setNewEvent({ title: '', time: '', location: '', description: '' });
    setShowAddEvent(false);
  };

  const deleteEvent = (eventId: string) => {
    setEvents(events.filter(e => e.id !== eventId));
  };

  const datesWithEvents = events.map(event => event.date);

  if (viewMode === 'itinerary') {
    return (
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-white mb-1">Trip Itinerary</h2>
            <p className="text-slate-400 text-sm">Your organized schedule timeline</p>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline"
              onClick={() => setViewMode('calendar')}
            >
              <CalendarIcon size={16} className="mr-2" />
              Calendar View
            </Button>
          </div>
        </div>
        <ItineraryView events={events} tripName="Paris Adventure" />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-white mb-1">Group Calendar</h2>
          <p className="text-slate-400 text-sm">Plan activities and keep everyone on schedule</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline"
            onClick={() => setViewMode('itinerary')}
          >
            <List size={16} className="mr-2" />
            Itinerary View
          </Button>
          <Button 
            onClick={() => setShowAddEvent(!showAddEvent)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus size={16} className="mr-2" />
            Add Event
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Calendar */}
        <div className="bg-slate-800/30 border border-slate-700/50 rounded-lg p-4">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            className="w-full"
            modifiers={{
              hasEvents: datesWithEvents
            }}
            modifiersStyles={{
              hasEvents: {
                backgroundColor: 'rgb(59 130 246 / 0.3)',
                color: 'white',
                fontWeight: 'bold'
              }
            }}
          />
        </div>

        {/* Events and Add Event Form */}
        <div className="space-y-4">
          {/* Add Event Form */}
          {showAddEvent && (
            <div className="bg-slate-800/30 border border-slate-700/50 rounded-lg p-4">
              <h3 className="text-lg font-medium text-white mb-4">
                Add Event {selectedDate && `for ${format(selectedDate, 'MMM d')}`}
              </h3>
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Event title"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                  className="w-full bg-slate-900/50 border border-slate-600 rounded-lg px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
                />
                <input
                  type="time"
                  value={newEvent.time}
                  onChange={(e) => setNewEvent({...newEvent, time: e.target.value})}
                  className="w-full bg-slate-900/50 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                />
                <input
                  type="text"
                  placeholder="Location (optional)"
                  value={newEvent.location}
                  onChange={(e) => setNewEvent({...newEvent, location: e.target.value})}
                  className="w-full bg-slate-900/50 border border-slate-600 rounded-lg px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
                />
                <textarea
                  placeholder="Description (optional)"
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
                  rows={2}
                  className="w-full bg-slate-900/50 border border-slate-600 rounded-lg px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 resize-none"
                />
                <div className="flex gap-2">
                  <Button onClick={handleAddEvent} className="bg-blue-600 hover:bg-blue-700">
                    Add Event
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setShowAddEvent(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Events List */}
          <div className="bg-slate-800/30 border border-slate-700/50 rounded-lg p-4">
            <h3 className="text-lg font-medium text-white mb-4">
              {selectedDate 
                ? `Events for ${format(selectedDate, 'EEEE, MMM d')}`
                : 'Select a date to view events'
              }
            </h3>
            
            {selectedDateEvents.length > 0 ? (
              <div className="space-y-3">
                {selectedDateEvents.map((event) => (
                  <div key={event.id} className="bg-slate-900/30 border border-slate-700/30 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-white mb-2">{event.title}</h4>
                        <div className="space-y-1 text-sm text-slate-400">
                          <div className="flex items-center gap-2">
                            <Clock size={14} />
                            {event.time}
                          </div>
                          {event.location && (
                            <div className="flex items-center gap-2">
                              <MapPin size={14} />
                              {event.location}
                            </div>
                          )}
                          <div className="text-xs text-slate-500">
                            Added by {event.createdBy}
                          </div>
                        </div>
                        {event.description && (
                          <p className="text-sm text-slate-300 mt-2">{event.description}</p>
                        )}
                      </div>
                      <div className="flex gap-2 ml-4">
                        <button className="text-slate-400 hover:text-white p-1">
                          <Edit3 size={14} />
                        </button>
                        <button 
                          onClick={() => deleteEvent(event.id)}
                          className="text-slate-400 hover:text-red-400 p-1"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-slate-400 text-sm">
                  {selectedDate 
                    ? 'No events scheduled for this day'
                    : 'Select a date to view events'
                  }
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
