
export interface ConsumerSubscription {
  tier: 'free' | 'plus';
  status: 'active' | 'trial' | 'expired' | 'cancelled';
  trialEndsAt?: string;
  subscriptionEndsAt?: string;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
}

export interface TripPreferences {
  dietary: string[];
  vibe: string[];
  budget: 'budget' | 'mid-range' | 'luxury';
  timePreference: 'early-riser' | 'night-owl' | 'flexible';
}

export interface AIRecommendation {
  id: string;
  type: 'restaurant' | 'activity' | 'accommodation' | 'transportation';
  title: string;
  description: string;
  location: string;
  rating?: number;
  priceRange?: string;
  matchedPreferences: string[];
}

export const DIETARY_OPTIONS = [
  'Vegetarian', 'Vegan', 'Halal', 'Kosher', 'Gluten-free', 
  'Dairy-free', 'Nut-free', 'Pescatarian', 'Keto', 'No restrictions'
];

export const VIBE_OPTIONS = [
  'Chill', 'Party', 'Outdoorsy', 'Family-friendly', 'Romantic', 
  'Adventure', 'Cultural', 'Luxury', 'Budget-friendly', 'Nightlife'
];

export const TRIPS_PLUS_PRICE = 9.99;
