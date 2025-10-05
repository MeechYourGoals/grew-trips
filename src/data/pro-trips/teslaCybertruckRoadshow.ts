import { ProTripData } from '../../types/pro';

export const teslaCybertruckRoadshow: ProTripData = {
  id: 'tesla-cybertruck-roadshow-2025',
  title: 'Tesla Cybertruck Launch Roadshow 2025',
  description: 'Tesla Cybertruck nationwide launch roadshow covering major markets across the United States.',
  location: 'Austin, TX',
  dateRange: 'Apr 1 - Jun 30, 2025',
  category: 'Enterprise',
  proTripCategory: 'Business Travel',
  tags: ['Automotive', 'Product Launch', 'Enterprise'],
  basecamp_name: 'Tesla Gigafactory Texas',
  basecamp_address: '1 Tesla Road, Austin, TX 78725',
  broadcasts: [],
  participants: [
    { id: 1, name: 'Elon Musk', avatar: '/images/avatars/blank-17.png', role: 'Executive Team' },
    { id: 2, name: 'Franz von Holzhausen', avatar: '/images/avatars/blank-18.png', role: 'Design Team' },
    { id: 3, name: 'Riley Brooks', avatar: '/images/avatars/blank-19.png', role: 'Logistics Team' },
    { id: 4, name: 'Kaitlyn Ruiz', avatar: '/images/avatars/blank-20.png', role: 'Technical Crew' }
  ],
  budget: {
    total: 2000000,
    spent: 500000,
    categories: [
      { name: 'Vehicle Transportation', budgeted: 800000, spent: 200000 },
      { name: 'Event Production', budgeted: 600000, spent: 150000 },
      { name: 'Team Travel', budgeted: 400000, spent: 100000 },
      { name: 'Marketing Activation', budgeted: 200000, spent: 50000 }
    ]
  },
  itinerary: [
    {
      date: '2025-04-01',
      events: [
        { time: '09:00', title: 'Roadshow Launch Event', location: 'Tesla Gigafactory Texas', type: 'meeting' },
        { time: '11:00', title: 'Press Conference', location: 'Gigafactory Main Hall', type: 'meeting' },
        { time: '14:00', title: 'First Deliveries', location: 'Customer Delivery Center', type: 'meeting' },
        { time: '18:00', title: 'Launch Celebration', location: 'Austin Convention Center', type: 'meeting' }
      ]
    }
  ],
  roster: [
    {
      id: '1',
      name: 'Elon Musk',
      email: 'elon@tesla.com',
      avatar: '/images/avatars/blank-17.png',
      role: 'Executive Team',
      credentialLevel: 'AllAccess',
      permissions: ['all-areas', 'executive-privileges'],
      roomPreferences: ['penthouse', 'private-jet-access'],
      dietaryRestrictions: []
    },
    {
      id: '2',
      name: 'Franz von Holzhausen',
      email: 'franz@tesla.com',
      avatar: '/images/avatars/blank-18.png',
      role: 'Design Team',
      credentialLevel: 'AllAccess',
      permissions: ['design-areas', 'vehicle-access'],
      roomPreferences: ['suite', 'design-workspace'],
      dietaryRestrictions: []
    },
    {
      id: '3',
      name: 'Riley Brooks',
      email: 'riley@tesla.com',
      avatar: '/images/avatars/blank-19.png',
      role: 'Logistics Team',
      credentialLevel: 'Backstage',
      permissions: ['logistics-coordination', 'vehicle-transport'],
      roomPreferences: ['standard-suite'],
      dietaryRestrictions: ['vegan']
    },
    {
      id: '4',
      name: 'Kaitlyn Ruiz',
      email: 'kaitlyn@tesla.com',
      avatar: '/images/avatars/blank-20.png',
      role: 'Technical Crew',
      credentialLevel: 'Backstage',
      permissions: ['technical-areas', 'av-equipment'],
      roomPreferences: ['crew-housing'],
      dietaryRestrictions: []
    }
  ],
  roomAssignments: [
    {
      id: 'room-tesla1',
      room: 'Penthouse Suite',
      hotel: 'Austin Proper Hotel',
      occupants: ['1'],
      checkIn: '2025-03-31T16:00:00Z',
      checkOut: '2025-04-02T12:00:00Z',
      roomType: 'suite',
      specialRequests: ['private-entrance', 'security-detail']
    }
  ],
  schedule: [
    {
      id: 'sched-tesla1',
      type: 'meeting',
      title: 'Cybertruck Reveal Event',
      startTime: '2025-04-01T11:00:00Z',
      endTime: '2025-04-01T13:00:00Z',
      location: 'Tesla Gigafactory Texas',
      participants: ['1', '2'],
      priority: 'critical',
      notes: 'Global livestream of Cybertruck production start'
    }
  ],
  perDiem: {
    dailyRate: 200,
    currency: 'USD',
    startDate: '2025-04-01',
    endDate: '2025-06-30',
    participants: [
      { participantId: '1', customRate: 0, advances: 0, deductions: 0, balance: 0 },
      { participantId: '2', customRate: 300, advances: 0, deductions: 0, balance: 27300 }
    ]
  },
  settlement: [],
  medical: [],
  compliance: [
    {
      id: 'comp-tesla1',
      type: 'safety',
      title: 'DOT Vehicle Transport Compliance',
      description: 'All vehicle transport must comply with DOT regulations',
      deadline: '2025-03-30',
      status: 'compliant',
      assignedTo: '3',
      documents: ['dot-compliance.pdf']
    }
  ],
  media: [
    {
      id: 'media-tesla1',
      type: 'press-conference',
      outlet: 'Global Automotive Press',
      contactPerson: 'Tesla PR Team',
      scheduledTime: '2025-04-01T11:00:00Z',
      duration: 120,
      location: 'Tesla Gigafactory Texas',
      participants: ['1', '2'],
      status: 'confirmed'
    }
  ],
  sponsors: []
};