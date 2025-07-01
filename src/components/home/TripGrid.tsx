import React from 'react';
import { TripCard } from '../TripCard';
import { ProTripCard } from '../ProTripCard';
import { EventCard } from '../EventCard';
import { MobileTripCard } from '../MobileTripCard';
import { MobileProTripCard } from '../MobileProTripCard';
import { MobileEventCard } from '../MobileEventCard';
import { useIsMobile } from '../../hooks/use-mobile';
import { ProTripData } from '../../types/pro-features';

interface TripGridProps {
  viewMode: string;
  trips: any[];
  proTrips: { [key: string]: ProTripData };
  events: any[];
}

export const TripGrid = ({ viewMode, trips, proTrips, events }: TripGridProps) => {
  const isMobile = useIsMobile();

  const renderTripCard = (trip: any, index: number) => {
    if (viewMode === 'myTrips') {
      return isMobile ? (
        <MobileTripCard key={index} trip={trip} />
      ) : (
        <TripCard key={index} trip={trip} />
      );
    } else if (viewMode === 'tripsPro') {
      return null;
    } else {
      return null;
    }
  };

  const renderProTripCard = (tripId: string, trip: ProTripData) => {
    if (viewMode === 'tripsPro') {
      return isMobile ? (
        <MobileProTripCard key={tripId} trip={trip} />
      ) : (
        <ProTripCard key={tripId} trip={trip} />
      );
    } else {
      return null;
    }
  };

  const renderEventCard = (event: any, index: number) => {
    if (viewMode === 'events') {
      return isMobile ? (
        <MobileEventCard key={index} event={event} />
      ) : (
        <EventCard key={index} event={event} />;
      )
    } else {
      return null;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {viewMode === 'myTrips' && trips.map((trip, index) => renderTripCard(trip, index))}
      {viewMode === 'tripsPro' && Object.entries(proTrips).map(([tripId, trip]) => renderProTripCard(tripId, trip))}
      {viewMode === 'events' && events.map((event, index) => renderEventCard(event, index))}
    </div>
  );
};

