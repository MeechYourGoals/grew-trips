export interface ProTripData {
  id: string;
  title: string;
  location: string;
  dateRange: string;
  category: string;
  description: string;
  tags: string[];
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

export const proTripMockData: Record<string, ProTripData> = {
  '1': {
    id: '1',
    title: "Eli Lilly C-Suite Retreat 2026",
    location: "Terranea, CA",
    dateRange: "Jan 15 - Jan 18, 2026",
    category: 'Business Travel',
    description: "Executive leadership retreat for pharmaceutical company C-Suite with strategic planning sessions, team building, and board presentations at luxury coastal resort.",
    tags: ["executive", "strategy", "pharma", "leadership"],
    participants: [
      { id: '1', name: "CEO David Ricks", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face", role: "Chief Executive Officer" },
      { id: '2', name: "CFO Anat Ashkenazi", avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=40&h=40&fit=crop&crop=face", role: "Chief Financial Officer" },
      { id: '3', name: "Strategy Director", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face", role: "Strategic Planning Lead" },
      { id: '4', name: "Executive Assistant", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face", role: "Executive Support" }
    ],
    itinerary: [
      {
        date: "Jan 15, 2026",
        events: [
          { time: "2:00 PM", title: "Executive Check-in", location: "Terranea Resort", type: "accommodation" },
          { time: "4:00 PM", title: "Welcome Reception", location: "Ocean Terrace", type: "networking" },
          { time: "7:00 PM", title: "Private Dinner", location: "Private Dining Room", type: "meal" }
        ]
      },
      {
        date: "Jan 16, 2026",
        events: [
          { time: "8:00 AM", title: "Strategic Planning Session", location: "Boardroom", type: "meeting" },
          { time: "12:00 PM", title: "Working Lunch", location: "Executive Lounge", type: "meal" },
          { time: "2:00 PM", title: "Financial Review", location: "Conference Room A", type: "presentation" },
          { time: "6:00 PM", title: "Team Building Activity", location: "Golf Course", type: "activity" }
        ]
      },
      {
        date: "Jan 17, 2026",
        events: [
          { time: "9:00 AM", title: "Board Presentation Prep", location: "Business Center", type: "meeting" },
          { time: "1:00 PM", title: "Stakeholder Lunch", location: "Catalina Room", type: "meal" },
          { time: "3:00 PM", title: "Innovation Workshop", location: "Innovation Lab", type: "workshop" }
        ]
      }
    ],
    budget: {
      total: 150000,
      spent: 85000,
      categories: [
        { name: "Accommodation", budgeted: 60000, spent: 35000 },
        { name: "Catering", budgeted: 40000, spent: 25000 },
        { name: "Transportation", budgeted: 30000, spent: 15000 },
        { name: "Activities", budgeted: 20000, spent: 10000 }
      ]
    }
  },
  '2': {
    id: '2',
    title: "Scarlet Knights AAU Volleyball Tourney",
    location: "Multi-State Tournament",
    dateRange: "Jun 15 - Jun 22, 2025",
    category: 'Sports – Team Trip',
    description: "AAU volleyball tournament featuring multiple matches across premier athletic facilities with team coordination and family logistics.",
    tags: ["volleyball", "tournament", "aau", "sports"],
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
  },
  '3': {
    id: '3',
    title: "Morgan Wallen North America Tour",
    location: "Multi-City Tour",
    dateRange: "Apr 5 - May 30, 2025",
    category: 'Touring',
    description: "Country music tour across major North American venues with full production crew and merchandise coordination.",
    tags: ["music", "tour", "country", "concerts"],
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
  },
  '4': {
    id: '4',
    title: "Los Angeles Dodgers – Playoffs 2025",
    location: "Los Angeles & San Francisco",
    dateRange: "Oct 1 - Oct 15, 2025",
    category: 'Sports – Team Trip',
    description: "Professional baseball playoff series with team logistics, medical support, and media coordination across California venues.",
    tags: ["baseball", "playoffs", "mlb", "dodgers"],
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
  },
  '5': {
    id: '5',
    title: "Chainsmokers – Vegas Residency",
    location: "Las Vegas, NV",
    dateRange: "Jan 2025 - Mar 2025",
    category: 'Residency',
    description: "Electronic music residency at premier Las Vegas venue with recurring show production and VIP coordination.",
    tags: ["edm", "residency", "vegas", "nightclub"],
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
  },
  '6': {
    id: '6',
    title: "Davos in Switzerland",
    location: "Davos, Switzerland",
    dateRange: "Jan 20 - Jan 24, 2025",
    category: 'Conference',
    description: "World Economic Forum with global leaders, business executives, and policy makers discussing economic and social issues at premier Alpine conference facility.",
    tags: ["wef", "economics", "conference", "davos"],
    participants: [
      { id: '1', name: "Klaus Schwab", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face", role: "Forum Founder & Executive Chairman" },
      { id: '2', name: "Jennifer Morgan", avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=40&h=40&fit=crop&crop=face", role: "Forum Director" },
      { id: '3', name: "Protocol Manager", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face", role: "Protocol & Logistics" },
      { id: '4', name: "Security Coordinator", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face", role: "Security Lead" }
    ],
    itinerary: [
      {
        date: "Jan 20, 2025",
        events: [
          { time: "8:00 AM", title: "Executive Briefing", location: "Davos Congress Centre", type: "meeting" },
          { time: "10:00 AM", title: "Opening Ceremony", location: "Main Auditorium", type: "ceremony" },
          { time: "2:00 PM", title: "Global Economic Outlook", location: "Plenary Hall", type: "presentation" },
          { time: "6:00 PM", title: "Welcome Reception", location: "Mountain View Terrace", type: "networking" }
        ]
      },
      {
        date: "Jan 22, 2025",
        events: [
          { time: "9:00 AM", title: "Technology & Innovation Panel", location: "Conference Room A", type: "panel" },
          { time: "1:00 PM", title: "Leaders Lunch", location: "Private Dining Room", type: "meal" },
          { time: "4:00 PM", title: "Climate Action Summit", location: "Main Hall", type: "presentation" }
        ]
      },
      {
        date: "Jan 24, 2025",
        events: [
          { time: "9:00 AM", title: "Closing Presentations", location: "Main Auditorium", type: "presentation" },
          { time: "12:00 PM", title: "Final Statements", location: "Press Center", type: "ceremony" },
          { time: "2:00 PM", title: "Departure Logistics", location: "Transport Hub", type: "transport" }
        ]
      }
    ],
    budget: {
      total: 800000,
      spent: 450000,
      categories: [
        { name: "Venue & Facilities", budgeted: 350000, spent: 200000 },
        { name: "Security & Protocol", budgeted: 200000, spent: 120000 },
        { name: "Catering & Hospitality", budgeted: 150000, spent: 80000 },
        { name: "Technology & AV", budgeted: 100000, spent: 50000 }
      ]
    }
  },
  '7': {
    id: '7',
    title: "TikTok Creators Accelerator Conference",
    location: "Los Angeles, CA",
    dateRange: "Sep 12 - Sep 15, 2025",
    category: 'Conference',
    description: "TikTok's official creator conference featuring top content creators, brand partnerships, and platform innovation workshops at cutting-edge LA venue.",
    tags: ["tiktok", "creators", "social media", "conference"],
    participants: [
      { id: '1', name: "Shou Zi Chew", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face", role: "TikTok CEO" },
      { id: '2', name: "Creator Program Manager", avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=40&h=40&fit=crop&crop=face", role: "Program Lead" },
      { id: '3', name: "Brand Partnership Lead", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face", role: "Partnerships" },
      { id: '4', name: "Content Strategy Director", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face", role: "Strategy" }
    ],
    itinerary: [
      {
        date: "Sep 12, 2025",
        events: [
          { time: "9:00 AM", title: "Creator Check-in", location: "YouTube Space LA", type: "registration" },
          { time: "11:00 AM", title: "Platform Updates Keynote", location: "Main Stage", type: "presentation" },
          { time: "2:00 PM", title: "Content Creation Workshop", location: "Studio A", type: "workshop" },
          { time: "6:00 PM", title: "Creator Mixer", location: "Rooftop Lounge", type: "networking" }
        ]
      },
      {
        date: "Sep 13, 2025",
        events: [
          { time: "10:00 AM", title: "Monetization Strategies", location: "Conference Room B", type: "presentation" },
          { time: "1:00 PM", title: "Brand Collaboration Lunch", location: "Partnership Pavilion", type: "meal" },
          { time: "4:00 PM", title: "Viral Content Lab", location: "Creation Studio", type: "workshop" }
        ]
      },
      {
        date: "Sep 15, 2025",
        events: [
          { time: "10:00 AM", title: "Future of Social Media", location: "Innovation Theater", type: "panel" },
          { time: "1:00 PM", title: "Closing Ceremony", location: "Main Stage", type: "ceremony" },
          { time: "3:00 PM", title: "Creator Showcase", location: "Gallery Space", type: "showcase" }
        ]
      }
    ],
    budget: {
      total: 400000,
      spent: 240000,
      categories: [
        { name: "Venue & Production", budgeted: 180000, spent: 110000 },
        { name: "Creator Fees", budgeted: 120000, spent: 80000 },
        { name: "Catering & Events", budgeted: 70000, spent: 35000 },
        { name: "Marketing & Swag", budgeted: 30000, spent: 15000 }
      ]
    }
  },
  '8': {
    id: '8',
    title: "Esports Team Lawrence Spring Championship",
    location: "Arlington, TX",
    dateRange: "May 10 - May 15, 2025",
    category: 'Tournament',
    description: "Professional esports tournament with team coordination, equipment management, and broadcast logistics at premier gaming venue.",
    tags: ["esports", "gaming", "tournament", "competition"],
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
  },
  '9': {
    id: '9',
    title: "YCombinator Winter 2025 Cohort",
    location: "San Francisco, CA",
    dateRange: "Jan 2025 - Mar 2025",
    category: 'Business Travel',
    description: "Startup accelerator program for Winter 2025 cohort with weekly sessions, mentor meetings, and Demo Day preparation in Silicon Valley.",
    tags: ["startup", "accelerator", "silicon valley", "venture capital"],
    participants: [
      { id: '1', name: "Paul Graham", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face", role: "YC Co-founder" },
      { id: '2', name: "Jessica Livingston", avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=40&h=40&fit=crop&crop=face", role: "YC Partner" },
      { id: '3', name: "Startup Founder #1", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face", role: "Founder" },
      { id: '4', name: "Tech Mentor", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face", role: "Mentor" }
    ],
    itinerary: [
      {
        date: "Jan 8, 2025",
        events: [
          { time: "9:00 AM", title: "Cohort Kickoff", location: "YC Office, Mountain View", type: "meeting" },
          { time: "11:00 AM", title: "Founder Introductions", location: "Main Conference Room", type: "networking" },
          { time: "2:00 PM", title: "YC Workshop: Fundraising", location: "Workshop Room A", type: "workshop" },
          { time: "5:00 PM", title: "Welcome Dinner", location: "Tech Cafeteria", type: "meal" }
        ]
      },
      {
        date: "Feb 12, 2025",
        events: [
          { time: "10:00 AM", title: "Investor Office Hours", location: "Partner Offices", type: "meeting" },
          { time: "1:00 PM", title: "Pitch Practice Session", location: "Demo Room", type: "workshop" },
          { time: "3:00 PM", title: "1-on-1 Mentor Meetings", location: "Meeting Rooms", type: "meeting" }
        ]
      },
      {
        date: "Mar 25, 2025",
        events: [
          { time: "2:00 PM", title: "Demo Day Rehearsal", location: "Presentation Theater", type: "workshop" },
          { time: "6:00 PM", title: "Demo Day Presentations", location: "Main Auditorium", type: "presentation" },
          { time: "8:00 PM", title: "Investor Reception", location: "Networking Hall", type: "networking" }
        ]
      }
    ],
    budget: {
      total: 100000,
      spent: 45000,
      categories: [
        { name: "Program Operations", budgeted: 40000, spent: 20000 },
        { name: "Mentor Fees", budgeted: 30000, spent: 15000 },
        { name: "Demo Day Event", budgeted: 20000, spent: 8000 },
        { name: "Founder Support", budgeted: 10000, spent: 2000 }
      ]
    }
  },
  '10': {
    id: '10',
    title: "Cast and Crew Wrap Party",
    location: "Auckland, New Zealand",
    dateRange: "Mar 22 - Mar 26, 2025",
    category: 'Business Travel',
    description: "Film production wrap celebration with cast, crew, and production team featuring location tours, celebration events, and team appreciation activities.",
    tags: ["film", "production", "wrap party", "entertainment"],
    participants: [
      { id: '1', name: "Director Sam Hughes", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face", role: "Film Director" },
      { id: '2', name: "Emma Watson", avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=40&h=40&fit=crop&crop=face", role: "Lead Actor" },
      { id: '3', name: "Jake Anderson", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face", role: "Co-star" },
      { id: '4', name: "Producer Lisa Chen", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=40&h=40&fit=crop&crop=face", role: "Executive Producer" },
      { id: '5', name: "Chris Thompson", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face", role: "Director of Photography" },
      { id: '6', name: "Stunt Coordinator", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face", role: "Stunt Coordinator" }
    ],
    itinerary: [
      {
        date: "Mar 22, 2025",
        events: [
          { time: "10:00 AM", title: "Airport Arrival", location: "Auckland International Airport", type: "transport" },
          { time: "2:00 PM", title: "Hotel Check-in", location: "SkyCity Grand Auckland", type: "accommodation" },
          { time: "6:00 PM", title: "Welcome Reception", location: "Hotel Rooftop Bar", type: "networking" },
          { time: "8:00 PM", title: "Cast Dinner", location: "Harbourside Restaurant", type: "meal" }
        ]
      },
      {
        date: "Mar 24, 2025",
        events: [
          { time: "9:00 AM", title: "Location Tour", location: "Film Set Locations", type: "activity" },
          { time: "1:00 PM", title: "Crew Appreciation Lunch", location: "Vineyard Restaurant", type: "meal" },
          { time: "7:00 PM", title: "Wrap Party Celebration", location: "Auckland Event Center", type: "celebration" }
        ]
      },
      {
        date: "Mar 26, 2025",
        events: [
          { time: "10:00 AM", title: "Final Breakfast", location: "Hotel Restaurant", type: "meal" },
          { time: "12:00 PM", title: "Farewell Ceremony", location: "Hotel Conference Room", type: "ceremony" },
          { time: "3:00 PM", title: "Departure Transport", location: "Auckland Airport", type: "transport" }
        ]
      }
    ],
    budget: {
      total: 180000,
      spent: 95000,
      categories: [
        { name: "Accommodation", budgeted: 70000, spent: 40000 },
        { name: "Catering & Events", budgeted: 60000, spent: 30000 },
        { name: "Transportation", budgeted: 30000, spent: 15000 },
        { name: "Activities & Tours", budgeted: 20000, spent: 10000 }
      ]
    }
  }
};
