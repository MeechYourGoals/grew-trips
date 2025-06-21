
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Calendar, Plus } from 'lucide-react';
import { TripTabs } from '../components/TripTabs';
import { TripHeader } from '../components/TripHeader';
import { PlacesSection } from '../components/PlacesSection';

const TripDetail = () => {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('chat');

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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Back Navigation */}
        <button 
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-slate-300 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft size={20} />
          Back to My Places
        </button>

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
