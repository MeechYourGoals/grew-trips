import React from 'react';
import { ChatMessage } from '@/hooks/useChatComposer';
import { MessageBubble } from './MessageBubble';

interface MessageItemProps {
  message: ChatMessage;
  reactions?: Record<string, { count: number; userReacted: boolean }>;
  onReaction: (messageId: string, reactionType: string) => void;
}

export const MessageItem = ({ message, reactions, onReaction }: MessageItemProps) => {
  return (
    <MessageBubble
      id={message.id}
      text={message.text}
      senderName={message.sender.name}
      senderAvatar={message.sender.avatar}
      timestamp={message.createdAt}
      isBroadcast={message.isBroadcast}
      isPayment={message.isPayment || message.tags?.includes('payment')}
      reactions={reactions}
      onReaction={onReaction}
    />
  );
};
