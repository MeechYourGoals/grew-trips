import { EventData } from '../../types/events';

export const googleIO2026Event: EventData = {
  id: 'google-io-2026',
  title: 'Google I/O 2026 – Speakers & Demo Team',
  location: 'Mountain View, CA',
  dateRange: 'May 12 - May 15, 2026',
  category: 'Tech Conference',
  description: 'Google\'s annual developer conference showcasing latest innovations',
  tags: ['Technology', 'Developer', 'AI', 'Android', 'Cloud'],
  participants: [
    { id: 1, name: 'Sundar Pichai', avatar: '/images/avatars/blank-13.png', role: 'Keynote Speaker' },
    { id: 2, name: 'Aparna Pappu', avatar: '/images/avatars/blank-14.png', role: 'Demo Lead' },
    { id: 3, name: 'Jordan Tigani', avatar: '/images/avatars/blank-15.png', role: 'BigQuery PM' },
    { id: 4, name: 'Maya Chen', avatar: '/images/avatars/blank-16.png', role: 'Developer Advocate' }
  ],
  itinerary: [
    {
      date: '2026-05-12',
      events: [
        { title: 'Keynote Setup', location: 'Shoreline Amphitheatre', time: '08:00' },
        { title: 'Opening Keynote', location: 'Main Stage', time: '10:00' },
        { title: 'Developer Sessions', location: 'Various Venues', time: '14:00' }
      ]
    }
  ],
  budget: {
    total: 8000000,
    spent: 4500000,
    categories: [
      { name: 'Venue', allocated: 3000000, spent: 2000000 },
      { name: 'Technology', allocated: 2500000, spent: 1500000 },
      { name: 'Speakers', allocated: 1500000, spent: 800000 },
      { name: 'Catering', allocated: 1000000, spent: 200000 }
    ]
  },
  groupChatEnabled: true,
  attendanceExpected: 7500,
  capacity: 7500,
  registrationStatus: 'open',
  checkedInCount: 0,
  userRole: 'organizer',
  tracks: [
    { id: 'ai-ml', name: 'AI & Machine Learning', color: '#4285F4', location: 'Building A' },
    { id: 'android', name: 'Android Development', color: '#34A853', location: 'Building B' },
    { id: 'cloud', name: 'Google Cloud', color: '#FBBC05', location: 'Building C' }
  ],
  speakers: [
    {
      id: 'sundar-pichai',
      name: 'Sundar Pichai',
      title: 'CEO',
      company: 'Google',
      bio: 'CEO of Google and Alphabet, leading the company\'s technology strategy.',
      avatar: '/images/avatars/blank-13.png',
      sessions: ['keynote-main'],
      socialLinks: {
        twitter: 'https://twitter.com/sundarpichai'
      }
    }
  ],
  sessions: [
    {
      id: 'keynote-main',
      title: 'The Future of AI',
      description: 'Sundar Pichai presents Google\'s latest AI innovations.',
      speaker: 'sundar-pichai',
      track: 'ai-ml',
      startTime: '10:00',
      endTime: '11:00',
      location: 'Main Stage',
      capacity: 7500,
      rsvpCount: 7500
    }
  ],
  sponsors: [],
  exhibitors: []
};