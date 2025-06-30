import { ProTripData, ProParticipant, RoomAssignment, Equipment, ProSchedule, PerDiemData, SettlementData, MedicalLog, ComplianceRule, MediaSlot, SponsorActivation } from '../types/pro';

export const proTripMockData: Record<string, ProTripData> = {
  'lakers-road-trip': {
    id: 'lakers-road-trip',
    title: 'Lakers Championship Road Trip',
    description: 'Multi-city professional basketball team travel coordination for the Los Angeles Lakers championship series.',
    location: 'Los Angeles → Phoenix → Denver',
    dateRange: 'Feb 15 - Feb 25, 2025',
    category: 'Sports – Team Trip',
    tags: ['Sports', 'Professional', 'Championship', 'Multi-City'],
    participants: [
      { id: 1, name: 'LeBron James', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face', role: 'Player' },
      { id: 2, name: 'Anthony Davis', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face', role: 'Player' },
      { id: 3, name: 'Coach Thompson', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face', role: 'Coach' },
      { id: 4, name: 'Team Manager', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=40&h=40&fit=crop&crop=face', role: 'TourManager' }
    ],
    budget: {
      total: 850000,
      spent: 425000,
      categories: [
        { name: 'Travel', budgeted: 300000, spent: 150000 },
        { name: 'Accommodation', budgeted: 250000, spent: 125000 },
        { name: 'Meals', budgeted: 150000, spent: 75000 },
        { name: 'Equipment', budgeted: 100000, spent: 50000 },
        { name: 'Medical', budgeted: 50000, spent: 25000 }
      ]
    },
    itinerary: [
      {
        date: '2025-02-15',
        events: [
          { time: '08:00', title: 'Team Breakfast', location: 'Hotel Restaurant', type: 'meeting' },
          { time: '10:00', title: 'Travel to Phoenix', location: 'LAX Airport', type: 'travel' },
          { time: '15:00', title: 'Arena Walk-through', location: 'Phoenix Suns Arena', type: 'meeting' },
          { time: '18:00', title: 'Team Dinner', location: 'Hotel Restaurant', type: 'meeting' }
        ]
      }
    ],
    roster: [
      {
        id: '1',
        name: 'LeBron James',
        email: 'lebron@lakers.com',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face',
        role: 'Player',
        credentialLevel: 'AllAccess',
        permissions: ['field-access', 'locker-room', 'media-area'],
        roomPreferences: ['suite', 'high-floor'],
        dietaryRestrictions: ['gluten-free'],
        medicalNotes: 'Ankle monitoring required'
      },
      {
        id: '2',
        name: 'Anthony Davis',
        email: 'ad@lakers.com',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face',
        role: 'Player',
        credentialLevel: 'AllAccess',
        permissions: ['field-access', 'locker-room', 'media-area'],
        roomPreferences: ['suite', 'quiet-floor'],
        dietaryRestrictions: ['dairy-free']
      },
      {
        id: '3',
        name: 'Coach Thompson',
        email: 'coach@lakers.com',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face',
        role: 'Coach',
        credentialLevel: 'AllAccess',
        permissions: ['field-access', 'locker-room', 'media-area', 'admin-access'],
        roomPreferences: ['single', 'near-elevator']
      }
    ],
    roomAssignments: [
      {
        id: 'room-1',
        room: 'Presidential Suite 2401',
        hotel: 'Phoenix Grand Hotel',
        occupants: ['1'],
        checkIn: '2025-02-15T15:00:00Z',
        checkOut: '2025-02-17T11:00:00Z',
        roomType: 'suite',
        specialRequests: ['late-checkout', 'extra-towels']
      }
    ],
    equipment: [
      {
        id: 'eq-1',
        name: 'Practice Basketballs (24)',
        category: 'sports',
        quantity: 24,
        location: 'Equipment Truck #1',
        status: 'packed',
        assignedTo: '3',
        notes: 'Official game balls'
      }
    ],
    schedule: [
      {
        id: 'sched-1',
        type: 'load-in',
        title: 'Equipment Load-In',
        startTime: '2025-02-15T14:00:00Z',
        endTime: '2025-02-15T16:00:00Z',
        location: 'Phoenix Suns Arena - Loading Dock',
        participants: ['3'],
        priority: 'high',
        notes: 'Coordinate with arena staff'
      }
    ],
    perDiem: {
      dailyRate: 150,
      currency: 'USD',
      startDate: '2025-02-15',
      endDate: '2025-02-25',
      participants: [
        { participantId: '1', customRate: 200, advances: 0, deductions: 0, balance: 2000 },
        { participantId: '2', customRate: 200, advances: 0, deductions: 0, balance: 2000 }
      ]
    },
    settlement: [
      {
        venue: 'Phoenix Suns Arena',
        date: '2025-02-16',
        guarantee: 500000,
        backendPercentage: 85,
        grossRevenue: 750000,
        expenses: 50000,
        netRevenue: 700000,
        merchandiseRevenue: 25000,
        finalPayout: 620000,
        status: 'pending'
      }
    ],
    medical: [
      {
        id: 'med-1',
        participantId: '1',
        date: '2025-02-14',
        type: 'checkup',
        description: 'Pre-trip ankle evaluation',
        severity: 'minor',
        status: 'monitoring',
        treatedBy: 'Dr. Smith',
        followUpDate: '2025-02-20',
        restricted: false
      }
    ],
    compliance: [
      {
        id: 'comp-1',
        type: 'union',
        title: 'NBA Player Travel Requirements',
        description: 'All players must comply with NBA travel guidelines',
        deadline: '2025-02-15',
        status: 'compliant',
        assignedTo: '3',
        documents: ['nba-travel-guidelines.pdf']
      }
    ],
    media: [
      {
        id: 'media-1',
        type: 'interview',
        outlet: 'ESPN',
        contactPerson: 'Sarah Johnson',
        scheduledTime: '2025-02-16T10:00:00Z',
        duration: 30,
        location: 'Phoenix Suns Arena - Media Room',
        participants: ['1'],
        status: 'scheduled'
      }
    ],
    sponsors: [
      {
        id: 'sponsor-1',
        sponsor: 'Nike',
        activation: 'Post-game shoe showcase',
        deadline: '2025-02-16',
        assignedTo: '1',
        status: 'pending',
        deliverables: ['photo-session', 'social-media-post'],
        notes: 'New signature shoe launch'
      }
    ]
  },
  'taylor-swift-eras-tour': {
    id: 'taylor-swift-eras-tour',
    title: 'Taylor Swift Eras Tour 2025',
    description: 'Multi-stadium international tour coordination for Taylor Swift\'s record-breaking Eras Tour continuation.',
    location: 'London → Paris → Madrid → Rome',
    dateRange: 'Jun 1 - Jun 30, 2025',
    category: 'Touring',
    tags: ['Music', 'International', 'Stadium', 'Multi-City'],
    participants: [
      { id: 5, name: 'Taylor Swift', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=40&h=40&fit=crop&crop=face', role: 'Talent' },
      { id: 6, name: 'Tour Manager', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face', role: 'TourManager' },
      { id: 7, name: 'Production Manager', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face', role: 'Producer' },
      { id: 8, name: 'Security Chief', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face', role: 'Security' }
    ],
    budget: {
      total: 5000000,
      spent: 2500000,
      categories: [
        { name: 'Production', budgeted: 2000000, spent: 1000000 },
        { name: 'Travel', budgeted: 1000000, spent: 500000 },
        { name: 'Accommodation', budgeted: 800000, spent: 400000 },
        { name: 'Crew', budgeted: 700000, spent: 350000 },
        { name: 'Security', budgeted: 500000, spent: 250000 }
      ]
    },
    itinerary: [
      {
        date: '2025-06-01',
        events: [
          { time: '06:00', title: 'Load-In Begins', location: 'Wembley Stadium', type: 'load-in' },
          { time: '10:00', title: 'Sound Check', location: 'Wembley Stadium', type: 'sound-check' },
          { time: '14:00', title: 'Rehearsal', location: 'Wembley Stadium', type: 'rehearsal' },
          { time: '19:30', title: 'Show Time', location: 'Wembley Stadium', type: 'show' }
        ]
      }
    ],
    roster: [
      {
        id: '5',
        name: 'Taylor Swift',
        email: 'taylor@13management.com',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=40&h=40&fit=crop&crop=face',
        role: 'Talent',
        credentialLevel: 'AllAccess',
        permissions: ['all-areas', 'vip-access', 'backstage', 'stage-access'],
        roomPreferences: ['presidential-suite', 'top-floor', 'piano-access'],
        dietaryRestrictions: ['vegetarian', 'no-nuts']
      },
      {
        id: '6',
        name: 'Andrea Swift',
        email: 'andrea@13management.com',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face',
        role: 'TourManager',
        credentialLevel: 'AllAccess',
        permissions: ['all-areas', 'admin-access', 'financial-access'],
        roomPreferences: ['suite', 'near-artist']
      }
    ],
    roomAssignments: [
      {
        id: 'room-ts1',
        room: 'Royal Suite Penthouse',
        hotel: 'The Langham London',
        occupants: ['5'],
        checkIn: '2025-05-31T14:00:00Z',
        checkOut: '2025-06-03T12:00:00Z',
        roomType: 'suite',
        specialRequests: ['piano', 'late-checkout', 'extra-security', 'privacy-floor']
      }
    ],
    equipment: [
      {
        id: 'eq-ts1',
        name: 'Main PA System',
        category: 'audio',
        quantity: 1,
        location: 'Audio Truck #1',
        status: 'in-transit',
        assignedTo: '7',
        trackingNumber: 'ERAS2025-AUDIO-001',
        notes: 'Custom touring rig'
      }
    ],
    schedule: [
      {
        id: 'sched-ts1',
        type: 'load-in',
        title: 'Production Load-In',
        startTime: '2025-06-01T06:00:00Z',
        endTime: '2025-06-01T12:00:00Z',
        location: 'Wembley Stadium - Loading Bay',
        participants: ['6', '7'],
        priority: 'critical',
        notes: 'Multiple truck coordination required'
      }
    ],
    perDiem: {
      dailyRate: 200,
      currency: 'USD',
      startDate: '2025-06-01',
      endDate: '2025-06-30',
      participants: [
        { participantId: '5', customRate: 500, advances: 0, deductions: 0, balance: 15000 },
        { participantId: '6', customRate: 300, advances: 0, deductions: 0, balance: 9000 }
      ]
    },
    settlement: [
      {
        venue: 'Wembley Stadium',
        date: '2025-06-01',
        guarantee: 2000000,
        backendPercentage: 90,
        grossRevenue: 4500000,
        expenses: 300000,
        netRevenue: 4200000,
        merchandiseRevenue: 500000,
        finalPayout: 4280000,
        status: 'calculated'
      }
    ],
    medical: [],
    compliance: [
      {
        id: 'comp-ts1',
        type: 'visa',
        title: 'UK Work Permit Compliance',
        description: 'All crew members must have valid UK work permits',
        deadline: '2025-05-25',
        status: 'compliant',
        assignedTo: '6',
        documents: ['uk-work-permits.pdf']
      }
    ],
    media: [
      {
        id: 'media-ts1',
        type: 'interview',
        outlet: 'BBC Radio 1',
        contactPerson: 'Annie Mac',
        scheduledTime: '2025-06-02T14:00:00Z',
        duration: 45,
        location: 'BBC Broadcasting House',
        participants: ['5'],
        status: 'confirmed'
      }
    ],
    sponsors: [
      {
        id: 'sponsor-ts1',
        sponsor: 'Apple Music',
        activation: 'Exclusive behind-the-scenes content',
        deadline: '2025-06-05',
        assignedTo: '5',
        status: 'in-progress',
        deliverables: ['video-content', 'playlist-curation'],
        notes: 'Documentary crew access required'
      }
    ]
  },
  'eli-lilly-c-suite-retreat-2026': {
    id: 'eli-lilly-c-suite-retreat-2026',
    title: 'Eli Lilly C-Suite Retreat 2026',
    description: 'Executive strategic planning retreat at Terranea Resort for senior leadership team.',
    location: 'Terranea Resort, Rancho Palos Verdes CA',
    dateRange: 'Jan 15 - Jan 18, 2026',
    category: 'Business Travel',
    tags: ['Business Travel', 'Executive', 'Strategy'],
    participants: [
      { id: 9, name: 'David Ricks', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face', role: 'CEO' },
      { id: 10, name: 'Anat Ashkenazi', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=40&h=40&fit=crop&crop=face', role: 'CFO' },
      { id: 11, name: 'Strategic Planner', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face', role: 'TourManager' }
    ],
    budget: {
      total: 75000,
      spent: 25000,
      categories: [
        { name: 'Accommodation', budgeted: 35000, spent: 15000 },
        { name: 'Meals', budgeted: 20000, spent: 7000 },
        { name: 'Transportation', budgeted: 15000, spent: 3000 },
        { name: 'Meeting Facilities', budgeted: 5000, spent: 0 }
      ]
    },
    itinerary: [
      {
        date: '2026-01-15',
        events: [
          { time: '09:00', title: 'Welcome Breakfast', location: 'Terranea Resort - Ocean View Room', type: 'meeting' },
          { time: '10:30', title: '2026 Strategic Planning Session', location: 'Executive Boardroom', type: 'meeting' },
          { time: '14:00', title: 'Working Lunch', location: 'Private Dining Room', type: 'meeting' },
          { time: '19:00', title: 'Executive Dinner', location: 'Catalina Kitchen', type: 'meeting' }
        ]
      }
    ],
    roster: [
      {
        id: '9',
        name: 'David Ricks',
        email: 'david.ricks@lilly.com',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face',
        role: 'Player',
        credentialLevel: 'AllAccess',
        permissions: ['all-areas', 'executive-access'],
        roomPreferences: ['ocean-view', 'executive-suite'],
        dietaryRestrictions: []
      },
      {
        id: '10',
        name: 'Anat Ashkenazi',
        email: 'anat.ashkenazi@lilly.com',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=40&h=40&fit=crop&crop=face',
        role: 'Player',
        credentialLevel: 'AllAccess',
        permissions: ['all-areas', 'executive-access'],
        roomPreferences: ['ocean-view', 'quiet-floor'],
        dietaryRestrictions: ['pescatarian']
      },
      {
        id: '11',
        name: 'Strategic Planner',
        email: 'strategy@lilly.com',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face',
        role: 'TourManager',
        credentialLevel: 'Backstage',
        permissions: ['planning-access', 'logistics-coordination'],
        roomPreferences: ['standard-room']
      }
    ],
    roomAssignments: [
      {
        id: 'room-el1',
        room: 'Presidential Suite',
        hotel: 'Terranea Resort',
        occupants: ['9'],
        checkIn: '2026-01-15T15:00:00Z',
        checkOut: '2026-01-18T11:00:00Z',
        roomType: 'suite',
        specialRequests: ['executive-amenities', 'late-checkout']
      }
    ],
    equipment: [],
    schedule: [
      {
        id: 'sched-el1',
        type: 'meeting',
        title: 'Strategic Planning Setup',
        startTime: '2026-01-15T08:00:00Z',
        endTime: '2026-01-15T09:00:00Z',
        location: 'Executive Boardroom',
        participants: ['11'],
        priority: 'medium',
        notes: 'Prepare materials and AV equipment'
      }
    ],
    perDiem: {
      dailyRate: 100,
      currency: 'USD',
      startDate: '2026-01-15',
      endDate: '2026-01-18',
      participants: [
        { participantId: '9', customRate: 0, advances: 0, deductions: 0, balance: 0 },
        { participantId: '10', customRate: 0, advances: 0, deductions: 0, balance: 0 }
      ]
    },
    settlement: [],
    medical: [],
    compliance: [
      {
        id: 'comp-el1',
        type: 'safety',
        title: 'Executive Travel Security',
        description: 'Enhanced security protocols for C-suite executives',
        deadline: '2026-01-14',
        status: 'compliant',
        assignedTo: '11',
        documents: ['security-protocols.pdf']
      }
    ],
    media: [],
    sponsors: []
  },
  'scarlet-knights-aau-volleyball-2025': {
    id: 'scarlet-knights-aau-volleyball-2025',
    title: 'Scarlet Knights AAU Volleyball Tourney',
    description: 'AAU volleyball tournament participation for Scarlet Knights team in Denver.',
    location: 'Denver CO',
    dateRange: 'Jun 15 - Jun 22, 2025',
    category: 'Sports – Team Trip',
    tags: ['Sports – Team Trip', 'Volleyball', 'Tournament'],
    participants: [
      { id: 12, name: 'Coach Sarah Martinez', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=40&h=40&fit=crop&crop=face', role: 'Coach' },
      { id: 13, name: 'Emma Rodriguez', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face', role: 'Player' },
      { id: 14, name: 'Mia Thompson', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face', role: 'Player' },
      { id: 15, name: 'Athletic Trainer', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face', role: 'Medical' }
    ],
    budget: {
      total: 25000,
      spent: 8000,
      categories: [
        { name: 'Travel', budgeted: 8000, spent: 3000 },
        { name: 'Accommodation', budgeted: 10000, spent: 4000 },
        { name: 'Meals', budgeted: 5000, spent: 1000 },
        { name: 'Tournament Fees', budgeted: 2000, spent: 0 }
      ]
    },
    itinerary: [
      {
        date: '2025-06-15',
        events: [
          { time: '08:00', title: 'Team Departure', location: 'New Brunswick NJ', type: 'travel' },
          { time: '12:00', title: 'Arrival Denver', location: 'Denver International Airport', type: 'travel' },
          { time: '15:00', title: 'Hotel Check-in', location: 'Hampton Inn Denver', type: 'meeting' },
          { time: '17:00', title: 'Team Meeting', location: 'Hotel Conference Room', type: 'meeting' }
        ]
      }
    ],
    roster: [
      {
        id: '12',
        name: 'Coach Sarah Martinez',
        email: 'sarah.martinez@scarletknights.org',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=40&h=40&fit=crop&crop=face',
        role: 'Coach',
        credentialLevel: 'AllAccess',
        permissions: ['team-management', 'medical-access'],
        roomPreferences: ['single-room', 'near-team'],
        dietaryRestrictions: []
      },
      {
        id: '13',
        name: 'Emma Rodriguez',
        email: 'emma.rodriguez@scarletknights.org',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face',
        role: 'Player',
        credentialLevel: 'Backstage',
        permissions: ['court-access', 'locker-room'],
        roomPreferences: ['shared-room'],
        dietaryRestrictions: ['gluten-free']
      },
      {
        id: '14',
        name: 'Mia Thompson',
        email: 'mia.thompson@scarletknights.org',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face',
        role: 'Player',
        credentialLevel: 'Backstage',
        permissions: ['court-access', 'locker-room'],
        roomPreferences: ['shared-room'],
        dietaryRestrictions: []
      },
      {
        id: '15',
        name: 'Athletic Trainer',
        email: 'trainer@scarletknights.org',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face',
        role: 'Medical',
        credentialLevel: 'AllAccess',
        permissions: ['medical-access', 'court-access'],
        roomPreferences: ['single-room']
      }
    ],
    roomAssignments: [
      {
        id: 'room-sk1',
        room: 'Room 201',
        hotel: 'Hampton Inn Denver',
        occupants: ['13', '14'],
        checkIn: '2025-06-15T15:00:00Z',
        checkOut: '2025-06-22T11:00:00Z',
        roomType: 'double',
        specialRequests: ['connecting-rooms']
      }
    ],
    equipment: [
      {
        id: 'eq-sk1',
        name: 'Team Volleyballs (12)',
        category: 'sports',
        quantity: 12,
        location: 'Equipment Bag',
        status: 'packed',
        assignedTo: '12',
        notes: 'Official tournament balls'
      }
    ],
    schedule: [
      {
        id: 'sched-sk1',
        type: 'meeting',
        title: 'Tournament Registration',
        startTime: '2025-06-16T08:00:00Z',
        endTime: '2025-06-16T09:00:00Z',
        location: 'Convention Center Registration',
        participants: ['12'],
        priority: 'high',
        notes: 'Bring all player documentation'
      }
    ],
    perDiem: {
      dailyRate: 50,
      currency: 'USD',
      startDate: '2025-06-15',
      endDate: '2025-06-22',
      participants: [
        { participantId: '13', customRate: 50, advances: 0, deductions: 0, balance: 350 },
        { participantId: '14', customRate: 50, advances: 0, deductions: 0, balance: 350 }
      ]
    },
    settlement: [],
    medical: [],
    compliance: [
      {
        id: 'comp-sk1',
        type: 'NCAA',
        title: 'AAU Eligibility Compliance',
        description: 'All players must maintain AAU eligibility status',
        deadline: '2025-06-14',
        status: 'compliant',
        assignedTo: '12',
        documents: ['aau-eligibility.pdf']
      }
    ],
    media: [],
    sponsors: []
  },
  'harris-elementary-dc-field-trip-2025': {
    id: 'harris-elementary-dc-field-trip-2025',
    title: 'Harris Elementary 8th-Grade DC Field Trip',
    description: 'Educational field trip to Washington DC for 8th grade students from Harris Elementary.',
    location: 'Washington DC',
    dateRange: 'Apr 10 - Apr 14, 2025',
    category: 'Education',
    tags: ['Education', 'Field Trip', 'Middle School'],
    participants: [
      { id: 16, name: 'Ms. Jennifer Wilson', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=40&h=40&fit=crop&crop=face', role: 'TourManager' },
      { id: 17, name: 'Mr. David Chen', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face', role: 'TourManager' },
      { id: 18, name: 'Student Group A', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face', role: 'VIP' },
      { id: 19, name: 'Student Group B', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face', role: 'VIP' }
    ],
    budget: {
      total: 15000,
      spent: 5000,
      categories: [
        { name: 'Transportation', budgeted: 8000, spent: 3000 },
        { name: 'Accommodation', budgeted: 4000, spent: 1500 },
        { name: 'Meals', budgeted: 2000, spent: 500 },
        { name: 'Activities', budgeted: 1000, spent: 0 }
      ]
    },
    itinerary: [
      {
        date: '2025-04-10',
        events: [
          { time: '06:00', title: 'School Departure', location: 'Harris Elementary', type: 'travel' },
          { time: '12:00', title: 'Arrival in Washington DC', location: 'Union Station', type: 'travel' },
          { time: '14:00', title: 'Capitol Building Tour', location: 'US Capitol', type: 'meeting' },
          { time: '18:00', title: 'Hotel Check-in', location: 'Embassy Suites DC', type: 'meeting' }
        ]
      }
    ],
    roster: [
      {
        id: '16',
        name: 'Ms. Jennifer Wilson',
        email: 'jwilson@harriselementary.edu',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=40&h=40&fit=crop&crop=face',
        role: 'TourManager',
        credentialLevel: 'AllAccess',
        permissions: ['student-supervision', 'emergency-contact'],
        roomPreferences: ['single-room', 'near-students'],
        dietaryRestrictions: []
      },
      {
        id: '17',
        name: 'Mr. David Chen',
        email: 'dchen@harriselementary.edu',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face',
        role: 'TourManager',
        credentialLevel: 'AllAccess',
        permissions: ['student-supervision', 'emergency-contact'],
        roomPreferences: ['single-room', 'near-students'],
        dietaryRestrictions: ['vegetarian']
      },
      {
        id: '18',
        name: 'Student Group A (13 students)',
        email: 'students@harriselementary.edu',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face',
        role: 'VIP',
        credentialLevel: 'Guest',
        permissions: ['supervised-access'],
        roomPreferences: ['quad-rooms'],
        dietaryRestrictions: ['various']
      },
      {
        id: '19',
        name: 'Student Group B (12 students)',
        email: 'students@harriselementary.edu',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face',
        role: 'VIP',
        credentialLevel: 'Guest',
        permissions: ['supervised-access'],
        roomPreferences: ['quad-rooms'],
        dietaryRestrictions: ['various']
      }
    ],
    roomAssignments: [
      {
        id: 'room-he1',
        room: 'Suite 401-404',
        hotel: 'Embassy Suites DC',
        occupants: ['16', '17', '18', '19'],
        checkIn: '2025-04-10T15:00:00Z',
        checkOut: '2025-04-14T10:00:00Z',
        roomType: 'connecting',
        specialRequests: ['student-supervision', 'extra-security']
      }
    ],
    equipment: [],
    schedule: [
      {
        id: 'sched-he1',
        type: 'meeting',
        title: 'Smithsonian Museum Visit',
        startTime: '2025-04-11T09:00:00Z',
        endTime: '2025-04-11T12:00:00Z',
        location: 'National Museum of Natural History',
        participants: ['16', '17', '18', '19'],
        priority: 'high',
        notes: 'Pre-arranged group tour'
      }
    ],
    perDiem: {
      dailyRate: 25,
      currency: 'USD',
      startDate: '2025-04-10',
      endDate: '2025-04-14',
      participants: [
        { participantId: '18', customRate: 25, advances: 0, deductions: 0, balance: 100 },
        { participantId: '19', customRate: 25, advances: 100, deductions: 0, balance: 0 }
      ]
    },
    settlement: [],
    medical: [],
    compliance: [
      {
        id: 'comp-he1',
        type: 'safety',
        title: 'Student Travel Authorization',
        description: 'All students must have signed permission slips and emergency contacts',
        deadline: '2025-04-08',
        status: 'compliant',
        assignedTo: '16',
        documents: ['permission-slips.pdf', 'emergency-contacts.pdf']
      }
    ],
    media: [],
    sponsors: []
  },
  'indiana-university-debate-championships-2025': {
    id: 'indiana-university-debate-championships-2025',
    title: 'Indiana University Debate Championships',
    description: 'National debate championship participation for Indiana University debate team in Austin.',
    location: 'Austin TX',
    dateRange: 'Mar 1 - Mar 6, 2025',
    category: 'Academic',
    tags: ['Academic', 'Debate', 'Championships'],
    participants: [
      { id: 20, name: 'Prof. Michael Davis', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face', role: 'Coach' },
      { id: 21, name: 'Alex Johnson', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=40&h=40&fit=crop&crop=face', role: 'Player' },
      { id: 22, name: 'Sarah Kim', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face', role: 'Player' },
      { id: 23, name: 'Faculty Advisor', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face', role: 'TourManager' }
    ],
    budget: {
      total: 8000,
      spent: 2500,
      categories: [
        { name: 'Travel', budgeted: 3000, spent: 1200 },
        { name: 'Accommodation', budgeted: 3000, spent: 1000 },
        { name: 'Meals', budgeted: 1500, spent: 300 },
        { name: 'Registration', budgeted: 500, spent: 0 }
      ]
    },
    itinerary: [
      {
        date: '2025-03-01',
        events: [
          { time: '08:00', title: 'Departure from Bloomington', location: 'Indiana University', type: 'travel' },
          { time: '14:00', title: 'Arrival in Austin', location: 'Austin-Bergstrom Airport', type: 'travel' },
          { time: '16:00', title: 'Championship Registration', location: 'UT Austin Student Union', type: 'meeting' },
          { time: '18:00', title: 'Team Strategy Meeting', location: 'Hotel Conference Room', type: 'meeting' }
        ]
      }
    ],
    roster: [
      {
        id: '20',
        name: 'Prof. Michael Davis',
        email: 'mdavis@indiana.edu',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face',
        role: 'Coach',
        credentialLevel: 'AllAccess',
        permissions: ['team-management', 'academic-access'],
        roomPreferences: ['single-room', 'quiet-floor'],
        dietaryRestrictions: []
      },
      {
        id: '21',
        name: 'Alex Johnson',
        email: 'ajohnson@iu.edu',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=40&h=40&fit=crop&crop=face',
        role: 'Player',
        credentialLevel: 'Backstage',
        permissions: ['competition-access'],
        roomPreferences: ['shared-room'],
        dietaryRestrictions: ['vegan']
      },
      {
        id: '22',
        name: 'Sarah Kim',
        email: 'skim@iu.edu',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face',
        role: 'Player',
        credentialLevel: 'Backstage',
        permissions: ['competition-access'],
        roomPreferences: ['shared-room'],
        dietaryRestrictions: []
      },
      {
        id: '23',
        name: 'Faculty Advisor',
        email: 'advisor@indiana.edu',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face',
        role: 'TourManager',
        credentialLevel: 'AllAccess',
        permissions: ['academic-supervision'],
        roomPreferences: ['single-room']
      }
    ],
    roomAssignments: [
      {
        id: 'room-iu1',
        room: 'Rooms 305-306',
        hotel: 'Hilton Austin',
        occupants: ['21', '22'],
        checkIn: '2025-03-01T15:00:00Z',
        checkOut: '2025-03-06T11:00:00Z',
        roomType: 'connecting',
        specialRequests: ['study-area', 'quiet-floor']
      }
    ],
    equipment: [],
    schedule: [
      {
        id: 'sched-iu1',
        type: 'meeting',
        title: 'Preliminary Rounds',
        startTime: '2025-03-02T09:00:00Z',
        endTime: '2025-03-02T17:00:00Z',
        location: 'UT Austin Debate Halls',
        participants: ['20', '21', '22', '23'],
        priority: 'critical',
        notes: 'Multiple debate rounds throughout the day'
      }
    ],
    perDiem: {
      dailyRate: 40,
      currency: 'USD',
      startDate: '2025-03-01',
      endDate: '2025-03-06',
      participants: [
        { participantId: '21', customRate: 40, advances: 0, deductions: 0, balance: 200 },
        { participantId: '22', customRate: 40, advances: 0, deductions: 0, balance: 200 }
      ]
    },
    settlement: [],
    medical: [],
    compliance: [
      {
        id: 'comp-iu1',
        type: 'NCAA',
        title: 'Academic Competition Compliance',
        description: 'Students must maintain academic standing for competition',
        deadline: '2025-02-28',
        status: 'compliant',
        assignedTo: '20',
        documents: ['academic-records.pdf']
      }
    ],
    media: [],
    sponsors: []
  },
  'y-combinator-winter-2025-cohort': {
    id: 'y-combinator-winter-2025-cohort',
    title: 'Y Combinator Winter 2025 Cohort',
    description: 'Participation in Y Combinator Winter 2025 accelerator program in San Francisco.',
    location: 'San Francisco CA',
    dateRange: 'Feb 1 - Mar 31, 2025',
    category: 'Startup',
    tags: ['Startup', 'Accelerator', 'Demo Day'],
    participants: [
      { id: 24, name: 'Jessica Chen', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=40&h=40&fit=crop&crop=face', role: 'TourManager' },
      { id: 25, name: 'Michael Torres', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face', role: 'Talent' },
      { id: 26, name: 'Lisa Park', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face', role: 'Talent' }
    ],
    budget: {
      total: 45000,
      spent: 15000,
      categories: [
        { name: 'Accommodation', budgeted: 25000, spent: 8000 },
        { name: 'Living Expenses', budgeted: 15000, spent: 5000 },
        { name: 'Transportation', budgeted: 3000, spent: 1500 },
        { name: 'Program Fees', budgeted: 2000, spent: 500 }
      ]
    },
    itinerary: [
      {
        date: '2025-02-01',
        events: [
          { time: '09:00', title: 'YC Orientation', location: 'Y Combinator HQ', type: 'meeting' },
          { time: '11:00', title: 'Founder Introductions', location: 'YC Auditorium', type: 'meeting' },
          { time: '14:00', title: 'First Partner Meeting', location: 'Conference Room A', type: 'meeting' },
          { time: '17:00', title: 'Cohort Mixer', location: 'YC Common Area', type: 'meeting' }
        ]
      }
    ],
    roster: [
      {
        id: '24',
        name: 'Jessica Chen',
        email: 'jessica@startup.com',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=40&h=40&fit=crop&crop=face',
        role: 'TourManager',
        credentialLevel: 'AllAccess',
        permissions: ['founder-access', 'yc-facilities'],
        roomPreferences: ['shared-housing', 'san-francisco'],
        dietaryRestrictions: ['vegetarian']
      },
      {
        id: '25',
        name: 'Michael Torres',
        email: 'michael@startup.com',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face',
        role: 'Talent',
        credentialLevel: 'AllAccess',
        permissions: ['founder-access', 'yc-facilities'],
        roomPreferences: ['shared-housing', 'san-francisco'],
        dietaryRestrictions: []
      },
      {
        id: '26',
        name: 'Lisa Park',
        email: 'lisa@startup.com',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face',
        role: 'Talent',
        credentialLevel: 'AllAccess',
        permissions: ['founder-access', 'yc-facilities'],
        roomPreferences: ['shared-housing', 'san-francisco'],
        dietaryRestrictions: ['gluten-free']
      }
    ],
    roomAssignments: [
      {
        id: 'room-yc1',
        room: '3BR Apartment',
        hotel: 'Mission District Housing',
        occupants: ['24', '25', '26'],
        checkIn: '2025-02-01T14:00:00Z',
        checkOut: '2025-03-31T12:00:00Z',
        roomType: 'suite',
        specialRequests: ['startup-workspace', 'high-speed-internet']
      }
    ],
    equipment: [
      {
        id: 'eq-yc1',
        name: 'Development Laptops (3)',
        category: 'general',
        quantity: 3,
        location: 'Apartment',
        status: 'setup',
        assignedTo: '24',
        notes: 'High-performance development machines'
      }
    ],
    schedule: [
      {
        id: 'sched-yc1',
        type: 'meeting',
        title: 'Demo Day Preparation',
        startTime: '2025-03-25T10:00:00Z',
        endTime: '2025-03-25T18:00:00Z',
        location: 'Y Combinator HQ',
        participants: ['24', '25', '26'],
        priority: 'critical',
        notes: 'Final pitch preparation and rehearsal'
      }
    ],
    perDiem: {
      dailyRate: 75,
      currency: 'USD',
      startDate: '2025-02-01',
      endDate: '2025-03-31',
      participants: [
        { participantId: '24', customRate: 75, advances: 0, deductions: 0, balance: 4425 },
        { participantId: '25', customRate: 75, advances: 0, deductions: 0, balance: 4425 },
        { participantId: '26', customRate: 75, advances: 0, deductions: 0, balance: 4425 }
      ]
    },
    settlement: [],
    medical: [],
    compliance: [
      {
        id: 'comp-yc1',
        type: 'safety',
        title: 'YC Program Compliance',
        description: 'Founders must attend required sessions and meet milestones',
        deadline: '2025-03-31',
        status: 'compliant',
        assignedTo: '24',
        documents: ['yc-requirements.pdf']
      }
    ],
    media: [
      {
        id: 'media-yc1',
        type: 'interview',
        outlet: 'TechCrunch',
        contactPerson: 'Sarah Perez',
        scheduledTime: '2025-03-28T14:00:00Z',
        duration: 30,
        location: 'YC Demo Day',
        participants: ['24', '25'],
        status: 'scheduled'
      }
    ],
    sponsors: []
  },
  'real-housewives-atl-s9-shoot-2025': {
    id: 'real-housewives-atl-s9-shoot-2025',
    title: 'Real Housewives ATL S9 Cast & Crew Shoot',
    description: 'Reality TV production shoot for Real Housewives of Atlanta Season 9 cast and crew.',
    location: 'Atlanta GA',
    dateRange: 'Aug 1 - Sep 30, 2025',
    category: 'TV Production',
    tags: ['TV Production', 'Reality Show', 'Cast & Crew'],
    participants: [
      { id: 27, name: 'Kenya Moore', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=40&h=40&fit=crop&crop=face', role: 'Talent' },
      { id: 28, name: 'Executive Producer', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face', role: 'Producer' },
      { id: 29, name: 'Camera Operator', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face', role: 'Crew' },
      { id: 30, name: 'Production Assistant', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face', role: 'Crew' }
    ],
    budget: {
      total: 2500000,
      spent: 850000,
      categories: [
        { name: 'Cast Fees', budgeted: 1500000, spent: 500000 },
        { name: 'Crew Salaries', budgeted: 600000, spent: 200000 },
        { name: 'Production Costs', budgeted: 300000, spent: 100000 },
        { name: 'Location Fees', budgeted: 100000, spent: 50000 }
      ]
    },
    itinerary: [
      {
        date: '2025-08-01',
        events: [
          { time: '08:00', title: 'Production Setup', location: 'Atlanta Studio', type: 'meeting' },
          { time: '10:00', title: 'Cast Interviews', location: 'Interview Room A', type: 'meeting' },
          { time: '14:00', title: 'Group Scene Filming', location: 'Restaurant Location', type: 'meeting' },
          { time: '18:00', title: 'Wrap and Review', location: 'Production Office', type: 'meeting' }
        ]
      }
    ],
    roster: [
      {
        id: '27',
        name: 'Kenya Moore',
        email: 'kenya@bravotv.com',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=40&h=40&fit=crop&crop=face',
        role: 'Talent',
        credentialLevel: 'AllAccess',
        permissions: ['cast-areas', 'media-access'],
        roomPreferences: ['luxury-suite', 'atlanta-downtown'],
        dietaryRestrictions: ['organic-only']
      },
      {
        id: '28',
        name: 'Executive Producer',
        email: 'producer@bravotv.com',
        avatar: 'https://images.unsplash.com/photo-147
