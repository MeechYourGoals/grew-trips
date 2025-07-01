import { ProTripData } from '../../types/pro';

export const indianaUniversityDebate: ProTripData = {
  id: 'indiana-university-debate-championships-2025',
  title: 'Indiana University Debate Championships',
  description: 'National debate championship participation for Indiana University debate team in Austin.',
  location: 'Austin TX',
  dateRange: 'Mar 1 - Mar 6, 2025',
  category: 'Academic',
  proTripCategory: 'Education & Academic',
  tags: ['Academic', 'Debate', 'Championships'],
  participants: [
    { id: 20, name: 'Prof. Michael Davis', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face', role: 'Teacher' },
    { id: 21, name: 'Alex Johnson', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=40&h=40&fit=crop&crop=face', role: 'Student' },
    { id: 22, name: 'Sarah Kim', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face', role: 'Student' },
    { id: 23, name: 'Faculty Advisor', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face', role: 'Supervisor' }
  ],
  budget: {
    total: 8000,
    spent: 2500,
    categories: [
      { name: 'Travel', budgeted: 3000, spent: 1200 },
      { name: 'Accommodation', budgeted: 3000, spent: 1000 },
      { name: 'Meals', budgeted: 1500, spent: 300 },
      { name: 'Registration', budgeted: 500, spent: 0 }
    ]
  },
  itinerary: [
    {
      date: '2025-03-01',
      events: [
        { time: '08:00', title: 'Departure from Bloomington', location: 'Indiana University', type: 'travel' },
        { time: '14:00', title: 'Arrival in Austin', location: 'Austin-Bergstrom Airport', type: 'travel' },
        { time: '16:00', title: 'Championship Registration', location: 'UT Austin Student Union', type: 'meeting' },
        { time: '18:00', title: 'Team Strategy Meeting', location: 'Hotel Conference Room', type: 'meeting' }
      ]
    }
  ],
  roster: [
    {
      id: '20',
      name: 'Prof. Michael Davis',
      email: 'mdavis@indiana.edu',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face',
      role: 'Teacher',
      credentialLevel: 'AllAccess',
      permissions: ['team-management', 'academic-access'],
      roomPreferences: ['single-room', 'quiet-floor'],
      dietaryRestrictions: []
    },
    {
      id: '21',
      name: 'Alex Johnson',
      email: 'ajohnson@iu.edu',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=40&h=40&fit=crop&crop=face',
      role: 'Student',
      credentialLevel: 'Backstage',
      permissions: ['competition-access'],
      roomPreferences: ['shared-room'],
      dietaryRestrictions: ['vegan']
    },
    {
      id: '22',
      name: 'Sarah Kim',
      email: 'skim@iu.edu',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face',
      role: 'Student',
      credentialLevel: 'Backstage',
      permissions: ['competition-access'],
      roomPreferences: ['shared-room'],
      dietaryRestrictions: []
    },
    {
      id: '23',
      name: 'Faculty Advisor',
      email: 'advisor@indiana.edu',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face',
      role: 'Supervisor',
      credentialLevel: 'AllAccess',
      permissions: ['academic-supervision'],
      roomPreferences: ['single-room']
    }
  ],
  roomAssignments: [
    {
      id: 'room-iu1',
      room: 'Rooms 305-306',
      hotel: 'Hilton Austin',
      occupants: ['21', '22'],
      checkIn: '2025-03-01T15:00:00Z',
      checkOut: '2025-03-06T11:00:00Z',
      roomType: 'connecting',
      specialRequests: ['study-area', 'quiet-floor']
    }
  ],
  equipment: [],
  schedule: [
    {
      id: 'sched-iu1',
      type: 'meeting',
      title: 'Preliminary Rounds',
      startTime: '2025-03-02T09:00:00Z',
      endTime: '2025-03-02T17:00:00Z',
      location: 'UT Austin Debate Halls',
      participants: ['20', '21', '22', '23'],
      priority: 'critical',
      notes: 'Multiple debate rounds throughout the day'
    }
  ],
  perDiem: {
    dailyRate: 40,
    currency: 'USD',
    startDate: '2025-03-01',
    endDate: '2025-03-06',
    participants: [
      { participantId: '21', customRate: 40, advances: 0, deductions: 0, balance: 200 },
      { participantId: '22', customRate: 40, advances: 0, deductions: 0, balance: 200 }
    ]
  },
  settlement: [],
  medical: [],
  compliance: [
    {
      id: 'comp-iu1',
      type: 'NCAA',
      title: 'Academic Competition Compliance',
      description: 'Students must maintain academic standing for competition',
      deadline: '2025-02-28',
      status: 'compliant',
      assignedTo: '20',
      documents: ['academic-records.pdf']
    }
  ],
  media: [],
  sponsors: []
};
