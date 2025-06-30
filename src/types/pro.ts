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
  venueAddress: string;
  date: string;
  category: 'headline' | 'private' | 'college' | 'festival' | 'corporate';
  status: 'planned' | 'confirmed' | 'completed' | 'cancelled';
  participants: TeamMember[];
  notes?: string;
  accommodation?: {
    type: 'hotel' | 'airbnb' | 'other';
    name: string;
    address: string;
    confirmationNumber: string;
    checkIn: string;
    checkOut: string;
    isPrivate?: boolean;
    allowedRoles?: string[];
  };
  transportation?: {
    type: 'flight' | 'train' | 'bus' | 'car' | 'other';
    details: string;
    confirmationNumber: string;
    dateTime: string;
    isPrivate?: boolean;
    allowedRoles?: string[];
  };
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'artist' | 'manager' | 'assistant' | 'crew' | 'security' | 'photographer' | 'videographer' | 'label-rep' | 'venue-rep';
  permissions: 'admin' | 'editor' | 'viewer';
  isActive: boolean;
  organizationId?: string;
  seatId?: string;
}

// New Enterprise SaaS Types
export interface Organization {
  id: string;
  name: string;
  displayName: string;
  subscriptionTier: 'starter' | 'growing' | 'enterprise' | 'enterprise-plus';
  subscriptionStatus: 'active' | 'trial' | 'cancelled' | 'expired';
  seatLimit: number;
  seatsUsed: number;
  billingEmail: string;
  createdAt: string;
  updatedAt: string;
  trialEndsAt?: string;
  subscriptionEndsAt?: string;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
}

export interface OrganizationMember {
  id: string;
  userId: string;
  organizationId: string;
  role: 'owner' | 'admin' | 'member';
  seatId: string;
  joinedAt: string;
  invitedBy: string;
  status: 'active' | 'pending' | 'suspended';
}

export interface OrganizationInvite {
  id: string;
  organizationId: string;
  email: string;
  invitedBy: string;
  role: 'admin' | 'member';
  token: string;
  expiresAt: string;
  status: 'pending' | 'accepted' | 'expired' | 'cancelled';
  createdAt: string;
}

export interface TravelWallet {
  id: string;
  userId: string;
  airlinePrograms: AirlineProgram[];
  hotelPrograms: HotelProgram[];
  rentalCarPrograms: RentalCarProgram[];
  createdAt: string;
  updatedAt: string;
}

export interface AirlineProgram {
  id: string;
  airline: string;
  programName: string;
  membershipNumber: string;
  tier?: string;
  isPreferred: boolean;
}

export interface HotelProgram {
  id: string;
  hotelChain: string;
  programName: string;
  membershipNumber: string;
  tier?: string;
  isPreferred: boolean;
}

export interface RentalCarProgram {
  id: string;
  company: string;
  programName: string;
  membershipNumber: string;
  tier?: string;
  isPreferred: boolean;
}

export interface ProSubscription {
  userId: string;
  organizationId?: string;
  plan: 'starter' | 'growing' | 'enterprise' | 'enterprise-plus';
  status: 'active' | 'trial' | 'cancelled' | 'expired';
  trialEndsAt?: string;
  subscriptionEndsAt?: string;
  isOrganizationOwner: boolean;
}

export interface Broadcast {
  id: string;
  senderId: string;
  message: string;
  targetTrips: string[];
  priority: 'normal' | 'urgent';
  timestamp: string;
  readBy: string[];
}

export interface ProTripParticipant {
  id: number;
  name: string;
  email?: string;
  avatar: string;
  role: string;
}

export interface ProParticipant {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'artist' | 'manager' | 'assistant' | 'crew' | 'security' | 'photographer' | 'videographer' | 'label-rep' | 'venue-rep' | 'player' | 'coach' | 'tour-mgr' | 'guitar-tech' | 'sound-engineer';
  permissions: 'admin' | 'staff' | 'talent';
  isActive: boolean;
  credentials: string[];
  roomAssignment?: string;
  medicalNotes?: string;
  accessLevel: 'all-areas' | 'backstage' | 'venue-only' | 'restricted';
}

export interface RoomAssignment {
  id: string;
  roomNumber: string;
  participants: string[];
  roomType: 'single' | 'double' | 'suite';
  hotel: string;
  checkIn: string;
  checkOut: string;
}

