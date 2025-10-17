export interface CategoryAssignment {
  id?: string;
  trip_id: string;
  category_id: string;
  assigned_user_ids: string[];
  lead_user_id?: string;
  task_id?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  description: string;
  color: string;
}

export const CATEGORIES: Category[] = [
  { id: 'accommodations', name: 'Accommodations', icon: '🏨', description: 'Hotels, rentals, and lodging', color: 'bg-blue-500' },
  { id: 'food', name: 'Food & Dining', icon: '🍽️', description: 'Restaurants, cafes, and meals', color: 'bg-red-500' },
  { id: 'transportation', name: 'Transportation', icon: '🚗', description: 'Flights, cars, and local transport', color: 'bg-green-500' },
  { id: 'fitness', name: 'Fitness & Activities', icon: '💪', description: 'Sports, hiking, and wellness', color: 'bg-purple-500' },
  { id: 'nightlife', name: 'Nightlife & Entertainment', icon: '🌙', description: 'Bars, clubs, and evening fun', color: 'bg-indigo-500' },
  { id: 'attractions', name: 'Attractions & Sightseeing', icon: '🎯', description: 'Museums, landmarks, and tours', color: 'bg-yellow-500' },
  { id: 'budget', name: 'Budget & Expenses', icon: '💰', description: 'Costs, payments, and financial planning', color: 'bg-emerald-500' }
];
