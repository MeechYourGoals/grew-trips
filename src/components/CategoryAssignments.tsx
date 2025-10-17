
import React, { useState, useEffect } from 'react';
import { Plus, Crown, User, Check, ListTodo } from 'lucide-react';
import { TripMember } from '../pages/ItineraryAssignmentPage';
import { CATEGORIES } from '../types/categoryAssignments';
import { useCategoryTasks } from '../hooks/useCategoryTasks';
import { useCategoryAssignments } from '../hooks/useCategoryAssignments';

interface CategoryAssignmentsProps {
  tripMembers: TripMember[];
  tripId: string;
}

export const CategoryAssignments = ({ tripMembers, tripId }: CategoryAssignmentsProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [localAssignments, setLocalAssignments] = useState<Record<string, { userIds: string[], leadId?: string }>>({});
  
  const { createOrUpdateCategoryTask } = useCategoryTasks(tripId);
  const { assignments } = useCategoryAssignments(tripId);

  // Build local state from persistent assignments
  useEffect(() => {
    const mappedAssignments: Record<string, { userIds: string[], leadId?: string }> = {};
    assignments.forEach(assignment => {
      mappedAssignments[assignment.category_id] = {
        userIds: assignment.assigned_user_ids,
        leadId: assignment.lead_user_id
      };
    });
    setLocalAssignments(mappedAssignments);
  }, [assignments]);

  const getAssignedUsers = (categoryId: string) => {
    const assignment = localAssignments[categoryId];
    if (!assignment) return [];
    return tripMembers.filter(m => assignment.userIds.includes(m.id));
  };

  const getLeadUserId = (categoryId: string) => {
    return localAssignments[categoryId]?.leadId;
  };

  const handleAssignUser = async (categoryId: string, userId: string, isLead: boolean = false) => {
    const current = localAssignments[categoryId] || { userIds: [], leadId: undefined };
    
    const userExists = current.userIds.includes(userId);
    let updatedUserIds = current.userIds;
    let updatedLeadId = current.leadId;

    if (!userExists) {
      updatedUserIds = [...current.userIds, userId];
    }
    if (isLead) {
      updatedLeadId = userId;
    }

    // Update local state immediately
    setLocalAssignments(prev => ({
      ...prev,
      [categoryId]: { userIds: updatedUserIds, leadId: updatedLeadId }
    }));

    // Persist to database and create task
    await createOrUpdateCategoryTask(categoryId, updatedUserIds, updatedLeadId);
  };

  const handleRemoveUser = async (categoryId: string, userId: string) => {
    const current = localAssignments[categoryId];
    if (!current) return;

    const updatedUserIds = current.userIds.filter(id => id !== userId);
    let updatedLeadId = current.leadId;

    if (updatedLeadId === userId) {
      updatedLeadId = updatedUserIds[0];
    }

    // Update local state immediately
    if (updatedUserIds.length === 0) {
      const { [categoryId]: _, ...rest } = localAssignments;
      setLocalAssignments(rest);
    } else {
      setLocalAssignments(prev => ({
        ...prev,
        [categoryId]: { userIds: updatedUserIds, leadId: updatedLeadId }
      }));
    }

    // Persist to database
    await createOrUpdateCategoryTask(categoryId, updatedUserIds, updatedLeadId);
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
        {CATEGORIES.map((category) => {
          const assignedUsers = getAssignedUsers(category.id);
          const leadUserId = getLeadUserId(category.id);
          const assignedCount = assignedUsers.length;
          
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
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-green-400 text-sm">
                      <Check size={16} />
                      <span>{assignedCount} {assignedCount === 1 ? 'person' : 'people'} assigned</span>
                    </div>
                    <div className="flex items-center gap-2 text-blue-400 text-xs">
                      <ListTodo size={14} />
                      <span>Task created in Tasks tab</span>
                    </div>
                  </div>
                ) : (
                  <div className="text-gray-400 text-sm">No one assigned yet</div>
                )}
              </div>

              {/* Assigned Users */}
              {assignedUsers.length > 0 && (
                <div className="space-y-2 mb-4">
                  {assignedUsers.map((user) => (
                    <div key={user.id} className="flex items-center justify-between bg-white/5 rounded-lg p-2">
                      <div className="flex items-center gap-2">
                        <img 
                          src={user.avatar} 
                          alt={user.name}
                          className="w-6 h-6 rounded-full"
                        />
                        <span className="text-white text-sm">{user.name}</span>
                        {leadUserId === user.id && (
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
              Assign to {CATEGORIES.find(c => c.id === selectedCategory)?.name}
            </h3>
            
            <div className="space-y-3 mb-6">
              {tripMembers.map((member) => {
                const assignedUsers = getAssignedUsers(selectedCategory);
                const leadUserId = getLeadUserId(selectedCategory);
                const isAssigned = assignedUsers.some(u => u.id === member.id);
                const isLead = leadUserId === member.id;
                
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
