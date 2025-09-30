import { ProTripData } from '../../types/pro';

export const goldmanSachsRecruiting: ProTripData = {
  id: 'gs-campus-gt-2025',
  title: 'Goldman Sachs Campus-Recruiting Trip — Georgia Tech',
  description: 'Campus recruiting visit to Georgia Tech featuring CEO keynote and networking events.',
  location: 'Atlanta, GA',
  dateRange: 'Sep 18 - Sep 19, 2025',
  category: 'Business Travel',
  tags: ['Recruiting', 'Finance', 'Campus', 'Investment Banking'],
  basecamp_name: 'Georgia Tech Student Center',
  basecamp_address: '350 Ferst Drive NW, Atlanta, GA 30332',
  broadcasts: [],
  participants: [
    { id: 1, name: 'David Solomon', avatar: '/images/avatars/blank-05.png', role: 'CEO Speaker' },
    { id: 2, name: 'Rachel Ma', avatar: '/images/avatars/blank-06.png', role: 'Campus Lead' },
    { id: 3, name: 'Luis Vargas', avatar: '/images/avatars/blank-07.png', role: 'Analyst Panelist' },
    { id: 4, name: 'Priya Dhillon', avatar: '/images/avatars/blank-08.png', role: 'HR Coordinator' }
  ],
  roster: [
    { id: '1', name: 'David Solomon', role: 'CEO Speaker', email: 'david.solomon@gs.com', avatar: '/images/avatars/blank-05.png', credentialLevel: 'AllAccess', permissions: ['admin'], roomPreferences: [], dietaryRestrictions: [], medicalNotes: '' },
    { id: '2', name: 'Rachel Ma', role: 'Campus Lead', email: 'rachel.ma@gs.com', avatar: '/images/avatars/blank-06.png', credentialLevel: 'Backstage', permissions: ['editor'], roomPreferences: [], dietaryRestrictions: [], medicalNotes: '' },
    { id: '3', name: 'Luis Vargas', role: 'Analyst Panelist', email: 'luis.vargas@gs.com', avatar: '/images/avatars/blank-07.png', credentialLevel: 'Backstage', permissions: ['editor'], roomPreferences: [], dietaryRestrictions: [], medicalNotes: '' },
    { id: '4', name: 'Priya Dhillon', role: 'HR Coordinator', email: 'priya.dhillon@gs.com', avatar: '/images/avatars/blank-08.png', credentialLevel: 'Guest', permissions: ['viewer'], roomPreferences: [], dietaryRestrictions: [], medicalNotes: '' }
  ],
  itinerary: [
    {
      date: '2025-09-18',
      events: [
        { title: 'Campus Arrival & Setup', location: 'Georgia Tech Student Center', time: '09:00', type: 'event' },
        { title: 'CEO Keynote', location: 'Klaus Advanced Computing Building', time: '14:00', type: 'event' },
        { title: 'Networking Reception', location: 'Tech Square', time: '18:00', type: 'event' }
      ]
    }
  ],
  budget: {
    total: 75000,
    spent: 45000,
    categories: [
      { name: 'Travel', budgeted: 25000, spent: 18000 },
      { name: 'Venue', budgeted: 20000, spent: 15000 },
      { name: 'Catering', budgeted: 15000, spent: 8000 },
      { name: 'Materials', budgeted: 15000, spent: 4000 }
    ]
  },
  schedule: [
    {
      id: 'keynote-1',
      title: 'CEO Keynote: Future of Finance',
      location: 'Klaus Advanced Computing Building',
      startTime: '2025-09-18T14:00:00Z',
      endTime: '2025-09-18T15:00:00Z',
      type: 'meeting',
      participants: ['1'],
      priority: 'high'
    }
  ],
  roomAssignments: [],
  equipment: [],
  perDiem: { dailyRate: 200, currency: 'USD', startDate: '2025-09-18', endDate: '2025-09-19', participants: [] },
  settlement: [],
  medical: [],
  compliance: [],
  media: [],
  sponsors: []
};