
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

export interface Broadcast {
  id: string;
  senderId: string;
  message: string;
  targetTrips: string[];
  priority: 'normal' | 'urgent';
  timestamp: string;
  readBy: string[];
}
