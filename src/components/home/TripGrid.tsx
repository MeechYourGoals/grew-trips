import React, { useMemo } from 'react';
import { TripCard } from '../TripCard';
import { ProTripCard } from '../ProTripCard';
import { EventCard } from '../EventCard';
import { MobileTripCard } from '../MobileTripCard';
import { MobileProTripCard } from '../MobileProTripCard';
import { MobileEventCard } from '../MobileEventCard';
import { RecommendationCard } from '../RecommendationCard';
import { useIsMobile } from '../../hooks/use-mobile';
import { ProTripData } from '../../types/pro';
import { EventData } from '../../types/events';
import { TripCardSkeleton } from '../ui/loading-skeleton';
import { EnhancedEmptyState } from '../ui/enhanced-empty-state';
import { filterActiveTrips } from '../../services/archiveService';
import { recommendationsData, getRecommendationsByType } from '../../data/recommendationsData';
import { MapPin, Calendar, Briefcase, Compass } from 'lucide-react';

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
  activeFilter?: string;
}

export const TripGrid = ({ 
  viewMode, 
  trips, 
  proTrips, 
  events, 
  loading = false,
  onCreateTrip,
  activeFilter = 'all'
}: TripGridProps) => {
  const isMobile = useIsMobile();

  // Filter out archived trips - use synchronous version since we don't have async user context
  const activeTrips = useMemo(() => trips, [trips]);
  const activeProTrips = useMemo(() => proTrips, [proTrips]);
  const activeEvents = useMemo(() => events, [events]);

  // Get filtered recommendations for travel recs view
  const filteredRecommendations = useMemo(() => {
    if (viewMode !== 'travelRecs') return [];
    return getRecommendationsByType(activeFilter === 'all' ? undefined : activeFilter);
  }, [viewMode, activeFilter]);

  // Show loading skeleton
  if (loading) {
    return (
      <div className={`grid gap-6 ${isMobile ? 'grid-cols-1' : 'md:grid-cols-2 xl:grid-cols-3'}`}>
        <TripCardSkeleton count={isMobile ? 3 : 6} />
      </div>
    );
  }

  // Check if we have content for the current view mode (using filtered data)
  const hasContent = viewMode === 'myTrips' 
    ? activeTrips.length > 0 
    : viewMode === 'tripsPro' 
    ? Object.keys(activeProTrips).length > 0
    : viewMode === 'events'
    ? Object.keys(activeEvents).length > 0
    : viewMode === 'travelRecs'
    ? filteredRecommendations.length > 0
    : false;

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
        case 'travelRecs':
          return {
            icon: Compass,
            title: 'No recommendations found',
            description: 'Try adjusting your filters or explore different categories to discover amazing travel experiences.',
            actionLabel: 'View All Recommendations',
            onAction: () => console.log('View all recommendations')
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

  // Render content grid (using filtered data)
  return (
    <div className={`grid gap-6 ${isMobile ? 'grid-cols-1' : 'md:grid-cols-2 xl:grid-cols-3'}`}>
      {viewMode === 'myTrips' ? (
        activeTrips.map((trip) => (
          <React.Fragment key={trip.id}>
            {isMobile ? (
              <MobileTripCard trip={trip} />
            ) : (
              <TripCard trip={trip} />
            )}
          </React.Fragment>
        ))
      ) : viewMode === 'tripsPro' ? (
        Object.values(activeProTrips).map((trip) => (
          <React.Fragment key={trip.id}>
            {isMobile ? (
              <MobileProTripCard trip={trip} />
            ) : (
              <ProTripCard trip={trip} />
            )}
          </React.Fragment>
        ))
      ) : viewMode === 'events' ? (
        Object.values(activeEvents).map((event) => (
          <React.Fragment key={event.id}>
            {isMobile ? (
              <MobileEventCard event={event} />
            ) : (
              <EventCard event={event} />
            )}
          </React.Fragment>
        ))
      ) : viewMode === 'travelRecs' ? (
        filteredRecommendations.map((recommendation) => (
          <RecommendationCard
            key={recommendation.id}
            recommendation={recommendation}
            onSaveToTrip={(id) => console.log('Save to trip:', id)}
          />
        ))
      ) : null}
    </div>
  );
};