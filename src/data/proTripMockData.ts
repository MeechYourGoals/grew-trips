import { ProTripData } from '../types/pro';

export const proTripMockData: Record<string, ProTripData> = {
  'lakers-road-trip': {
    id: 'lakers-road-trip',
    title: 'Lakers Road Trip - Eastern Conference',
    location: 'Boston, MA → New York, NY → Philadelphia, PA',
    dateRange: 'Jan 15 - Jan 22, 2025',
    category: 'Sports – Team Trip',
    description: 'Professional basketball team road trip covering 3 games in 7 days',
    tags: ['Basketball', 'NBA', 'Road Trip', 'Professional Sports'],
    participants: [
      { id: 1, name: 'Coach Johnson', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face', role: 'Head Coach' },
      { id: 2, name: 'Sarah Martinez', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=40&h=40&fit=crop&crop=face', role: 'Team Manager' },
      { id: 3, name: 'Mike Thompson', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face', role: 'Player' },
      { id: 4, name: 'Dr. Lisa Chen', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face', role: 'Team Physician' }
    ],
    roster: [
      {
        id: 'coach-1',
        name: 'Coach Johnson',
        email: 'coach@lakers.com',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face',
        role: 'coach',
        permissions: 'admin',
        isActive: true,
        credentials: ['All-Access', 'Bench', 'Locker Room'],
        roomAssignment: 'Suite 401',
        accessLevel: 'all-areas'
      },
      {
        id: 'player-1',
        name: 'Mike Thompson',
        email: 'mike.thompson@lakers.com',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face',
        role: 'player',
        permissions: 'talent',
        isActive: true,
        credentials: ['Player Areas', 'Court Access'],
        roomAssignment: 'Room 305',
        medicalNotes: 'Knee monitoring required',
        accessLevel: 'backstage'
      },
      {
        id: 'manager-1',
        name: 'Sarah Martinez',
        email: 'sarah@lakers.com',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=40&h=40&fit=crop&crop=face',
        role: 'manager',
        permissions: 'admin',
        isActive: true,
        credentials: ['Management', 'Press Area', 'VIP Access'],
        roomAssignment: 'Suite 402',
        accessLevel: 'all-areas'
      }
    ],
    roomAssignments: [
      {
        id: 'room-1',
        roomNumber: 'Suite 401',
        participants: ['coach-1'],
        roomType: 'suite',
        hotel: 'Four Seasons Boston',
        checkIn: '2025-01-15T15:00:00Z',
        checkOut: '2025-01-17T11:00:00Z'
      },
      {
        id: 'room-2',
        roomNumber: 'Room 305',
        participants: ['player-1'],
        roomType: 'single',
        hotel: 'Four Seasons Boston',
        checkIn: '2025-01-15T15:00:00Z',
        checkOut: '2025-01-17T11:00:00Z'
      }
    ],
    equipment: [
      {
        id: 'eq-1',
        name: 'Team Uniforms - Home',
        category: 'jerseys',
        status: 'arrived',
        trackingNumber: 'TRK123456',
        responsiblePerson: 'Equipment Manager',
        value: 15000
      },
      {
        id: 'eq-2',
        name: 'Medical Equipment Kit',
        category: 'transport',
        status: 'packed',
        responsiblePerson: 'Dr. Lisa Chen',
        value: 25000
      },
      {
        id: 'eq-3',
        name: 'Team Basketballs (12)',
        category: 'transport',
        status: 'shipped',
        trackingNumber: 'TRK789012',
        responsiblePerson: 'Assistant Coach',
        value: 800
      }
    ],
    schedule: [
      {
        id: 'sched-1',
        eventType: 'practice',
        startTime: '2025-01-16T10:00:00Z',
        endTime: '2025-01-16T12:00:00Z',
        location: 'TD Garden Practice Court',
        crew: ['coach-1', 'player-1'],
        equipment: ['eq-3'],
        notes: 'Light practice before game'
      }
    ],
    perDiem: {
      dailyRate: 150,
      currency: 'USD',
      deductions: [],
      advances: [
        {
          date: '2025-01-15',
          amount: 500,
          recipient: 'Mike Thompson'
        }
      ]
    },
    settlements: [],
    medicalLog: [
      {
        id: 'med-1',
        participantId: 'player-1',
        date: '2025-01-15',
        type: 'checkup',
        description: 'Routine knee assessment',
        status: 'active',
        restrictedActivities: ['Heavy practice'],
        medicalStaff: 'Dr. Lisa Chen',
        private: true
      }
    ],
    compliance: [
      {
        id: 'comp-1',
        type: 'union',
        description: 'Player rest requirements must be met',
        status: 'compliant',
        assignedTo: 'Sarah Martinez',
        documents: ['Union Agreement 2025']
      }
    ],
    mediaSlots: [],
    sponsorActivations: [],
    budget: {
      total: 85000,
      spent: 45000,
      categories: [
        { name: 'Accommodation', budgeted: 35000, spent: 25000 },
        { name: 'Transport', budgeted: 25000, spent: 15000 },
        { name: 'Meals', budgeted: 15000, spent: 5000 },
        { name: 'Medical', budgeted: 10000, spent: 0 }
      ]
    },
    itinerary: [
      {
        date: '2025-01-16',
        events: [
          { time: '10:00', title: 'Team Practice', location: 'TD Garden Practice Court', type: 'practice' },
          { time: '19:00', title: 'vs Boston Celtics', location: 'TD Garden', type: 'game' }
        ]
      }
    ]
  },
  'taylor-swift-eras-tour': {
    id: 'taylor-swift-eras-tour',
    title: 'The Eras Tour - International Leg',
    location: 'London, UK → Paris, FR → Berlin, DE',
    dateRange: 'Jun 10 - Jun 25, 2025',
    category: 'Touring',
    description: 'International stadium tour covering 3 major European cities',
    tags: ['Music', 'Tour', 'International', 'Stadium'],
    participants: [
      { id: 5, name: 'Taylor Swift', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=40&h=40&fit=crop&crop=face', role: 'Artist' },
      { id: 6, name: 'Andrea Swift', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face', role: 'Tour Manager' },
      { id: 7, name: 'Travis Kelce', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face', role: 'Guest' },
      { id: 8, name: 'Sound Engineer', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face', role: 'Crew' }
    ],
    roster: [
      {
        id: 'artist-1',
        name: 'Taylor Swift',
        email: 'taylor@taylornation.com',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=40&h=40&fit=crop&crop=face',
        role: 'artist',
        permissions: 'talent',
        isActive: true,
        credentials: ['Artist Areas', 'VIP Access', 'Stage Access'],
        roomAssignment: 'Presidential Suite',
        accessLevel: 'all-areas'
      },
      {
        id: 'tour-mgr-1',
        name: 'Andrea Swift',
        email: 'andrea@taylornation.com',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face',
        role: 'tour-mgr',
        permissions: 'admin',
        isActive: true,
        credentials: ['All-Access', 'Management', 'Production'],
        roomAssignment: 'Suite 1A',
        accessLevel: 'all-areas'
      },
      {
        id: 'sound-1',
        name: 'John Mitchell',
        email: 'john@soundcrew.com',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face',
        role: 'sound-engineer',
        permissions: 'staff',
        isActive: true,
        credentials: ['Stage Access', 'Equipment Areas'],
        roomAssignment: 'Room 205',
        accessLevel: 'backstage'
      }
    ],
    roomAssignments: [
      {
        id: 'room-suite',
        roomNumber: 'Presidential Suite',
        participants: ['artist-1'],
        roomType: 'suite',
        hotel: 'The Savoy London',
        checkIn: '2025-06-10T14:00:00Z',
        checkOut: '2025-06-13T12:00:00Z'
      }
    ],
    equipment: [
      {
        id: 'eq-guitar-1',
        name: 'Taylor Acoustic Guitar Collection',
        category: 'instruments',
        status: 'arrived',
        trackingNumber: 'MUS001',
        responsiblePerson: 'Guitar Tech',
        value: 50000
      },
      {
        id: 'eq-sound-1',
        name: 'Main Sound System',
        category: 'sound',
        status: 'shipped',
        trackingNumber: 'SND001',
        responsiblePerson: 'John Mitchell',
        value: 200000
      },
      {
        id: 'eq-staging-1',
        name: 'Stage Backdrop & Props',
        category: 'signage',
        status: 'packed',
        responsiblePerson: 'Production Manager',
        value: 75000
      }
    ],
    schedule: [
      {
        id: 'load-in-1',
        eventType: 'load-in',
        startTime: '2025-06-11T06:00:00Z',
        endTime: '2025-06-11T14:00:00Z',
        location: 'Wembley Stadium',
        crew: ['tour-mgr-1', 'sound-1'],
        equipment: ['eq-sound-1', 'eq-staging-1'],
        notes: 'Full production load-in'
      },
      {
        id: 'soundcheck-1',
        eventType: 'sound-check',
        startTime: '2025-06-11T16:00:00Z',
        endTime: '2025-06-11T18:00:00Z',
        location: 'Wembley Stadium Main Stage',
        crew: ['artist-1', 'sound-1'],
        equipment: ['eq-guitar-1', 'eq-sound-1'],
        notes: 'Full band soundcheck with all instruments'
      }
    ],
    perDiem: {
      dailyRate: 200,
      currency: 'GBP',
      deductions: [],
      advances: []
    },
    settlements: [
      {
        guarantee: 2000000,
        actualRevenue: 2500000,
        merchPercentage: 15,
        merchRevenue: 300000,
        expenses: 450000,
        finalPayout: 2395000,
        date: '2025-06-12',
        venue: 'Wembley Stadium'
      }
    ],
    medicalLog: [],
    compliance: [
      {
        id: 'visa-1',
        type: 'visa',
        description: 'Work permits for EU tour dates',
        deadline: '2025-05-01',
        status: 'compliant',
        assignedTo: 'Andrea Swift',
        documents: ['EU Work Permit', 'Artist Visa']
      }
    ],
    mediaSlots: [
      {
        id: 'media-1',
        type: 'interview',
        participant: 'artist-1',
        outlet: 'BBC Radio 1',
        startTime: '2025-06-11T11:00:00Z',
        duration: 30,
        location: 'Hotel Suite',
        requirements: ['Quiet room', 'Good lighting'],
        status: 'scheduled'
      }
    ],
    sponsorActivations: [
      {
        id: 'sponsor-1',
        sponsor: 'Mastercard',
        activity: 'VIP Meet & Greet',
        deadline: '2025-06-12T19:00:00Z',
        status: 'pending',
        assignedTo: 'Andrea Swift',
        deliverables: ['Photo opportunities', 'Signed merchandise'],
        notes: '50 VIP cardholders'
      }
    ],
    budget: {
      total: 3500000,
      spent: 1800000,
      categories: [
        { name: 'Production', budgeted: 2000000, spent: 1200000 },
        { name: 'Accommodation', budgeted: 500000, spent: 300000 },
        { name: 'Transport', budgeted: 400000, spent: 200000 },
        { name: 'Catering', budgeted: 300000, spent: 100000 },
        { name: 'Security', budgeted: 300000, spent: 0 }
      ]
    },
    itinerary: [
      {
        date: '2025-06-12',
        events: [
          { time: '16:00', title: 'Soundcheck', location: 'Wembley Stadium', type: 'sound-check' },
          { time: '20:00', title: 'The Eras Tour - Night 1', location: 'Wembley Stadium', type: 'performance' },
          { time: '23:30', title: 'Load-out begins', location: 'Wembley Stadium', type: 'load-out' }
        ]
      }
    ]
  }
};
