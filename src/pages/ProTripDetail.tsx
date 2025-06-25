
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

  // Get dynamic labels based on trip category
  const getLabels = (category: string) => {
    switch (category) {
      case 'Sports – Team Trip':
        return { schedule: 'Game Schedule', team: 'Team Roster' };
      case 'Conference':
        return { schedule: 'Conference Schedule', team: 'Conference Members' };
      case 'Tournament':
        return { schedule: 'Tournament Schedule', team: 'Tournament Roster' };
      case 'Residency':
        return { schedule: 'Residency Schedule', team: 'Show Crew' };
      default:
        return { schedule: 'Tour Schedule', team: 'Tour Team' };
    }
  };

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
            { id: '1', name: "Kevin Hart", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face", role: "Comedian" },
            { id: '2', name: "Sarah Mitchell", avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=40&h=40&fit=crop&crop=face", role: "Tour Manager" },
            { id: '3', name: "Marcus Chen", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face", role: "Sound Engineer" },
            { id: '4', name: "Lisa Rodriguez", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face", role: "Security Lead" }
          ],
          itinerary: [
            {
              date: "Mar 10, 2025",
              events: [
                { time: "2:00 PM", title: "Venue Sound Check", location: "Qudos Bank Arena, Sydney", type: "technical" },
                { time: "6:00 PM", title: "Meet & Greet", location: "Green Room", type: "event" },
                { time: "8:00 PM", title: "Show Performance", location: "Main Stage", type: "performance" }
              ]
            },
            {
              date: "Mar 15, 2025",
              events: [
                { time: "10:00 AM", title: "Travel to Melbourne", location: "Sydney Airport", type: "transport" },
                { time: "3:00 PM", title: "Hotel Check-in", location: "Crown Towers Melbourne", type: "accommodation" },
                { time: "7:00 PM", title: "Show Performance", location: "Rod Laver Arena", type: "performance" }
              ]
            },
            {
              date: "Mar 20, 2025",
              events: [
                { time: "11:00 AM", title: "Travel to Perth", location: "Melbourne Airport", type: "transport" },
                { time: "4:00 PM", title: "Final Show Setup", location: "RAC Arena", type: "technical" },
                { time: "8:00 PM", title: "Final Show", location: "RAC Arena", type: "performance" }
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

      case '2': // Scarlet Knights AAU Volleyball
        return {
          id: '2',
          title: "Scarlet Knights AAU Volleyball Tourney",
          location: "Multi-State Tournament",
          dateRange: "Jun 15 - Jun 22, 2025",
          category: 'Sports – Team Trip',
          description: "AAU volleyball tournament featuring multiple matches across premier athletic facilities with team coordination and family logistics.",
          participants: [
            { id: '1', name: "Coach Williams", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face", role: "Head Coach" },
            { id: '2', name: "Emma Johnson", avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=40&h=40&fit=crop&crop=face", role: "Setter" },
            { id: '3', name: "Maya Patel", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face", role: "Libero" },
            { id: '4', name: "Dr. Smith", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face", role: "Athletic Trainer" }
          ],
          itinerary: [
            {
              date: "Jun 15, 2025",
              events: [
                { time: "8:00 AM", title: "Team Check-in", location: "IMG Academy, Florida", type: "registration" },
                { time: "10:00 AM", title: "Pool Play Match 1", location: "Court 3, IMG Academy", type: "game" },
                { time: "2:00 PM", title: "Pool Play Match 2", location: "Court 5, IMG Academy", type: "game" }
              ]
            },
            {
              date: "Jun 18, 2025",
              events: [
                { time: "9:00 AM", title: "Travel to Orlando", location: "Team Bus", type: "transport" },
                { time: "1:00 PM", title: "Quarterfinals", location: "ESPN Wide World of Sports", type: "game" },
                { time: "6:00 PM", title: "Team Dinner", location: "Disney Springs", type: "meal" }
              ]
            },
            {
              date: "Jun 20, 2025",
              events: [
                { time: "10:00 AM", title: "Travel to Columbus", location: "Orlando Airport", type: "transport" },
                { time: "4:00 PM", title: "Championship Match", location: "Ohio State University Gymnasium", type: "game" }
              ]
            }
          ],
          budget: {
            total: 25000,
            spent: 15000,
            categories: [
              { name: "Registration Fees", budgeted: 8000, spent: 8000 },
              { name: "Transportation", budgeted: 7000, spent: 4000 },
              { name: "Accommodation", budgeted: 6000, spent: 2000 },
              { name: "Meals", budgeted: 4000, spent: 1000 }
            ]
          }
        };

      case '3': // Morgan Wallen North America Tour
        return {
          id: '3',
          title: "Morgan Wallen North America Tour",
          location: "Multi-City Tour",
          dateRange: "Apr 5 - May 30, 2025",
          category: 'Touring',
          description: "Country music tour across major North American venues with full production crew and merchandise coordination.",
          participants: [
            { id: '1', name: "Jake Morrison", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face", role: "Tour Manager" },
            { id: '2', name: "Alex Rivera", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face", role: "Guitar Tech" },
            { id: '3', name: "Sam Taylor", avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=40&h=40&fit=crop&crop=face", role: "Lighting Director" },
            { id: '4', name: "Casey Brooks", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face", role: "Merch Lead" }
          ],
          itinerary: [
            {
              date: "Apr 5, 2025",
              events: [
                { time: "12:00 PM", title: "Load-in & Setup", location: "Bridgestone Arena, Nashville", type: "technical" },
                { time: "5:00 PM", title: "Sound Check", location: "Main Stage", type: "technical" },
                { time: "8:00 PM", title: "Show Performance", location: "Bridgestone Arena", type: "performance" }
              ]
            },
            {
              date: "Apr 12, 2025",
              events: [
                { time: "8:00 AM", title: "Travel to NYC", location: "Nashville Airport", type: "transport" },
                { time: "2:00 PM", title: "Load-in", location: "Madison Square Garden", type: "technical" },
                { time: "8:00 PM", title: "Show Performance", location: "Madison Square Garden", type: "performance" }
              ]
            },
            {
              date: "Apr 20, 2025",
              events: [
                { time: "10:00 AM", title: "Travel to Colorado", location: "JFK Airport", type: "transport" },
                { time: "6:00 PM", title: "Outdoor Setup", location: "Red Rocks Amphitheatre", type: "technical" },
                { time: "8:30 PM", title: "Show Performance", location: "Red Rocks Amphitheatre", type: "performance" }
              ]
            }
          ],
          budget: {
            total: 2500000,
            spent: 1200000,
            categories: [
              { name: "Venue Costs", budgeted: 800000, spent: 400000 },
              { name: "Production", budgeted: 900000, spent: 450000 },
              { name: "Transportation", budgeted: 500000, spent: 250000 },
              { name: "Crew & Catering", budgeted: 300000, spent: 100000 }
            ]
          }
        };

      case '4': // LA Dodgers Playoffs
        return {
          id: '4',
          title: "Los Angeles Dodgers – Playoffs 2025",
          location: "Los Angeles & San Francisco",
          dateRange: "Oct 1 - Oct 15, 2025",
          category: 'Sports – Team Trip',
          description: "Professional baseball playoff series with team logistics, medical support, and media coordination across California venues.",
          participants: [
            { id: '1', name: "Dr. Martinez", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face", role: "Team Physio" },
            { id: '2', name: "Coach Thompson", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face", role: "Pitching Coach" },
            { id: '3', name: "Lisa Park", avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=40&h=40&fit=crop&crop=face", role: "Travel Coordinator" },
            { id: '4', name: "Mike Davis", avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=40&h=40&fit=crop&crop=face", role: "Equipment Manager" }
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
              date: "Oct 5, 2025",
              events: [
                { time: "8:00 AM", title: "Travel to San Francisco", location: "LAX", type: "transport" },
                { time: "2:00 PM", title: "Away Game Prep", location: "Oracle Park", type: "training" },
                { time: "7:30 PM", title: "Game 3 vs Giants", location: "Oracle Park", type: "game" }
              ]
            },
            {
              date: "Oct 8, 2025",
              events: [
                { time: "9:00 AM", title: "Return to LA", location: "SFO Airport", type: "transport" },
                { time: "4:00 PM", title: "Home Game Prep", location: "Dodger Stadium", type: "training" },
                { time: "8:00 PM", title: "Game 5 vs Giants", location: "Dodger Stadium", type: "game" }
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

      case '5': // Chainsmokers Vegas Residency
        return {
          id: '5',
          title: "Chainsmokers – Vegas Residency",
          location: "Las Vegas, NV",
          dateRange: "Jan 2025 - Mar 2025",
          category: 'Residency',
          description: "Electronic music residency at premier Las Vegas venue with recurring show production and VIP coordination.",
          participants: [
            { id: '1', name: "David Kim", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face", role: "Show Director" },
            { id: '2', name: "Maria Santos", avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=40&h=40&fit=crop&crop=face", role: "Pyro Tech" },
            { id: '3', name: "Ryan Mitchell", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face", role: "Stage Manager" },
            { id: '4', name: "Ashley Chen", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face", role: "VIP Coordinator" }
          ],
          itinerary: [
            {
              date: "Jan 3, 2025",
              events: [
                { time: "4:00 PM", title: "Setup & Rehearsal", location: "XS Nightclub, Wynn", type: "technical" },
                { time: "8:00 PM", title: "VIP Reception", location: "Private Lounge", type: "event" },
                { time: "11:00 PM", title: "Residency Show #1", location: "Main Floor", type: "performance" }
              ]
            },
            {
              date: "Feb 7, 2025",
              events: [
                { time: "3:00 PM", title: "Technical Check", location: "XS Nightclub, Wynn", type: "technical" },
                { time: "7:00 PM", title: "Meet & Greet", location: "VIP Area", type: "event" },
                { time: "11:30 PM", title: "Residency Show #2", location: "Main Floor", type: "performance" }
              ]
            },
            {
              date: "Mar 7, 2025",
              events: [
                { time: "2:00 PM", title: "Final Setup", location: "XS Nightclub, Wynn", type: "technical" },
                { time: "6:00 PM", title: "Finale VIP Party", location: "Rooftop Terrace", type: "event" },
                { time: "11:00 PM", title: "Final Residency Show", location: "Main Floor", type: "performance" }
              ]
            }
          ],
          budget: {
            total: 1500000,
            spent: 750000,
            categories: [
              { name: "Venue & Production", budgeted: 800000, spent: 400000 },
              { name: "Pyrotechnics", budgeted: 300000, spent: 150000 },
              { name: "VIP Services", budgeted: 250000, spent: 125000 },
              { name: "Marketing", budgeted: 150000, spent: 75000 }
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
          description: "Financial conference with speaker coordination, venue management, and networking events at Georgia's premier conference facility.",
          participants: [
            { id: '1', name: "Robert Johnson", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face", role: "Keynote Speaker" },
            { id: '2', name: "Jennifer Lee", avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=40&h=40&fit=crop&crop=face", role: "AV Lead" },
            { id: '3', name: "Michael Torres", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face", role: "Vendor Coordinator" },
            { id: '4', name: "Sarah Williams", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face", role: "Registration Manager" }
          ],
          itinerary: [
            {
              date: "Sep 8, 2025",
              events: [
                { time: "8:00 AM", title: "Speaker Briefing", location: "Georgia World Congress Center - Hall A", type: "meeting" },
                { time: "10:00 AM", title: "Opening Keynote", location: "Main Auditorium", type: "presentation" },
                { time: "2:00 PM", title: "Panel: Future of Investing", location: "Conference Room B", type: "panel" },
                { time: "6:00 PM", title: "Networking Reception", location: "Exhibit Hall", type: "networking" }
              ]
            },
            {
              date: "Sep 9, 2025",
              events: [
                { time: "9:00 AM", title: "Workshop: Portfolio Management", location: "Conference Room C", type: "workshop" },
                { time: "1:00 PM", title: "Lunch & Learn Session", location: "Ballroom", type: "presentation" },
                { time: "4:00 PM", title: "Panel: Market Trends", location: "Conference Room A", type: "panel" }
              ]
            },
            {
              date: "Sep 10, 2025",
              events: [
                { time: "9:00 AM", title: "Final Presentations", location: "Main Auditorium", type: "presentation" },
                { time: "12:00 PM", title: "Closing Remarks", location: "Main Auditorium", type: "ceremony" },
                { time: "1:00 PM", title: "Conference Wrap-up", location: "Exhibit Hall", type: "networking" }
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

      case '7': // Content House Retreat
        return {
          id: '7',
          title: "Content House – Creative Retreat",
          location: "Malibu, CA",
          dateRange: "Aug 15 - Aug 22, 2025",
          category: 'Business Travel',
          description: "Creative retreat for content creators with brand collaboration planning, filming coordination, and team building activities.",
          participants: [
            { id: '1', name: "Alex Rivera", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face", role: "Creative Director" },
            { id: '2', name: "Emma Johnson", avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=40&h=40&fit=crop&crop=face", role: "Brand Manager" },
            { id: '3', name: "Tyler Brooks", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face", role: "Video Editor" },
            { id: '4', name: "Sophia Chen", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face", role: "Social Media Lead" }
          ],
          itinerary: [
            {
              date: "Aug 15, 2025",
              events: [
                { time: "11:00 AM", title: "House Check-in", location: "Malibu Beach House", type: "accommodation" },
                { time: "2:00 PM", title: "Creative Brainstorm", location: "Main Lounge", type: "meeting" },
                { time: "6:00 PM", title: "Welcome Dinner", location: "Oceanview Deck", type: "meal" }
              ]
            },
            {
              date: "Aug 18, 2025",
              events: [
                { time: "9:00 AM", title: "Brand Collab Filming", location: "Beach Location", type: "filming" },
                { time: "1:00 PM", title: "Content Review", location: "Edit Suite", type: "meeting" },
                { time: "7:00 PM", title: "Team Building Activity", location: "Pool Area", type: "activity" }
              ]
            }
          ],
          budget: {
            total: 75000,
            spent: 35000,
            categories: [
              { name: "Accommodation", budgeted: 35000, spent: 20000 },
              { name: "Catering", budgeted: 20000, spent: 8000 },
              { name: "Equipment Rental", budgeted: 15000, spent: 5000 },
              { name: "Activities", budgeted: 5000, spent: 2000 }
            ]
          }
        };

      case '8': // Esports Championship
        return {
          id: '8',
          title: "Esports Team Lawrence Spring Championship",
          location: "Arlington, TX",
          dateRange: "May 10 - May 15, 2025",
          category: 'Tournament',
          description: "Professional esports tournament with team coordination, equipment management, and broadcast logistics at premier gaming venue.",
          participants: [
            { id: '1', name: "Coach Martinez", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face", role: "Head Coach" },
            { id: '2', name: "Danny Kim", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face", role: "Analyst" },
            { id: '3', name: "Jordan Taylor", avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=40&h=40&fit=crop&crop=face", role: "Team Captain" },
            { id: '4', name: "Alex Wong", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face", role: "Equipment Manager" }
          ],
          itinerary: [
            {
              date: "May 10, 2025",
              events: [
                { time: "9:00 AM", title: "Team Registration", location: "Esports Stadium Arlington", type: "registration" },
                { time: "12:00 PM", title: "Group Stage Match 1", location: "Main Stage", type: "match" },
                { time: "4:00 PM", title: "Group Stage Match 2", location: "Stage B", type: "match" }
              ]
            },
            {
              date: "May 12, 2025",
              events: [
                { time: "10:00 AM", title: "Equipment Check", location: "Practice Area", type: "technical" },
                { time: "2:00 PM", title: "Quarterfinals", location: "Main Stage", type: "match" },
                { time: "6:00 PM", title: "Strategy Review", location: "Team Room", type: "meeting" }
              ]
            },
            {
              date: "May 15, 2025",
              events: [
                { time: "1:00 PM", title: "Championship Finals", location: "Main Stage", type: "match" },
                { time: "5:00 PM", title: "Awards Ceremony", location: "Main Stage", type: "ceremony" }
              ]
            }
          ],
          budget: {
            total: 50000,
            spent: 28000,
            categories: [
              { name: "Registration & Fees", budgeted: 15000, spent: 15000 },
              { name: "Equipment", budgeted: 20000, spent: 8000 },
              { name: "Travel & Lodging", budgeted: 10000, spent: 4000 },
              { name: "Team Support", budgeted: 5000, spent: 1000 }
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
  const labels = getLabels(tripData.category);

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
              <h2 className="text-xl font-semibold text-white">{labels.team}</h2>
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
              <h2 className="text-xl font-semibold text-white">{labels.schedule}</h2>
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
