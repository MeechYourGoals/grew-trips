import { ProTripData } from '../../types/pro-features';

export const lakersRoadTrip: ProTripData = {
  id: 'lakers-road-trip',
  title: 'Lakers Road Trip - Western Conference',
  description: 'Los Angeles Lakers road trip covering 5 games across the Western Conference.',
  location: 'Phoenix AZ, Denver CO, Portland OR',
  dateRange: 'Jan 20 - Feb 3, 2025',
  category: 'Sports',
  proTripCategory: 'Sports & Athletics',
  tags: ['Sports', 'Basketball', 'Road Trip'],
  participants: [
    { id: 1, name: 'Anthony Davis', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face', role: 'Player' },
    { id: 2, name: 'Coach Johnson', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=40&h=40&fit=crop&crop=face', role: 'Coach' },
    { id: 3, name: 'Team Manager', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face', role: 'Team Manager' }
  ],
  budget: {
    total: 150000,
    spent: 45000,
    categories: [
      { name: 'Travel', budgeted: 60000, spent: 20000 },
      { name: 'Accommodation', budgeted: 50000, spent: 15000 },
      { name: 'Meals', budgeted: 30000, spent: 8000 },
      { name: 'Equipment', budgeted: 10000, spent: 2000 }
    ]
  },
  itinerary: [
    {
      date: '2025-01-20',
      events: [
        { time: '08:00', title: 'Team Departure', location: 'LAX Airport', type: 'travel' },
        { time: '12:00', title: 'Arrival in Phoenix', location: 'Phoenix Sky Harbor', type: 'travel' },
        { time: '16:00', title: 'Team Practice', location: 'Footprint Center', type: 'meeting' },
        { time: '19:00', title: 'Game vs Suns', location: 'Footprint Center', type: 'meeting' }
      ]
    }
  ],
  roster: [
    {
      id: '1',
      name: 'Anthony Davis',
      email: 'ad@lakers.com',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face',
      role: 'Player',
      credentialLevel: 'AllAccess',
      permissions: ['locker-room', 'team-areas'],
      roomPreferences: ['suite', 'high-floor'],
      dietaryRestrictions: []
    },
    {
      id: '2',
      name: 'Coach Johnson',
      email: 'coach@lakers.com',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=40&h=40&fit=crop&crop=face',
      role: 'Coach',
      credentialLevel: 'AllAccess',
      permissions: ['all-areas', 'team-management'],
      roomPreferences: ['suite', 'quiet-floor'],
      dietaryRestrictions: ['diabetic-friendly']
    },
    {
      id: '3',
      name: 'Team Manager',
      email: 'manager@lakers.com',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face',
      role: 'Team Manager',
      credentialLevel: 'Backstage',
      permissions: ['team-coordination', 'logistics'],
      roomPreferences: ['standard-room']
    }
  ],
  roomAssignments: [
    {
      id: 'room-1',
      room: 'Suite 1201',
      hotel: 'Phoenix Marriott',
      occupants: ['1'],
      checkIn: '2025-01-20T15:00:00Z',
      checkOut: '2025-01-21T11:00:00Z',
      roomType: 'suite',
      specialRequests: ['late-checkout', 'quiet-floor']
    }
  ],
  equipment: [
    {
      id: 'eq-1',
      name: 'Team Basketball Equipment',
      category: 'sports',
      quantity: 50,
      location: 'Equipment Truck',
      status: 'packed',
      assignedTo: '3',
      notes: 'Includes basketballs, training gear, medical supplies'
    }
  ],
  schedule: [
    {
      id: 'sched-1',
      type: 'meeting',
      title: 'Pre-game Team Meeting',
      startTime: '2025-01-20T17:00:00Z',
      endTime: '2025-01-20T18:00:00Z',
      location: 'Hotel Conference Room',
      participants: ['1', '2', '3'],
      priority: 'high',
      notes: 'Review game strategy and matchups'
    }
  ],
  perDiem: {
    dailyRate: 150,
    currency: 'USD',
    startDate: '2025-01-20',
    endDate: '2025-02-03',
    participants: [
      { participantId: '1', customRate: 200, advances: 0, deductions: 0, balance: 2800 },
      { participantId: '2', customRate: 175, advances: 0, deductions: 0, balance: 2450 }
    ]
  },
  settlement: [],
  medical: [
    {
      id: 'med-1',
      participantId: '1',
      date: '2025-01-18',
      type: 'checkup',
      description: 'Pre-trip physical examination',
      severity: 'minor',
      status: 'resolved',
      treatedBy: 'Team Doctor Smith',
      restricted: false
    }
  ],
  compliance: [
    {
      id: 'comp-1',
      type: 'safety',
      title: 'NBA Travel Protocols',
      description: 'All team members must follow NBA travel and safety guidelines',
      deadline: '2025-01-19',
      status: 'compliant',
      assignedTo: '2',
      documents: ['nba-travel-policy.pdf']
    }
  ],
  media: [],
  sponsors: []
};
