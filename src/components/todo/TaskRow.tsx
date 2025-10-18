import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Users, User, CheckCircle } from 'lucide-react';
import { Checkbox } from '../ui/checkbox';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { CompletionDrawer } from './CompletionDrawer';
import { useTripTasks } from '../../hooks/useTripTasks';
import { formatDistanceToNow, isAfter } from 'date-fns';
import { TripTask } from '../../types/tasks';
import { hapticService } from '../../services/hapticService';
import { Progress } from '../ui/progress';
import { useAuth } from '../../hooks/useAuth';
import { useDemoMode } from '../../hooks/useDemoMode';

interface TaskRowProps {
  task: TripTask;
  tripId: string;
}

export const TaskRow = ({ task, tripId }: TaskRowProps) => {
  const [showCompletionDrawer, setShowCompletionDrawer] = useState(false);
  const [justCompleted, setJustCompleted] = useState(false);
  const { toggleTaskMutation } = useTripTasks(tripId);

  const isCompleted = task.is_poll 
    ? (task.task_status?.filter(s => s.completed).length || 0) >= (task.task_status?.length || 1)
    : task.task_status?.[0]?.completed || false;

  const isOverdue = task.due_at && isAfter(new Date(), new Date(task.due_at)) && !isCompleted;
  
  const { user } = useAuth();
  const { isDemoMode } = useDemoMode();

  // Get current user ID based on auth state
  const getCurrentUserId = () => {
    if (isDemoMode || !user) {
      return 'demo-user';
    }
    return user.id;
  };
  
  const currentUserId = getCurrentUserId();
  const currentUserStatus = task.task_status?.find(s => s.user_id === currentUserId);
  const userCompleted = currentUserStatus?.completed || false;

  const completionCount = task.task_status?.filter(s => s.completed).length || 0;
  const totalUsers = task.task_status?.length || 1;
  const completionPercentage = (completionCount / totalUsers) * 100;

  const handleToggleComplete = () => {
    const willBeCompleted = !userCompleted;
    
    // Trigger haptic feedback
    if (willBeCompleted) {
      hapticService.success();
      setJustCompleted(true);
      // Reset animation state after 1 second
      setTimeout(() => setJustCompleted(false), 1000);
    } else {
      hapticService.light();
    }
    
    toggleTaskMutation.mutate({
      taskId: task.id,
      completed: willBeCompleted
    });
  };

  // Animation effect for group task completion
  useEffect(() => {
    if (task.is_poll && completionPercentage === 100 && !justCompleted) {
      // Celebration animation for group completion
      hapticService.celebration();
      // You could add confetti here in the future
    }
  }, [completionPercentage, task.is_poll, justCompleted]);

  return (
    <div className={`bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 transition-all hover:bg-white/10 ${
      isCompleted ? 'opacity-75' : ''
    }`}>
      <div className="flex items-start gap-3">
        {/* Checkbox with Animation */}
        <div className="relative mt-1">
          <Checkbox
            checked={userCompleted}
            onCheckedChange={handleToggleComplete}
          />
          {/* Success Animation Overlay */}
          {justCompleted && (
            <div className="absolute -inset-2 pointer-events-none">
              <CheckCircle 
                className="w-6 h-6 text-green-400 animate-scale-in" 
                fill="currentColor"
              />
            </div>
          )}
        </div>

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
            <div className="flex flex-col items-end gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowCompletionDrawer(true)}
                className="flex items-center gap-2 text-gray-300 hover:text-white"
              >
                <Users size={16} />
                <span className="text-sm">{completionCount}/{totalUsers}</span>
              </Button>
              
              {/* Group Progress Bar */}
              <div className="w-20">
                <Progress 
                  value={completionPercentage} 
                  className={`h-1 ${completionPercentage === 100 ? 'animate-pulse' : ''}`}
                />
                <span className="text-xs text-gray-400 mt-1">
                  {Math.round(completionPercentage)}%
                </span>
              </div>
              
              {/* Celebration Effect for Group Completion */}
              {completionPercentage === 100 && (
                <div className="text-xs text-yellow-400 font-medium animate-bounce">
                  🎉 All done!
                </div>
              )}
            </div>
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