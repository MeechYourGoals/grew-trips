
import React from 'react';
import { TripCard } from '../TripCard';
import { ProTripCard } from '../ProTripCard';
import { MobileTripCard } from '../MobileTripCard';
import { MobileProTripCard } from '../MobileProTripCard';
import { useIsMobile } from '../../hooks/use-mobile';
import { ProTripData } from '../../types/pro';

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
}

export const TripGrid = ({ viewMode, trips, proTrips }: TripGridProps) => {
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
      ) : (
        Object.values(proTrips).map((trip) => (
          <React.Fragment key={trip.id}>
            {isMobile ? (
              <MobileProTripCard trip={trip} />
            ) : (
              <ProTripCard trip={trip} />
            )}
          </React.Fragment>
        ))
      )}
    </div>
  );
};
