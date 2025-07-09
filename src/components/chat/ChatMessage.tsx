import React from 'react';
import { MockMessage } from './mockMessages';
import { formatTime } from './messageUtils';
import { MessageReactionBar } from './MessageReactionBar';

interface ChatMessageProps {
  message: MockMessage;
  reactions?: Record<string, { count: number; userReacted: boolean }>;
  onReaction: (messageId: string, reactionType: string) => void;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message, reactions, onReaction }) => {
  return (
    <div className="flex items-start gap-3">
      <img
        src={message.user.image}
        alt={message.user.name}
        className="w-8 h-8 rounded-full flex-shrink-0 object-cover border border-gray-600"
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm font-medium text-gray-300">
            {message.user.name}
          </span>
          <span className="text-xs text-gray-500">
            {formatTime(message.created_at)}
          </span>
        </div>
        <div className="text-sm text-gray-200 leading-relaxed">
          {message.text}
        </div>
        <MessageReactionBar
          messageId={message.id}
          reactions={reactions}
          onReaction={onReaction}
        />
      </div>
    </div>
  );
};