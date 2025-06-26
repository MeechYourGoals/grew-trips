import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Users, Plus, Mic, Music, Trophy, Briefcase, Hotel, Plane } from 'lucide-react';
import { Tour, TourTrip } from '../types/pro';

const mockTour: Tour = {
  id: '1',
  name: 'Kevin Hart – Australia Comedy Tour',
  description: 'International comedy tour across 15 cities',
  artistName: 'Alex Thompson',
  startDate: '2025-07-01',
  endDate: '2025-09-30',
  createdAt: '2025-01-01',
  updatedAt: '2025-01-15',
  teamMembers: [
    { id: '1', name: 'Alex Thompson', email: 'alex@comedy.com', role: 'artist', permissions: 'admin', isActive: true },
    { id: '2', name: 'Sarah Manager', email: 'sarah@management.com', role: 'manager', permissions: 'admin', isActive: true },
    { id: '3', name: 'Mike Assistant', email: 'mike@team.com', role: 'assistant', permissions: 'editor', isActive: true },
    { id: '4', name: 'John Driver', email: 'john@transport.com', role: 'crew', permissions: 'viewer', isActive: true },
    { id: '5', name: 'Lisa Photo', email: 'lisa@photo.com', role: 'photographer', permissions: 'editor', isActive: false },
    { id: '6', name: 'Mark Security', email: 'mark@security.com', role: 'security', permissions: 'viewer', isActive: true }
  ],
  trips: [
    { 
      id: '1', 
      tourId: '1', 
      city: 'Los Angeles', 
      venue: 'Comedy Store', 
      venueAddress: '8433 Sunset Blvd, West Hollywood, CA 90069',
      date: '2025-07-15', 
      category: 'headline', 
      status: 'confirmed', 
      participants: [],
      accommodation: {
        type: 'hotel',
        name: 'The Sunset Marquis',
        address: '1200 Alta Loma Rd, West Hollywood, CA 90069',
        confirmationNumber: 'SM-789123',
        checkIn: '2025-07-14',
        checkOut: '2025-07-16'
      },
      transportation: {
        type: 'flight',
        details: 'Delta Flight 1234 - LAX Terminal 3',
        confirmationNumber: 'DL-ABC123',
        dateTime: '2025-07-14 14:30'
      }
    },
    { 
      id: '2', 
      tourId: '1', 
      city: 'New York', 
      venue: 'Madison Square Garden', 
      venueAddress: '4 Pennsylvania Plaza, New York, NY 10001',
      date: '2025-08-01', 
      category: 'headline', 
      status: 'planned', 
      participants: [],
      accommodation: {
        type: 'hotel',
        name: 'The Plaza Hotel',
        address: 'Fifth Avenue at Central Park South, New York, NY 10019',
        confirmationNumber: 'PL-456789',
        checkIn: '2025-07-31',
        checkOut: '2025-08-02'
      },
      transportation: {
        type: 'flight',
        details: 'American Flight 5678 - JFK Terminal 8',
        confirmationNumber: 'AA-DEF456',
        dateTime: '2025-07-31 16:45'
      }
    },
    { 
      id: '3', 
      tourId: '1', 
      city: 'Chicago', 
      venue: 'Second City', 
      venueAddress: '1616 N Wells St, Chicago, IL 60614',
      date: '2025-08-15', 
      category: 'private', 
      status: 'confirmed', 
      participants: [],
      accommodation: {
        type: 'airbnb',
        name: 'Downtown Chicago Penthouse',
        address: '100 E Walton St, Chicago, IL 60611',
        confirmationNumber: 'AB-GHI789',
        checkIn: '2025-08-14',
        checkOut: '2025-08-16'
      },
      transportation: {
        type: 'train',
        details: 'Amtrak Lake Shore Limited - Car 3, Seat 15A',
        confirmationNumber: 'AM-JKL012',
        dateTime: '2025-08-14 09:30'
      }
    }
  ]
};

