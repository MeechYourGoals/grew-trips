import { ProTripData } from '../types/pro';

export const proTripMockData: Record<string, ProTripData> = {
  'nba-eastern-road-2025': {
    id: 'nba-eastern-road-2025',
    title: 'Lakers Eastern Conference Road Trip',
    description: 'Five-game road trip through Eastern Conference cities with full team and medical staff',
    location: 'Multi-City (NYC, Boston, Miami, Atlanta, Philadelphia)',
    dateRange: 'Feb 10 - Feb 20, 2025',
    category: 'Professional Sports',
    tags: ['NBA', 'Sports', 'Road Trip', 'Team Travel', 'Professional'],
    participants: [
      { id: 1, name: 'Coach Mike Johnson', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face', role: 'Head Coach' },
      { id: 2, name: 'Dr. Sarah Williams', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=40&h=40&fit=crop&crop=face', role: 'Team Physician' },
      { id: 3, name: 'Marcus Thompson', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face', role: 'Equipment Manager' },
      { id: 4, name: 'Lisa Chen', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face', role: 'Team Coordinator' }
    ],
    budget: {
      total: 450000,
      spent: 280000,
      categories: [
        { name: 'Transportation', budgeted: 150000, spent: 95000 },
        { name: 'Accommodation', budgeted: 120000, spent: 85000 },
        { name: 'Meals & Per Diem', budgeted: 80000, spent: 50000 },
        { name: 'Equipment Transport', budgeted: 60000, spent: 35000 },
        { name: 'Medical & Insurance', budgeted: 40000, spent: 15000 }
      ]
    },
    itinerary: [
      {
        date: '2025-02-10',
        events: [
          { time: '08:00', title: 'Team Departure - LAX', location: 'Los Angeles Airport', type: 'travel' },
          { time: '17:00', title: 'Arrival - JFK Airport', location: 'New York', type: 'travel' },
          { time: '19:00', title: 'Team Dinner', location: 'Manhattan Hotel', type: 'meal' }
        ]
      },
      {
        date: '2025-02-11',
        events: [
          { time: '10:00', title: 'Morning Shootaround', location: 'Madison Square Garden', type: 'practice' },
          { time: '13:00', title: 'Team Lunch', location: 'Team Hotel', type: 'meal' },
          { time: '19:30', title: 'Game vs NY Knicks', location: 'Madison Square Garden', type: 'game' }
        ]
      }
    ],
    // Enhanced Pro features
    roster: [
      {
        id: 'player-1',
        name: 'LeBron James',
        email: 'lebron@lakers.com',
        avatar: 'https://images.unsplash.com/photo-1506629905877-92d64671772d?w=40&h=40&fit=crop&crop=face',
        role: 'Player',
        credentialLevel: 'AllAccess',
        permissions: ['court-access', 'media-interviews', 'vip-areas'],
        roomPreferences: ['suite', 'high-floor'],
        dietaryRestrictions: ['gluten-free'],
        medicalNotes: 'Previous ankle injury - monitor workload'
      },
      {
        id: 'coach-1',
        name: 'Coach Mike Johnson',
        email: 'coach@lakers.com',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face',
        role: 'Coach',
        credentialLevel: 'AllAccess',
        permissions: ['court-access', 'media-interviews', 'team-areas', 'admin-access']
      },
      {
        id: 'medical-1',
        name: 'Dr. Sarah Williams',
        email: 'doctor@lakers.com',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=40&h=40&fit=crop&crop=face',
        role: 'Medical',
        credentialLevel: 'AllAccess',
        permissions: ['medical-access', 'court-access', 'confidential-areas']
      }
    ],
    roomAssignments: [
      {
        id: 'room-1',
        room: 'Presidential Suite 2501',
        hotel: 'The Plaza New York',
        occupants: ['player-1'],
        checkIn: '2025-02-10T15:00:00Z',
        checkOut: '2025-02-12T11:00:00Z',
        roomType: 'suite',
        specialRequests: ['Extra security', 'Private gym access', 'Dietary catering']
      },
      {
        id: 'room-2',
        room: 'Executive Floor 2401-2403',
        hotel: 'The Plaza New York',
        occupants: ['coach-1', 'medical-1'],
        checkIn: '2025-02-10T15:00:00Z',
        checkOut: '2025-02-12T11:00:00Z',
        roomType: 'connecting'
      }
    ],
    equipment: [
      {
        id: 'eq-1',
        name: 'Practice Basketballs (24 units)',
        category: 'sports',
        quantity: 24,
        location: 'Madison Square Garden',
        status: 'delivered',
        assignedTo: 'Marcus Thompson',
        trackingNumber: 'NBA2025-001'
      },
      {
        id: 'eq-2',
        name: 'Medical Equipment Case',
        category: 'general',
        quantity: 1,
        location: 'Team Hotel',
        status: 'delivered',
        assignedTo: 'Dr. Sarah Williams',
        notes: 'Contains emergency medical supplies and treatment equipment'
      },
      {
        id: 'eq-3',
        name: 'Team Uniforms & Gear',
        category: 'sports',
        quantity: 50,
        location: 'Madison Square Garden',
        status: 'setup',
        assignedTo: 'Equipment Staff'
      }
    ],
    schedule: [
      {
        id: 'sched-1',
        type: 'load-in',
        title: 'Equipment Load-in',
        startTime: '2025-02-11T08:00:00Z',
        endTime: '2025-02-11T09:00:00Z',
        location: 'Madison Square Garden - Loading Dock',
        participants: ['eq-staff-1', 'eq-staff-2'],
        priority: 'high'
      }
    ],
    perDiem: {
      dailyRate: 150,
      currency: 'USD',
      startDate: '2025-02-10',
      endDate: '2025-02-20',
      participants: [
        { participantId: 'player-1', customRate: 300, advances: 500, deductions: 0, balance: 2500 }
      ]
    },
    settlement: [
      {
        venue: 'Madison Square Garden',
        date: '2025-02-11',
        guarantee: 2500000,
        backendPercentage: 0,
        grossRevenue: 0,
        expenses: 125000,
        netRevenue: 0,
        merchandiseRevenue: 85000,
        finalPayout: 2500000,
        status: 'pending'
      }
    ],
    medical: [
      {
        id: 'med-1',
        participantId: 'player-1',
        date: '2025-02-08',
        type: 'checkup',
        description: 'Pre-trip physical examination and ankle assessment',
        severity: 'minor',
        status: 'monitoring',
        treatedBy: 'Dr. Sarah Williams',
        followUpDate: '2025-02-15',
        restricted: false
      }
    ],
    compliance: [
      {
        id: 'comp-1',
        type: 'insurance',
        title: 'Team Travel Insurance',
        description: 'Comprehensive coverage for all team members during road trip',
        deadline: '2025-02-09',
        status: 'compliant',
        assignedTo: 'Lisa Chen',
        documents: ['insurance-policy-2025.pdf', 'coverage-details.pdf']
      }
    ],
    media: [
      {
        id: 'media-1',
        type: 'interview',
        outlet: 'ESPN',
        contactPerson: 'John Smith',
        scheduledTime: '2025-02-11T16:00:00Z',
        duration: 30,
        location: 'Madison Square Garden - Media Room',
        participants: ['coach-1'],
        status: 'confirmed'
      }
    ],
    sponsors: [
      {
        id: 'sponsor-1',
        sponsor: 'Nike',
        activation: 'Postgame Player Interviews in Nike Gear',
        deadline: '2025-02-11T22:00:00Z',
        assignedTo: 'Media Coordinator',
        status: 'pending',
        deliverables: ['Player interviews', 'Social media posts', 'Photo opportunities']
      }
    ]
  },
  'taylor-swift-eras-2025': {
    id: 'taylor-swift-eras-2025',
    title: 'Taylor Swift - The Eras Tour 2025',
    description: 'International leg of the record-breaking Eras Tour with full production and crew',
    location: 'Multi-City (Tokyo, Sydney, London, Paris, Toronto)',
    dateRange: 'Apr 15 - Aug 20, 2025',
    category: 'Concert Tour',
    tags: ['Taylor Swift', 'Eras Tour', 'Concert', 'Music', 'International'],
    participants: [
      { id: 5, name: 'Robert Allen', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face', role: 'Tour Manager' },
      { id: 6, name: 'Emily Davis', avatar: 'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=40&h=40&fit=crop&crop=face', role: 'Production Lead' },
      { id: 7, name: 'Kevin Lee', avatar: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=40&h=40&fit=crop&crop=face', role: 'Security Director' },
      { id: 8, name: 'Megan White', avatar: 'https://images.unsplash.com/photo-1506634572416-48cdfe530110?w=40&h=40&fit=crop&crop=face', role: 'Medical Coordinator' }
    ],
    budget: {
      total: 12000000,
      spent: 7500000,
      categories: [
        { name: 'Venue Rental', budgeted: 4000000, spent: 2500000 },
        { name: 'Transportation', budgeted: 3000000, spent: 1800000 },
        { name: 'Accommodation', budgeted: 2500000, spent: 1500000 },
        { name: 'Production', budgeted: 1500000, spent: 900000 },
        { name: 'Security', budgeted: 1000000, spent: 800000 }
      ]
    },
    itinerary: [
      {
        date: '2025-04-15',
        events: [
          { time: '09:00', title: 'Load-In - Tokyo Dome', location: 'Tokyo, Japan', type: 'setup' },
          { time: '19:00', title: 'Concert - Tokyo Dome', location: 'Tokyo, Japan', type: 'show' }
        ]
      },
      {
        date: '2025-04-16',
        events: [
          { time: '19:00', title: 'Concert - Tokyo Dome', location: 'Tokyo, Japan', type: 'show' }
        ]
      }
    ],
    // Enhanced Pro features
    roster: [
      {
        id: 'taylor-1',
        name: 'Taylor Swift',
        email: 'taylor@tswift.com',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face',
        role: 'Talent',
        credentialLevel: 'AllAccess',
        permissions: ['stage-access', 'vip-areas', 'media-control'],
        roomPreferences: ['penthouse', 'ocean-view'],
        dietaryRestrictions: ['organic-only'],
        medicalNotes: 'Vocal strain - monitor daily'
      },
      {
        id: 'manager-1',
        name: 'Robert Allen',
        email: 'manager@tswift.com',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face',
        role: 'TourManager',
        credentialLevel: 'AllAccess',
        permissions: ['all-areas', 'financial-control', 'contract-approval']
      },
      {
        id: 'security-1',
        name: 'Kevin Lee',
        email: 'security@tswift.com',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=40&h=40&fit=crop&crop=face',
        role: 'Security',
        credentialLevel: 'Backstage',
        permissions: ['stage-security', 'vip-security', 'perimeter-control']
      }
    ],
    roomAssignments: [
      {
        id: 'room-3',
        room: 'Presidential Suite 5001',
        hotel: 'Park Hyatt Tokyo',
        occupants: ['taylor-1'],
        checkIn: '2025-04-14T15:00:00Z',
        checkOut: '2025-04-17T11:00:00Z',
        roomType: 'suite',
        specialRequests: ['Blackout curtains', 'Humidifier', 'Aromatherapy diffuser']
      },
      {
        id: 'room-4',
        room: 'Executive Suites 4901-4905',
        hotel: 'Park Hyatt Tokyo',
        occupants: ['manager-1', 'security-1'],
        checkIn: '2025-04-14T15:00:00Z',
        checkOut: '2025-04-17T11:00:00Z',
        roomType: 'connecting'
      }
    ],
    equipment: [
      {
        id: 'eq-4',
        name: 'Main Stage Rigging',
        category: 'lighting',
        quantity: 1,
        location: 'Tokyo Dome',
        status: 'setup',
        assignedTo: 'Emily Davis',
        trackingNumber: 'TS2025-001'
      },
      {
        id: 'eq-5',
        name: 'Backup Vocal Microphones',
        category: 'audio',
        quantity: 4,
        location: 'Stage Left',
        status: 'setup',
        assignedTo: 'Audio Engineer',
        notes: 'Shure SM58 - tested and ready'
      },
      {
        id: 'eq-6',
        name: 'Wardrobe Trunks',
        category: 'general',
        quantity: 12,
        location: 'Backstage Wardrobe',
        status: 'delivered',
        assignedTo: 'Wardrobe Staff'
      }
    ],
    schedule: [
      {
        id: 'sched-2',
        type: 'sound-check',
        title: 'Full Band Sound Check',
        startTime: '2025-04-15T14:00:00Z',
        endTime: '2025-04-15T16:00:00Z',
        location: 'Tokyo Dome - Main Stage',
        participants: ['taylor-1', 'band-1', 'audio-engineer'],
        priority: 'critical'
      }
    ],
    perDiem: {
      dailyRate: 200,
      currency: 'USD',
      startDate: '2025-04-14',
      endDate: '2025-04-17',
      participants: [
        { participantId: 'taylor-1', customRate: 500, advances: 1000, deductions: 0, balance: 4000 }
      ]
    },
    settlement: [
      {
        venue: 'Tokyo Dome',
        date: '2025-04-15',
        guarantee: 5000000,
        backendPercentage: 0.6,
        grossRevenue: 8000000,
        expenses: 1500000,
        netRevenue: 6500000,
        merchandiseRevenue: 1200000,
        finalPayout: 5400000,
        status: 'calculated'
      }
    ],
    medical: [
      {
        id: 'med-2',
        participantId: 'taylor-1',
        date: '2025-04-14',
        type: 'checkup',
        description: 'Pre-show vocal assessment and throat spray',
        severity: 'minor',
        status: 'active',
        treatedBy: 'Dr. Emily Carter',
        followUpDate: '2025-04-15',
        restricted: false
      }
    ],
    compliance: [
      {
        id: 'comp-2',
        type: 'visa',
        title: 'Japanese Work Visa',
        description: 'Valid work visa for all non-Japanese crew members',
        deadline: '2025-04-01',
        status: 'compliant',
        assignedTo: 'Visa Coordinator',
        documents: ['visa-list.pdf', 'passport-copies.zip']
      }
    ],
    media: [
      {
        id: 'media-2',
        type: 'press-conference',
        outlet: 'Associated Press',
        contactPerson: 'Samantha Young',
        scheduledTime: '2025-04-15T11:00:00Z',
        duration: 60,
        location: 'Park Hyatt Tokyo - Ballroom',
        participants: ['taylor-1', 'manager-1'],
        status: 'confirmed'
      }
    ],
    sponsors: [
      {
        id: 'sponsor-2',
        sponsor: 'Coca-Cola',
        activation: 'Branded Refreshment Stations',
        deadline: '2025-04-15T18:00:00Z',
        assignedTo: 'Marketing Team',
        status: 'completed',
        deliverables: ['Station setup', 'Product placement', 'Social media mentions']
      }
    ]
  },
  'influencer-retreat-2025': {
    id: 'influencer-retreat-2025',
    title: 'Luxury Influencer Retreat - Maldives',
    description: 'Exclusive retreat for top-tier social media influencers with curated activities and brand partnerships',
    location: 'Maldives - Private Island Resort',
    dateRange: 'Jun 5 - Jun 12, 2025',
    category: 'Influencer Marketing',
    tags: ['Influencer', 'Retreat', 'Luxury', 'Travel', 'Social Media'],
    participants: [
      { id: 9, name: 'Sophia Rodriguez', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=40&h=40&fit=crop&crop=face', role: 'Event Planner' },
      { id: 10, name: 'Daniel Kim', avatar: 'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=40&h=40&fit=crop&crop=face', role: 'Brand Liaison' },
      { id: 11, name: 'Olivia Chen', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=40&h=40&fit=crop&crop=face', role: 'Photographer' },
      { id: 12, name: 'Ethan Brown', avatar: 'https://images.unsplash.com/photo-1506634572416-48cdfe530110?w=40&h=40&fit=crop&crop=face', role: 'Videographer' }
    ],
    budget: {
      total: 600000,
      spent: 420000,
      categories: [
        { name: 'Accommodation', budgeted: 200000, spent: 150000 },
        { name: 'Travel', budgeted: 150000, spent: 100000 },
        { name: 'Activities', budgeted: 100000, spent: 80000 },
        { name: 'Gifts & Swag', budgeted: 80000, spent: 50000 },
        { name: 'Contingency', budgeted: 70000, spent: 40000 }
      ]
    },
    itinerary: [
      {
        date: '2025-06-05',
        events: [
          { time: '14:00', title: 'Arrival - Malé International Airport', location: 'Maldives', type: 'travel' },
          { time: '16:00', title: 'Seaplane Transfer to Private Island', location: 'Maldives', type: 'travel' },
          { time: '19:00', title: 'Welcome Dinner', location: 'Beachfront Restaurant', type: 'meal' }
        ]
      },
      {
        date: '2025-06-06',
        events: [
          { time: '09:00', title: 'Yoga Session', location: 'Beachfront Deck', type: 'activity' },
          { time: '14:00', title: 'Snorkeling Excursion', location: 'Coral Reef', type: 'activity' },
          { time: '19:00', title: 'Sunset Cocktail Party', location: 'Rooftop Bar', type: 'social' }
        ]
      }
    ],
    // Enhanced Pro features
    roster: [
      {
        id: 'influencer-1',
        name: 'Alex Johnson',
        email: 'alex@travelgram.com',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face',
        role: 'VIP',
        credentialLevel: 'AllAccess',
        permissions: ['all-activities', 'sponsored-posts', 'exclusive-access'],
        roomPreferences: ['overwater-bungalow', 'private-pool'],
        dietaryRestrictions: ['vegetarian'],
        medicalNotes: 'Allergic to shellfish'
      },
      {
        id: 'planner-1',
        name: 'Sophia Rodriguez',
        email: 'sophia@events.com',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face',
        role: 'TourManager',
        credentialLevel: 'AllAccess',
        permissions: ['all-areas', 'budget-control', 'vendor-management']
      },
      {
        id: 'photographer-1',
        name: 'Olivia Chen',
        email: 'olivia@photos.com',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=40&h=40&fit=crop&crop=face',
        role: 'Crew',
        credentialLevel: 'Backstage',
        permissions: ['photo-shoots', 'editing-access', 'media-releases']
      }
    ],
    roomAssignments: [
      {
        id: 'room-5',
        room: 'Overwater Bungalow 101',
        hotel: 'Four Seasons Landaa Giraavaru',
        occupants: ['influencer-1'],
        checkIn: '2025-06-05T15:00:00Z',
        checkOut: '2025-06-12T11:00:00Z',
        roomType: 'suite',
        specialRequests: ['Private butler', 'Sunset views', 'Floating breakfast']
      },
      {
        id: 'room-6',
        room: 'Beach Villa 201-202',
        hotel: 'Four Seasons Landaa Giraavaru',
        occupants: ['planner-1', 'photographer-1'],
        checkIn: '2025-06-05T15:00:00Z',
        checkOut: '2025-06-12T11:00:00Z',
        roomType: 'double'
      }
    ],
    equipment: [
      {
        id: 'eq-7',
        name: 'Professional Camera Kit',
        category: 'video',
        quantity: 1,
        location: 'Olivia Chen\'s Villa',
        status: 'setup',
        assignedTo: 'Olivia Chen',
        trackingNumber: 'PHOTO2025-001'
      },
      {
        id: 'eq-8',
        name: 'Drone with 4K Camera',
        category: 'video',
        quantity: 1,
        location: 'Daniel Kim\'s Villa',
        status: 'setup',
        assignedTo: 'Ethan Brown',
        notes: 'Spare batteries and charging station included'
      },
      {
        id: 'eq-9',
        name: 'Swag Bags',
        category: 'general',
        quantity: 20,
        location: 'Event Storage',
        status: 'delivered',
        assignedTo: 'Event Staff'
      }
    ],
    schedule: [
      {
        id: 'sched-3',
        type: 'photo-shoot',
        title: 'Underwater Photo Shoot',
        startTime: '2025-06-07T09:00:00Z',
        endTime: '2025-06-07T12:00:00Z',
        location: 'Coral Reef',
        participants: ['influencer-1', 'photographer-1', 'videographer-1'],
        priority: 'high'
      }
    ],
    perDiem: {
      dailyRate: 300,
      currency: 'USD',
      startDate: '2025-06-05',
      endDate: '2025-06-12',
      participants: [
        { participantId: 'influencer-1', customRate: 500, advances: 1500, deductions: 0, balance: 5000 }
      ]
    },
    settlement: [
      {
        venue: 'Four Seasons Landaa Giraavaru',
        date: '2025-06-12',
        guarantee: 400000,
        backendPercentage: 0,
        grossRevenue: 0,
        expenses: 100000,
        netRevenue: 0,
        merchandiseRevenue: 0,
        finalPayout: 400000,
        status: 'pending'
      }
    ],
    medical: [
      {
        id: 'med-3',
        participantId: 'influencer-1',
        date: '2025-06-06',
        type: 'allergy',
        description: 'Shellfish allergy - EpiPen provided',
        severity: 'moderate',
        status: 'active',
        treatedBy: 'Dr. Online Consult',
        followUpDate: '2025-06-07',
        restricted: true
      }
    ],
    compliance: [
      {
        id: 'comp-3',
        type: 'insurance',
        title: 'Travel Insurance',
        description: 'Comprehensive travel insurance for all participants',
        deadline: '2025-06-01',
        status: 'compliant',
        assignedTo: 'Sophia Rodriguez',
        documents: ['travel-insurance.pdf', 'policy-details.pdf']
      }
    ],
    media: [
      {
        id: 'media-3',
        type: 'photo-shoot',
        outlet: 'Instagram',
        contactPerson: 'Alex Johnson',
        scheduledTime: '2025-06-07T10:00:00Z',
        duration: 120,
        location: 'Coral Reef',
        participants: ['influencer-1', 'photographer-1'],
        status: 'confirmed'
      }
    ],
    sponsors: [
      {
        id: 'sponsor-3',
        sponsor: 'Luxury Watches Inc.',
        activation: 'Product Placement in Photos',
        deadline: '2025-06-07T12:00:00Z',
        assignedTo: 'Daniel Kim',
        status: 'completed',
        deliverables: ['Product placement', 'Social media posts', 'Brand mentions']
      }
    ]
  }
};
