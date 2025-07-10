import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../integrations/supabase/client';
import { TripTask, CreateTaskRequest, ToggleTaskRequest } from '../types/tasks';
import { useToast } from './use-toast';

export const useTripTasks = (tripId: string) => {
  return useQuery({
    queryKey: ['tripTasks', tripId],
    queryFn: async (): Promise<TripTask[]> => {
      // For now, return mock data until the database migration is applied
      return [];
    },
    enabled: !!tripId
  });
};

export const useTaskMutations = (tripId: string) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const createTaskMutation = useMutation({
    mutationFn: async (task: CreateTaskRequest) => {
      // Mock implementation for now
      const newTask: TripTask = {
        id: Date.now().toString(),
        trip_id: tripId,
        creator_id: 'current-user',
        title: task.title,
        description: task.description,
        due_at: task.due_at,
        is_poll: task.is_poll,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        creator: {
          id: 'current-user',
          name: 'Current User'
        },
        task_status: [{
          task_id: Date.now().toString(),
          user_id: 'current-user',
          completed: false
        }]
      };
      return newTask;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tripTasks', tripId] });
      toast({
        title: 'Task created',
        description: 'Your task has been added to the list.'
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to create task. Please try again.',
        variant: 'destructive'
      });
    }
  });

  const toggleTaskMutation = useMutation({
    mutationFn: async ({ taskId, completed }: ToggleTaskRequest) => {
      // Mock implementation for now
      return { taskId, completed };
    },
    onMutate: async ({ taskId, completed }) => {
      // Optimistic update
      await queryClient.cancelQueries({ queryKey: ['tripTasks', tripId] });
      
      const previousTasks = queryClient.getQueryData<TripTask[]>(['tripTasks', tripId]);
      
      queryClient.setQueryData<TripTask[]>(['tripTasks', tripId], (old) => {
        if (!old) return old;
        
        return old.map(task => {
          if (task.id === taskId) {
            const updatedStatus = task.task_status?.map(status => {
              if (status.user_id === 'current-user-id') { // TODO: Get from auth
                return {
                  ...status,
                  completed,
                  completed_at: completed ? new Date().toISOString() : undefined
                };
              }
              return status;
            });
            
            return {
              ...task,
              task_status: updatedStatus
            };
          }
          return task;
        });
      });

      return { previousTasks };
    },
    onError: (err, variables, context) => {
      // Rollback on error
      if (context?.previousTasks) {
        queryClient.setQueryData(['tripTasks', tripId], context.previousTasks);
      }
      toast({
        title: 'Error',
        description: 'Failed to update task. Please try again.',
        variant: 'destructive'
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['tripTasks', tripId] });
    }
  });

  return {
    createTaskMutation,
    toggleTaskMutation
  };
};