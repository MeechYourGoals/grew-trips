
import { ProTripData } from '../../types/pro';

export const lakersRoadTrip: ProTripData = {
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
};
