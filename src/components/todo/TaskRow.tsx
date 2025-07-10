import React, { useState } from 'react';
import { Calendar, Clock, Users, User } from 'lucide-react';
import { Checkbox } from '../ui/checkbox';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { CompletionDrawer } from './CompletionDrawer';
import { useTaskMutations } from '../../hooks/useTripTasks';
import { formatDistanceToNow, isAfter } from 'date-fns';
import { TripTask } from '../../types/tasks';

interface TaskRowProps {
  task: TripTask;
  tripId: string;
}

export const TaskRow = ({ task, tripId }: TaskRowProps) => {
  const [showCompletionDrawer, setShowCompletionDrawer] = useState(false);
  const { toggleTaskMutation } = useTaskMutations(tripId);

  const isCompleted = task.is_poll 
    ? (task.task_status?.filter(s => s.completed).length || 0) >= (task.task_status?.length || 1)
    : task.task_status?.[0]?.completed || false;

  const isOverdue = task.due_at && isAfter(new Date(), new Date(task.due_at)) && !isCompleted;
  
  const currentUserStatus = task.task_status?.find(s => s.user_id === 'current-user-id'); // TODO: Get from auth
  const userCompleted = currentUserStatus?.completed || false;

  const handleToggleComplete = () => {
    toggleTaskMutation.mutate({
      taskId: task.id,
      completed: !userCompleted
    });
  };

  const completionCount = task.task_status?.filter(s => s.completed).length || 0;
  const totalUsers = task.task_status?.length || 1;
  const completionPercentage = (completionCount / totalUsers) * 100;

  return (
    <div className={`bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 transition-all hover:bg-white/10 ${
      isCompleted ? 'opacity-75' : ''
    }`}>
      <div className="flex items-start gap-3">
        {/* Checkbox */}
        <Checkbox
          checked={userCompleted}
          onCheckedChange={handleToggleComplete}
          className="mt-1"
        />

        {/* Task Content */}
        <div className="flex-1 min-w-0">
          <div className={`font-medium text-white ${isCompleted ? 'line-through' : ''}`}>
            {task.title}
          </div>
          
          {task.description && (
            <p className="text-gray-400 text-sm mt-1">{task.description}</p>
          )}

          {/* Due Date */}
          {task.due_at && (
            <div className="flex items-center gap-1 mt-2">
              <Calendar size={14} />
              <Badge 
                variant={isOverdue ? 'destructive' : 'secondary'}
                className="text-xs"
              >
                {isOverdue ? 'Overdue' : 'Due'} {formatDistanceToNow(new Date(task.due_at), { addSuffix: true })}
              </Badge>
            </div>
          )}
        </div>

        {/* Progress/Avatars */}
        <div className="flex items-center gap-2">
          {task.is_poll ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowCompletionDrawer(true)}
              className="flex items-center gap-2 text-gray-300 hover:text-white"
            >
              <Users size={16} />
              <span className="text-sm">{completionCount}/{totalUsers}</span>
              <div className="w-6 h-6 rounded-full border-2 border-gray-500 relative">
                <div 
                  className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 to-purple-400"
                  style={{ 
                    clipPath: `polygon(50% 50%, 50% 0%, ${50 + Math.cos((completionPercentage * 3.6 - 90) * Math.PI / 180) * 50}% ${50 - Math.sin((completionPercentage * 3.6 - 90) * Math.PI / 180) * 50}%, 50% 50%)`
                  }}
                />
              </div>
            </Button>
          ) : (
            <div className="flex items-center gap-1">
              <User size={16} className="text-gray-400" />
              <Avatar className="w-6 h-6">
                <AvatarImage src={task.creator?.avatar} />
                <AvatarFallback className="text-xs">
                  {task.creator?.name?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>
            </div>
          )}
        </div>
      </div>

      {/* Completion Drawer */}
      {showCompletionDrawer && (
        <CompletionDrawer
          task={task}
          onClose={() => setShowCompletionDrawer(false)}
        />
      )}
    </div>
  );
};