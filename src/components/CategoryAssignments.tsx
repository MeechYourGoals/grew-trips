
import React, { useState } from 'react';
import { Plus, Crown, User, Check } from 'lucide-react';
import { TripMember, CategoryAssignment } from '../pages/ItineraryAssignmentPage';

interface Category {
  id: string;
  name: string;
  icon: string;
  description: string;
  color: string;
}

const categories: Category[] = [
  { id: 'accommodations', name: 'Accommodations', icon: '🏨', description: 'Hotels, rentals, and lodging', color: 'bg-blue-500' },
  { id: 'food', name: 'Food & Dining', icon: '🍽️', description: 'Restaurants, cafes, and meals', color: 'bg-red-500' },
  { id: 'transportation', name: 'Transportation', icon: '🚗', description: 'Flights, cars, and local transport', color: 'bg-green-500' },
  { id: 'fitness', name: 'Fitness & Activities', icon: '💪', description: 'Sports, hiking, and wellness', color: 'bg-purple-500' },
  { id: 'nightlife', name: 'Nightlife & Entertainment', icon: '🌙', description: 'Bars, clubs, and evening fun', color: 'bg-indigo-500' },
  { id: 'attractions', name: 'Attractions & Sightseeing', icon: '🎯', description: 'Museums, landmarks, and tours', color: 'bg-yellow-500' },
  { id: 'budget', name: 'Budget & Expenses', icon: '💰', description: 'Costs, payments, and financial planning', color: 'bg-emerald-500' }
];

interface CategoryAssignmentsProps {
  tripMembers: TripMember[];
  assignments: CategoryAssignment[];
  onAssignmentChange: (assignments: CategoryAssignment[]) => void;
}

