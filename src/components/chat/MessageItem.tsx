import React from 'react';
import { ChatMessage } from '@/hooks/useChatComposer';
import { getMockAvatar } from '@/utils/mockAvatars';
import { MessageReactionBar } from './MessageReactionBar';

interface MessageItemProps {
  message: ChatMessage;
  reactions?: Record<string, { count: number; userReacted: boolean }>;
  onReaction: (messageId: string, reactionType: string) => void;
}

export const MessageItem = ({ message, reactions, onReaction }: MessageItemProps) => {
  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex items-start gap-3">
      <img
        src={message.sender.avatar || getMockAvatar(message.sender.name)}
        alt={message.sender.name}
        className="w-8 h-8 rounded-full object-cover border border-gray-600/50"
      />
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-white font-medium text-sm">{message.sender.name}</span>
          <span className="text-gray-400 text-xs">{formatTime(message.createdAt)}</span>
          {message.isBroadcast && (
            <span className="text-xs bg-orange-600/20 text-orange-400 px-2 py-0.5 rounded">
              Broadcast
            </span>
          )}
        </div>
        <p className="text-gray-300 text-sm">{message.text}</p>
        <MessageReactionBar
          messageId={message.id}
          reactions={reactions}
          onReaction={onReaction}
        />
      </div>
    </div>
  );
};
