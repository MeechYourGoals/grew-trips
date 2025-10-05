import React, { useState } from 'react';
import { Plus, Check, X } from 'lucide-react';
import { hapticService } from '../../services/hapticService';

interface Task {
  id: string;
  title: string;
  completed: boolean;
  assignee?: string;
  dueDate?: string;
}

interface MobileTripTasksProps {
  tripId: string;
}

export const MobileTripTasks = ({ tripId }: MobileTripTasksProps) => {
  const [tasks, setTasks] = useState<Task[]>([
    { id: '1', title: 'Book flights', completed: true, assignee: 'Sarah' },
    { id: '2', title: 'Reserve hotel rooms', completed: false, assignee: 'Mike', dueDate: 'Tomorrow' },
    { id: '3', title: 'Plan day 1 itinerary', completed: false, assignee: 'Alex' }
  ]);
  const [showCompleted, setShowCompleted] = useState(true);

  const handleToggleTask = async (taskId: string) => {
    await hapticService.success();
    setTasks(tasks.map(task =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  const handleDeleteTask = async (taskId: string) => {
    await hapticService.medium();
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const activeTasks = tasks.filter(t => !t.completed);
  const completedTasks = tasks.filter(t => t.completed);

  return (
    <div className="flex flex-col h-full bg-black px-4 py-4">
      {/* Header with Add Button */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-white">Trip Tasks</h2>
          <p className="text-sm text-gray-400">
            {activeTasks.length} pending · {completedTasks.length} completed
          </p>
        </div>
        <button
          onClick={async () => {
            await hapticService.medium();
            // Add task modal
          }}
          className="p-3 bg-blue-600 rounded-lg active:scale-95 transition-transform"
        >
          <Plus size={20} className="text-white" />
        </button>
      </div>

      {/* Active Tasks */}
      <div className="flex-1 overflow-y-auto">
        <div className="space-y-3 mb-6">
          {activeTasks.map((task) => (
            <div
              key={task.id}
              className="bg-white/10 rounded-xl p-4 active:bg-white/15 transition-colors"
            >
              <div className="flex items-start gap-3">
                <button
                  onClick={() => handleToggleTask(task.id)}
                  className="mt-0.5 flex-shrink-0 w-6 h-6 rounded-full border-2 border-gray-400 flex items-center justify-center active:scale-95 transition-transform"
                >
                  {task.completed && <Check size={14} className="text-white" />}
                </button>
                <div className="flex-1">
                  <h4 className="text-white font-medium">{task.title}</h4>
                  <div className="flex items-center gap-3 mt-1">
                    {task.assignee && (
                      <span className="text-xs text-gray-400">@{task.assignee}</span>
                    )}
                    {task.dueDate && (
                      <span className="text-xs text-orange-400">{task.dueDate}</span>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteTask(task.id)}
                  className="p-1 text-gray-400 active:text-red-400 active:scale-95 transition-all"
                >
                  <X size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Completed Tasks */}
        {completedTasks.length > 0 && (
          <div>
            <button
              onClick={async () => {
                await hapticService.light();
                setShowCompleted(!showCompleted);
              }}
              className="flex items-center justify-between w-full mb-3 py-2"
            >
              <h3 className="text-sm font-semibold text-gray-400">
                Completed ({completedTasks.length})
              </h3>
              <span className="text-gray-400">{showCompleted ? '−' : '+'}</span>
            </button>
            
            {showCompleted && (
              <div className="space-y-3">
                {completedTasks.map((task) => (
                  <div
                    key={task.id}
                    className="bg-white/5 rounded-xl p-4 opacity-60"
                  >
                    <div className="flex items-start gap-3">
                      <button
                        onClick={() => handleToggleTask(task.id)}
                        className="mt-0.5 flex-shrink-0 w-6 h-6 rounded-full bg-green-500 flex items-center justify-center active:scale-95 transition-transform"
                      >
                        <Check size={14} className="text-white" />
                      </button>
                      <div className="flex-1">
                        <h4 className="text-gray-300 line-through">{task.title}</h4>
                        {task.assignee && (
                          <span className="text-xs text-gray-500">@{task.assignee}</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
