import { ProTripData } from '../../types/pro';

export const nvidiaBowlingNight: ProTripData = {
  id: 'nvidia-bowling-2025',
  title: 'NVIDIA Santa Clara — Employee Bowling Night',
  location: 'Santa Clara, CA',
  dateRange: 'Dec 8, 2025',
  category: 'Team-Building',
  tags: ['Corporate Event', 'Tech', 'Entertainment', 'Employee Engagement'],
  participants: [
    { id: 1, name: 'Jensen Huang', avatar: '/images/avatars/blank-09.png', role: 'Host' },
    { id: 2, name: 'Colette Kress', avatar: '/images/avatars/blank-10.png', role: 'CFO' },
    { id: 3, name: 'Mark Stevens', avatar: '/images/avatars/blank-11.png', role: 'People Ops' },
    { id: 4, name: 'Lena Ko', avatar: '/images/avatars/blank-12.png', role: 'Event Planner' }
  ],
  roster: [
    { id: '1', name: 'Jensen Huang', role: 'Host', email: 'jensen@nvidia.com', avatar: '/images/avatars/blank-09.png', credentialLevel: 'AllAccess', permissions: ['admin'], roomPreferences: [], dietaryRestrictions: [], medicalNotes: '' },
    { id: '2', name: 'Colette Kress', role: 'CFO', email: 'colette@nvidia.com', avatar: '/images/avatars/blank-10.png', credentialLevel: 'AllAccess', permissions: ['admin'], roomPreferences: [], dietaryRestrictions: [], medicalNotes: '' },
    { id: '3', name: 'Mark Stevens', role: 'People Ops', email: 'mark@nvidia.com', avatar: '/images/avatars/blank-11.png', credentialLevel: 'Backstage', permissions: ['editor'], roomPreferences: [], dietaryRestrictions: [], medicalNotes: '' },
    { id: '4', name: 'Lena Ko', role: 'Event Planner', email: 'lena@nvidia.com', avatar: '/images/avatars/blank-12.png', credentialLevel: 'Guest', permissions: ['editor'], roomPreferences: [], dietaryRestrictions: [], medicalNotes: '' }
  ],
  itinerary: [
    {
      date: '2025-12-08',
      events: [
        { title: 'Team Check-in', location: 'AMF Moonlite Lanes', time: '18:00', type: 'event' },
        { title: 'Bowling Tournament', location: 'AMF Moonlite Lanes', time: '18:30', type: 'event' },
        { title: 'Awards & Dinner', location: 'AMF Moonlite Lanes', time: '21:00', type: 'event' }
      ]
    }
  ],
  budget: {
    total: 12000,
    spent: 8500,
    categories: [
      { name: 'Venue', budgeted: 5000, spent: 4000 },
      { name: 'Food & Drinks', budgeted: 4000, spent: 3000 },
      { name: 'Prizes', budgeted: 2000, spent: 1000 },
      { name: 'Transportation', budgeted: 1000, spent: 500 }
    ]
  },
  groupChatEnabled: true,
  schedule: [
    {
      id: 'bowling-1',
      title: 'Team Bowling Tournament',
      location: 'AMF Moonlite Lanes',
      startTime: '2025-12-08T18:30:00Z',
      endTime: '2025-12-08T21:00:00Z',
      type: 'meeting',
      participants: ['1', '2', '3', '4'],
      priority: 'medium'
    }
  ],
  roomAssignments: [],
  equipment: []
};