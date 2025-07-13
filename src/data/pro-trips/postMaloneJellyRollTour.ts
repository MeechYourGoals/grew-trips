import { ProTripData } from '../../types/pro';

export const postMaloneJellyRollTour: ProTripData = {
  id: 'postmalone-jellyroll-tour-2026',
  title: 'Post Malone × Jelly Roll — Stadium Tour 2026',
  location: 'Multiple Cities, USA',
  dateRange: 'Jun 1 - Sep 30, 2026',
  category: 'Music Tour',
  tags: ['Stadium', 'North America', 'Hip-Hop', 'Country Rock'],
  participants: [
    { id: 1, name: 'Post Malone', avatar: '/images/avatars/blank-01.png', role: 'Headliner' },
    { id: 2, name: 'Jelly Roll', avatar: '/images/avatars/blank-02.png', role: 'Co-Headliner' },
    { id: 3, name: 'Dre London', avatar: '/images/avatars/blank-03.png', role: 'Tour Manager' },
    { id: 4, name: 'Marissa Jones', avatar: '/images/avatars/blank-04.png', role: 'Production Director' }
  ],
  roster: [
    { id: '1', name: 'Post Malone', role: 'Headliner', email: 'postmalone@tour.com', avatar: '/images/avatars/blank-01.png', credentialLevel: 'AllAccess', permissions: ['admin'], roomPreferences: [], dietaryRestrictions: [], medicalNotes: '' },
    { id: '2', name: 'Jelly Roll', role: 'Co-Headliner', email: 'jellyroll@tour.com', avatar: '/images/avatars/blank-02.png', credentialLevel: 'AllAccess', permissions: ['admin'], roomPreferences: [], dietaryRestrictions: [], medicalNotes: '' },
    { id: '3', name: 'Dre London', role: 'Tour Manager', email: 'dre@tour.com', avatar: '/images/avatars/blank-03.png', credentialLevel: 'Backstage', permissions: ['admin'], roomPreferences: [], dietaryRestrictions: [], medicalNotes: '' },
    { id: '4', name: 'Marissa Jones', role: 'Production Director', email: 'marissa@tour.com', avatar: '/images/avatars/blank-04.png', credentialLevel: 'Backstage', permissions: ['editor'], roomPreferences: [], dietaryRestrictions: [], medicalNotes: '' }
  ],
  itinerary: [
    {
      date: '2026-06-01',
      events: [
        { title: 'Tour Kickoff - Chicago', location: 'Soldier Field', time: '19:00', type: 'event' },
        { title: 'Sound Check', location: 'Soldier Field', time: '16:00', type: 'event' }
      ]
    }
  ],
  budget: {
    total: 15000000,
    spent: 8500000,
    categories: [
      { name: 'Venues', budgeted: 6000000, spent: 3500000 },
      { name: 'Production', budgeted: 4000000, spent: 2800000 },
      { name: 'Crew', budgeted: 3000000, spent: 1200000 },
      { name: 'Marketing', budgeted: 2000000, spent: 1000000 }
    ]
  },
  groupChatEnabled: true,
  schedule: [
    {
      id: 'show-1',
      title: 'Chicago Stadium Show',
      location: 'Soldier Field, Chicago',
      startTime: '2026-06-01T19:00:00Z',
      endTime: '2026-06-01T22:00:00Z',
      type: 'show',
      participants: ['1', '2'],
      priority: 'high'
    }
  ],
  roomAssignments: [],
  equipment: []
};