export interface Equipment {
  id: string;
  name: string;
  category: 'instruments' | 'sound' | 'lighting' | 'transport' | 'jerseys' | 'signage';
  status: 'packed' | 'shipped' | 'arrived' | 'missing';
  trackingNumber?: string;
  responsiblePerson: string;
  value: number;
}

export interface ProSchedule {
  id: string;
  eventType: 'load-in' | 'sound-check' | 'practice' | 'load-out' | 'media';
  startTime: string;
  endTime: string;
  location: string;
  crew: string[];
  equipment: string[];
  notes?: string;
}

export interface PerDiemData {
  dailyRate: number;
  currency: string;
  deductions: Array<{
    date: string;
    amount: number;
    reason: string;
  }>;
  advances: Array<{
    date: string;
    amount: number;
    recipient: string;
  }>;
}

export interface SettlementData {
  guarantee: number;
  actualRevenue: number;
  merchPercentage: number;
  merchRevenue: number;
  expenses: number;
  finalPayout: number;
  date: string;
  venue: string;
}

export interface MedicalLog {
  id: string;
  participantId: string;
  date: string;
  type: 'injury' | 'illness' | 'therapy' | 'checkup';
  description: string;
  treatment?: string;
  status: 'active' | 'healing' | 'cleared';
  restrictedActivities: string[];
  medicalStaff: string;
  private: boolean;
}

export interface ComplianceRule {
  id: string;
  type: 'ncaa' | 'union' | 'visa' | 'venue' | 'insurance';
  description: string;
  deadline?: string;
  status: 'compliant' | 'warning' | 'violation' | 'pending';
  assignedTo: string;
  documents: string[];
}

export interface MediaSlot {
  id: string;
  type: 'interview' | 'photo-shoot' | 'podcast' | 'post-game';
  participant: string;
  outlet: string;
  startTime: string;
  duration: number;
  location: string;
  requirements: string[];
  status: 'scheduled' | 'completed' | 'cancelled';
}

export interface SponsorActivation {
  id: string;
  sponsor: string;
  activity: string;
  deadline: string;
  status: 'pending' | 'in-progress' | 'completed' | 'overdue';
  assignedTo: string;
  deliverables: string[];
  notes?: string;
}

export interface ProTripData {
  id: string;
  title: string;
  description: string;
  location: string;
  dateRange: string;
  category: string;
  tags: string[];
  participants: ProTripParticipant[];
  roster: ProParticipant[];
  roomAssignments: RoomAssignment[];
  equipment: Equipment[];
  schedule: ProSchedule[];
  perDiem: PerDiemData;
  settlements: SettlementData[];
  medicalLog: MedicalLog[];
  compliance: ComplianceRule[];
  mediaSlots: MediaSlot[];
  sponsorActivations: SponsorActivation[];
  budget: {
    total: number;
    spent: number;
    categories: Array<{
      name: string;
      budgeted: number;
      spent: number;
    }>;
  };
  itinerary: Array<{
    date: string;
    events: Array<{
      time: string;
      title: string;
      location: string;
      type: string;
    }>;
  }>;
}

export const SUBSCRIPTION_TIERS = {
  starter: {
    name: 'Starter Team',
    price: 19.99,
    seatLimit: 10,
    features: [
      'Up to 10 team members',
      'Multi-city tour management',
      'Basic team roles & permissions',
      'Group chat & messaging',
      'Shared itinerary building',
      'Travel wallet integration',
      'Email support'
    ]
  },
  growing: {
    name: 'Growing Team',
    price: 39.99,
    seatLimit: 25,
    features: [
      'Up to 25 team members',
      'Advanced role management',
      'Broadcast messaging system',
      'Travel wallet & rewards tracking',
      'Priority email support',
      'Custom branding options',
      'Enhanced security features',
      'Usage analytics & reporting'
    ]
  },
  enterprise: {
    name: 'Enterprise Team',
    price: 59.99,
    seatLimit: 50,
    features: [
      'Up to 50 team members',
      'Advanced admin controls',
      'SSO integration',
      'Custom integrations',
      'Dedicated account manager',
      'Advanced compliance features',
      'Priority phone support',
      'Custom onboarding',
      'Advanced analytics dashboard'
    ]
  },
  'enterprise-plus': {
    name: 'Enterprise Plus',
    price: 79.99,
    seatLimit: 999,
    features: [
      'Unlimited team members',
      'White-label options',
      'Custom feature development',
      '24/7 dedicated support',
      'On-premise deployment options',
      'Advanced security & compliance',
      'Custom SLA agreements',
      'Quarterly business reviews',
      'Executive support line'
    ]
  }
} as const;
