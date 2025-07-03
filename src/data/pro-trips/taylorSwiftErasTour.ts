import { ProTripData } from '../../types/pro';

export const taylorSwiftErasTour: ProTripData = {
  id: 'taylor-swift-eras-tour',
  title: 'Taylor Swift Eras Tour - International Leg',
  description: 'International leg of Taylor Swift Eras Tour covering major stadiums across Europe and Asia.',
  location: 'London, Paris, Tokyo, Sydney',
  dateRange: 'Mar 1 - Apr 30, 2025',
  category: 'Entertainment',
  proTripCategory: 'Music & Entertainment Tours',
  tags: ['Music Tour', 'Concert', 'International'],
  participants: [
    { id: 4, name: 'Taylor Swift', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=40&h=40&fit=crop&crop=face', role: 'Artists' },
    { id: 5, name: 'Tour Director', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face', role: 'Tour Manager' },
    { id: 6, name: 'Production Manager', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face', role: 'Production Crew' },
    { id: 7, name: 'Security Chief', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face', role: 'Security' },
    { id: 8, name: 'Sound Engineer', avatar: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=40&h=40&fit=crop&crop=face', role: 'Production Crew' }
  ],
  budget: {
    total: 25000000,
    spent: 8500000,
    categories: [
      { name: 'Production', budgeted: 15000000, spent: 5000000 },
      { name: 'Travel & Logistics', budgeted: 5000000, spent: 1800000 },
      { name: 'Accommodation', budgeted: 3000000, spent: 1200000 },
      { name: 'Marketing', budgeted: 2000000, spent: 500000 }
    ]
  },
  itinerary: [
    {
      date: '2025-03-01',
      events: [
        { time: '10:00', title: 'Load-in Begins', location: 'Wembley Stadium', type: 'meeting' },
        { time: '14:00', title: 'Sound Check', location: 'Wembley Stadium Main Stage', type: 'meeting' },
        { time: '17:00', title: 'Final Rehearsal', location: 'Wembley Stadium', type: 'meeting' },
        { time: '20:00', title: 'Show Time', location: 'Wembley Stadium', type: 'meeting' }
      ]
    }
  ],
  roster: [
    {
      id: '4',
      name: 'Taylor Swift',
      email: 'taylor@taylorswift.com',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=40&h=40&fit=crop&crop=face',
      role: 'Artists',
      credentialLevel: 'AllAccess',
      permissions: ['all-areas', 'artist-privileges'],
      roomPreferences: ['presidential-suite', 'top-floor', 'extra-security'],
      dietaryRestrictions: ['no-dairy']
    },
    {
      id: '5',
      name: 'Tour Director',
      email: 'director@tourmanagement.com',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face',
      role: 'Tour Manager',
      credentialLevel: 'AllAccess',
      permissions: ['all-areas', 'tour-management'],
      roomPreferences: ['executive-suite', 'near-artist'],
      dietaryRestrictions: []
    },
    {
      id: '6',
      name: 'Production Manager',
      email: 'production@tourteam.com',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face',
      role: 'Production Crew',
      credentialLevel: 'Backstage',
      permissions: ['production-areas', 'equipment-access'],
      roomPreferences: ['standard-suite'],
      dietaryRestrictions: ['vegetarian']
    },
    {
      id: '7',
      name: 'Security Chief',
      email: 'security@tourteam.com',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face',
      role: 'Security',
      credentialLevel: 'AllAccess',
      permissions: ['security-protocols', 'emergency-access'],
      roomPreferences: ['standard-room', 'security-floor']
    },
    {
      id: '8',
      name: 'Sound Engineer',
      email: 'sound@tourteam.com',
      avatar: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=40&h=40&fit=crop&crop=face',
      role: 'Production Crew',
      credentialLevel: 'Backstage',
      permissions: ['audio-equipment', 'stage-access'],
      roomPreferences: ['crew-housing']
    }
  ],
  roomAssignments: [
    {
      id: 'room-ts1',
      room: 'Presidential Suite',
      hotel: 'The Langham London',
      occupants: ['4'],
      checkIn: '2025-02-28T14:00:00Z',
      checkOut: '2025-03-03T12:00:00Z',
      roomType: 'suite',
      specialRequests: ['extra-security', 'private-entrance', 'soundproofing']
    }
  ],
  equipment: [
    {
      id: 'eq-ts1',
      name: 'Main Sound System',
      category: 'audio',
      quantity: 1,
      location: 'Production Truck #1',
      status: 'in-transit',
      assignedTo: '8',
      notes: 'L-Acoustics K2 line array system',
      trackingNumber: 'TR-2025-001'
    },
    {
      id: 'eq-ts2',
      name: 'Stage Lighting Rig',
      category: 'lighting',
      quantity: 1,
      location: 'Production Truck #2',
      status: 'in-transit',
      assignedTo: '6',
      notes: 'Complete LED lighting system with moving heads'
    }
  ],
  schedule: [
    {
      id: 'sched-ts1',
      type: 'load-in',
      title: 'Equipment Load-in',
      startTime: '2025-03-01T08:00:00Z',
      endTime: '2025-03-01T12:00:00Z',
      location: 'Wembley Stadium Loading Dock',
      participants: ['6', '8'],
      priority: 'critical',
      notes: 'All production equipment must be in place before sound check'
    }
  ],
  perDiem: {
    dailyRate: 200,
    currency: 'USD',
    startDate: '2025-03-01',
    endDate: '2025-04-30',
    participants: [
      { participantId: '4', customRate: 0, advances: 0, deductions: 0, balance: 0 },
      { participantId: '5', customRate: 300, advances: 0, deductions: 0, balance: 18300 },
      { participantId: '6', customRate: 250, advances: 0, deductions: 0, balance: 15250 }
    ]
  },
  settlement: [
    {
      venue: 'Wembley Stadium',
      date: '2025-03-01',
      guarantee: 8000000,
      backendPercentage: 85,
      grossRevenue: 12000000,
      expenses: 2500000,
      netRevenue: 9500000,
      merchandiseRevenue: 1500000,
      finalPayout: 11000000,
      status: 'calculated'
    }
  ],
  medical: [],
  compliance: [
    {
      id: 'comp-ts1',
      type: 'visa',
      title: 'International Tour Visas',
      description: 'All crew must have valid work visas for UK, France, Japan, and Australia',
      deadline: '2025-02-15',
      status: 'compliant',
      assignedTo: '5',
      documents: ['visa-checklist.pdf', 'work-permits.pdf']
    }
  ],
  media: [
    {
      id: 'media-ts1',
      type: 'interview',
      outlet: 'BBC Radio 1',
      contactPerson: 'Greg James',
      scheduledTime: '2025-03-02T10:00:00Z',
      duration: 45,
      location: 'BBC Broadcasting House',
      participants: ['4'],
      status: 'confirmed'
    }
  ],
  sponsors: [
    {
      id: 'sponsor-ts1',
      sponsor: 'Apple Music',
      activation: 'Exclusive streaming rights',
      deadline: '2025-03-01',
      assignedTo: '5',
      status: 'in-progress',
      deliverables: ['exclusive-content', 'behind-scenes-footage'],
      notes: 'Multi-platform content creation and distribution'
    }
  ]
};
