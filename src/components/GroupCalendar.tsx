import React from 'react';
import { Calendar } from './ui/calendar';
import { format } from 'date-fns';
import { ItineraryView } from './ItineraryView';
import { useCalendarManagement } from '@/hooks/useCalendarManagement';
import { CalendarHeader } from './calendar/CalendarHeader';
import { AddEventForm } from './calendar/AddEventForm';
import { EventList } from './calendar/EventList';

export const GroupCalendar = () => {
  const {
    selectedDate,
    setSelectedDate,
    events,
    showAddEvent,
    setShowAddEvent,
    viewMode,
    toggleViewMode,
    newEvent,
    updateEventField,
    getEventsForDate,
    handleAddEvent,
    deleteEvent,
    resetForm
  } = useCalendarManagement();

  const selectedDateEvents = selectedDate ? getEventsForDate(selectedDate) : [];
  const datesWithEvents = events.map(event => event.date);

  if (viewMode === 'itinerary') {
    return (
      <div className="p-6">
        <CalendarHeader
          viewMode={viewMode}
          onToggleView={toggleViewMode}
          onAddEvent={() => setShowAddEvent(!showAddEvent)}
        />
        <ItineraryView events={events} tripName="Trip Itinerary" />
      </div>
    );
  }

  return (
    <div className="p-6">
      <CalendarHeader
        viewMode={viewMode}
        onToggleView={toggleViewMode}
        onAddEvent={() => setShowAddEvent(!showAddEvent)}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card/50 backdrop-blur-sm border border-border rounded-lg p-4">
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
                backgroundColor: 'hsl(var(--primary) / 0.3)',
                color: 'hsl(var(--primary-foreground))',
                fontWeight: 'bold'
              }
            }}
          />
        </div>

        <div className="space-y-4">
          {showAddEvent && (
            <div className="bg-card/50 backdrop-blur-sm border border-border rounded-lg p-4">
              <h3 className="text-lg font-medium text-foreground mb-4">
                Add Event {selectedDate && `for ${format(selectedDate, 'MMM d')}`}
              </h3>
              <AddEventForm
                newEvent={newEvent}
                onUpdateField={updateEventField}
                onSubmit={handleAddEvent}
                onCancel={resetForm}
              />
            </div>
          )}

          <div className="bg-card/50 backdrop-blur-sm border border-border rounded-lg p-4">
            <h3 className="text-lg font-medium text-foreground mb-4">
              {selectedDate 
                ? `Events for ${format(selectedDate, 'EEEE, MMM d')}`
                : 'Select a date to view events'
              }
            </h3>
            
            <EventList
              events={selectedDateEvents}
              onDelete={deleteEvent}
              emptyMessage={selectedDate 
                ? 'No events scheduled for this day'
                : 'Select a date to view events'
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
};
