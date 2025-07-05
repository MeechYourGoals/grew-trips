export interface TripParticipant {
  id: number;
  name: string;
  avatar: string;
}

export interface Trip {
  id: number;
  title: string;
  location: string;
  dateRange: string;
  description: string;
  participants: TripParticipant[];
}

export const tripsData: Trip[] = [
  {
    id: 1,
    title: "Spring Break Cancun 2026 Kappa Alpha Psi Trip",
    location: "Cancun, Mexico",
    dateRange: "Mar 15 - Mar 22, 2026",
    description: "Brotherhood spring break getaway with beach activities, nightlife, and bonding experiences",
    participants: [
      { id: 1, name: "Marcus", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face" },
      { id: 2, name: "Jamal", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face" },
      { id: 3, name: "Darius", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face" },
      { id: 4, name: "Terrell", avatar: "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=40&h=40&fit=crop&crop=face" },
      { id: 5, name: "Jerome", avatar: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=40&h=40&fit=crop&crop=face" }
    ]
  },
  {
    id: 2,
    title: "Tokyo Adventure",
    location: "Tokyo, Japan",
    dateRange: "Oct 5 - Oct 15, 2025",
    description: "Cultural exploration of Japan's capital with temples, modern tech districts, and amazing cuisine",
    participants: [
      { id: 4, name: "Alex", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face" },
      { id: 5, name: "Maria", avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=40&h=40&fit=crop&crop=face" },
      { id: 6, name: "David", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face" }
    ]
  },
  {
    id: 3,
    title: "Jack and Jill's destination wedding",
    location: "Bali, Indonesia",
    dateRange: "Dec 10 - Dec 20, 2025",
    description: "Romantic destination wedding celebration with family and friends in paradise",
    participants: [
      { id: 7, name: "Jack", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face" },
      { id: 8, name: "Jill", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=40&h=40&fit=crop&crop=face" },
      { id: 9, name: "Steve", avatar: "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=40&h=40&fit=crop&crop=face" },
      { id: 10, name: "Emma", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face" }
    ]
  },
  {
    id: 4,
    title: "Kristen's Bachelorette Party",
    location: "Nashville, TN",
    dateRange: "Nov 8 - Nov 10, 2025",
    description: "Epic bachelorette celebration with honky-tonk bars, live music, and unforgettable memories",
    participants: [
      { id: 10, name: "Kristen", avatar: "https://images.unsplash.com/photo-1506634572416-48cdfe530110?w=40&h=40&fit=crop&crop=face" },
      { id: 11, name: "Ashley", avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=40&h=40&fit=crop&crop=face" },
      { id: 12, name: "Megan", avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=40&h=40&fit=crop&crop=face" },
      { id: 13, name: "Taylor", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face" },
      { id: 14, name: "Sam", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=40&h=40&fit=crop&crop=face" },
      { id: 15, name: "Jenna", avatar: "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=40&h=40&fit=crop&crop=face" }
    ]
  },
  {
    id: 5,
    title: "Coachella Squad 2026",
    location: "Indio, CA",
    dateRange: "Apr 10 - Apr 13, 2026",
    description: "Music festival adventure with top artists, desert vibes, and group camping",
    participants: [
      { id: 16, name: "Tyler", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face" },
      { id: 17, name: "Zoe", avatar: "https://images.unsplash.com/photo-1506634572416-48cdfe530110?w=40&h=40&fit=crop&crop=face" },
      { id: 18, name: "Mason", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face" },
      { id: 19, name: "Chloe", avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=40&h=40&fit=crop&crop=face" },
      { id: 20, name: "Jordan", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face" }
    ]
  },
  {
    id: 6,
    title: "Johnson Family Summer Vacay",
    location: "Aspen, CO",
    dateRange: "Jul 20 - Jul 28, 2025",
    description: "Multi-generational family retreat with hiking, spa time, and quality family bonding",
    participants: [
      { id: 21, name: "Dad (Mike)", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face" },
      { id: 22, name: "Mom (Linda)", avatar: "https://images.unsplash.com/photo-1506634572416-48cdfe530110?w=40&h=40&fit=crop&crop=face" },
      { id: 23, name: "Katie", avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=40&h=40&fit=crop&crop=face" },
      { id: 24, name: "Tommy", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face" },
      { id: 25, name: "Grandma Pat", avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=40&h=40&fit=crop&crop=face" }
    ]
  },
  {
    id: 7,
    title: "Fantasy Football Chat's Annual Golf Outing",
    location: "Phoenix, Arizona",
    dateRange: "Feb 20 - Feb 23, 2025",
    description: "Annual guys' golf trip with tournaments, poker nights, and fantasy football draft",
    participants: [
      { id: 26, name: "Commissioner Mike", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face" },
      { id: 27, name: "Big Rob", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face" },
      { id: 28, name: "Tony", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face" },
      { id: 29, name: "Dave", avatar: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=40&h=40&fit=crop&crop=face" },
      { id: 30, name: "Chris", avatar: "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=40&h=40&fit=crop&crop=face" },
      { id: 31, name: "Steve", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face" }
    ]
  },
  {
    id: 8,
    title: "Harris Middle School's 8th Grade Field Trip to Washington DC",
    location: "Washington, DC",
    dateRange: "Apr 15 - Apr 18, 2025",
    description: "Educational field trip exploring American history and government with museum visits",
    participants: [
      { id: 32, name: "Ms. Johnson", avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=40&h=40&fit=crop&crop=face" },
      { id: 33, name: "Mr. Davis", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face" },
      { id: 34, name: "Mrs. Garcia", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face" },
      { id: 35, name: "Mr. Thompson", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face" },
      { id: 36, name: "Principal Adams", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=40&h=40&fit=crop&crop=face" }
    ]
  }
];

export const getTripById = (id: number): Trip | null => {
  return tripsData.find(trip => trip.id === id) || null;
};

export const generateTripMockData = (trip: Trip) => {
  const participantNames = trip.participants.map(p => p.name);
  
  return {
    basecamp: {
      name: `${trip.location.split(',')[0]} Base Hotel`,
      address: `123 Main Street, ${trip.location}`
    },
    broadcasts: [
      { 
        id: 1, 
        senderName: participantNames[0] || "Organizer", 
        content: `Looking forward to ${trip.title}! Everything is confirmed and ready to go.`, 
        timestamp: "2025-01-15T15:30:00Z" 
      },
      { 
        id: 2, 
        senderName: participantNames[1] || "Coordinator", 
        content: `Just confirmed all arrangements for ${trip.location}. This is going to be amazing!`, 
        timestamp: "2025-01-15T10:00:00Z" 
      }
    ],
    links: [
      { id: 1, title: `Our Accommodation in ${trip.location.split(',')[0]}`, url: "https://example.com/accommodation", category: "Accommodation" },
      { id: 2, title: `${trip.location.split(',')[0]} Attractions Guide`, url: "https://example.com/attractions", category: "Attractions" },
      { id: 3, title: `Best Restaurants in ${trip.location.split(',')[0]}`, url: "https://example.com/restaurants", category: "Food" }
    ],
    itinerary: [
      {
        date: trip.dateRange.split(' - ')[0].replace(/\w{3} /, '2025-03-'),
        events: [
          { title: "Arrival & Check-in", location: `${trip.location.split(',')[0]} Base Hotel`, time: "14:00" },
          { title: "Welcome Dinner", location: `Local Restaurant in ${trip.location.split(',')[0]}`, time: "19:30" }
        ]
      }
    ]
  };
};