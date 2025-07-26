export interface TripContext {
  tripId: string;
  title: string;
  location: string;
  dateRange: {
    start: string;
    end: string;
  } | string;
  participants: Array<{
    id: string;
    name: string;
    role?: string;
  }>;
  itinerary: Array<{
    id: string;
    title: string;
    date: string;
    time?: string;
    location?: string;
    description?: string;
    events?: any[];
  }>;
  accommodation?: {
    name: string;
    address: string;
    checkIn: string;
    checkOut: string;
  } | string;
  currentDate: string;
  upcomingEvents: Array<{
    id: string;
    title: string;
    date: string;
    time?: string;
    location?: string;
  }>;
  recentUpdates: Array<{
    id: string;
    type: string;
    message: string;
    timestamp: string;
  }>;
  confirmationNumbers?: {
    [key: string]: string;
  };
  // Optional properties for legacy support
  isPro?: boolean;
  basecamp?: {
    name: string;
    address: string;
  };
  preferences?: any;
  broadcasts?: any[];
  links?: any[];
  proData?: {
    category: string;
    equipment?: string[];
  };
}