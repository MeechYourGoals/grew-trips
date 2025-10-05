import { useState, useMemo } from 'react';
import { CalendarEvent } from '@/types/calendar';
import { CategoryAssignment, TripMember } from '@/pages/ItineraryAssignmentPage';

export const categories = [
  { id: 'accommodations', name: 'Accommodations', icon: '🏨', color: 'bg-blue-500' },
  { id: 'food', name: 'Food & Dining', icon: '🍽️', color: 'bg-red-500' },
  { id: 'transportation', name: 'Transportation', icon: '🚗', color: 'bg-green-500' },
  { id: 'fitness', name: 'Fitness & Activities', icon: '💪', color: 'bg-purple-500' },
  { id: 'nightlife', name: 'Nightlife & Entertainment', icon: '🌙', color: 'bg-indigo-500' },
  { id: 'attractions', name: 'Attractions & Sightseeing', icon: '🎯', color: 'bg-yellow-500' },
  { id: 'budget', name: 'Budget & Expenses', icon: '💰', color: 'bg-emerald-500' }
];

export const useCategoryManagement = (
  assignments: CategoryAssignment[],
  tripMembers: TripMember[]
) => {
  const [filterCategory, setFilterCategory] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const getCategoryInfo = (categoryId: string) => {
    return categories.find(c => c.id === categoryId);
  };

  const getUserAssignedCategories = (userId: string) => {
    return assignments
      .filter(a => a.assignedUsers.some(u => u.id === userId))
      .map(a => a.categoryId);
  };

  const isUserLeadForCategory = (userId: string, categoryId: string) => {
    const assignment = assignments.find(a => a.categoryId === categoryId);
    return assignment?.leadUserId === userId;
  };

  const filterEventsByCategory = (events: CalendarEvent[]) => {
    if (!filterCategory) return events;
    return events.filter(event => event.event_category === filterCategory);
  };

  const clearFilter = () => setFilterCategory(null);

  const selectCategory = (categoryId: string | null) => setSelectedCategory(categoryId);

  return {
    categories,
    filterCategory,
    setFilterCategory,
    selectedCategory,
    setSelectedCategory,
    selectCategory,
    getCategoryInfo,
    getUserAssignedCategories,
    isUserLeadForCategory,
    filterEventsByCategory,
    clearFilter
  };
};
