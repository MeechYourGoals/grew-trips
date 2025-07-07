import React, { useState } from 'react';
import { MobileHeader } from '../components/MobileHeader';
import { CreateTripModal } from '../components/CreateTripModal';
import { SentimentAnalysis } from '../components/SentimentAnalysis';
import { UpgradeModal } from '../components/UpgradeModal';
import { SettingsMenu } from '../components/SettingsMenu';
import { TripStatsOverview } from '../components/home/TripStatsOverview';
import { TripViewToggle } from '../components/home/TripViewToggle';
import { DesktopHeader } from '../components/home/DesktopHeader';
import { TripGrid } from '../components/home/TripGrid';
import { EmptyState } from '../components/home/EmptyState';
import { useAuth } from '../hooks/useAuth';
import { useIsMobile } from '../hooks/use-mobile';
import { proTripMockData } from '../data/proTripMockData';
import { eventsMockData } from '../data/eventsMockData';
import { tripsData } from '../data/tripsData';
import { calculateTripStats, calculateProTripStats, calculateEventStats } from '../utils/tripStatsCalculator';

const Index = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [viewMode, setViewMode] = useState('myTrips');
  const { user } = useAuth();
  const isMobile = useIsMobile();

  // Use centralized trip data
  const trips = tripsData;

  console.log('Index - proTripMockData IDs:', Object.keys(proTripMockData));
  console.log('Index - eventsMockData IDs:', Object.keys(eventsMockData));

  // Calculate stats for each view mode
  const tripStats = calculateTripStats(trips);
  const proTripStats = calculateProTripStats(proTripMockData);
  const eventStats = calculateEventStats(eventsMockData);

  const getCurrentStats = () => {
    switch (viewMode) {
      case 'myTrips': return tripStats;
      case 'tripsPro': return proTripStats;
      case 'events': return eventStats;
      default: return tripStats;
    }
  };

  const hasTrips = viewMode === 'myTrips' 
    ? trips.length > 0 
    : viewMode === 'tripsPro' 
    ? Object.keys(proTripMockData).length > 0
    : Object.keys(eventsMockData).length > 0;

  return (
    <div className="min-h-screen bg-black font-outfit">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-yellow-500/5 rounded-full blur-3xl animate-float"></div>
        <div className="absolute top-3/4 right-1/4 w-80 h-80 bg-yellow-400/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-amber-500/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="container mx-auto px-4 py-6 max-w-7xl relative z-10">
        {/* Mobile Header */}
        <MobileHeader
          onCreateTrip={() => setIsCreateModalOpen(true)}
          onUpgradeToProo={() => setIsUpgradeModalOpen(true)}
          onSettings={() => setIsSettingsOpen(true)}
          onProDashboard={() => {}} // Empty function since Pro Dashboard was removed
          viewMode={viewMode}
        />

        {/* Desktop Header */}
        {!isMobile && (
          <DesktopHeader
            viewMode={viewMode}
            onCreateTrip={() => setIsCreateModalOpen(true)}
            onUpgrade={() => setIsUpgradeModalOpen(true)}
            onSettings={() => setIsSettingsOpen(true)}
          />
        )}

        {/* Enhanced Toggle */}
        <TripViewToggle
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />

        {/* Trip Stats Overview */}
        {!isMobile && (
          <TripStatsOverview stats={getCurrentStats()} viewMode={viewMode} />
        )}

        {/* Main Content - Trip Cards */}
        <div className="mb-8">
          {hasTrips ? (
            <TripGrid
              viewMode={viewMode}
              trips={trips}
              proTrips={proTripMockData}
              events={eventsMockData}
            />
          ) : (
            <EmptyState
              viewMode={viewMode}
              onCreateTrip={() => setIsCreateModalOpen(true)}
            />
          )}
        </div>

        {/* AI Sentiment Analysis Section */}
        <div className="mt-12">
          <SentimentAnalysis />
        </div>
      </div>

      {/* Modals */}
      <CreateTripModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
      />

      <UpgradeModal 
        isOpen={isUpgradeModalOpen} 
        onClose={() => setIsUpgradeModalOpen(false)} 
      />

      <SettingsMenu 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
      />
    </div>
  );
};

export default Index;
