import { ProTripData } from '../../types/pro';

export const ohioStateNotreDame: ProTripData = {
  id: 'osu-notredame-2025',
  title: 'Ohio State vs Notre Dame – Away Game 2025',
  description: 'Ohio State Buckeyes away game against Notre Dame Fighting Irish at Notre Dame Stadium.',
  location: 'South Bend, IN',
  dateRange: 'Sep 13 - Sep 14, 2025',
  category: 'Sports',
  proTripCategory: 'Sports & Athletics',
  tags: ['Sports', 'NCAA Division I', 'Football'],
  participants: [
    { id: 1, name: 'Ryan Day', avatar: '/images/avatars/blank-01.png', role: 'Coaches' },
    { id: 2, name: 'Marvin Harrison Jr.', avatar: '/images/avatars/blank-02.png', role: 'Players' },
    { id: 3, name: 'Kyle McCord', avatar: '/images/avatars/blank-03.png', role: 'Players' },
    { id: 4, name: 'Kate Hoke', avatar: '/images/avatars/blank-04.png', role: 'Medical Staff' }
  ],
  budget: {
    total: 250000,
    spent: 75000,
    categories: [
      { name: 'Travel', budgeted: 80000, spent: 25000 },
      { name: 'Accommodation', budgeted: 70000, spent: 20000 },
      { name: 'Meals', budgeted: 50000, spent: 15000 },
      { name: 'Equipment', budgeted: 50000, spent: 15000 }
    ]
  },
  itinerary: [
    {
      date: '2025-09-13',
      events: [
        { time: '08:00', title: 'Team Departure', location: 'Columbus Airport', type: 'travel' },
        { time: '11:30', title: 'Arrival in South Bend', location: 'South Bend Airport', type: 'travel' },
        { time: '14:00', title: 'Hotel Check-in', location: 'Morris Inn', type: 'travel' },
        { time: '16:00', title: 'Team Practice', location: 'Notre Dame Stadium', type: 'meeting' },
        { time: '19:00', title: 'Team Dinner', location: 'Morris Inn Dining', type: 'meeting' }
      ]
    }
  ],
  roster: [
    {
      id: '1',
      name: 'Ryan Day',
      email: 'rday@osu.edu',
      avatar: '/images/avatars/blank-01.png',
      role: 'Coaches',
      credentialLevel: 'AllAccess',
      permissions: ['all-areas', 'team-management'],
      roomPreferences: ['suite', 'quiet-floor'],
      dietaryRestrictions: []
    },
    {
      id: '2',
      name: 'Marvin Harrison Jr.',
      email: 'mharrison@osu.edu',
      avatar: '/images/avatars/blank-02.png',
      role: 'Players',
      credentialLevel: 'AllAccess',
      permissions: ['locker-room', 'team-areas'],
      roomPreferences: ['double-room', 'teammate-pairing'],
      dietaryRestrictions: []
    },
    {
      id: '3',
      name: 'Kyle McCord',
      email: 'kmccord@osu.edu',
      avatar: '/images/avatars/blank-03.png',
      role: 'Players',
      credentialLevel: 'AllAccess',
      permissions: ['locker-room', 'team-areas'],
      roomPreferences: ['double-room', 'teammate-pairing'],
      dietaryRestrictions: ['no-shellfish']
    },
    {
      id: '4',
      name: 'Kate Hoke',
      email: 'khoke@osu.edu',
      avatar: '/images/avatars/blank-04.png',
      role: 'Medical Staff',
      credentialLevel: 'Backstage',
      permissions: ['medical-facilities', 'team-coordination'],
      roomPreferences: ['single-room', 'near-elevator'],
      dietaryRestrictions: ['vegetarian']
    }
  ],
  roomAssignments: [
    {
      id: 'room-osu1',
      room: 'Suite 301',
      hotel: 'Morris Inn',
      occupants: ['1'],
      checkIn: '2025-09-13T14:00:00Z',
      checkOut: '2025-09-14T11:00:00Z',
      roomType: 'suite',
      specialRequests: ['late-checkout', 'quiet-floor']
    }
  ],
  equipment: [
    {
      id: 'eq-osu1',
      name: 'Team Football Equipment',
      category: 'sports',
      quantity: 85,
      location: 'Equipment Bus',
      status: 'packed',
      assignedTo: '4',
      notes: 'Helmets, pads, uniforms, medical supplies'
    }
  ],
  schedule: [
    {
      id: 'sched-osu1',
      type: 'meeting',
      title: 'Pre-game Strategy Meeting',
      startTime: '2025-09-13T20:30:00Z',
      endTime: '2025-09-13T21:30:00Z',
      location: 'Morris Inn Conference Room',
      participants: ['1', '2', '3'],
      priority: 'high',
      notes: 'Review Notre Dame defensive schemes'
    }
  ],
  perDiem: {
    dailyRate: 125,
    currency: 'USD',
    startDate: '2025-09-13',
    endDate: '2025-09-14',
    participants: [
      { participantId: '1', customRate: 200, advances: 0, deductions: 0, balance: 400 },
      { participantId: '2', customRate: 125, advances: 0, deductions: 0, balance: 250 }
    ]
  },
  settlement: [],
  medical: [],
  compliance: [
    {
      id: 'comp-osu1',
      type: 'safety',
      title: 'NCAA Travel Protocols',
      description: 'All team members must follow NCAA travel and eligibility guidelines',
      deadline: '2025-09-12',
      status: 'compliant',
      assignedTo: '1',
      documents: ['ncaa-travel-policy.pdf']
    }
  ],
  media: [],
  sponsors: []
};