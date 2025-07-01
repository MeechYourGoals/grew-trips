
import React from 'react';
import { Building, Star, DollarSign, Trophy } from 'lucide-react';

export const ExhibitorsSponsorSection = () => {
  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold text-white">Exhibitors & Sponsors Management</h3>
      
      {/* Sponsor Tiers */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-6">
        <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Trophy size={20} />
          Sponsor Tiers & Benefits
        </h4>
        <div className="space-y-4">
          {[
            { tier: 'Platinum', price: '$25,000', benefits: ['Logo on all materials', 'Keynote slot', 'Premium booth'], color: 'bg-gradient-to-r from-gray-300 to-gray-100' },
            { tier: 'Gold', price: '$15,000', benefits: ['Logo on website', 'Speaking opportunity', 'Standard booth'], color: 'bg-gradient-to-r from-yellow-400 to-yellow-200' },
            { tier: 'Silver', price: '$10,000', benefits: ['Website listing', 'Networking access', 'Small booth'], color: 'bg-gradient-to-r from-gray-400 to-gray-200' },
            { tier: 'Bronze', price: '$5,000', benefits: ['Program listing', 'Badge recognition'], color: 'bg-gradient-to-r from-orange-400 to-orange-200' }
          ].map((sponsor) => (
            <div key={sponsor.tier} className="bg-white/5 rounded-lg p-4 border border-white/10">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded ${sponsor.color}`}></div>
                  <span className="text-white font-medium">{sponsor.tier}</span>
                  <span className="text-glass-orange font-bold">{sponsor.price}</span>
                </div>
                <button className="text-glass-orange hover:text-glass-orange/80 text-sm">
                  Edit Tier
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {sponsor.benefits.map((benefit, idx) => (
                  <span key={idx} className="bg-white/10 text-gray-300 px-3 py-1 rounded-full text-sm">
                    {benefit}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Current Sponsors */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-6">
        <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Star size={20} />
          Current Sponsors
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { name: 'TechCorp Inc.', tier: 'Platinum', status: 'Confirmed', booth: 'A1' },
            { name: 'Innovation Labs', tier: 'Gold', status: 'Pending', booth: 'B2' },
            { name: 'StartupXYZ', tier: 'Silver', status: 'Confirmed', booth: 'C3' },
            { name: 'Future Systems', tier: 'Bronze', status: 'Confirmed', booth: 'D4' }
          ].map((sponsor) => (
            <div key={sponsor.name} className="bg-white/5 rounded-lg p-4 border border-white/10">
              <div className="flex items-center justify-between mb-2">
                <h5 className="text-white font-medium">{sponsor.name}</h5>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  sponsor.status === 'Confirmed' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                }`}>
                  {sponsor.status}
                </span>
              </div>
              <div className="text-sm text-gray-400 space-y-1">
                <div>Tier: <span className="text-glass-orange">{sponsor.tier}</span></div>
                <div>Booth: <span className="text-white">{sponsor.booth}</span></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Exhibitor Management */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-6">
        <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Building size={20} />
          Exhibitor Directory
        </h4>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm text-gray-300 mb-2">Company Name</label>
              <input 
                type="text" 
                placeholder="Enter company name"
                className="w-full bg-gray-800/50 border border-gray-600 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-glass-orange/50"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-2">Booth Number</label>
              <input 
                type="text" 
                placeholder="e.g., A15"
                className="w-full bg-gray-800/50 border border-gray-600 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-glass-orange/50"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-2">Category</label>
              <select className="w-full bg-gray-800/50 border border-gray-600 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-glass-orange/50">
                <option>Technology</option>
                <option>Healthcare</option>
                <option>Finance</option>
                <option>Education</option>
              </select>
            </div>
            <div className="flex items-end">
              <button className="w-full bg-glass-orange hover:bg-glass-orange/80 text-white py-3 rounded-lg font-medium">
                Add Exhibitor
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
