import { useTaskMutations } from './useTripTasks';
import { useCategoryAssignments } from './useCategoryAssignments';
import { CATEGORIES } from '../types/categoryAssignments';

export const useCategoryTasks = (tripId: string) => {
  const { createTaskMutation } = useTaskMutations(tripId);
  const { upsertAssignment, deleteAssignment, assignments } = useCategoryAssignments(tripId);

  const createOrUpdateCategoryTask = async (
    categoryId: string,
    assignedUserIds: string[],
    leadUserId?: string
  ) => {
    const category = CATEGORIES.find(c => c.id === categoryId);
    if (!category) return;

    const existingAssignment = assignments.find(a => a.category_id === categoryId);

    // If removing all users, delete the assignment and return
    if (assignedUserIds.length === 0) {
      if (existingAssignment) {
        await deleteAssignment(categoryId);
      }
      return;
    }

    // If this is a new assignment, create a task
    if (!existingAssignment || !existingAssignment.task_id) {
      try {
        const newTask = await createTaskMutation.mutateAsync({
          title: `Plan ${category.name}`,
          description: `You've been assigned to coordinate ${category.description.toLowerCase()} for this trip.`,
          is_poll: false,
          assignedTo: assignedUserIds
        });

        // Save assignment with task_id
        await upsertAssignment({
          trip_id: tripId,
          category_id: categoryId,
          assigned_user_ids: assignedUserIds,
          lead_user_id: leadUserId,
          task_id: newTask.id
        });
      } catch (error) {
        console.error('Error creating category task:', error);
        // Still save assignment even if task creation fails
        await upsertAssignment({
          trip_id: tripId,
          category_id: categoryId,
          assigned_user_ids: assignedUserIds,
          lead_user_id: leadUserId
        });
      }
    } else {
      // Update existing assignment
      await upsertAssignment({
        ...existingAssignment,
        assigned_user_ids: assignedUserIds,
        lead_user_id: leadUserId
      });
    }
  };

  return {
    createOrUpdateCategoryTask
  };
};
