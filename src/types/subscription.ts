
export interface ProSubscription {
  userId: string;
  organizationId?: string;
  plan: 'starter' | 'growing' | 'enterprise' | 'enterprise-plus';
  status: 'active' | 'trial' | 'cancelled' | 'expired';
  trialEndsAt?: string;
  subscriptionEndsAt?: string;
  isOrganizationOwner: boolean;
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
