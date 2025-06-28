import React, { useState } from 'react';
import { TripCard } from '../components/TripCard';
import { ProTripCard } from '../components/ProTripCard';
import { MobileTripCard } from '../components/MobileTripCard';
import { MobileProTripCard } from '../components/MobileProTripCard';
import { MobileHeader } from '../components/MobileHeader';
import { CreateTripModal } from '../components/CreateTripModal';
import { SentimentAnalysis } from '../components/SentimentAnalysis';
import { ProUpgradeModal } from '../components/ProUpgradeModal';
import { SettingsMenu } from '../components/SettingsMenu';
import { ToggleGroup, ToggleGroupItem } from '../components/ui/toggle-group';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../components/ui/dropdown-menu';
import { Plus, Crown, Settings, User, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useIsMobile } from '../hooks/use-mobile';
import { proTripMockData } from '../data/proTripMockData';

const Index = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isProModalOpen, setIsProModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [viewMode, setViewMode] = useState('myTrips');
  const navigate = useNavigate();
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

  // Pro trips data from shared mock data
  const proMockTrips = Object.values(proTripMockData);

  console.log('Index - proMockTrips IDs:', proMockTrips.map(trip => trip.id));

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
          onUpgradeToProo={() => setIsProModalOpen(true)}
          onSettings={() => setIsSettingsOpen(true)}
          onProDashboard={() => navigate('/tour/pro-1')}
          viewMode={viewMode}
        />

        {/* Desktop Header */}
        {!isMobile && (
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold text-white tracking-tight mb-2">
                {viewMode === 'myTrips' ? 'My Trips' : 'Trips Pro'}
              </h1>
              <p className="text-gray-400">
                {viewMode === 'myTrips' 
                  ? 'Plan, organize, and share your perfect trips' 
                  : 'Professional trip management with advanced features'
                }
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/tour/pro-1')}
                className="bg-gray-900/80 backdrop-blur-md border border-gray-700 hover:border-yellow-500/50 text-white px-6 py-3 rounded-2xl flex items-center gap-3 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl font-medium"
              >
                <Crown size={20} className="text-yellow-500" />
                Pro Dashboard
              </button>
              
              <button
                onClick={() => setIsProModalOpen(true)}
                className="bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-700 hover:to-yellow-600 text-black px-6 py-3 rounded-2xl flex items-center gap-3 transition-all duration-300 hover:scale-105 shadow-lg font-medium"
              >
                <Crown size={20} />
                Upgrade to Pro
              </button>
              
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="bg-gray-900/80 backdrop-blur-md border border-gray-700 hover:bg-gray-800/80 hover:border-gray-600 text-white px-6 py-3 rounded-2xl flex items-center gap-3 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl font-medium"
              >
                <Plus size={20} />
                Create New Trip
              </button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="bg-gray-900/80 backdrop-blur-md border border-gray-700 hover:bg-gray-800/80 hover:border-gray-600 text-white p-3 rounded-2xl transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl">
                    <Settings size={20} />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent 
                  align="end" 
                  className="bg-gray-900/95 backdrop-blur-md border border-gray-700 text-white min-w-[200px] z-50"
                >
                  <DropdownMenuItem 
                    onClick={() => setIsSettingsOpen(true)}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-gray-800/80 cursor-pointer"
                  >
                    <User size={16} />
                    Account Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => setIsProModalOpen(true)}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-gray-800/80 cursor-pointer"
                  >
                    <Crown size={16} className="text-yellow-500" />
                    Upgrade to Pro
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        )}

        {/* Enhanced Toggle */}
        <div className="flex justify-center mb-8">
          <ToggleGroup 
            type="single" 
            value={viewMode} 
            onValueChange={(value) => value && setViewMode(value)}
            className="bg-gray-900/80 backdrop-blur-md border border-gray-700 rounded-2xl p-2"
          >
            <ToggleGroupItem 
              value="myTrips" 
              className={`px-4 sm:px-8 py-3 sm:py-4 rounded-xl text-white data-[state=on]:bg-yellow-500 data-[state=on]:text-black transition-all font-medium ${isMobile ? 'text-sm' : ''}`}
            >
              <div className="flex items-center gap-2">
                <MapPin size={isMobile ? 16 : 18} />
                <span className={isMobile ? 'text-sm' : ''}>My Trips</span>
              </div>
            </ToggleGroupItem>
            <ToggleGroupItem 
              value="tripsPro" 
              className={`px-4 sm:px-8 py-3 sm:py-4 rounded-xl text-white data-[state=on]:bg-gradient-to-r data-[state=on]:from-yellow-500 data-[state=on]:to-yellow-600 data-[state=on]:text-black transition-all font-medium flex items-center gap-2 ${isMobile ? 'text-sm' : ''}`}
            >
              <Crown size={isMobile ? 16 : 18} />
              <span className={isMobile ? 'text-sm' : ''}>Trips Pro</span>
            </ToggleGroupItem>
          </ToggleGroup>
        </div>

        {/* Trip Stats Overview - Hidden on mobile */}
        {viewMode === 'myTrips' && !isMobile && (
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <div className="bg-gray-900/80 backdrop-blur-md border border-gray-700 rounded-2xl p-6 text-center">
              <div className="text-3xl font-bold text-white mb-2">{trips.length}</div>
              <div className="text-gray-400">Total Trips</div>
            </div>
            <div className="bg-gray-900/80 backdrop-blur-md border border-gray-700 rounded-2xl p-6 text-center">
              <div className="text-3xl font-bold text-yellow-500 mb-2">3</div>
              <div className="text-gray-400">Upcoming</div>
            </div>
            <div className="bg-gray-900/80 backdrop-blur-md border border-gray-700 rounded-2xl p-6 text-center">
              <div className="text-3xl font-bold text-green-500 mb-2">2</div>
              <div className="text-gray-400">Completed</div>
            </div>
            <div className="bg-gray-900/80 backdrop-blur-md border border-gray-700 rounded-2xl p-6 text-center">
              <div className="text-3xl font-bold text-blue-500 mb-2">1</div>
              <div className="text-gray-400">In Planning</div>
            </div>
          </div>
        )}

        {/* Main Content - Trip Cards */}
        <div className="mb-8">
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
              proMockTrips.map((trip) => (
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

          {/* Empty State for new users */}
          {((viewMode === 'myTrips' && trips.length === 0) || (viewMode === 'tripsPro' && proMockTrips.length === 0)) && (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <MapPin size={40} className="text-yellow-500" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">
                {viewMode === 'myTrips' ? 'No trips yet' : 'No professional trips yet'}
              </h3>
              <p className="text-gray-400 mb-8 max-w-md mx-auto">
                {viewMode === 'myTrips' 
                  ? 'Start planning your next adventure! Create your first trip and invite friends to join.'
                  : 'Manage professional trips, tours, and events with advanced collaboration tools.'
                }
              </p>
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black px-8 py-4 rounded-2xl font-semibold transition-all duration-300 hover:scale-105 shadow-lg"
              >
                Create Your First Trip
              </button>
            </div>
          )}
        </div>

        {/* AI Sentiment Analysis Section - Simplified on mobile */}
        <div className="mt-12">
          <SentimentAnalysis />
        </div>
      </div>

      {/* Create Trip Modal */}
      <CreateTripModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
      />

      {/* Pro Upgrade Modal */}
      <ProUpgradeModal 
        isOpen={isProModalOpen} 
        onClose={() => setIsProModalOpen(false)} 
      />

      {/* Settings Menu */}
      <SettingsMenu 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
      />
    </div>
  );
};

export default Index;
