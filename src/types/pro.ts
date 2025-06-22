
export interface Tour {
  id: string;
  name: string;
  description?: string;
  artistName: string;
  startDate: string;
  endDate: string;
  trips: TourTrip[];
  teamMembers: TeamMember[];
  createdAt: string;
  updatedAt: string;
}

export interface TourTrip {
  id: string;
  tourId: string;
  city: string;
  venue: string;
  date: string;
  category: 'headline' | 'private' | 'college' | 'festival' | 'corporate';
  status: 'planned' | 'confirmed' | 'completed' | 'cancelled';
  participants: TeamMember[];
  notes?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'artist' | 'manager' | 'assistant' | 'crew' | 'security' | 'photographer' | 'videographer' | 'label-rep' | 'venue-rep';
  permissions: 'admin' | 'editor' | 'viewer';
  isActive: boolean;
}

export interface ProSubscription {
  userId: string;
  plan: 'basic' | 'plus' | 'premium' | 'pro';
  status: 'active' | 'trial' | 'cancelled' | 'expired';
  trialEndsAt?: string;
  subscriptionEndsAt?: string;
}

export interface Broadcast {
  id: string;
  senderId: string;
  message: string;
  targetTrips: string[]; // empty array means all trips
  priority: 'normal' | 'urgent';
  timestamp: string;
  readBy: string[];
}
