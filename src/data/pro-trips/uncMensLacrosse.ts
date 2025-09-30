import { ProTripData } from '../../types/pro';

export const uncMensLacrosse: ProTripData = {
  id: 'unc-lax-2025',
  title: 'UNC Men\'s Lacrosse 2025 Season',
  description: 'University of North Carolina Tar Heels Men\'s Lacrosse 2025 season coordination and game travel.',
  location: 'Chapel Hill NC',
  dateRange: 'Feb 1 - May 31, 2025',
  category: 'Sports',
  proTripCategory: 'Sports – Pro, Collegiate, Youth',
  tags: ['Sports', 'Lacrosse', 'NCAA Division I', 'UNC'],
  basecamp_name: 'Dorrance Field',
  basecamp_address: '104 Stadium Drive, Chapel Hill, NC 27514',
  broadcasts: [],
  participants: Array.from({ length: 45 }, (_, i) => {
    const id = 201 + i;
    const avatars = [
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?w=40&h=40&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=40&h=40&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=40&h=40&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=40&h=40&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1552058544-f2b08422138a?w=40&h=40&fit=crop&crop=face'
    ];
    
    if (i < 6) {
      const coaches = ['Joe Breschi', 'Jon Thompson', 'Dave Pietramala', 'Peter Murphy', 'Assistant Coach', 'Graduate Assistant'];
      return { id, name: coaches[i] || `Coach ${i + 1}`, avatar: avatars[i % avatars.length], role: 'Coaches' };
    } else if (i < 35) {
      const players = ['Michael Gianforcaro', 'James Matan', 'Owen Duffy', 'Antonio DeMarco', 'Cooper Frankenheimer', 'Dewey Egan', 'Tayden Bultman', 'Kai Prohaszka', 'Nick Pietramala', 'Dominic Pietramala', 'Hayden Downs', 'Colin Hannigan'];
      const playerIndex = (i - 6) % players.length;
      const playerNumber = Math.floor((i - 6) / 12) + 1;
      return { id, name: players[playerIndex] || `Player ${i - 5}`, avatar: avatars[i % avatars.length], role: 'Players' };
    } else {
      const staff = ['Team Manager', 'Equipment Manager', 'Athletic Trainer', 'Academic Coordinator', 'Video Coordinator', 'Strength Coach', 'Team Doctor', 'Bus Driver', 'Administrative Assistant', 'Compliance Officer'];
      return { id, name: staff[i - 35] || `Staff ${i - 34}`, avatar: avatars[i % avatars.length], role: 'Staff' };
    }
  }),
  budget: {
    total: 125000,
    spent: 45000,
    categories: [
      { name: 'Travel', budgeted: 45000, spent: 18000 },
      { name: 'Accommodation', budgeted: 35000, spent: 15000 },
      { name: 'Meals', budgeted: 25000, spent: 8000 },
      { name: 'Equipment', budgeted: 20000, spent: 4000 }
    ]
  },
  itinerary: [
    {
      date: '2025-03-20',
      events: [
        { time: '07:30', title: 'Team Breakfast', location: 'Hotel Ballroom', type: 'meeting' },
        { time: '09:00', title: 'Bus Departure', location: 'Boshamer Stadium', type: 'travel' },
        { time: '11:30', title: 'Arrival at Duke', location: 'Duke University', type: 'travel' },
        { time: '13:00', title: 'Pre-Game Meal', location: 'Duke Facilities', type: 'meeting' },
        { time: '15:00', title: 'UNC vs Duke', location: 'Koskinen Stadium', type: 'meeting' }
      ]
    }
  ],
  roster: [
    {
      id: '201',
      name: 'Joe Breschi',
      email: 'breschi@unc.edu',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face',
      role: 'Coaches',
      credentialLevel: 'AllAccess',
      permissions: ['team-management', 'facility-access', 'medical-access'],
      roomPreferences: ['single-room'],
      dietaryRestrictions: []
    },
    {
      id: '202',
      name: 'Jon Thompson',
      email: 'jthompson@unc.edu',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face',
      role: 'Coaches',
      credentialLevel: 'AllAccess',
      permissions: ['team-management', 'offensive-coordination'],
      roomPreferences: ['single-room'],
      dietaryRestrictions: []
    },
    {
      id: '203',
      name: 'Dave Pietramala',
      email: 'dpietramala@unc.edu',
      avatar: 'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?w=40&h=40&fit=crop&crop=face',
      role: 'Coaches',
      credentialLevel: 'AllAccess',
      permissions: ['team-management', 'defensive-coordination'],
      roomPreferences: ['single-room'],
      dietaryRestrictions: []
    },
    {
      id: '204',
      name: 'Peter Murphy',
      email: 'pmurphy@unc.edu',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=40&h=40&fit=crop&crop=face',
      role: 'Coaches',
      credentialLevel: 'AllAccess',
      permissions: ['team-management', 'assistant-coaching'],
      roomPreferences: ['single-room'],
      dietaryRestrictions: []
    },
    {
      id: '205',
      name: 'Michael Gianforcaro',
      email: 'mgianforcaro@unc.edu',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=40&h=40&fit=crop&crop=face',
      role: 'Players',
      credentialLevel: 'Backstage',
      permissions: ['field-access', 'locker-room'],
      roomPreferences: ['shared-room'],
      dietaryRestrictions: []
    },
    {
      id: '206',
      name: 'James Matan',
      email: 'jmatan@unc.edu',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face',
      role: 'Players',
      credentialLevel: 'Backstage',
      permissions: ['field-access', 'locker-room'],
      roomPreferences: ['shared-room'],
      dietaryRestrictions: []
    },
    {
      id: '207',
      name: 'Owen Duffy',
      email: 'oduffy@unc.edu',
      avatar: 'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=40&h=40&fit=crop&crop=face',
      role: 'Players',
      credentialLevel: 'Backstage',
      permissions: ['field-access', 'locker-room'],
      roomPreferences: ['shared-room'],
      dietaryRestrictions: []
    },
    {
      id: '208',
      name: 'Antonio DeMarco',
      email: 'ademarco@unc.edu',
      avatar: 'https://images.unsplash.com/photo-1552058544-f2b08422138a?w=40&h=40&fit=crop&crop=face',
      role: 'Players',
      credentialLevel: 'Backstage',
      permissions: ['field-access', 'locker-room'],
      roomPreferences: ['shared-room'],
      dietaryRestrictions: []
    },
    {
      id: '209',
      name: 'Cooper Frankenheimer',
      email: 'cfrankenheimer@unc.edu',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=40&h=40&fit=crop&crop=face',
      role: 'Players',
      credentialLevel: 'Backstage',
      permissions: ['field-access', 'locker-room'],
      roomPreferences: ['shared-room'],
      dietaryRestrictions: []
    },
    {
      id: '210',
      name: 'Dewey Egan',
      email: 'degan@unc.edu',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=40&h=40&fit=crop&crop=face',
      role: 'Players',
      credentialLevel: 'Backstage',
      permissions: ['field-access', 'locker-room'],
      roomPreferences: ['shared-room'],
      dietaryRestrictions: []
    },
    {
      id: '211',
      name: 'Tayden Bultman',
      email: 'tbultman@unc.edu',
      avatar: 'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=40&h=40&fit=crop&crop=face',
      role: 'Players',
      credentialLevel: 'Backstage',
      permissions: ['field-access', 'locker-room'],
      roomPreferences: ['shared-room'],
      dietaryRestrictions: []
    },
    {
      id: '212',
      name: 'Kai Prohaszka',
      email: 'kprohaszka@unc.edu',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face',
      role: 'Players',
      credentialLevel: 'Backstage',
      permissions: ['field-access', 'locker-room'],
      roomPreferences: ['shared-room'],
      dietaryRestrictions: []
    },
    {
      id: '213',
      name: 'Nick Pietramala',
      email: 'npietramala@unc.edu',
      avatar: 'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?w=40&h=40&fit=crop&crop=face',
      role: 'Players',
      credentialLevel: 'Backstage',
      permissions: ['field-access', 'locker-room'],
      roomPreferences: ['shared-room'],
      dietaryRestrictions: []
    },
    {
      id: '214',
      name: 'Dominic Pietramala',
      email: 'dpietramala2@unc.edu',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=40&h=40&fit=crop&crop=face',
      role: 'Players',
      credentialLevel: 'Backstage',
      permissions: ['field-access', 'locker-room'],
      roomPreferences: ['shared-room'],
      dietaryRestrictions: []
    },
    {
      id: '215',
      name: 'Hayden Downs',
      email: 'hdowns@unc.edu',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=40&h=40&fit=crop&crop=face',
      role: 'Players',
      credentialLevel: 'Backstage',
      permissions: ['field-access', 'locker-room'],
      roomPreferences: ['shared-room'],
      dietaryRestrictions: []
    },
    {
      id: '216',
      name: 'Colin Hannigan',
      email: 'channigan@unc.edu',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face',
      role: 'Players',
      credentialLevel: 'Backstage',
      permissions: ['field-access', 'locker-room'],
      roomPreferences: ['shared-room'],
      dietaryRestrictions: []
    }
  ],
  roomAssignments: [
    {
      id: 'room-unc1',
      room: 'Rooms 401-402',
      hotel: 'Graduate Chapel Hill',
      occupants: ['205', '206'],
      checkIn: '2025-03-19T15:00:00Z',
      checkOut: '2025-03-21T11:00:00Z',
      roomType: 'connecting',
      specialRequests: ['ground-floor', 'team-floor']
    },
    {
      id: 'room-unc2',
      room: 'Rooms 403-404',
      hotel: 'Graduate Chapel Hill',
      occupants: ['207', '208'],
      checkIn: '2025-03-19T15:00:00Z',
      checkOut: '2025-03-21T11:00:00Z',
      roomType: 'connecting',
      specialRequests: ['team-floor']
    }
  ],
  equipment: [
    {
      id: 'eq-unc1',
      name: 'Team Lacrosse Sticks (Set of 30)',
      category: 'sports',
      quantity: 30,
      location: 'Equipment Bus',
      status: 'packed',
      assignedTo: '202',
      notes: 'Game and practice sticks for all positions'
    },
    {
      id: 'eq-unc2',
      name: 'Team Uniforms - Carolina Blue Home Set',
      category: 'general',
      quantity: 25,
      location: 'Equipment Bus',
      status: 'packed',
      assignedTo: '204',
      notes: 'Home Carolina Blue jerseys and shorts'
    },
    {
      id: 'eq-unc3',
      name: 'Training Equipment & Cones',
      category: 'sports',
      quantity: 1,
      location: 'Equipment Bus',
      status: 'packed',
      assignedTo: '203',
      notes: 'Agility cones, training balls, and practice equipment'
    }
  ],
  schedule: [
    {
      id: 'sched-unc1',
      type: 'meeting',
      title: 'Team Meeting & Pre-Game Prep',
      startTime: '2025-03-20T07:30:00Z',
      endTime: '2025-03-20T08:30:00Z',
      location: 'Hotel Conference Room',
      participants: ['201', '202', '203', '204'],
      priority: 'high',
      notes: 'Final game strategy and team prep meeting'
    },
    {
      id: 'sched-unc2',
      type: 'meeting',
      title: 'UNC vs Duke - ACC Conference Game',
      startTime: '2025-03-20T15:00:00Z',
      endTime: '2025-03-20T17:00:00Z',
      location: 'Koskinen Stadium, Duke University',
      participants: ['201', '202', '203', '204', '205', '206', '207', '208', '209', '210', '211', '212', '213', '214', '215', '216'],
      priority: 'critical',
      notes: 'ACC conference rivalry game - WHITE away jerseys'
    }
  ],
  perDiem: {
    dailyRate: 65,
    currency: 'USD',
    startDate: '2025-03-19',
    endDate: '2025-03-21',
    participants: [
      { participantId: '205', customRate: 65, advances: 0, deductions: 0, balance: 195 },
      { participantId: '206', customRate: 65, advances: 0, deductions: 0, balance: 195 },
      { participantId: '207', customRate: 65, advances: 0, deductions: 0, balance: 195 },
      { participantId: '208', customRate: 65, advances: 0, deductions: 0, balance: 195 }
    ]
  },
  settlement: [],
  medical: [],
  compliance: [
    {
      id: 'comp-unc1',
      type: 'NCAA',
      title: 'NCAA Eligibility Verification',
      description: 'All student-athletes must maintain NCAA eligibility standards',
      deadline: '2025-03-18',
      status: 'compliant',
      assignedTo: '201',
      documents: ['ncaa-eligibility.pdf', 'academic-standing.pdf']
    },
    {
      id: 'comp-unc2',
      type: 'safety',
      title: 'Medical Clearance & Insurance',
      description: 'Current medical clearance and insurance documentation',
      deadline: '2025-03-18',
      status: 'compliant',
      assignedTo: '204',
      documents: ['medical-clearance-2025.pdf', 'insurance-docs.pdf']
    }
  ],
  media: [],
  sponsors: [
    {
      id: 'sponsor-unc1',
      sponsor: 'Nike Lacrosse',
      activation: 'Official Equipment and Apparel Partner',
      deadline: '2025-03-15',
      assignedTo: '202',
      status: 'completed',
      deliverables: ['Team uniforms', 'Practice gear', 'Equipment bags'],
      notes: 'Official UNC Athletics Nike partnership'
    }
  ]
};