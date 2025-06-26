
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Calendar, MapPin, Users, Plus, Mic, Music, Trophy, Briefcase, Hotel, Plane } from 'lucide-react';
import { Tour, TourTrip } from '../types/pro';
import { proTripMockData } from '../data/proTripMockData';

// Convert ProTripData to Tour format for compatibility
const convertProTripToTour = (proTripData: any): Tour => {
  return {
    id: proTripData.id,
    name: proTripData.title,
    description: proTripData.description,
    artistName: proTripData.participants[0]?.name || 'Team Lead',
    startDate: proTripData.dateRange.split(' - ')[0] || '2025-01-01',
    endDate: proTripData.dateRange.split(' - ')[1] || '2025-12-31',
    createdAt: '2025-01-01',
    updatedAt: '2025-01-15',
    teamMembers: proTripData.participants.map((p: any, index: number) => ({
      id: p.id,
      name: p.name,
      email: `${p.name.toLowerCase().replace(' ', '.')}@${proTripData.category.toLowerCase().replace(/[^a-z]/g, '')}.com`,
      role: p.role.toLowerCase().replace(/[^a-z]/g, '-'),
      permissions: index === 0 ? 'admin' : index === 1 ? 'admin' : 'editor',
      isActive: true
    })),
    trips: proTripData.itinerary.map((day: any, dayIndex: number) => ({
      id: `${proTripData.id}-${dayIndex}`,
      tourId: proTripData.id,
      city: proTripData.location.split(',')[0] || proTripData.location,
      venue: day.events[0]?.location || 'Main Venue',
      venueAddress: `${day.events[0]?.location}, ${proTripData.location}`,
      date: day.date,
      category: proTripData.category.includes('Sports') ? 'private' : 
                proTripData.category.includes('Business') ? 'corporate' :
                proTripData.category.includes('Tour') ? 'headline' :
                proTripData.category.includes('Conference') ? 'college' : 'private',
      status: dayIndex === 0 ? 'confirmed' : dayIndex === 1 ? 'planned' : 'confirmed',
      participants: proTripData.participants,
      accommodation: {
        type: 'hotel',
        name: `${proTripData.location} Premium Hotel`,
        address: `Premium Location, ${proTripData.location}`,
        confirmationNumber: `${proTripData.id.toUpperCase()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
        checkIn: day.date,
        checkOut: day.date
      },
      transportation: {
        type: 'flight',
        details: `Premium Transport - ${proTripData.location}`,
        confirmationNumber: `TR-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
        dateTime: `${day.date} 14:30`
      }
    }))
  };
};

export const TourDashboard = () => {
  const navigate = useNavigate();
  const { proTripId } = useParams();
  const tripId = proTripId?.replace(/^pro-/, '') || '1';
  
  // Get the correct pro trip data
  const proTripData = proTripMockData[tripId];
  if (!proTripData) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Trip Not Found</h1>
          <p className="text-gray-400 mb-2">The requested trip could not be found.</p>
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

  const [tour] = useState<Tour>(convertProTripToTour(proTripData));

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
            <h2 className="text-xl md:text-2xl font-semibold text-white">Schedule</h2>
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
            <h2 className="text-xl md:text-2xl font-semibold text-white">Team</h2>
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
