import React, { useState } from 'react';
import { TripCard } from '../components/TripCard';
import { CreateTripModal } from '../components/CreateTripModal';
import { SentimentAnalysis } from '../components/SentimentAnalysis';
import { Plus } from 'lucide-react';

const Index = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

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

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Trips Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-3xl font-bold text-white">My Trips</h1>
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl flex items-center gap-2 transition-all duration-200 hover:scale-105 shadow-lg border border-red-500/30"
              >
                <Plus size={20} />
                Create New Trip
              </button>
            </div>

            {/* Trip Cards Grid */}
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {trips.map((trip) => (
                <TripCard key={trip.id} trip={trip} />
              ))}
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
    </div>
  );
};

export default Index;
