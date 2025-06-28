
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Calendar, Users } from 'lucide-react';
import { Tour } from '../types/pro';
import { UniversalTripAI } from './UniversalTripAI';
import { TourDashboardStats } from './tour/TourDashboardStats';
import { TourScheduleSection } from './tour/TourScheduleSection';
import { TourTeamSection } from './tour/TourTeamSection';
import { proTripMockData } from '../data/proTripMockData';
import { convertProTripToTour } from '../utils/tourDataConverter';

export const TourDashboard = () => {
  const navigate = useNavigate();
  const { proTripId } = useParams();
  
  console.log('TourDashboard - proTripId from URL:', proTripId);
  console.log('TourDashboard - Available trip IDs:', Object.keys(proTripMockData));
  
  const proTripData = proTripId ? proTripMockData[proTripId] : null;
  
  if (!proTripData) {
    console.log('TourDashboard - Trip data not found for ID:', proTripId);
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Trip Not Found</h1>
          <p className="text-gray-400 mb-2">The requested trip could not be found.</p>
          <p className="text-gray-400 mb-4">Trip ID: {proTripId}</p>
          <button
            onClick={() => navigate('/')}
            className="bg-gradient-to-r from-glass-orange to-glass-yellow text-white px-6 py-3 rounded-xl"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  console.log('TourDashboard - Found trip data:', proTripData.title);
  const [tour] = useState<Tour>(convertProTripToTour(proTripData));

  // Build trip context for AI (fixed basecamp property)
  const tripContext = {
    id: proTripId || 'tour-1',
    title: tour.name,
    location: proTripData.location,
    dateRange: `${tour.startDate} - ${tour.endDate}`,
    basecamp: undefined, // Fixed: basecamp property doesn't exist in ProTripData
    collaborators: proTripData.participants,
    itinerary: proTripData.itinerary,
    budget: proTripData.budget,
    broadcasts: [],
    links: [],
    messages: [],
    isPro: true
  };

  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto px-6 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">{tour.name}</h1>
              <p className="text-gray-400">{tour.description}</p>
            </div>
            <div className="flex items-center gap-4">
              {/* Universal Trip AI Button */}
              <UniversalTripAI tripContext={tripContext} />
              
              <div className="bg-gradient-to-r from-glass-orange/20 to-glass-yellow/20 backdrop-blur-sm border border-white/20 rounded-2xl px-4 py-2">
                <span className="text-glass-orange font-medium">TRIPS PRO</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-6 text-gray-300">
            <div className="flex items-center gap-2">
              <Calendar size={16} />
              <span>{new Date(tour.startDate).toLocaleDateString()} - {new Date(tour.endDate).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users size={16} />
              <span>{tour.teamMembers.length} Core Team Members</span>
            </div>
          </div>
        </div>

        {/* Dashboard Stats */}
        <TourDashboardStats tour={tour} />

        {/* Schedule */}
        <TourScheduleSection tour={tour} />

        {/* Team Members */}
        <TourTeamSection tour={tour} />
      </div>
    </div>
  );
};
