import React from 'react';
import { CalendarEvent } from '@/types/calendar';
import { EventItem } from './EventItem';

interface EventListProps {
  events: CalendarEvent[];
  onDelete: (eventId: string) => void;
  emptyMessage?: string;
  isDeleting?: boolean;
}

export const EventList = ({ events, onDelete, emptyMessage = "No events for this date", isDeleting = false }: EventListProps) => {
  if (events.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground text-sm">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {events.map(event => (
        <EventItem key={event.id} event={event} onDelete={onDelete} isDeleting={isDeleting} />
      ))}
    </div>
  );
};
