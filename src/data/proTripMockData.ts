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
  }
};
