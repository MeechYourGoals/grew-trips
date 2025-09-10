import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../integrations/supabase/client';
import { TripTask, CreateTaskRequest, ToggleTaskRequest } from '../types/tasks';
import { useToast } from './use-toast';

const generateSeedTasks = (tripId: string): TripTask[] => {
  const consumerTripIds = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
  
  if (!consumerTripIds.includes(tripId)) {
    return []; // No seed tasks for pro trips
  }

  const taskTemplates: Record<string, TripTask[]> = {
    '1': [ // Spring Break Cancun
      {
        id: 'seed-1-1',
        trip_id: tripId,
        creator_id: 'seed-user',
        title: 'Pack reef-safe sunscreen',
        description: 'Make sure to bring sunscreen that won\'t damage the coral reefs',
        due_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        is_poll: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        creator: { id: 'seed-user', name: 'Trip Organizer' },
        task_status: [{ task_id: 'seed-1-1', user_id: 'current-user', completed: false }]
      },
      {
        id: 'seed-1-2',
        trip_id: tripId,
        creator_id: 'seed-user',
        title: 'Download offline maps for Cancun',
        description: 'Download Google Maps offline for the hotel and downtown areas',
        due_at: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
        is_poll: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        creator: { id: 'seed-user', name: 'Trip Organizer' },
        task_status: [{ task_id: 'seed-1-2', user_id: 'current-user', completed: false }]
      }
    ],
    '4': [ // Bachelorette Party
      {
        id: 'seed-4-1',
        trip_id: tripId,
        creator_id: 'seed-user',
        title: 'Coordinate ride to Broadway bars',
        description: 'Book Uber/Lyft for the group to hit the honky-tonk scene',
        due_at: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        is_poll: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        creator: { id: 'seed-user', name: 'Ashley' },
        task_status: [{ task_id: 'seed-4-1', user_id: 'current-user', completed: false }]
      }
    ],
    '6': [ // Family Vacation
      {
        id: 'seed-6-1',
        trip_id: tripId,
        creator_id: 'seed-user',
        title: 'Pack hiking boots for everyone',
        description: 'Make sure everyone has proper footwear for the mountain trails',
        due_at: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(),
        is_poll: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        creator: { id: 'seed-user', name: 'Dad (Mike)' },
        task_status: [{ task_id: 'seed-6-1', user_id: 'current-user', completed: false }]
      }
    ],
    '7': [ // Golf Trip
      {
        id: 'seed-7-1',
        trip_id: tripId,
        creator_id: 'seed-user',
        title: 'Bring poker chips for evening games',
        description: 'Someone needs to pack the poker set for our nightly tournaments',
        due_at: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString(),
        is_poll: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        creator: { id: 'seed-user', name: 'Commissioner Mike' },
        task_status: [{ task_id: 'seed-7-1', user_id: 'current-user', completed: false }]
      }
    ]
  };

  return taskTemplates[tripId] || [];
};

export const useTripTasks = (tripId: string) => {
  return useQuery({
    queryKey: ['tripTasks', tripId],
    queryFn: async (): Promise<TripTask[]> => {
      try {
        // Fetch real tasks from database
        const { data: tasks, error } = await supabase
          .from('trip_tasks')
          .select(`
            *,
            task_status(*)
          `)
          .eq('trip_id', tripId)
          .order('created_at', { ascending: false });

        if (error) throw error;

        // If no real tasks exist, return seed tasks for consumer trips
        if (!tasks || tasks.length === 0) {
          return generateSeedTasks(tripId);
        }

        // Transform database tasks to match TripTask interface
        return tasks.map(task => ({
          id: task.id,
          trip_id: task.trip_id,
          creator_id: task.creator_id,
          title: task.title,
          description: task.description,
          due_at: task.due_at,
          is_poll: task.is_poll,
          created_at: task.created_at,
          updated_at: task.updated_at,
          creator: {
            id: task.creator_id,
            name: 'User'
          },
          task_status: (task.task_status || []) as any[]
        }));
      } catch (error) {
        console.error('Error fetching tasks:', error);
        // Fallback to seed tasks on error
        return generateSeedTasks(tripId);
      }
    },
    enabled: !!tripId
  });
};

export const useTaskMutations = (tripId: string) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const createTaskMutation = useMutation({
    mutationFn: async (task: CreateTaskRequest) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Create the task in database
      const { data: newTask, error } = await supabase
        .from('trip_tasks')
        .insert({
          trip_id: tripId,
          creator_id: user.id,
          title: task.title,
          description: task.description,
          due_at: task.due_at,
          is_poll: task.is_poll
        })
        .select()
        .single();

      if (error) throw error;

      // Create initial task status for creator
      await supabase
        .from('task_status')
        .insert({
          task_id: newTask.id,
          user_id: user.id,
          completed: false
        });

      // Transform to TripTask format
      return {
        id: newTask.id,
        trip_id: newTask.trip_id,
        creator_id: newTask.creator_id,
        title: newTask.title,
        description: newTask.description,
        due_at: newTask.due_at,
        is_poll: newTask.is_poll,
        created_at: newTask.created_at,
        updated_at: newTask.updated_at,
        creator: {
          id: user.id,
          name: 'Current User'
        },
        task_status: [{
          task_id: newTask.id,
          user_id: user.id,
          completed: false
        }]
      } as TripTask;
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
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Update task status in database
      const { error } = await supabase
        .from('task_status')
        .upsert({
          task_id: taskId,
          user_id: user.id,
          completed,
          completed_at: completed ? new Date().toISOString() : null
        });

      if (error) throw error;
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