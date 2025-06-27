
import React from 'react';
import { Calendar, MapPin, Users, DollarSign, Clock, CheckCircle } from 'lucide-react';
import { ProTripData } from '../data/proTripMockData';

interface ProTripOverviewProps {
  tripData: ProTripData;
}

export const ProTripOverview = ({ tripData }: ProTripOverviewProps) => {
  const totalEvents = tripData.itinerary.reduce((total, day) => total + day.events.length, 0);
  const budgetPercentage = (tripData.budget.spent / tripData.budget.total) * 100;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
      {/* Total Events */}
      <div className="bg-gradient-to-br from-glass-orange/20 to-glass-yellow/20 backdrop-blur-md border border-white/20 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-3">
          <Calendar className="text-glass-orange" size={24} />
          <h3 className="text-white font-semibold">Total Events</h3>
        </div>
        <div className="text-3xl font-bold text-white mb-1">{totalEvents}</div>
        <div className="text-glass-orange/80 text-sm">{tripData.itinerary.length} days scheduled</div>
      </div>

      {/* Team Size */}
      <div className="bg-gradient-to-br from-glass-green/20 to-glass-yellow/20 backdrop-blur-md border border-white/20 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-3">
          <Users className="text-glass-green" size={24} />
          <h3 className="text-white font-semibold">Team Size</h3>
        </div>
        <div className="text-3xl font-bold text-white mb-1">{tripData.participants.length}</div>
        <div className="text-glass-green/80 text-sm">Active members</div>
      </div>

      {/* Budget Status */}
      <div className="bg-gradient-to-br from-glass-yellow/20 to-glass-orange/20 backdrop-blur-md border border-white/20 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-3">
          <DollarSign className="text-glass-yellow" size={24} />
          <h3 className="text-white font-semibold">Budget</h3>
        </div>
        <div className="text-3xl font-bold text-white mb-1">{budgetPercentage.toFixed(0)}%</div>
        <div className="text-glass-yellow/80 text-sm">${tripData.budget.spent.toLocaleString()} spent</div>
      </div>

      {/* Trip Status */}
      <div className="bg-gradient-to-br from-glass-green/20 to-glass-blue/20 backdrop-blur-md border border-white/20 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-3">
          <CheckCircle className="text-glass-green" size={24} />
          <h3 className="text-white font-semibold">Status</h3>
        </div>
        <div className="text-xl font-bold text-white mb-1">Active</div>
        <div className="text-glass-green/80 text-sm">{tripData.category}</div>
      </div>
    </div>
  );
};
