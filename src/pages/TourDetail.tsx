
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Crown } from 'lucide-react';
import { TourDashboard } from '../components/TourDashboard';
import { BroadcastSystem } from '../components/BroadcastSystem';

const TourDetail = () => {
  const { tourId } = useParams();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto px-6 py-8 max-w-7xl">
        {/* Back Navigation */}
        <button 
          onClick={() => navigate('/')}
          className="flex items-center gap-3 text-gray-300 hover:text-white mb-8 transition-colors group"
        >
          <div className="bg-gray-800 p-2 rounded-lg shadow-lg group-hover:shadow-glass-orange/20 transition-all border border-gray-700 hover:border-glass-orange/50">
            <ArrowLeft size={20} />
          </div>
          <span className="font-medium">Back to Dashboard</span>
        </button>

        {/* Pro Badge */}
        <div className="flex items-center gap-3 mb-8">
          <div className="bg-gradient-to-r from-glass-orange/20 to-glass-yellow/20 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-2 flex items-center gap-2">
            <Crown size={16} className="text-glass-orange" />
            <span className="text-glass-orange font-medium">TRIPS PRO</span>
          </div>
        </div>

        {/* Tour Dashboard */}
        <TourDashboard />

        {/* Broadcast System */}
        <div className="mt-8">
          <BroadcastSystem tourId={tourId || '1'} />
        </div>
      </div>
    </div>
  );
};

export default TourDetail;
