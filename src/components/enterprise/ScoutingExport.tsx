
import React, { useState } from 'react';
import { Users, Download, Star, Plus, Search } from 'lucide-react';

export const ScoutingExport = () => {
  const [prospects] = useState([
    {
      id: '1',
      name: 'Marcus Johnson',
      position: 'Point Guard',
      school: 'Lincoln High School',
      grade: '11th',
      contactInfo: 'marcus.j@email.com',
      notes: 'Excellent court vision and leadership',
      rating: 4.5
    },
    {
      id: '2',
      name: 'Sarah Williams',
      position: 'Forward',
      school: 'Roosevelt Academy',
      grade: '12th',
      contactInfo: 'sarah.w@email.com',
      notes: 'Strong defensive presence, improving offense',
      rating: 4.2
    },
    {
      id: '3',
      name: 'David Chen',
      position: 'Shooting Guard',
      school: 'Jefferson Prep',
      grade: '10th',
      contactInfo: 'david.c@email.com',
      notes: 'Exceptional 3-point shooter, needs work on defense',
      rating: 4.7
    }
  ]);

  const getRatingStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={16}
        className={i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-400'}
      />
    ));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold text-white flex items-center gap-2">
          <Users size={24} className="text-glass-orange" />
          Recruiting & Scouting
        </h3>
        <div className="flex gap-2">
          <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2">
            <Download size={16} />
            Export to CRM
          </button>
          <button className="bg-glass-orange hover:bg-glass-orange/80 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2">
            <Plus size={16} />
            Add Prospect
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="flex-1 relative">
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search prospects..."
              className="w-full bg-gray-800/50 border border-gray-600 text-white rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-glass-orange/50"
            />
          </div>
          <select className="bg-gray-800/50 border border-gray-600 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-glass-orange/50">
            <option>All Positions</option>
            <option>Point Guard</option>
            <option>Shooting Guard</option>
            <option>Forward</option>
            <option>Center</option>
          </select>
          <select className="bg-gray-800/50 border border-gray-600 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-glass-orange/50">
            <option>All Grades</option>
            <option>9th Grade</option>
            <option>10th Grade</option>
            <option>11th Grade</option>
            <option>12th Grade</option>
          </select>
        </div>
      </div>

      {/* Prospects List */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-6">
        <h4 className="text-lg font-semibold text-white mb-4">Prospect Database</h4>
        <div className="space-y-4">
          {prospects.map((prospect) => (
            <div key={prospect.id} className="bg-white/5 rounded-lg p-4 border border-white/10">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-glass-orange to-glass-yellow rounded-full flex items-center justify-center">
                    <Users size={20} className="text-white" />
                  </div>
                  <div>
                    <h5 className="text-white font-medium">{prospect.name}</h5>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-400">{prospect.position}</span>
                      <span className="text-sm text-gray-500">•</span>
                      <span className="text-sm text-gray-400">{prospect.grade}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    {getRatingStars(prospect.rating)}
                    <span className="text-sm text-gray-400 ml-2">{prospect.rating}</span>
                  </div>
                  <button className="text-glass-orange hover:text-glass-orange/80 text-sm">Edit</button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-3">
                <div className="text-gray-400">
                  <span className="text-white">School:</span> {prospect.school}
                </div>
                <div className="text-gray-400">
                  <span className="text-white">Contact:</span> {prospect.contactInfo}
                </div>
              </div>
              
              <div className="text-sm text-gray-400">
                <span className="text-white">Notes:</span> {prospect.notes}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Export Options */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-6">
        <h4 className="text-lg font-semibold text-white mb-4">Export Options</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center justify-center gap-2 p-4 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 transition-colors">
            <Download size={20} className="text-blue-400" />
            <div className="text-left">
              <div className="text-white font-medium">CSV Export</div>
              <div className="text-sm text-gray-400">Download as spreadsheet</div>
            </div>
          </button>
          <button className="flex items-center justify-center gap-2 p-4 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 transition-colors">
            <Download size={20} className="text-green-400" />
            <div className="text-left">
              <div className="text-white font-medium">Salesforce</div>
              <div className="text-sm text-gray-400">Push to CRM</div>
            </div>
          </button>
          <button className="flex items-center justify-center gap-2 p-4 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 transition-colors">
            <Download size={20} className="text-purple-400" />
            <div className="text-left">
              <div className="text-white font-medium">HubSpot</div>
              <div className="text-sm text-gray-400">Sync contacts</div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
