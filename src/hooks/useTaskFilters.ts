import { useState, useCallback, useMemo } from 'react';
import { TripTask } from '../types/tasks';

export type TaskStatus = 'all' | 'open' | 'completed';
export type TaskSortBy = 'dueDate' | 'created' | 'priority';

export interface TaskFilters {
  status: TaskStatus;
  assignee?: string;
  dateRange: { start?: Date; end?: Date };
  sortBy: TaskSortBy;
}

export const useTaskFilters = () => {
  const [status, setStatus] = useState<TaskStatus>('all');
  const [assignee, setAssignee] = useState<string | undefined>();
  const [dateRange, setDateRange] = useState<{ start?: Date; end?: Date }>({});
  const [sortBy, setSortBy] = useState<TaskSortBy>('dueDate');

  const applyFilters = useCallback((tasks: TripTask[]): TripTask[] => {
    let filtered = tasks.filter(task => {
      // Status filter
      const isCompleted = task.is_poll 
        ? (task.task_status?.filter(s => s.completed).length || 0) >= (task.task_status?.length || 1)
        : task.task_status?.[0]?.completed || false;

      if (status === 'open' && isCompleted) return false;
      if (status === 'completed' && !isCompleted) return false;

      // Assignee filter
      if (assignee) {
        const hasAssignee = task.task_status?.some(s => s.user_id === assignee);
        if (!hasAssignee) return false;
      }

      // Date range filter
      if (task.due_at) {
        const dueDate = new Date(task.due_at);
        if (dateRange.start && dueDate < dateRange.start) return false;
        if (dateRange.end && dueDate > dateRange.end) return false;
      }

      return true;
    });

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'dueDate':
          if (!a.due_at) return 1;
          if (!b.due_at) return -1;
          return new Date(a.due_at).getTime() - new Date(b.due_at).getTime();
        
        case 'created':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        
        case 'priority':
          // Tasks with due dates are higher priority
          const aPriority = a.due_at ? 1 : 0;
          const bPriority = b.due_at ? 1 : 0;
          return bPriority - aPriority;
        
        default:
          return 0;
      }
    });

    return filtered;
  }, [status, assignee, dateRange, sortBy]);

  const clearFilters = useCallback(() => {
    setStatus('all');
    setAssignee(undefined);
    setDateRange({});
    setSortBy('dueDate');
  }, []);

  const hasActiveFilters = useMemo(() => {
    return status !== 'all' || 
           assignee !== undefined ||
           dateRange.start !== undefined ||
           dateRange.end !== undefined;
  }, [status, assignee, dateRange]);

  return {
    // State
    status,
    assignee,
    dateRange,
    sortBy,
    
    // Computed
    hasActiveFilters,
    
    // Actions
    setStatus,
    setAssignee,
    setDateRange,
    setSortBy,
    applyFilters,
    clearFilters
  };
};
