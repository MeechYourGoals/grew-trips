import { TripTask, CreateTaskRequest, TaskStatus } from '@/types/tasks';

class TaskStorageService {
  private getStorageKey(tripId: string): string {
    return `tasks_${tripId}`;
  }

  // Get all tasks for a trip
  getTasks(tripId: string): TripTask[] {
    try {
      const stored = localStorage.getItem(this.getStorageKey(tripId));
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading tasks from localStorage:', error);
      return [];
    }
  }

  // Save tasks for a trip
  private saveTasks(tripId: string, tasks: TripTask[]): void {
    try {
      localStorage.setItem(this.getStorageKey(tripId), JSON.stringify(tasks));
    } catch (error) {
      console.error('Error saving tasks to localStorage:', error);
    }
  }

  // Create a new task
  createTask(tripId: string, taskData: CreateTaskRequest & { assignedTo: string[] }): TripTask {
    const tasks = this.getTasks(tripId);
    
    const newTask: TripTask = {
      id: `demo-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      trip_id: tripId,
      creator_id: 'demo-user',
      title: taskData.title,
      description: taskData.description,
      due_at: taskData.due_at,
      is_poll: taskData.is_poll,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      creator: {
        id: 'demo-user',
        name: 'You'
      },
      task_status: this.createInitialTaskStatus(taskData, 'demo-user')
    };

    tasks.unshift(newTask);
    this.saveTasks(tripId, tasks);
    return newTask;
  }

  // Create initial task status based on assignment
  private createInitialTaskStatus(taskData: CreateTaskRequest & { assignedTo: string[] }, creatorId: string): TaskStatus[] {
    if (taskData.is_poll) {
      // Group task - assign to everyone
      return taskData.assignedTo.map(userId => ({
        task_id: '', // Will be set after task creation
        user_id: userId,
        completed: false
      }));
    } else {
      // Single task - assign to specified users or creator
      const assignees = taskData.assignedTo.length > 0 ? taskData.assignedTo : [creatorId];
      return assignees.map(userId => ({
        task_id: '', // Will be set after task creation
        user_id: userId,
        completed: false
      }));
    }
  }

  // Toggle task completion for a user
  toggleTask(tripId: string, taskId: string, userId: string, completed: boolean): TripTask | null {
    const tasks = this.getTasks(tripId);
    const taskIndex = tasks.findIndex(t => t.id === taskId);
    
    if (taskIndex === -1) return null;

    const task = tasks[taskIndex];
    const statusIndex = task.task_status?.findIndex(s => s.user_id === userId) ?? -1;

    if (statusIndex === -1) {
      // Add new status if user not found
      task.task_status = task.task_status || [];
      task.task_status.push({
        task_id: taskId,
        user_id: userId,
        completed,
        completed_at: completed ? new Date().toISOString() : undefined
      });
    } else {
      // Update existing status
      task.task_status[statusIndex] = {
        ...task.task_status[statusIndex],
        completed,
        completed_at: completed ? new Date().toISOString() : undefined
      };
    }

    task.updated_at = new Date().toISOString();
    this.saveTasks(tripId, tasks);
    return task;
  }

  // Delete a task
  deleteTask(tripId: string, taskId: string): boolean {
    const tasks = this.getTasks(tripId);
    const filteredTasks = tasks.filter(t => t.id !== taskId);
    
    if (filteredTasks.length !== tasks.length) {
      this.saveTasks(tripId, filteredTasks);
      return true;
    }
    
    return false;
  }

  // Clear all tasks for a trip (useful for demo reset)
  clearTasks(tripId: string): void {
    localStorage.removeItem(this.getStorageKey(tripId));
  }

  // Clear all demo data
  clearAllDemoTasks(): void {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith('tasks_')) {
        localStorage.removeItem(key);
      }
    });
  }
}

export const taskStorageService = new TaskStorageService();