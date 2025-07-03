import { ProTripData } from '../../types/pro';

export const yCombinatorCohort: ProTripData = {
  id: 'y-combinator-winter-2025-cohort',
  title: 'Y Combinator Winter 2025 Cohort',
  description: 'Participation in Y Combinator Winter 2025 accelerator program in San Francisco.',
  location: 'San Francisco CA',
  dateRange: 'Feb 1 - Mar 31, 2025',
  category: 'Startup',
  proTripCategory: 'Events',
  tags: ['Startup', 'Accelerator', 'Demo Day'],
  participants: [
    { id: 24, name: 'Jessica Chen', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=40&h=40&fit=crop&crop=face', role: 'Speakers' },
    { id: 25, name: 'Michael Torres', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face', role: 'Speakers' },
    { id: 26, name: 'Lisa Park', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face', role: 'Speakers' }
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
      role: 'Speakers',
      credentialLevel: 'AllAccess',
      permissions: ['speaker-access', 'yc-facilities'],
      roomPreferences: ['shared-housing', 'san-francisco'],
      dietaryRestrictions: ['vegetarian']
    },
    {
      id: '25',
      name: 'Michael Torres',
      email: 'michael@startup.com',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face',
      role: 'Speakers',
      credentialLevel: 'AllAccess',
      permissions: ['speaker-access', 'yc-facilities'],
      roomPreferences: ['shared-housing', 'san-francisco'],
      dietaryRestrictions: []
    },
    {
      id: '26',
      name: 'Lisa Park',
      email: 'lisa@startup.com',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face',
      role: 'Speakers',
      credentialLevel: 'AllAccess',
      permissions: ['speaker-access', 'yc-facilities'],
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
      description: 'Speakers must attend required sessions and meet milestones',
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
};
