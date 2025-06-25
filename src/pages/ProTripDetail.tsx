
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Settings, Users, Calendar, MapPin, Crown, MessageSquare, FileText, DollarSign } from 'lucide-react';
import { TripSettings } from '../components/TripSettings';

interface ProTripData {
  id: string;
  title: string;
  location: string;
  dateRange: string;
  category: string;
  description: string;
  participants: Array<{
    id: string;
    name: string;
    avatar: string;
    role: string;
  }>;
  itinerary: Array<{
    date: string;
    events: Array<{
      time: string;
      title: string;
      location: string;
      type: string;
    }>;
  }>;
  budget: {
    total: number;
    spent: number;
    categories: Array<{
      name: string;
      budgeted: number;
      spent: number;
    }>;
  };
}

const ProTripDetail = () => {
  const { proTripId } = useParams();
  const navigate = useNavigate();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Mock data based on trip type
  const getTripData = (id: string): ProTripData => {
    switch (id) {
      case '1': // Kevin Hart Comedy Tour
        return {
          id: '1',
          title: "Kevin Hart – Australia Comedy Tour",
          location: "Australia",
          dateRange: "Mar 10 - Mar 25, 2025",
          category: 'Touring',
          description: "Multi-city comedy tour across Australia with venue coordination, transportation logistics, and team management.",
          participants: [
            { id: '1', name: "Kevin Hart", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face", role: "Artist" },
            { id: '2', name: "Tour Manager", avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=40&h=40&fit=crop&crop=face", role: "Manager" },
            { id: '3', name: "Assistant", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face", role: "Assistant" },
            { id: '4', name: "Security", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face", role: "Security" }
          ],
          itinerary: [
            {
              date: "Mar 10, 2025",
              events: [
                { time: "2:00 PM", title: "Venue Sound Check", location: "Sydney Opera House", type: "technical" },
                { time: "6:00 PM", title: "Meet & Greet", location: "Green Room", type: "event" },
                { time: "8:00 PM", title: "Show Performance", location: "Main Stage", type: "performance" }
              ]
            },
            {
              date: "Mar 12, 2025",
              events: [
                { time: "10:00 AM", title: "Travel to Melbourne", location: "Sydney Airport", type: "transport" },
                { time: "3:00 PM", title: "Hotel Check-in", location: "Crown Towers", type: "accommodation" },
                { time: "7:00 PM", title: "Show Performance", location: "Rod Laver Arena", type: "performance" }
              ]
            }
          ],
          budget: {
            total: 500000,
            spent: 275000,
            categories: [
              { name: "Venue Costs", budgeted: 200000, spent: 120000 },
              { name: "Transportation", budgeted: 150000, spent: 85000 },
              { name: "Accommodation", budgeted: 100000, spent: 45000 },
              { name: "Catering", budgeted: 50000, spent: 25000 }
            ]
          }
        };

      case '4': // LA Dodgers
        return {
          id: '4',
          title: "Los Angeles Dodgers – Playoffs 2025",
          location: "Various Stadiums",
          dateRange: "Oct 1 - Oct 30, 2025",
          category: 'Sports – Team Trip',
          description: "Professional baseball playoff series with team logistics, medical support, and media coordination.",
          participants: [
            { id: '1', name: "Team Manager", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face", role: "Manager" },
            { id: '2', name: "Medical Team", avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=40&h=40&fit=crop&crop=face", role: "Medical" },
            { id: '3', name: "Media Relations", avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=40&h=40&fit=crop&crop=face", role: "Media" }
          ],
          itinerary: [
            {
              date: "Oct 1, 2025",
              events: [
                { time: "10:00 AM", title: "Team Meeting", location: "Dodger Stadium", type: "meeting" },
                { time: "2:00 PM", title: "Practice Session", location: "Training Field", type: "training" },
                { time: "7:00 PM", title: "Game 1 vs Giants", location: "Dodger Stadium", type: "game" }
              ]
            },
            {
              date: "Oct 3, 2025",
              events: [
                { time: "8:00 AM", title: "Travel to San Francisco", location: "LAX", type: "transport" },
                { time: "3:00 PM", title: "Away Game Prep", location: "Oracle Park", type: "training" },
                { time: "7:30 PM", title: "Game 2 vs Giants", location: "Oracle Park", type: "game" }
              ]
            }
          ],
          budget: {
            total: 2000000,
            spent: 850000,
            categories: [
              { name: "Travel & Transport", budgeted: 800000, spent: 350000 },
              { name: "Accommodation", budgeted: 600000, spent: 250000 },
              { name: "Equipment", budgeted: 400000, spent: 150000 },
              { name: "Medical Support", budgeted: 200000, spent: 100000 }
            ]
          }
        };

      case '6': // InvestFest Conference
        return {
          id: '6',
          title: "InvestFest – Panelists",
          location: "Atlanta, GA",
          dateRange: "Sep 8 - Sep 10, 2025",
          category: 'Conference',
          description: "Financial conference with speaker coordination, venue management, and networking events.",
          participants: [
            { id: '1', name: "Event Producer", avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=40&h=40&fit=crop&crop=face", role: "Producer" },
            { id: '2', name: "PR Manager", avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=40&h=40&fit=crop&crop=face", role: "PR Manager" },
            { id: '3', name: "Media Contact", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face", role: "Media" }
          ],
          itinerary: [
            {
              date: "Sep 8, 2025",
              events: [
                { time: "8:00 AM", title: "Speaker Briefing", location: "Georgia World Congress Center", type: "meeting" },
                { time: "10:00 AM", title: "Opening Keynote", location: "Main Hall", type: "presentation" },
                { time: "2:00 PM", title: "Panel: Future of Investing", location: "Conference Room A", type: "panel" },
                { time: "6:00 PM", title: "Networking Reception", location: "Rooftop Terrace", type: "networking" }
              ]
            }
          ],
          budget: {
            total: 300000,
            spent: 180000,
            categories: [
              { name: "Venue Rental", budgeted: 120000, spent: 80000 },
              { name: "Speaker Fees", budgeted: 100000, spent: 60000 },
              { name: "Catering", budgeted: 50000, spent: 25000 },
              { name: "AV Equipment", budgeted: 30000, spent: 15000 }
            ]
          }
        };

      default:
        return {
          id: proTripId || '1',
          title: "Sample Pro Trip",
          location: "Various Locations",
          dateRange: "TBD",
          category: 'Business Travel',
          description: "Professional trip with team coordination and logistics management.",
          participants: [],
          itinerary: [],
          budget: { total: 0, spent: 0, categories: [] }
        };
    }
  };

  const tripData = getTripData(proTripId || '1');

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
        <div className="bg-gradient-to-r from-gray-900/90 to-gray-800/90 backdrop-blur-md border border-gray-700 rounded-3xl p-8 mb-8">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-white mb-4">{tripData.title}</h1>
              <p className="text-gray-300 mb-6">{tripData.description}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex items-center gap-3">
                  <MapPin className="text-glass-orange" size={20} />
                  <div>
                    <div className="text-sm text-gray-400">Location</div>
                    <div className="text-white font-medium">{tripData.location}</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Calendar className="text-glass-yellow" size={20} />
                  <div>
                    <div className="text-sm text-gray-400">Date Range</div>
                    <div className="text-white font-medium">{tripData.dateRange}</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Crown className="text-glass-green" size={20} />
                  <div>
                    <div className="text-sm text-gray-400">Category</div>
                    <div className="text-white font-medium">{tripData.category}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Team Members */}
          <div className="bg-gray-900/80 backdrop-blur-md border border-gray-700 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <Users className="text-glass-orange" size={24} />
              <h2 className="text-xl font-semibold text-white">Team Members</h2>
            </div>
            
            <div className="space-y-4">
              {tripData.participants.map((participant) => (
                <div key={participant.id} className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-xl">
                  <img
                    src={participant.avatar}
                    alt={participant.name}
                    className="w-10 h-10 rounded-full border-2 border-gray-600"
                  />
                  <div>
                    <div className="text-white font-medium">{participant.name}</div>
                    <div className="text-gray-400 text-sm">{participant.role}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Itinerary */}
          <div className="bg-gray-900/80 backdrop-blur-md border border-gray-700 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <Calendar className="text-glass-yellow" size={24} />
              <h2 className="text-xl font-semibold text-white">Itinerary</h2>
            </div>
            
            <div className="space-y-6">
              {tripData.itinerary.map((day, index) => (
                <div key={index}>
                  <div className="text-glass-yellow font-medium mb-3">{day.date}</div>
                  <div className="space-y-3">
                    {day.events.map((event, eventIndex) => (
                      <div key={eventIndex} className="flex gap-3 p-3 bg-gray-800/50 rounded-xl">
                        <div className="text-gray-400 text-sm min-w-[60px]">{event.time}</div>
                        <div className="flex-1">
                          <div className="text-white font-medium">{event.title}</div>
                          <div className="text-gray-400 text-sm">{event.location}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Budget Overview */}
          <div className="bg-gray-900/80 backdrop-blur-md border border-gray-700 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <DollarSign className="text-glass-green" size={24} />
              <h2 className="text-xl font-semibold text-white">Budget</h2>
            </div>
            
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-400">Total Budget</span>
                <span className="text-white font-bold">${tripData.budget.total.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-400">Spent</span>
                <span className="text-glass-orange font-bold">${tripData.budget.spent.toLocaleString()}</span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-glass-orange to-glass-yellow h-3 rounded-full transition-all duration-300"
                  style={{ width: `${(tripData.budget.spent / tripData.budget.total) * 100}%` }}
                ></div>
              </div>
            </div>
            
            <div className="space-y-3">
              {tripData.budget.categories.map((category, index) => (
                <div key={index} className="p-3 bg-gray-800/50 rounded-xl">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-white font-medium">{category.name}</span>
                    <span className="text-gray-400 text-sm">
                      ${category.spent.toLocaleString()} / ${category.budgeted.toLocaleString()}
                    </span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-glass-yellow h-2 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min((category.spent / category.budgeted) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
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
