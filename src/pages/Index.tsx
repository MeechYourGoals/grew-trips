import React, { useState } from 'react';
import { TripCard } from '../components/TripCard';
import { ProTripCard } from '../components/ProTripCard';
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
import { Plus, Crown, Settings, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Index = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isProModalOpen, setIsProModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [viewMode, setViewMode] = useState('myTrips');
  const navigate = useNavigate();
  const { user } = useAuth();

  // Sample trip data with rich mock content
  const trips = [
    {
      id: 1,
      title: "Summer in Paris",
      location: "Paris, France",
      dateRange: "Jul 15 - Jul 22, 2025",
      participants: [
        { id: 1, name: "Emma", avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=40&h=40&fit=crop&crop=face" },
        { id: 2, name: "Jake", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face" },
        { id: 3, name: "Sarah", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face" }
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
      title: "Target Minneapolis HQ Retreat",
      location: "Las Vegas, NV",
      dateRange: "Sep 15 - Sep 18, 2025",
      participants: [
        { id: 26, name: "Rebecca (VP)", avatar: "https://images.unsplash.com/photo-1506634572416-48cdfe530110?w=40&h=40&fit=crop&crop=face" },
        { id: 27, name: "Marcus", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face" },
        { id: 28, name: "Priya", avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=40&h=40&fit=crop&crop=face" },
        { id: 29, name: "Carlos", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face" },
        { id: 30, name: "Jennifer", avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=40&h=40&fit=crop&crop=face" },
        { id: 31, name: "Derek", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face" }
      ]
    },
    {
      id: 8,
      title: "Cast and Crew Wrap Party",
      location: "Auckland, New Zealand",
      dateRange: "Mar 22 - Mar 26, 2025",
      participants: [
        { id: 32, name: "Director Sam", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face" },
        { id: 33, name: "Emma (Lead)", avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=40&h=40&fit=crop&crop=face" },
        { id: 34, name: "Jake (Co-star)", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face" },
        { id: 35, name: "Producer Lisa", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=40&h=40&fit=crop&crop=face" },
        { id: 36, name: "DP Chris", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face" },
        { id: 37, name: "Stunt Coord", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face" }
      ]
    }
  ];

  // Mock Pro trips data
  const proMockTrips = [
    {
      id: 'pro-1',
      title: "Kevin Hart – Australia Comedy Tour",
      location: "Australia",
      dateRange: "Mar 10 - Mar 25, 2025",
      category: 'comedy',
      tags: ["Comedy", "Touring", "Rotating Team"],
      participants: [
        { id: 1, name: "Kevin Hart", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face", role: "artist" },
        { id: 2, name: "Tour Manager", avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=40&h=40&fit=crop&crop=face", role: "manager" },
        { id: 3, name: "Assistant", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face", role: "assistant" },
        { id: 4, name: "Security", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face", role: "security" }
      ]
    },
    {
      id: 'pro-2',
      title: "Morgan Wallen – North America Tour",
      location: "Various Cities",
      dateRange: "Apr 5 - Jun 20, 2025",
      category: 'music',
      tags: ["Music", "Multi-City Tour"],
      participants: [
        { id: 5, name: "Morgan Wallen", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face", role: "artist" },
        { id: 6, name: "Band Leader", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face", role: "crew" },
        { id: 7, name: "Label Rep", avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=40&h=40&fit=crop&crop=face", role: "label-rep" },
        { id: 8, name: "Road Crew", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face", role: "crew" }
      ]
    },
    {
      id: 'pro-3',
      title: "Scarlett Knights – AAU Volleyball Tourney",
      location: "Orlando, FL",
      dateRange: "Jul 12 - Jul 16, 2025",
      category: 'sports',
      tags: ["Youth Sports", "Multi-Family"],
      participants: [
        { id: 9, name: "Coach Sarah", avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=40&h=40&fit=crop&crop=face", role: "manager" },
        { id: 10, name: "Team Mom", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face", role: "assistant" },
        { id: 11, name: "Athletic Dir", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face", role: "manager" }
      ]
    },
    {
      id: 'pro-4',
      title: "Los Angeles Dodgers – Playoffs 2025",
      location: "Various Stadiums",
      dateRange: "Oct 1 - Oct 30, 2025",
      category: 'sports',
      tags: ["Pro Sports", "Championship"],
      participants: [
        { id: 12, name: "Team Manager", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face", role: "manager" },
        { id: 13, name: "Medical Team", avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=40&h=40&fit=crop&crop=face", role: "crew" },
        { id: 14, name: "Media Relations", avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=40&h=40&fit=crop&crop=face", role: "crew" }
      ]
    },
    {
      id: 'pro-5',
      title: "Content House – Passes Retreat",
      location: "Bahamas",
      dateRange: "Aug 15 - Aug 22, 2025",
      category: 'influencer',
      tags: ["Influencer", "Retreat", "Team Coordination"],
      participants: [
        { id: 15, name: "Lead Creator", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face", role: "artist" },
        { id: 16, name: "Photographer", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face", role: "photographer" },
        { id: 17, name: "Videographer", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face", role: "videographer" }
      ]
    },
    {
      id: 'pro-6',
      title: "InvestFest – Panelists",
      location: "Atlanta, GA",
      dateRange: "Sep 8 - Sep 10, 2025",
      category: 'conference',
      tags: ["Speaker", "Event Production"],
      participants: [
        { id: 18, name: "Event Producer", avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=40&h=40&fit=crop&crop=face", role: "manager" },
        { id: 19, name: "PR Manager", avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=40&h=40&fit=crop&crop=face", role: "crew" },
        { id: 20, name: "Media Contact", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face", role: "crew" }
      ]
    },
    {
      id: 'pro-7',
      title: "The Chainsmokers – Vegas Residency 2025",
      location: "Las Vegas, NV",
      dateRange: "Jan 1 - Dec 31, 2025",
      category: 'music',
      tags: ["DJ", "Residency", "Recurring"],
      participants: [
        { id: 21, name: "Drew Taggart", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face", role: "artist" },
        { id: 22, name: "Alex Pall", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face", role: "artist" },
        { id: 23, name: "Lighting Tech", avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=40&h=40&fit=crop&crop=face", role: "crew" },
        { id: 24, name: "Videographer", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face", role: "videographer" }
      ]
    },
    {
      id: 'pro-8',
      title: "Esports Team – Valorant Spring Championship",
      location: "Chicago, IL",
      dateRange: "May 20 - May 25, 2025",
      category: 'esports',
      tags: ["Esports", "Championship"],
      participants: [
        { id: 25, name: "Head Coach", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face", role: "manager" },
        { id: 26, name: "Analyst", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face", role: "crew" },
        { id: 27, name: "Social Media", avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=40&h=40&fit=crop&crop=face", role: "crew" }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-black font-outfit">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-yellow-500/5 rounded-full blur-3xl animate-float"></div>
        <div className="absolute top-3/4 right-1/4 w-80 h-80 bg-yellow-400/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-amber-500/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="container mx-auto px-4 py-6 max-w-7xl relative z-10">
        {/* Header with Pro Features */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-semibold text-white tracking-tight">
            {viewMode === 'myTrips' ? 'My Trips' : 'Trips Pro'}
          </h1>
          <div className="flex items-center gap-4">
            {/* Pro Dashboard Button */}
            <button
              onClick={() => navigate('/tour/1')}
              className="bg-gray-900/80 backdrop-blur-md border border-gray-700 hover:border-yellow-500/50 text-white px-6 py-3 rounded-2xl flex items-center gap-3 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl font-medium hover:bg-gray-800/80"
            >
              <Crown size={20} className="text-yellow-500" />
              Pro Dashboard
            </button>
            
            {/* Upgrade to Pro */}
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

            {/* Settings Dropdown Menu */}
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

        {/* Toggle Between My Trips and Trips Pro */}
        <div className="flex justify-center mb-8">
          <ToggleGroup 
            type="single" 
            value={viewMode} 
            onValueChange={(value) => value && setViewMode(value)}
            className="bg-gray-900/80 backdrop-blur-md border border-gray-700 rounded-2xl p-1"
          >
            <ToggleGroupItem 
              value="myTrips" 
              className="px-6 py-3 rounded-xl text-white data-[state=on]:bg-gray-800/80 data-[state=on]:text-yellow-500 transition-all"
            >
              My Trips
            </ToggleGroupItem>
            <ToggleGroupItem 
              value="tripsPro" 
              className="px-6 py-3 rounded-xl text-white data-[state=on]:bg-gradient-to-r data-[state=on]:from-yellow-600/30 data-[state=on]:to-yellow-500/30 data-[state=on]:text-yellow-400 transition-all flex items-center gap-2"
            >
              <Crown size={16} />
              Trips Pro
            </ToggleGroupItem>
          </ToggleGroup>
        </div>

        {/* Main Content - Trip Cards */}
        <div className="mb-8">
          {/* Trip Cards Grid */}
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {viewMode === 'myTrips' ? (
              trips.map((trip) => (
                <TripCard key={trip.id} trip={trip} />
              ))
            ) : (
              proMockTrips.map((trip) => (
                <ProTripCard key={trip.id} trip={trip} />
              ))
            )}
          </div>
        </div>

        {/* AI Sentiment Analysis Section - Now at bottom */}
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
