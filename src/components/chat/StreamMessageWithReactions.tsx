import React, { useState } from 'react';
import { MessageReactionBar } from './MessageReactionBar';

interface StreamMessageWithReactionsProps {
  messageId: string;
  messageText: string;
  senderName: string;
  senderAvatar?: string;
  timestamp: string;
  className?: string;
}

export const StreamMessageWithReactions: React.FC<StreamMessageWithReactionsProps> = ({
  messageId,
  messageText,
  senderName,
  senderAvatar,
  timestamp,
  className = ''
}) => {
  const [reactions, setReactions] = useState<Record<string, { count: number; userReacted: boolean }>>({});

  const handleReaction = (messageId: string, reactionType: string) => {
    setReactions(prev => {
      const currentReaction = prev[reactionType] || { count: 0, userReacted: false };
      
      return {
        ...prev,
        [reactionType]: {
          count: currentReaction.userReacted ? currentReaction.count - 1 : currentReaction.count + 1,
          userReacted: !currentReaction.userReacted
        }
      };
    });
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={`group relative ${className}`}>
      <div className="flex items-start gap-3">
        <img
          src={senderAvatar || `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face`}
          alt={senderName}
          className="w-8 h-8 rounded-full object-cover border border-gray-600/50"
        />
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-white font-medium text-sm">{senderName}</span>
            <span className="text-gray-400 text-xs">{formatTime(timestamp)}</span>
          </div>
          <p className="text-gray-300 text-sm">{messageText}</p>
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 mt-1">
            <MessageReactionBar
              messageId={messageId}
              reactions={reactions}
              onReaction={handleReaction}
            />
          </div>
        </div>
      </div>
    </div>
  );
};