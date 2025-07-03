import { ProTripData } from '../../types/pro';

export const eliLillyCsuiteRetreat: ProTripData = {
  id: 'eli-lilly-c-suite-retreat-2026',
  title: 'Eli Lilly C-Suite Retreat 2026',
  description: 'Executive strategic planning retreat at Terranea Resort for senior leadership team.',
  location: 'Terranea Resort, Rancho Palos Verdes CA',
  dateRange: 'Jan 15 - Jan 18, 2026',
  category: 'Business Travel',
  proTripCategory: 'Corporate & Business',
  tags: ['Business Travel', 'Executive', 'Strategy'],
  participants: [
    { id: 9, name: 'David Ricks', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face', role: 'Executives' },
    { id: 10, name: 'Anat Ashkenazi', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=40&h=40&fit=crop&crop=face', role: 'Executives' },
    { id: 11, name: 'Strategic Planner', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face', role: 'Coordinators' }
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
      role: 'Executives',
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
      role: 'Executives',
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
      role: 'Coordinators',
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
};
