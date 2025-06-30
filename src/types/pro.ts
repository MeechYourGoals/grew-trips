
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

// Enhanced Pro-specific types
export interface ProParticipant {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'Player' | 'Coach' | 'TourManager' | 'Crew' | 'VIP' | 'Security' | 'Medical' | 'Tech' | 'Producer' | 'Talent';
  credentialLevel: 'AllAccess' | 'Backstage' | 'Guest' | 'Restricted';
  permissions: string[];
  roomPreferences?: string[];
  dietaryRestrictions?: string[];
  medicalNotes?: string;
}

export interface RoomAssignment {
  id: string;
  room: string;
  hotel: string;
  occupants: string[];
  checkIn: string;
  checkOut: string;
  roomType: 'single' | 'double' | 'suite' | 'connecting';
  specialRequests?: string[];
}

export interface Equipment {
  id: string;
  name: string;
  category: 'audio' | 'video' | 'lighting' | 'instruments' | 'sports' | 'general';
  quantity: number;
  location: string;
  status: 'packed' | 'in-transit' | 'delivered' | 'setup' | 'missing';
  assignedTo?: string;
  notes?: string;
  trackingNumber?: string;
}

export interface ProSchedule {
  id: string;
  type: 'load-in' | 'sound-check' | 'rehearsal' | 'show' | 'load-out' | 'travel' | 'meeting';
  title: string;
  startTime: string;
  endTime: string;
  location: string;
  participants: string[];
  priority: 'low' | 'medium' | 'high' | 'critical';
  notes?: string;
}

export interface PerDiemData {
  dailyRate: number;
  currency: string;
  startDate: string;
  endDate: string;
  participants: Array<{
    participantId: string;
    customRate?: number;
    advances: number;
    deductions: number;
    balance: number;
  }>;
}

export interface SettlementData {
  venue: string;
  date: string;
  guarantee: number;
  backendPercentage: number;
  grossRevenue: number;
  expenses: number;
  netRevenue: number;
  merchandiseRevenue: number;
  finalPayout: number;
  status: 'pending' | 'calculated' | 'paid';
}

export interface MedicalLog {
  id: string;
  participantId: string;
  date: string;
  type: 'injury' | 'illness' | 'checkup' | 'therapy' | 'medication';
  description: string;
  severity: 'minor' | 'moderate' | 'severe';
  status: 'active' | 'resolved' | 'monitoring';
  treatedBy?: string;
  followUpDate?: string;
  restricted: boolean;
}

export interface ComplianceRule {
  id: string;
  type: 'visa' | 'union' | 'NCAA' | 'insurance' | 'safety';
  title: string;
  description: string;
  deadline?: string;
  status: 'compliant' | 'warning' | 'violation';
  assignedTo?: string;
  documents: string[];
}

export interface MediaSlot {
  id: string;
  type: 'interview' | 'photo-shoot' | 'press-conference' | 'podcast';
  outlet: string;
  contactPerson: string;
  scheduledTime: string;
  duration: number;
  location: string;
  participants: string[];
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled';
}

export interface SponsorActivation {
  id: string;
  sponsor: string;
  activation: string;
  deadline: string;
  assignedTo: string;
  status: 'pending' | 'in-progress' | 'completed';
  deliverables: string[];
  notes?: string;
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

export interface ProTripData {
  id: string;
  title: string;
  description: string;
  location: string;
  dateRange: string;
  category: string;
  tags: string[];
  participants: ProTripParticipant[];
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
  // Enhanced Pro features
  roster: ProParticipant[];
  roomAssignments: RoomAssignment[];
  equipment: Equipment[];
  schedule: ProSchedule[];
  perDiem: PerDiemData;
  settlement: SettlementData[];
  medical: MedicalLog[];
  compliance: ComplianceRule[];
  media: MediaSlot[];
  sponsors: SponsorActivation[];
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
