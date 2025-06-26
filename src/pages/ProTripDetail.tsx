
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Settings, Crown, MessageSquare, FileText, Users } from 'lucide-react';
import { TripSettings } from '../components/TripSettings';
import { ProTripHeader } from '../components/ProTripHeader';
import { ProTripTeam } from '../components/ProTripTeam';
import { ProTripSchedule } from '../components/ProTripSchedule';
import { ProTripBudget } from '../components/ProTripBudget';
import { proTripMockData } from '../data/proTripMockData';
import { getTripLabels } from '../utils/tripLabels';

const ProTripDetail = () => {
  const { proTripId } = useParams();
  const navigate = useNavigate();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // CRITICAL FIX: Extract numeric ID from 'pro-X' format
  console.log('ProTripDetail - Raw proTripId from URL:', proTripId);
  const tripId = proTripId?.replace('pro-', '') || '1';
  console.log('ProTripDetail - Extracted tripId after replace:', tripId);
  console.log('ProTripDetail - Available mock data keys:', Object.keys(proTripMockData));
  
  // Get trip data from mock data
  const tripData = proTripMockData[tripId];
  console.log('ProTripDetail - Found tripData for ID', tripId, ':', tripData ? tripData.title : 'NOT FOUND');
  console.log('ProTripDetail - Full tripData object:', tripData);

  if (!tripData) {
    console.error('ProTripDetail - No trip data found for ID:', tripId);
    console.error('ProTripDetail - Available IDs in mock data:', Object.keys(proTripMockData));
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Trip Not Found</h1>
          <p className="text-gray-400 mb-2">The requested trip could not be found.</p>
          <p className="text-gray-500 text-sm mb-2">URL Parameter: {proTripId}</p>
          <p className="text-gray-500 text-sm mb-2">Extracted ID: {tripId}</p>
          <p className="text-gray-500 text-sm mb-6">Available IDs: {Object.keys(proTripMockData).join(', ')}</p>
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

  const labels = getTripLabels(tripData.category);

  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto px-6 py-8 max-w-7xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button 
            onClick={() => navigate('/')}
            className="flex items-center gap-3 text-gray-300 hover:text-white transition-colors group"
          >
            <div className="bg-gray-800 p-2 rounded-lg shadow-lg group-hover:shadow-yellow-500/20 transition-all border border-gray-700 hover:border-yellow-500/50">
              <ArrowLeft size={20} />
            </div>
            <span className="font-medium">Back to Trips</span>
          </button>

          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-r from-glass-orange to-glass-yellow p-2 rounded-lg">
              <Crown size={20} className="text-white" />
            </div>
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="bg-gray-800 p-2 rounded-lg hover:bg-gray-700 transition-colors border border-gray-700 hover:border-yellow-500/50"
            >
              <Settings size={20} className="text-white" />
            </button>
          </div>
        </div>

        {/* Trip Header */}
        <ProTripHeader tripData={tripData} />

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <ProTripTeam tripData={tripData} teamLabel={labels.team} />
          <ProTripSchedule tripData={tripData} scheduleLabel={labels.schedule} />
          <ProTripBudget tripData={tripData} />
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700 hover:border-glass-orange/50 rounded-2xl p-6 transition-all duration-300 text-left group">
            <MessageSquare className="text-glass-orange mb-3 group-hover:scale-110 transition-transform" size={24} />
            <div className="text-white font-medium mb-1">Team Chat</div>
            <div className="text-gray-400 text-sm">Communicate with your team</div>
          </button>
          
          <button className="bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700 hover:border-glass-yellow/50 rounded-2xl p-6 transition-all duration-300 text-left group">
            <FileText className="text-glass-yellow mb-3 group-hover:scale-110 transition-transform" size={24} />
            <div className="text-white font-medium mb-1">Documents</div>
            <div className="text-gray-400 text-sm">Contracts, schedules, and files</div>
          </button>
          
          <button className="bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700 hover:border-glass-green/50 rounded-2xl p-6 transition-all duration-300 text-left group">
            <Users className="text-glass-green mb-3 group-hover:scale-110 transition-transform" size={24} />
            <div className="text-white font-medium mb-1">Broadcasts</div>
            <div className="text-gray-400 text-sm">Send updates to all members</div>
          </button>
        </div>
      </div>

      {/* Trip Settings Modal */}
      <TripSettings
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        tripId={tripData.id}
        tripName={tripData.title}
        currentUserId="current-user"
      />
    </div>
  );
};

export default ProTripDetail;
