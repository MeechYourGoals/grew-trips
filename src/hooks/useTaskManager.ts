import { useState, useCallback } from 'react';

export interface TaskFormData {
  title: string;
  description: string;
  dueDate?: Date;
  taskMode: 'solo' | 'poll';
  assignedMembers: string[];
}

export interface CreateTaskData {
  title: string;
  description?: string;
  due_at?: string;
  is_poll: boolean;
  assignedTo?: string[];
}

export const useTaskManager = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState<Date | undefined>();
  const [taskMode, setTaskMode] = useState<'solo' | 'poll'>('solo');
  const [assignedMembers, setAssignedMembers] = useState<string[]>([]);

  const validateTask = useCallback((): { isValid: boolean; error?: string } => {
    if (!title.trim()) {
      return { isValid: false, error: 'Task title is required' };
    }

    if (title.length > 140) {
      return { isValid: false, error: 'Task title must be 140 characters or less' };
    }

    return { isValid: true };
  }, [title]);

  const getTaskData = useCallback((): CreateTaskData | null => {
    const validation = validateTask();
    if (!validation.isValid) {
      return null;
    }

    return {
      title: title.trim(),
      description: description.trim() || undefined,
      due_at: dueDate?.toISOString(),
      is_poll: taskMode === 'poll',
      assignedTo: assignedMembers.length > 0 ? assignedMembers : undefined
    };
  }, [title, description, dueDate, taskMode, assignedMembers, validateTask]);

  const resetForm = useCallback(() => {
    setTitle('');
    setDescription('');
    setDueDate(undefined);
    setTaskMode('solo');
    setAssignedMembers([]);
  }, []);

  const updateAssignedMembers = useCallback((members: string[]) => {
    setAssignedMembers(members);
  }, []);

  const toggleMember = useCallback((memberId: string) => {
    setAssignedMembers(prev => 
      prev.includes(memberId) 
        ? prev.filter(id => id !== memberId)
        : [...prev, memberId]
    );
  }, []);

  return {
    // State
    title,
    description,
    dueDate,
    taskMode,
    assignedMembers,
    
    // Computed
    isValid: validateTask().isValid,
    characterCount: title.length,
    maxCharacters: 140,
    
    // Actions
    setTitle,
    setDescription,
    setDueDate,
    setTaskMode,
    updateAssignedMembers,
    toggleMember,
    validateTask,
    getTaskData,
    resetForm
  };
};