export const TourDashboard = () => {
  const navigate = useNavigate();
  const [tour] = useState<Tour>(mockTour);

  // Calculate upcoming events (current date or future)
  const today = new Date();
  const upcomingEvents = tour.trips.filter(trip => new Date(trip.date) >= today).length;

  // Calculate total unique team members across all trips
  const allTeamMembers = new Set();
  tour.teamMembers.forEach(member => allTeamMembers.add(member.id));
  tour.trips.forEach(trip => {
    trip.participants.forEach(participant => allTeamMembers.add(participant.id));
  });

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
              <span>{tour.teamMembers.length} Core Team Members</span>
            </div>
          </div>
        </div>

        {/* Tour Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 md:p-6">
            <div className="text-xl md:text-2xl font-bold text-white mb-1">{tour.trips.length}</div>
            <div className="text-gray-400 text-xs md:text-sm">Total Events</div>
          </div>
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 md:p-6">
            <div className="text-xl md:text-2xl font-bold text-glass-green mb-1">{upcomingEvents}</div>
            <div className="text-gray-400 text-xs md:text-sm">Upcoming</div>
          </div>
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 md:p-6">
            <div className="text-xl md:text-2xl font-bold text-glass-yellow mb-1">{allTeamMembers.size}</div>
            <div className="text-gray-400 text-xs md:text-sm">Total Team Members</div>
          </div>
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 md:p-6">
            <div className="text-xl md:text-2xl font-bold text-white mb-1">{tour.teamMembers.filter(m => m.isActive).length}</div>
            <div className="text-gray-400 text-xs md:text-sm">Active Team</div>
          </div>
        </div>

        {/* Tour Schedule */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-6 md:p-8 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
            <h2 className="text-xl md:text-2xl font-semibold text-white">Tour Schedule</h2>
            <button className="bg-gradient-to-r from-glass-orange to-glass-yellow hover:from-glass-orange/80 hover:to-glass-yellow/80 text-white font-medium px-4 md:px-6 py-3 rounded-2xl transition-all duration-200 hover:scale-105 shadow-lg flex items-center gap-2">
              <Plus size={20} />
              Add Event
            </button>
          </div>

          <div className="grid gap-4">
            {tour.trips.map((trip) => (
              <div 
                key={trip.id} 
                onClick={() => navigate(`/trip/${trip.id}`)}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 md:p-6 hover:bg-white/10 transition-all duration-200 cursor-pointer group"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-glass-orange/30 to-glass-yellow/30 backdrop-blur-sm rounded-xl flex items-center justify-center flex-shrink-0">
                      {getCategoryIcon(trip.category)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-lg font-semibold text-white group-hover:text-glass-yellow transition-colors mb-1">
                        {trip.city}
                      </h3>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-gray-400 text-sm">
                          <MapPin size={12} />
                          <span className="truncate">{trip.venue}</span>
                        </div>
                        <div className="text-gray-500 text-xs">
                          {trip.venueAddress}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between lg:justify-end gap-4">
                    <div className="text-right">
                      <div className="text-white font-medium text-sm md:text-base">{new Date(trip.date).toLocaleDateString()}</div>
                      <div className={`text-xs px-2 py-1 rounded-full ${getStatusColor(trip.status)}`}>
                        {trip.status}
                      </div>
                    </div>
                    <div className="w-2 h-2 bg-glass-orange rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </div>
                </div>
                
                {/* Transportation & Accommodations Preview */}
                <div className="mt-4 pt-4 border-t border-white/10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="flex items-center gap-2 text-gray-400">
                      <Hotel size={12} className="text-glass-yellow" />
                      <span className="truncate">{trip.accommodation?.name} - {trip.accommodation?.confirmationNumber}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400">
                      <Plane size={12} className="text-glass-green" />
                      <span className="truncate">{trip.transportation?.details} - {trip.transportation?.confirmationNumber}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Team Members */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-6 md:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
            <h2 className="text-xl md:text-2xl font-semibold text-white">Tour Team</h2>
            <button className="bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 text-white px-4 py-2 rounded-xl transition-all duration-200 flex items-center gap-2">
              <Plus size={16} />
              Add Member
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {tour.teamMembers.map((member) => (
              <div key={member.id} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-glass-green/30 to-glass-yellow/30 backdrop-blur-sm rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-white">{member.name.charAt(0)}</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-white font-medium truncate">{member.name}</div>
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
