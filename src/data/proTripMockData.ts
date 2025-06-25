
export interface ProTripData {
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

export const proTripMockData: Record<string, ProTripData> = {
  '1': {
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
  },
  '2': {
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
  },
  '3': {
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
  },
  '4': {
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
  },
  '5': {
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
  },
  '6': {
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
  },
  '7': {
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
  },
  '8': {
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
  }
};
