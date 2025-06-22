import React, { useState } from 'react';
import { TripCard } from '../components/TripCard';
import { ProTripCard } from '../components/ProTripCard';
import { CreateTripModal } from '../components/CreateTripModal';
import { SentimentAnalysis } from '../components/SentimentAnalysis';
import { ProUpgradeModal } from '../components/ProUpgradeModal';
import { ToggleGroup, ToggleGroupItem } from '../components/ui/toggle-group';
import { Plus, Crown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isProModalOpen, setIsProModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState('myTrips');
  const navigate = useNavigate();

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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 font-outfit">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-glass-orange/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute top-3/4 right-1/4 w-80 h-80 bg-glass-yellow/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-glass-green/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="container mx-auto px-4 py-6 max-w-7xl relative z-10">
        {/* Header with Pro Features */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-semibold text-white tracking-tight">
            {viewMode === 'myTrips' ? 'My Trips' : 'Trips Pro'}
          </h1>
          <div className="flex items-center gap-4">
            {/* Pro Tour Dashboard Button */}
            <button
              onClick={() => navigate('/tour/1')}
              className="bg-gradient-to-r from-glass-orange/20 to-glass-yellow/20 backdrop-blur-md border border-white/20 hover:border-white/40 text-white px-6 py-3 rounded-2xl flex items-center gap-3 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl font-medium"
            >
              <Crown size={20} />
              Tour Dashboard
            </button>
            
            {/* Upgrade to Pro */}
            <button
              onClick={() => setIsProModalOpen(true)}
              className="bg-gradient-to-r from-glass-orange to-glass-yellow hover:from-glass-orange/80 hover:to-glass-yellow/80 text-white px-6 py-3 rounded-2xl flex items-center gap-3 transition-all duration-300 hover:scale-105 shadow-lg font-medium"
            >
              <Crown size={20} />
              Upgrade to Pro
            </button>
            
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 text-white px-6 py-3 rounded-2xl flex items-center gap-3 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl font-medium"
            >
              <Plus size={20} />
              Create New Trip
            </button>
          </div>
        </div>

        {/* Toggle Between My Trips and Trips Pro */}
        <div className="flex justify-center mb-8">
          <ToggleGroup 
            type="single" 
            value={viewMode} 
            onValueChange={(value) => value && setViewMode(value)}
            className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-1"
          >
            <ToggleGroupItem 
              value="myTrips" 
              className="px-6 py-3 rounded-xl text-white data-[state=on]:bg-white/20 data-[state=on]:text-glass-yellow transition-all"
            >
              My Trips
            </ToggleGroupItem>
            <ToggleGroupItem 
              value="tripsPro" 
              className="px-6 py-3 rounded-xl text-white data-[state=on]:bg-gradient-to-r data-[state=on]:from-glass-orange/30 data-[state=on]:to-glass-yellow/30 data-[state=on]:text-glass-yellow transition-all flex items-center gap-2"
            >
              <Crown size={16} />
              Trips Pro
            </ToggleGroupItem>
          </ToggleGroup>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Trips Section */}
          <div className="lg:col-span-2">
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

          {/* AI Sentiment Analysis Section */}
          <div className="lg:col-span-1">
            <SentimentAnalysis />
          </div>
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
    </div>
  );
};

export default Index;
