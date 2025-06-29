
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

const Index = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [viewMode, setViewMode] = useState('myTrips');
  const { user } = useAuth();
  const isMobile = useIsMobile();

  // Sample trip data with updated examples
  const trips = [
    {
      id: 1,
      title: "Spring Break Cancun 2026 Kappa Alpha Psi Trip",
      location: "Cancun, Mexico",
      dateRange: "Mar 15 - Mar 22, 2026",
      participants: [
        { id: 1, name: "Marcus", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face" },
        { id: 2, name: "Jamal", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face" },
        { id: 3, name: "Darius", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face" },
        { id: 4, name: "Terrell", avatar: "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=40&h=40&fit=crop&crop=face" },
        { id: 5, name: "Jerome", avatar: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=40&h=40&fit=crop&crop=face" }
      ]
    },
    {
      id: 2,
      title: "Tokyo Adventure",
      location: "Tokyo, Japan",
      dateRange: "Oct 5 - Oct 15, 2025",
      participants: [
        { id: 4, name: "Alex", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face" },
        { id: 5, name: "Maria", avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=40&h=40&fit=crop&crop=face" },
        { id: 6, name: "David", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face" }
      ]
    },
    {
      id: 3,
      title: "Bali Getaway",
      location: "Bali, Indonesia",
      dateRange: "Dec 10 - Dec 20, 2025",
      participants: [
        { id: 7, name: "Lisa", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=40&h=40&fit=crop&crop=face" },
        { id: 8, name: "Ryan", avatar: "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=40&h=40&fit=crop&crop=face" },
        { id: 9, name: "Nina", avatar: "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=40&h=40&fit=crop&crop=face" }
      ]
    },
    {
      id: 4,
      title: "Kristen's Bachelorette Party",
      location: "Nashville, TN",
      dateRange: "Nov 8 - Nov 10, 2025",
      participants: [
        { id: 10, name: "Kristen", avatar: "https://images.unsplash.com/photo-1506634572416-48cdfe530110?w=40&h=40&fit=crop&crop=face" },
        { id: 11, name: "Ashley", avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=40&h=40&fit=crop&crop=face" },
        { id: 12, name: "Megan", avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=40&h=40&fit=crop&crop=face" },
        { id: 13, name: "Taylor", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face" },
        { id: 14, name: "Sam", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=40&h=40&fit=crop&crop=face" },
        { id: 15, name: "Jenna", avatar: "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=40&h=40&fit=crop&crop=face" }
      ]
    },
    {
      id: 5,
      title: "Coachella Squad 2026",
      location: "Indio, CA",
      dateRange: "Apr 10 - Apr 13, 2026",
      participants: [
        { id: 16, name: "Tyler", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face" },
        { id: 17, name: "Zoe", avatar: "https://images.unsplash.com/photo-1506634572416-48cdfe530110?w=40&h=40&fit=crop&crop=face" },
        { id: 18, name: "Mason", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face" },
        { id: 19, name: "Chloe", avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=40&h=40&fit=crop&crop=face" },
        { id: 20, name: "Jordan", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face" }
      ]
    },
    {
      id: 6,
      title: "Johnson Family Summer Vacay",
      location: "Aspen, CO",
      dateRange: "Jul 20 - Jul 28, 2025",
      participants: [
        { id: 21, name: "Dad (Mike)", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face" },
        { id: 22, name: "Mom (Linda)", avatar: "https://images.unsplash.com/photo-1506634572416-48cdfe530110?w=40&h=40&fit=crop&crop=face" },
        { id: 23, name: "Katie", avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=40&h=40&fit=crop&crop=face" },
        { id: 24, name: "Tommy", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face" },
        { id: 25, name: "Grandma Pat", avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=40&h=40&fit=crop&crop=face" }
      ]
    },
    {
      id: 7,
      title: "Fantasy Football Chat's Annual Golf Outing",
      location: "Phoenix, Arizona",
      dateRange: "Feb 20 - Feb 23, 2025",
      participants: [
        { id: 26, name: "Commissioner Mike", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face" },
        { id: 27, name: "Big Rob", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face" },
        { id: 28, name: "Tony", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face" },
        { id: 29, name: "Dave", avatar: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=40&h=40&fit=crop&crop=face" },
        { id: 30, name: "Chris", avatar: "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=40&h=40&fit=crop&crop=face" },
        { id: 31, name: "Steve", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face" }
      ]
    },
    {
      id: 8,
      title: "Harris Middle School's 8th Grade Field Trip to Washington DC",
      location: "Washington, DC",
      dateRange: "Apr 15 - Apr 18, 2025",
      participants: [
        { id: 32, name: "Ms. Johnson", avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=40&h=40&fit=crop&crop=face" },
        { id: 33, name: "Mr. Davis", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face" },
        { id: 34, name: "Mrs. Garcia", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face" },
        { id: 35, name: "Mr. Thompson", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face" },
        { id: 36, name: "Principal Adams", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=40&h=40&fit=crop&crop=face" }
      ]
    }
  ];

  console.log('Index - proTripMockData IDs:', Object.keys(proTripMockData));

  const hasTrips = viewMode === 'myTrips' ? trips.length > 0 : Object.keys(proTripMockData).length > 0;

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
        {viewMode === 'myTrips' && !isMobile && (
          <TripStatsOverview totalTrips={trips.length} />
        )}

        {/* Main Content - Trip Cards */}
        <div className="mb-8">
          {hasTrips ? (
            <TripGrid
              viewMode={viewMode}
              trips={trips}
              proTrips={proTripMockData}
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