export const CategoryAssignments = ({ tripMembers, assignments, onAssignmentChange }: CategoryAssignmentsProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showAssignModal, setShowAssignModal] = useState(false);

  const getAssignmentForCategory = (categoryId: string): CategoryAssignment | undefined => {
    return assignments.find(a => a.categoryId === categoryId);
  };

  const handleAssignUser = (categoryId: string, userId: string, isLead: boolean = false) => {
    const newAssignments = [...assignments];
    const existingIndex = newAssignments.findIndex(a => a.categoryId === categoryId);
    
    if (existingIndex >= 0) {
      const existing = newAssignments[existingIndex];
      const user = tripMembers.find(m => m.id === userId);
      if (!user) return;

      const userExists = existing.assignedUsers.some(u => u.id === userId);
      if (!userExists) {
        existing.assignedUsers.push(user);
      }
      if (isLead) {
        existing.leadUserId = userId;
      }
    } else {
      const user = tripMembers.find(m => m.id === userId);
      if (!user) return;

      newAssignments.push({
        categoryId,
        assignedUsers: [user],
        leadUserId: isLead ? userId : undefined
      });
    }
    
    onAssignmentChange(newAssignments);
  };

  const handleRemoveUser = (categoryId: string, userId: string) => {
    const newAssignments = [...assignments];
    const existingIndex = newAssignments.findIndex(a => a.categoryId === categoryId);
    
    if (existingIndex >= 0) {
      const existing = newAssignments[existingIndex];
      existing.assignedUsers = existing.assignedUsers.filter(u => u.id !== userId);
      
      if (existing.leadUserId === userId) {
        existing.leadUserId = existing.assignedUsers[0]?.id;
      }
      
      if (existing.assignedUsers.length === 0) {
        newAssignments.splice(existingIndex, 1);
      }
    }
    
    onAssignmentChange(newAssignments);
  };

  return (
    <div className="space-y-6">
      {/* Instructions */}
      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
        <h2 className="text-xl font-semibold text-white mb-3">Assign Category Responsibilities</h2>
        <p className="text-gray-300">
          Assign team members to be responsible for different aspects of your trip. 
          The person with the crown icon is the category lead and has primary responsibility.
        </p>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => {
          const assignment = getAssignmentForCategory(category.id);
          const assignedCount = assignment?.assignedUsers.length || 0;
          
          return (
            <div 
              key={category.id}
              className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 hover:border-yellow-500/30 transition-all"
            >
              {/* Category Header */}
              <div className="flex items-center gap-3 mb-4">
                <div className="text-3xl">{category.icon}</div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white">{category.name}</h3>
                  <p className="text-sm text-gray-400">{category.description}</p>
                </div>
              </div>

              {/* Assignment Status */}
              <div className="mb-4">
                {assignedCount > 0 ? (
                  <div className="flex items-center gap-2 text-green-400 text-sm">
                    <Check size={16} />
                    <span>{assignedCount} {assignedCount === 1 ? 'person' : 'people'} assigned</span>
                  </div>
                ) : (
                  <div className="text-gray-400 text-sm">No one assigned yet</div>
                )}
              </div>

              {/* Assigned Users */}
              {assignment && assignment.assignedUsers.length > 0 && (
                <div className="space-y-2 mb-4">
                  {assignment.assignedUsers.map((user) => (
                    <div key={user.id} className="flex items-center justify-between bg-white/5 rounded-lg p-2">
                      <div className="flex items-center gap-2">
                        <img 
                          src={user.avatar} 
                          alt={user.name}
                          className="w-6 h-6 rounded-full"
                        />
                        <span className="text-white text-sm">{user.name}</span>
                        {assignment.leadUserId === user.id && (
                          <Crown size={14} className="text-yellow-500" />
                        )}
                      </div>
                      <button
                        onClick={() => handleRemoveUser(category.id, user.id)}
                        className="text-gray-400 hover:text-red-400 text-xs"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Add User Button */}
              <button
                onClick={() => {
                  setSelectedCategory(category.id);
                  setShowAssignModal(true);
                }}
                className="w-full flex items-center justify-center gap-2 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400 py-2 rounded-lg transition-colors border border-yellow-500/30"
              >
                <Plus size={16} />
                <span>Assign People</span>
              </button>
            </div>
          );
        })}
      </div>

      {/* Assignment Modal */}
      {showAssignModal && selectedCategory && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold text-white mb-4">
              Assign to {categories.find(c => c.id === selectedCategory)?.name}
            </h3>
            
            <div className="space-y-3 mb-6">
              {tripMembers.map((member) => {
                const assignment = getAssignmentForCategory(selectedCategory);
                const isAssigned = assignment?.assignedUsers.some(u => u.id === member.id);
                const isLead = assignment?.leadUserId === member.id;
                
                return (
                  <div key={member.id} className="flex items-center justify-between bg-gray-800 rounded-lg p-3">
                    <div className="flex items-center gap-3">
                      <img 
                        src={member.avatar} 
                        alt={member.name}
                        className="w-8 h-8 rounded-full"
                      />
                      <div>
                        <div className="text-white font-medium">{member.name}</div>
                        <div className="text-gray-400 text-sm">{member.email}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {isAssigned && (
                        <button
                          onClick={() => handleAssignUser(selectedCategory, member.id, true)}
                          className={`p-1 rounded ${isLead ? 'text-yellow-500' : 'text-gray-400 hover:text-yellow-500'}`}
                          title="Make lead"
                        >
                          <Crown size={16} />
                        </button>
                      )}
                      <button
                        onClick={() => 
                          isAssigned 
                            ? handleRemoveUser(selectedCategory, member.id)
                            : handleAssignUser(selectedCategory, member.id)
                        }
                        className={`p-1 rounded ${
                          isAssigned 
                            ? 'text-red-400 hover:text-red-300' 
                            : 'text-green-400 hover:text-green-300'
                        }`}
                      >
                        {isAssigned ? <User size={16} /> : <Plus size={16} />}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowAssignModal(false)}
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-lg transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
