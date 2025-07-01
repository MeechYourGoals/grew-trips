
import { ProTripData } from '../../types/pro';

export const scarletKnightsVolleyball: ProTripData = {
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
};
