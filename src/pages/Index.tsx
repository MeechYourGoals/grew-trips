
import React, { useState, useEffect } from 'react';
import { MobileHeader } from '../components/MobileHeader';
import { CreateTripModal } from '../components/CreateTripModal';
import { UpgradeModal } from '../components/UpgradeModal';
import { SettingsMenu } from '../components/SettingsMenu';
import { TripStatsOverview } from '../components/home/TripStatsOverview';
import { TripViewToggle } from '../components/home/TripViewToggle';
import { DesktopHeader } from '../components/home/DesktopHeader';
import { TripGrid } from '../components/home/TripGrid';
import { RecommendationFilters } from '../components/home/RecommendationFilters';

// New conversion components
import { PersistentCTABar } from '../components/conversion/PersistentCTABar';

import { SocialProofSection } from '../components/conversion/SocialProofSection';
import { FeatureShowcase } from '../components/conversion/FeatureShowcase';
import { PricingSection } from '../components/conversion/PricingSection';
import { DemoModal } from '../components/conversion/DemoModal';

import { useAuth } from '../hooks/useAuth';
import { useIsMobile } from '../hooks/use-mobile';
import { proTripMockData } from '../data/proTripMockData';
import { eventsMockData } from '../data/eventsMockData';
import { tripsData } from '../data/tripsData';
import { calculateTripStats, calculateProTripStats, calculateEventStats, filterItemsByStatus } from '../utils/tripStatsCalculator';
import { useLocation } from 'react-router-dom';

const Index = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const [showPricingModal, setShowPricingModal] = useState(false);
  const [isPricingSectionVisible, setIsPricingSectionVisible] = useState(false);
  const [viewMode, setViewMode] = useState('myTrips');
  const [isLoading, setIsLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string>('');
  const [recsFilter, setRecsFilter] = useState('all');
  const [settingsInitialConsumerSection, setSettingsInitialConsumerSection] = useState<string | undefined>(undefined);
  const { user } = useAuth();
  const isMobile = useIsMobile();
  const location = useLocation();

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

  const getFilteredData = () => {
    if (!activeFilter || activeFilter === 'total') {
      return {
        trips,
        proTrips: proTripMockData,
        events: eventsMockData
      };
    }

    switch (viewMode) {
      case 'myTrips':
        return {
          trips: filterItemsByStatus(trips, activeFilter),
          proTrips: proTripMockData,
          events: eventsMockData
        };
      case 'tripsPro':
        return {
          trips,
          proTrips: Object.fromEntries(
            Object.entries(proTripMockData).filter(([_, trip]) => 
              filterItemsByStatus([trip], activeFilter).length > 0
            )
          ),
          events: eventsMockData
        };
      case 'events':
        return {
          trips,
          proTrips: proTripMockData,
          events: Object.fromEntries(
            Object.entries(eventsMockData).filter(([_, event]) => 
              filterItemsByStatus([event], activeFilter).length > 0
            )
          )
        };
      default:
        return { trips, proTrips: proTripMockData, events: eventsMockData };
    }
  };

  // Simulate loading when switching view modes
  const handleViewModeChange = (newMode: string) => {
    if (newMode === 'upgrade') {
      setIsUpgradeModalOpen(true);
      return;
    }
    setIsLoading(true);
    setViewMode(newMode);
    setActiveFilter(''); // Reset filter when changing view mode
    // Simulate API delay
    setTimeout(() => {
      setIsLoading(false);
    }, 800);
  };

  const handleFilterClick = (filter: string) => {
    // Toggle filter: if same filter is clicked, clear it
    setActiveFilter(activeFilter === filter ? '' : filter);
  };

  const handleCreateTrip = () => {
    setIsCreateModalOpen(true);
  };

  const handleScheduleDemo = () => {
    setIsDemoModalOpen(true);
  };

  const handleSeePricing = () => {
    setIsPricingSectionVisible(true);
    // Scroll to pricing section
    const pricingSection = document.querySelector('#pricing-section');
    if (pricingSection) {
      pricingSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const filteredData = getFilteredData();

  // Open settings to saved recs if requested via query params
  useEffect(() => {
    const sp = new URLSearchParams(location.search);
    const open = sp.get('openSettings');
    if (open === 'saved-recs') {
      setSettingsInitialConsumerSection('saved-recs');
      setIsSettingsOpen(true);
    }
  }, [location.search]);

  return (
    <div className="min-h-screen bg-background font-outfit">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-float"></div>
        <div className="absolute top-3/4 right-1/4 w-80 h-80 bg-accent/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-primary/3 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="container mx-auto px-4 py-6 max-w-7xl relative z-10">
        {/* Mobile Header */}
        <MobileHeader
          onCreateTrip={handleCreateTrip}
          onUpgradeToProo={() => setIsUpgradeModalOpen(true)}
          onSettings={() => setIsSettingsOpen(true)}
          onProDashboard={() => {}} // Empty function since Pro Dashboard was removed
          viewMode={viewMode}
        />

        {/* Desktop Header */}
        {!isMobile && (
          <DesktopHeader
            viewMode={viewMode}
            onCreateTrip={handleCreateTrip}
            onUpgrade={() => setIsUpgradeModalOpen(true)}
            onSettings={() => setIsSettingsOpen(true)}
          />
        )}


        {/* Enhanced Toggle with smooth transitions */}
        <div className="animate-fade-in">
          <TripViewToggle 
            viewMode={viewMode} 
            onViewModeChange={handleViewModeChange}
            onUpgrade={() => setIsUpgradeModalOpen(true)}
          />
        </div>

        {/* Trip Stats Overview with loading state - moved above filters for travel recs */}
        {!isMobile && (
          <div className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <TripStatsOverview 
              stats={getCurrentStats()} 
              viewMode={viewMode} 
              activeFilter={activeFilter}
              onFilterClick={handleFilterClick}
            />
          </div>
        )}

        {/* Travel Recommendations Filters with inline search */}
        {viewMode === 'travelRecs' && (
          <div className="mb-6">
            <RecommendationFilters 
              activeFilter={recsFilter}
              onFilterChange={setRecsFilter}
              showInlineSearch={true}
            />
          </div>
        )}

        {/* Main Content - Trip Cards with enhanced loading and empty states */}
        <div className="mb-12 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <TripGrid
            viewMode={viewMode}
            trips={filteredData.trips}
            proTrips={filteredData.proTrips}
            events={filteredData.events}
            loading={isLoading}
            onCreateTrip={handleCreateTrip}
            activeFilter={recsFilter}
          />
        </div>

        {/* Social Proof Section */}
        <div className="mb-12 animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <SocialProofSection />
        </div>

        {/* Feature Showcase */}
        <div className="mb-12 animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <FeatureShowcase />
        </div>

        {/* Pricing Section */}
        <div className="mb-12 animate-fade-in" style={{ animationDelay: '0.5s' }}>
          <PricingSection />
        </div>

      </div>

      {/* Persistent CTA Bar */}
      <PersistentCTABar
        viewMode={viewMode}
        onPlanTrip={handleCreateTrip}
        onScheduleDemo={handleScheduleDemo}
        onSeePricing={handleSeePricing}
      />

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
        initialConsumerSection={settingsInitialConsumerSection}
      />

      <DemoModal
        isOpen={isDemoModalOpen}
        onClose={() => setIsDemoModalOpen(false)}
        demoType={viewMode === 'events' ? 'events' : 'pro'}
      />
    </div>
  );
};

export default Index;
