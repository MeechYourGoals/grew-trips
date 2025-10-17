import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../integrations/supabase/client';
import { CategoryAssignment } from '../types/categoryAssignments';
import { useAuth } from './useAuth';
import { useDemoMode } from './useDemoMode';

const STORAGE_KEY = 'chravel_category_assignments';

// Demo mode storage helpers
const getDemoAssignments = (tripId: string): CategoryAssignment[] => {
  try {
    const stored = localStorage.getItem(`${STORAGE_KEY}_${tripId}`);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const saveDemoAssignments = (tripId: string, assignments: CategoryAssignment[]) => {
  localStorage.setItem(`${STORAGE_KEY}_${tripId}`, JSON.stringify(assignments));
};

export const useCategoryAssignments = (tripId: string) => {
  const { user } = useAuth();
  const { isDemoMode } = useDemoMode();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['categoryAssignments', tripId, isDemoMode],
    queryFn: async (): Promise<CategoryAssignment[]> => {
      // Demo mode
      if (isDemoMode || !user) {
        return getDemoAssignments(tripId);
      }

      // Authenticated mode
      const { data, error } = await supabase
        .from('category_assignments')
        .select('*')
        .eq('trip_id', tripId);

      if (error) throw error;
      
      // Transform database types to our interface
      return (data || []).map(item => ({
        ...item,
        assigned_user_ids: Array.isArray(item.assigned_user_ids) 
          ? item.assigned_user_ids as string[]
          : []
      }));
    },
    enabled: !!tripId
  });

  const upsertMutation = useMutation({
    mutationFn: async (assignment: CategoryAssignment) => {
      // Demo mode
      if (isDemoMode || !user) {
        const current = getDemoAssignments(tripId);
        const existingIndex = current.findIndex(
          a => a.category_id === assignment.category_id
        );

        let updated: CategoryAssignment[];
        if (existingIndex >= 0) {
          updated = [...current];
          updated[existingIndex] = { ...assignment, updated_at: new Date().toISOString() };
        } else {
          updated = [...current, { ...assignment, id: `demo-${Date.now()}`, created_at: new Date().toISOString() }];
        }

        saveDemoAssignments(tripId, updated);
        return updated[existingIndex >= 0 ? existingIndex : updated.length - 1];
      }

      // Authenticated mode
      const { data, error } = await supabase
        .from('category_assignments')
        .upsert({
          trip_id: assignment.trip_id,
          category_id: assignment.category_id,
          assigned_user_ids: assignment.assigned_user_ids,
          lead_user_id: assignment.lead_user_id,
          task_id: assignment.task_id,
        }, {
          onConflict: 'trip_id,category_id'
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categoryAssignments', tripId] });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (categoryId: string) => {
      // Demo mode
      if (isDemoMode || !user) {
        const current = getDemoAssignments(tripId);
        const updated = current.filter(a => a.category_id !== categoryId);
        saveDemoAssignments(tripId, updated);
        return;
      }

      // Authenticated mode
      const { error } = await supabase
        .from('category_assignments')
        .delete()
        .eq('trip_id', tripId)
        .eq('category_id', categoryId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categoryAssignments', tripId] });
    }
  });

  return {
    assignments: query.data || [],
    isLoading: query.isLoading,
    upsertAssignment: upsertMutation.mutateAsync,
    deleteAssignment: deleteMutation.mutateAsync
  };
};
