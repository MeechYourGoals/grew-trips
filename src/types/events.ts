
export interface Track {
  id: string;
  name: string;
  color: string;
  location: string;
}

export interface Speaker {
  id: string;
  name: string;
  title: string;
  company: string;
  bio: string;
  avatar: string;
  sessions: string[];
  socialLinks?: {
    twitter?: string;
    linkedin?: string;
    website?: string;
  };
}

export interface Session {
  id: string;
  title: string;
  description: string;
  speaker: string; // Speaker ID
  track: string; // Track ID
  startTime: string;
  endTime: string;
  location: string;
  capacity: number;
  rsvpCount: number;
  materials?: {
    title: string;
    url: string;
    type: 'slides' | 'document' | 'video';
  }[];
}

export interface Sponsor {
  id: string;
  name: string;
  tier: 'platinum' | 'gold' | 'silver' | 'bronze';
  logo: string;
  website: string;
  description: string;
  booth?: string;
}

export interface Exhibitor {
  id: string;
  name: string;
  description: string;
  booth: string;
  logo: string;
  website: string;
  contacts: {
    name: string;
    role: string;
    email: string;
  }[];
}

export type EventUserRole = 'organizer' | 'speaker' | 'exhibitor' | 'attendee';

export interface EventData {
  id: string;
  title: string;
  location: string;
  dateRange: string;
  category: string;
  description: string;
  tags: string[];
  capacity: number;
  registrationStatus: 'open' | 'closed' | 'waitlist';
  attendanceExpected: number;
  groupChatEnabled: boolean;
  
  // Event-specific features
  tracks: Track[];
  speakers: Speaker[];
  sessions: Session[];
  sponsors: Sponsor[];
  exhibitors: Exhibitor[];
  
  // User context
  userRole: EventUserRole;
  
  // Analytics
  checkedInCount: number;
  
  // Enhanced participant data
  participants: Array<{
    id: number;
    name: string;
    avatar: string;
    role: string;
    userRole?: EventUserRole;
    checkedIn?: boolean;
  }>;
  
  // Budget with sponsor revenue
  budget: {
    total: number;
    spent: number;
    sponsorRevenue?: number;
    categories: Array<{
      name: string;
      allocated: number;
      spent: number;
    }>;
  };
  
  // Basic trip data for compatibility
  itinerary: Array<{
    date: string;
    events: Array<{
      title: string;
      location: string;
      time: string;
    }>;
  }>;
}
