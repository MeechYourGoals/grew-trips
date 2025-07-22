
import React from 'react';
import { TripCard } from '../TripCard';
import { ProTripCard } from '../ProTripCard';
import { EventCard } from '../EventCard';
import { MobileTripCard } from '../MobileTripCard';
import { MobileProTripCard } from '../MobileProTripCard';
import { MobileEventCard } from '../MobileEventCard';
import { useIsMobile } from '../../hooks/use-mobile';
import { ProTripData } from '../../types/pro';
import { EventData } from '../../types/events';
import { TripCardSkeleton } from '../ui/loading-skeleton';
import { EnhancedEmptyState } from '../ui/enhanced-empty-state';
import { MapPin, Calendar, Briefcase } from 'lucide-react';

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
  loading?: boolean;
  onCreateTrip?: () => void;
}

export const TripGrid = ({ 
  viewMode, 
  trips, 
  proTrips, 
  events, 
  loading = false,
  onCreateTrip 
}: TripGridProps) => {
  const isMobile = useIsMobile();

  // Show loading skeleton
  if (loading) {
    return (
      <div className={`grid gap-6 ${isMobile ? 'grid-cols-1' : 'md:grid-cols-2 xl:grid-cols-3'}`}>
        <TripCardSkeleton count={isMobile ? 3 : 6} />
      </div>
    );
  }

  // Check if we have content for the current view mode
  const hasContent = viewMode === 'myTrips' 
    ? trips.length > 0 
    : viewMode === 'tripsPro' 
    ? Object.keys(proTrips).length > 0
    : Object.keys(events).length > 0;

  // Show enhanced empty state if no content
  if (!hasContent) {
    const getEmptyStateProps = () => {
      switch (viewMode) {
        case 'myTrips':
          return {
            icon: MapPin,
            title: 'No trips yet',
            description: 'Start planning your next adventure! Create your first trip and invite friends to join.',
            actionLabel: 'Create Your First Trip',
            onAction: onCreateTrip
          };
        case 'tripsPro':
          return {
            icon: Briefcase,
            title: 'No professional trips yet',
            description: 'Manage professional trips, tours, and events with advanced collaboration tools.',
            actionLabel: 'Create Professional Trip',
            onAction: onCreateTrip
          };
        case 'events':
          return {
            icon: Calendar,
            title: 'No events yet',
            description: 'Organize conferences, meetings, and professional events with comprehensive management tools.',
            actionLabel: 'Create Event',
            onAction: onCreateTrip
          };
        default:
          return {
            icon: MapPin,
            title: 'No content available',
            description: 'Get started by creating your first item.',
            actionLabel: 'Get Started',
            onAction: onCreateTrip
          };
      }
    };

    return <EnhancedEmptyState {...getEmptyStateProps()} />;
  }

  // Render content grid
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
