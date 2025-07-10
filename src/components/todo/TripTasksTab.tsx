import React, { useState } from 'react';
import { Plus, CheckCircle2, Clock, Users } from 'lucide-react';
import { Button } from '../ui/button';
import { TaskRow } from './TaskRow';
import { TaskCreateModal } from './TaskCreateModal';
import { useTripTasks } from '../../hooks/useTripTasks';
import { useTripVariant } from '../../contexts/TripVariantContext';

interface TripTasksTabProps {
  tripId: string;
}

export const TripTasksTab = ({ tripId }: TripTasksTabProps) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showCompleted, setShowCompleted] = useState(false);
  const { accentColors } = useTripVariant();
  const { data: tasks, isLoading } = useTripTasks(tripId);

  const openTasks = tasks?.filter(task => {
    if (task.is_poll) {
      // For poll tasks, check if all required users have completed
      const completionRate = task.task_status?.filter(status => status.completed).length || 0;
      const totalRequired = task.task_status?.length || 1;
      return completionRate < totalRequired;
    }
    // For solo tasks, check if the single status is completed
    return !task.task_status?.[0]?.completed;
  }) || [];

  const completedTasks = tasks?.filter(task => {
    if (task.is_poll) {
      const completionRate = task.task_status?.filter(status => status.completed).length || 0;
      const totalRequired = task.task_status?.length || 1;
      return completionRate >= totalRequired;
    }
    return task.task_status?.[0]?.completed;
  }) || [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-white">To-Do List</h2>
          <p className="text-gray-400 text-sm">Keep track of everything that needs to get done</p>
        </div>
        <Button
          onClick={() => setShowCreateModal(true)}
          className={`bg-gradient-to-r ${accentColors.gradient} hover:opacity-90`}
        >
          <Plus size={16} className="mr-2" />
          Add Task
        </Button>
      </div>

      {/* Open Tasks */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-white font-medium">
          <Clock size={18} />
          <span>To Do ({openTasks.length})</span>
        </div>
        {openTasks.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <CheckCircle2 size={48} className="mx-auto mb-3 opacity-50" />
            <p>All caught up! No pending tasks.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {openTasks.map((task) => (
              <TaskRow key={task.id} task={task} tripId={tripId} />
            ))}
          </div>
        )}
      </div>

      {/* Completed Tasks */}
      {completedTasks.length > 0 && (
        <div className="space-y-3">
          <button
            onClick={() => setShowCompleted(!showCompleted)}
            className="flex items-center gap-2 text-gray-300 hover:text-white font-medium transition-colors"
          >
            <CheckCircle2 size={18} />
            <span>Completed ({completedTasks.length})</span>
            <span className="text-xs">
              {showCompleted ? '▼' : '▶'}
            </span>
          </button>
          
          {showCompleted && (
            <div className="space-y-2">
              {completedTasks.map((task) => (
                <TaskRow key={task.id} task={task} tripId={tripId} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Create Task Modal */}
      {showCreateModal && (
        <TaskCreateModal
          tripId={tripId}
          onClose={() => setShowCreateModal(false)}
        />
      )}
    </div>
  );
};