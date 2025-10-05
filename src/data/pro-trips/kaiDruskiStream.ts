import { ProTripData } from '../../types/pro';

export const kaiDruskiStream: ProTripData = {
  id: 'kai-druski-jake-adin-24hr-atl',
  title: 'Kai Cenat × Druski × Jake Paul × Adin Ross – 24-Hour Live-Stream',
  description: '24-hour collaborative live-stream event featuring top content creators in Atlanta.',
  location: 'Atlanta, GA',
  dateRange: 'Aug 7 - Aug 8, 2025',
  proTripCategory: 'Content',
  tags: ['Content', 'Live Stream', 'Gaming'],
  basecamp_name: 'State Farm Arena',
  basecamp_address: '1 State Farm Drive, Atlanta, GA 30303',
  broadcasts: [],
  participants: [
    { id: 1, name: 'Kai Cenat', avatar: '/images/avatars/blank-09.png', role: 'Content Creators' },
    { id: 2, name: 'Druski', avatar: '/images/avatars/blank-10.png', role: 'Content Creators' },
    { id: 3, name: 'Jake Paul', avatar: '/images/avatars/blank-11.png', role: 'Content Creators' },
    { id: 4, name: 'Adin Ross', avatar: '/images/avatars/blank-12.png', role: 'Content Creators' }
  ],
  budget: {
    total: 150000,
    spent: 45000,
    categories: [
      { name: 'Production', budgeted: 75000, spent: 25000 },
      { name: 'Accommodation', budgeted: 30000, spent: 10000 },
      { name: 'Catering', budgeted: 25000, spent: 7000 },
      { name: 'Production Rental', budgeted: 20000, spent: 3000 }
    ]
  },
  itinerary: [
    {
      date: '2025-08-07',
      events: [
        { time: '10:00', title: 'Crew Call & Setup', location: 'Atlanta Studio Complex', type: 'meeting' },
        { time: '12:00', title: 'Tech Rehearsal', location: 'Main Studio', type: 'meeting' },
        { time: '14:00', title: 'Creator Arrival & Briefing', location: 'Green Room', type: 'meeting' },
        { time: '16:00', title: 'Stream Goes Live', location: 'Main Studio', type: 'meeting' }
      ]
    }
  ],
  roster: [
    {
      id: '1',
      name: 'Kai Cenat',
      email: 'kai@streamteam.com',
      avatar: '/images/avatars/blank-09.png',
      role: 'Content Creators',
      credentialLevel: 'AllAccess',
      permissions: ['all-areas', 'stream-control'],
      roomPreferences: ['suite', 'high-floor'],
      dietaryRestrictions: []
    },
    {
      id: '2',
      name: 'Druski',
      email: 'druski@streamteam.com',
      avatar: '/images/avatars/blank-10.png',
      role: 'Content Creators',
      credentialLevel: 'AllAccess',
      permissions: ['all-areas', 'stream-control'],
      roomPreferences: ['suite', 'high-floor'],
      dietaryRestrictions: []
    },
    {
      id: '3',
      name: 'Jake Paul',
      email: 'jake@streamteam.com',
      avatar: '/images/avatars/blank-11.png',
      role: 'Content Creators',
      credentialLevel: 'AllAccess',
      permissions: ['all-areas', 'stream-control'],
      roomPreferences: ['suite', 'high-floor'],
      dietaryRestrictions: []
    },
    {
      id: '4',
      name: 'Adin Ross',
      email: 'adin@streamteam.com',
      avatar: '/images/avatars/blank-12.png',
      role: 'Content Creators',
      credentialLevel: 'AllAccess',
      permissions: ['all-areas', 'stream-control'],
      roomPreferences: ['suite', 'high-floor'],
      dietaryRestrictions: ['no-dairy']
    }
  ],
  roomAssignments: [
    {
      id: 'room-stream1',
      room: 'Penthouse Suite A',
      hotel: 'W Atlanta Downtown',
      occupants: ['1'],
      checkIn: '2025-08-07T12:00:00Z',
      checkOut: '2025-08-08T14:00:00Z',
      roomType: 'suite',
      specialRequests: ['late-checkout', 'soundproofing']
    }
  ],
  schedule: [
    {
      id: 'sched-stream1',
      type: 'show',
      title: '24-Hour Live Stream',
      startTime: '2025-08-07T16:00:00Z',
      endTime: '2025-08-08T16:00:00Z',
      location: 'Atlanta Studio Complex',
      participants: ['1', '2', '3', '4'],
      priority: 'critical',
      notes: 'Continuous 24-hour stream with rotating host segments'
    }
  ],
  perDiem: {
    dailyRate: 300,
    currency: 'USD',
    startDate: '2025-08-07',
    endDate: '2025-08-08',
    participants: [
      { participantId: '1', customRate: 500, advances: 0, deductions: 0, balance: 1000 },
      { participantId: '2', customRate: 400, advances: 0, deductions: 0, balance: 800 }
    ]
  },
  settlement: [],
  medical: [],
  compliance: [
    {
      id: 'comp-stream1',
      type: 'safety',
      title: 'Platform Content Guidelines',
      description: 'All content must comply with Twitch and YouTube ToS',
      deadline: '2025-08-07',
      status: 'compliant',
      assignedTo: '1',
      documents: ['platform-guidelines.pdf']
    }
  ],
  media: [
    {
      id: 'media-stream1',
      type: 'press-conference',
      outlet: 'Twitch & YouTube',
      contactPerson: 'Production Manager',
      scheduledTime: '2025-08-07T16:00:00Z',
      duration: 1440,
      location: 'Atlanta Studio Complex',
      participants: ['1', '2', '3', '4'],
      status: 'confirmed'
    }
  ],
  sponsors: [
    {
      id: 'sponsor-stream1',
      sponsor: 'Red Bull',
      activation: 'Energy drink sponsorship',
      deadline: '2025-08-07',
      assignedTo: '1',
      status: 'in-progress',
      deliverables: ['product-placement', 'branded-segments'],
      notes: 'Exclusive energy drink partner for 24-hour stream'
    }
  ]
};