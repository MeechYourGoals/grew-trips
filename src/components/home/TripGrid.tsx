
import React from 'react';
import { TripCard } from '../TripCard';
import { ProTripCard } from '../ProTripCard';
import { EventCard } from '../EventCard';
import { MobileTripCard } from '../MobileTripCard';
import { MobileProTripCard } from '../MobileProTripCard';
import { MobileEventCard } from '../MobileEventCard';
import { useIsMobile } from '../../hooks/use-mobile';
import { ProTripData } from '../../types/pro';
import { EventData } from '../../data/eventsMockData';

interface Trip {
  id: number;
  title: string;
  location: string;
  dateRange: string;
  participants: Array<{
    id: number;
    name: string;
    avatar: string;
  }>;
}

interface TripGridProps {
  viewMode: string;
  trips: Trip[];
  proTrips: Record<string, ProTripData>;
  events: Record<string, EventData>;
}

export const TripGrid = ({ viewMode, trips, proTrips, events }: TripGridProps) => {
  const isMobile = useIsMobile();

  return (
    <div className={`grid gap-6 ${isMobile ? 'grid-cols-1' : 'md:grid-cols-2 xl:grid-cols-3'}`}>
      {viewMode === 'myTrips' ? (
        trips.map((trip) => (
          <React.Fragment key={trip.id}>
            {isMobile ? (
              <MobileTripCard trip={trip} />
            ) : (
              <TripCard trip={trip} />
            )}
          </React.Fragment>
        ))
      ) : viewMode === 'tripsPro' ? (
        Object.values(proTrips).map((trip) => (
          <React.Fragment key={trip.id}>
            {isMobile ? (
              <MobileProTripCard trip={trip} />
            ) : (
              <ProTripCard trip={trip} />
            )}
          </React.Fragment>
        ))
      ) : (
        Object.values(events).map((event) => (
          <React.Fragment key={event.id}>
            {isMobile ? (
              <MobileEventCard event={event} />
            ) : (
              <EventCard event={event} />
            )}
          </React.Fragment>
        ))
      )}
    </div>
  );
};
