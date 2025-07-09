import { ProTripData } from '../../types/pro';

export const paulGeorgeEliteAAU: ProTripData = {
  id: 'paul-george-elite-aau-nationals-2025',
  title: 'Paul George Elite AAU Nationals \'25',
  description: 'AAU National Championship tournament in Las Vegas featuring elite high school prospects.',
  location: 'Las Vegas NV',
  dateRange: 'Jul 8 - Jul 15, 2025',
  category: 'Sports – Team Trip',
  tags: ['Sports – Team Trip', 'Basketball', 'AAU', 'Nationals'],
  participants: [
    { id: 20, name: 'Brandon Lincoln', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face', role: 'Directors' },
    { id: 21, name: 'Matt Barnes', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face', role: 'Coaches' },
    { id: 22, name: 'Jerald Dickson', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face', role: 'Operations' },
    { id: 23, name: 'Carter Bryant', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=40&h=40&fit=crop&crop=face', role: 'Players' },
    { id: 24, name: 'Jaden DePina', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face', role: 'Players' },
    { id: 25, name: 'James Evans Jr.', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face', role: 'Players' },
    { id: 26, name: 'Ifiok Peter', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face', role: 'Players' }
  ],
  budget: {
    total: 85000,
    spent: 32000,
    categories: [
      { name: 'Travel', budgeted: 25000, spent: 12000 },
      { name: 'Accommodation', budgeted: 35000, spent: 15000 },
      { name: 'Meals', budgeted: 15000, spent: 5000 },
      { name: 'Tournament Fees', budgeted: 10000, spent: 0 }
    ]
  },
  itinerary: [
    {
      date: '2025-07-08',
      events: [
        { time: '06:00', title: 'Team Departure', location: 'LAX Terminal 5', type: 'travel' },
        { time: '08:30', title: 'Arrival Las Vegas', location: 'McCarran International Airport', type: 'travel' },
        { time: '10:00', title: 'Hotel Check-in', location: 'Mandalay Bay Resort', type: 'meeting' },
        { time: '14:00', title: 'Court Walkthrough', location: 'Las Vegas Convention Center', type: 'meeting' },
        { time: '16:00', title: 'Team Practice', location: 'Convention Center Court 3', type: 'activity' },
        { time: '19:00', title: 'Welcome Dinner', location: 'Mandalay Bay Dining', type: 'meeting' }
      ]
    },
    {
      date: '2025-07-09',
      events: [
        { time: '08:00', title: 'Game 1: vs Houston Hoops', location: 'Convention Center Court 1', type: 'activity' },
        { time: '14:00', title: 'Game 2: vs Chicago Elite', location: 'Convention Center Court 2', type: 'activity' },
        { time: '20:00', title: 'Team Meeting', location: 'Mandalay Bay Suite 1205', type: 'meeting' }
      ]
    }
  ],
  roster: [
    {
      id: '20',
      name: 'Brandon Lincoln',
      email: 'brandon.lincoln@paulgeorgeelite.com',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face',
      role: 'Directors',
      credentialLevel: 'AllAccess',
      permissions: ['team-management', 'financial-access', 'media-access'],
      roomPreferences: ['single-room', 'executive-floor'],
      dietaryRestrictions: []
    },
    {
      id: '21',
      name: 'Matt Barnes',
      email: 'matt.barnes@paulgeorgeelite.com',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face',
      role: 'Coaches',
      credentialLevel: 'AllAccess',
      permissions: ['team-management', 'court-access', 'medical-access'],
      roomPreferences: ['single-room', 'near-team'],
      dietaryRestrictions: []
    },
    {
      id: '22',
      name: 'Jerald Dickson',
      email: 'jerald.dickson@paulgeorgeelite.com',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face',
      role: 'Operations',
      credentialLevel: 'AllAccess',
      permissions: ['logistics-access', 'financial-access', 'team-management'],
      roomPreferences: ['single-room'],
      dietaryRestrictions: []
    },
    {
      id: '23',
      name: 'Carter Bryant',
      email: 'carter.bryant@paulgeorgeelite.com',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=40&h=40&fit=crop&crop=face',
      role: 'Players',
      credentialLevel: 'Backstage',
      permissions: ['court-access', 'locker-room'],
      roomPreferences: ['shared-room'],
      dietaryRestrictions: []
    },
    {
      id: '24',
      name: 'Jaden DePina',
      email: 'jaden.depina@paulgeorgeelite.com',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face',
      role: 'Players',
      credentialLevel: 'Backstage',
      permissions: ['court-access', 'locker-room'],
      roomPreferences: ['shared-room'],
      dietaryRestrictions: []
    },
    {
      id: '25',
      name: 'James Evans Jr.',
      email: 'james.evans@paulgeorgeelite.com',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face',
      role: 'Players',
      credentialLevel: 'Backstage',
      permissions: ['court-access', 'locker-room'],
      roomPreferences: ['shared-room'],
      dietaryRestrictions: []
    },
    {
      id: '26',
      name: 'Ifiok Peter',
      email: 'ifiok.peter@paulgeorgeelite.com',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face',
      role: 'Players',
      credentialLevel: 'Backstage',
      permissions: ['court-access', 'locker-room'],
      roomPreferences: ['shared-room'],
      dietaryRestrictions: []
    }
  ],
  roomAssignments: [
    {
      id: 'room-pg1',
      room: 'Suite 1205',
      hotel: 'Mandalay Bay Resort',
      occupants: ['20'],
      checkIn: '2025-07-08T10:00:00Z',
      checkOut: '2025-07-15T12:00:00Z',
      roomType: 'suite',
      specialRequests: ['executive-floor']
    },
    {
      id: 'room-pg2',
      room: 'Room 1207',
      hotel: 'Mandalay Bay Resort',
      occupants: ['21'],
      checkIn: '2025-07-08T10:00:00Z',
      checkOut: '2025-07-15T12:00:00Z',
      roomType: 'single',
      specialRequests: ['near-team']
    },
    {
      id: 'room-pg3',
      room: 'Room 1210',
      hotel: 'Mandalay Bay Resort',
      occupants: ['23', '24'],
      checkIn: '2025-07-08T10:00:00Z',
      checkOut: '2025-07-15T12:00:00Z',
      roomType: 'double',
      specialRequests: ['connecting-rooms']
    }
  ],
  equipment: [
    {
      id: 'eq-pg1',
      name: 'Team Basketballs (15)',
      category: 'sports',
      quantity: 15,
      location: 'Equipment Bag 1',
      status: 'packed',
      assignedTo: '21',
      notes: 'Official tournament balls'
    },
    {
      id: 'eq-pg2',
      name: 'Team Uniforms (Home)',
      category: 'sports',
      quantity: 12,
      location: 'Uniform Bag',
      status: 'packed',
      assignedTo: '22',
      notes: 'White jerseys with black trim'
    },
    {
      id: 'eq-pg3',
      name: 'Training Equipment',
      category: 'general',
      quantity: 1,
      location: 'Training Bag',
      status: 'packed',
      assignedTo: '21',
      notes: 'Cones, bands, agility ladder'
    }
  ],
  schedule: [
    {
      id: 'sched-pg1',
      type: 'meeting',
      title: 'Tournament Registration',
      startTime: '2025-07-08T12:00:00Z',
      endTime: '2025-07-08T13:00:00Z',
      location: 'Convention Center Registration',
      participants: ['20', '21', '22'],
      priority: 'high',
      notes: 'Bring all player documentation and insurance forms'
    },
    {
      id: 'sched-pg2',
      type: 'show',
      title: 'Pool Play Game 1',
      startTime: '2025-07-09T08:00:00Z',
      endTime: '2025-07-09T09:30:00Z',
      location: 'Convention Center Court 1',
      participants: ['21', '23', '24', '25', '26'],
      priority: 'critical',
      notes: 'vs Houston Hoops - must win to advance'
    }
  ],
  perDiem: {
    dailyRate: 75,
    currency: 'USD',
    startDate: '2025-07-08',
    endDate: '2025-07-15',
    participants: [
      { participantId: '23', customRate: 75, advances: 0, deductions: 0, balance: 525 },
      { participantId: '24', customRate: 75, advances: 0, deductions: 0, balance: 525 },
      { participantId: '25', customRate: 75, advances: 0, deductions: 0, balance: 525 },
      { participantId: '26', customRate: 75, advances: 0, deductions: 0, balance: 525 }
    ]
  },
  settlement: [],
  medical: [],
  compliance: [
    {
      id: 'comp-pg1',
      type: 'insurance',
      title: 'AAU Eligibility & Insurance',
      description: 'All players must have current AAU membership and insurance coverage',
      deadline: '2025-07-07',
      status: 'compliant',
      assignedTo: '22',
      documents: ['aau-membership.pdf', 'insurance-coverage.pdf']
    },
    {
      id: 'comp-pg2',
      type: 'NCAA',
      title: 'NCAA Amateurism Compliance',
      description: 'Ensure all activities comply with NCAA amateur status requirements',
      deadline: '2025-07-07',
      status: 'compliant',
      assignedTo: '20',
      documents: ['ncaa-compliance.pdf']
    }
  ],
  media: [],
  sponsors: []
};