
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Users, Plus, Mic, Music, Trophy, Briefcase } from 'lucide-react';
import { Tour, TourTrip } from '../types/pro';

const mockTour: Tour = {
  id: '1',
  name: 'Comedy World Tour 2025',
  description: 'International comedy tour across 15 cities',
  artistName: 'Alex Thompson',
  startDate: '2025-07-01',
  endDate: '2025-09-30',
  createdAt: '2025-01-01',
  updatedAt: '2025-01-15',
  teamMembers: [
    { id: '1', name: 'Alex Thompson', email: 'alex@comedy.com', role: 'artist', permissions: 'admin', isActive: true },
    { id: '2', name: 'Sarah Manager', email: 'sarah@management.com', role: 'manager', permissions: 'admin', isActive: true },
    { id: '3', name: 'Mike Assistant', email: 'mike@team.com', role: 'assistant', permissions: 'editor', isActive: true }
  ],
  trips: [
    { id: '1', tourId: '1', city: 'Los Angeles', venue: 'Comedy Store', date: '2025-07-15', category: 'headline', status: 'confirmed', participants: [] },
    { id: '2', tourId: '1', city: 'New York', venue: 'Madison Square Garden', date: '2025-08-01', category: 'headline', status: 'planned', participants: [] },
    { id: '3', tourId: '1', city: 'Chicago', venue: 'Second City', date: '2025-08-15', category: 'private', status: 'confirmed', participants: [] }
  ]
};

export const TourDashboard = () => {
  const navigate = useNavigate();
  const [tour] = useState<Tour>(mockTour);

  const getCategoryIcon = (category: TourTrip['category']) => {
    switch (category) {
      case 'headline': return <Mic size={16} className="text-glass-orange" />;
      case 'private': return <Briefcase size={16} className="text-glass-yellow" />;
      case 'college': return <Trophy size={16} className="text-glass-green" />;
      case 'festival': return <Music size={16} className="text-purple-400" />;
      case 'corporate': return <Briefcase size={16} className="text-blue-400" />;
    }
  };

  const getStatusColor = (status: TourTrip['status']) => {
    switch (status) {
      case 'confirmed': return 'bg-green-500/20 text-green-400';
      case 'planned': return 'bg-yellow-500/20 text-yellow-400';
      case 'completed': return 'bg-blue-500/20 text-blue-400';
      case 'cancelled': return 'bg-red-500/20 text-red-400';
    }
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
            <div className="bg-gradient-to-r from-glass-orange/20 to-glass-yellow/20 backdrop-blur-sm border border-white/20 rounded-2xl px-4 py-2">
              <span className="text-glass-orange font-medium">TRIPS PRO</span>
            </div>
          </div>
          
          <div className="flex items-center gap-6 text-gray-300">
            <div className="flex items-center gap-2">
              <Calendar size={16} />
              <span>{new Date(tour.startDate).toLocaleDateString()} - {new Date(tour.endDate).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users size={16} />
              <span>{tour.teamMembers.length} Team Members</span>
            </div>
          </div>
        </div>

        {/* Tour Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6">
            <div className="text-2xl font-bold text-white mb-1">{tour.trips.length}</div>
            <div className="text-gray-400 text-sm">Total Shows</div>
          </div>
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6">
            <div className="text-2xl font-bold text-glass-green mb-1">{tour.trips.filter(t => t.status === 'confirmed').length}</div>
            <div className="text-gray-400 text-sm">Confirmed</div>
          </div>
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6">
            <div className="text-2xl font-bold text-glass-yellow mb-1">{tour.trips.filter(t => t.status === 'planned').length}</div>
            <div className="text-gray-400 text-sm">Planned</div>
          </div>
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6">
            <div className="text-2xl font-bold text-white mb-1">{tour.teamMembers.filter(m => m.isActive).length}</div>
            <div className="text-gray-400 text-sm">Active Team</div>
          </div>
        </div>

        {/* Upcoming Shows */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-white">Tour Schedule</h2>
            <button className="bg-gradient-to-r from-glass-orange to-glass-yellow hover:from-glass-orange/80 hover:to-glass-yellow/80 text-white font-medium px-6 py-3 rounded-2xl transition-all duration-200 hover:scale-105 shadow-lg flex items-center gap-2">
              <Plus size={20} />
              Add Show
            </button>
          </div>

          <div className="grid gap-4">
            {tour.trips.map((trip) => (
              <div 
                key={trip.id} 
                onClick={() => navigate(`/trip/${trip.id}`)}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-200 cursor-pointer group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-glass-orange/30 to-glass-yellow/30 backdrop-blur-sm rounded-xl flex items-center justify-center">
                      {getCategoryIcon(trip.category)}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white group-hover:text-glass-yellow transition-colors">
                        {trip.city}
                      </h3>
                      <div className="flex items-center gap-2 text-gray-400">
                        <MapPin size={14} />
                        <span>{trip.venue}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-white font-medium">{new Date(trip.date).toLocaleDateString()}</div>
                      <div className={`text-xs px-2 py-1 rounded-full ${getStatusColor(trip.status)}`}>
                        {trip.status}
                      </div>
                    </div>
                    <div className="w-2 h-2 bg-glass-orange rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Team Members */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-white">Tour Team</h2>
            <button className="bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 text-white px-4 py-2 rounded-xl transition-all duration-200 flex items-center gap-2">
              <Plus size={16} />
              Add Member
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tour.teamMembers.map((member) => (
              <div key={member.id} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-glass-green/30 to-glass-yellow/30 backdrop-blur-sm rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-white">{member.name.charAt(0)}</span>
                  </div>
                  <div>
                    <div className="text-white font-medium">{member.name}</div>
                    <div className="text-gray-400 text-xs capitalize">{member.role.replace('-', ' ')}</div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    member.permissions === 'admin' ? 'bg-red-500/20 text-red-400' :
                    member.permissions === 'editor' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-blue-500/20 text-blue-400'
                  }`}>
                    {member.permissions}
                  </span>
                  <div className={`w-2 h-2 rounded-full ${member.isActive ? 'bg-green-400' : 'bg-gray-500'}`}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
