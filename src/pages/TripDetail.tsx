
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MessageCircle } from 'lucide-react';
import { TripTabs } from '../components/TripTabs';
import { TripHeader } from '../components/TripHeader';
import { PlacesSection } from '../components/PlacesSection';
import { MessageInbox } from '../components/MessageInbox';

const TripDetail = () => {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('chat');
  const [showInbox, setShowInbox] = useState(false);

  // Sample trip data - this would come from your database
  const trip = {
    id: 1,
    title: "Summer in Paris",
    location: "Paris, France",
    dateRange: "Jul 14 - Jul 21, 2025",
    description: "Family vacation exploring the City of Light",
    collaborators: [
      { id: 1, name: "Emma", avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=40&h=40&fit=crop&crop=face" },
      { id: 2, name: "Jake", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face" },
      { id: 3, name: "Sarah", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face" }
    ]
  };

  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto px-6 py-8 max-w-7xl">
        {/* Back Navigation */}
        <div className="flex items-center justify-between mb-8">
          <button 
            onClick={() => navigate('/')}
            className="flex items-center gap-3 text-gray-300 hover:text-white transition-colors group"
          >
            <div className="bg-gray-800 p-2 rounded-lg shadow-lg group-hover:shadow-red-500/20 transition-all border border-gray-700 hover:border-red-500/50">
              <ArrowLeft size={20} />
            </div>
            <span className="font-medium">Back to My Places</span>
          </button>

          <button
            onClick={() => setShowInbox(!showInbox)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl transition-colors flex items-center gap-2"
          >
            <MessageCircle size={16} />
            {showInbox ? 'Hide Inbox' : 'Message Inbox'}
          </button>
        </div>

        {/* Message Inbox */}
        {showInbox && (
          <div className="mb-8">
            <MessageInbox />
          </div>
        )}

        {/* Trip Header */}
        <TripHeader trip={trip} />

        {/* Places to Visit Section */}
        <PlacesSection />

        {/* Trip Tabs */}
        <TripTabs activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
    </div>
  );
};

export default TripDetail;
