import React, { useState } from 'react';
import { getMockAvatar } from '@/utils/mockAvatars';
import { MessageReactionBar } from './MessageReactionBar';
import { cn } from '@/lib/utils';

export interface MessageBubbleProps {
  id: string;
  text: string;
  senderName: string;
  senderAvatar?: string;
  timestamp: string;
  isBroadcast?: boolean;
  isPayment?: boolean;
  reactions?: Record<string, { count: number; userReacted: boolean }>;
  onReaction: (messageId: string, reactionType: string) => void;
}

export const MessageBubble = ({
  id,
  text,
  senderName,
  senderAvatar,
  timestamp,
  isBroadcast,
  isPayment,
  reactions,
  onReaction
}: MessageBubbleProps) => {
  const [showReactions, setShowReactions] = useState(false);

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getTextColorClass = () => {
    if (isBroadcast) return 'text-orange-400';
    if (isPayment) return 'text-green-400';
    return 'text-foreground';
  };

  const getBubbleClasses = () => {
    if (isBroadcast) {
      return 'bg-orange-600/10 border-orange-500/30 shadow-[0_2px_12px_rgba(251,146,60,0.15)]';
    }
    if (isPayment) {
      return 'bg-green-600/10 border-green-500/30 shadow-[0_2px_12px_rgba(34,197,94,0.15)]';
    }
    return 'bg-card/50 border-border shadow-sm';
  };

  return (
    <div
      className="group flex items-start gap-3"
      onMouseEnter={() => setShowReactions(true)}
      onMouseLeave={() => setShowReactions(false)}
    >
      <img
        src={senderAvatar || getMockAvatar(senderName)}
        alt={senderName}
        className="w-10 h-10 rounded-full object-cover border-2 border-border/50"
      />
      
      <div className="flex-1">
        <div className={cn('rounded-xl px-4 py-3 backdrop-blur-sm border transition-all', getBubbleClasses())}>
          <div className="flex items-center gap-2 mb-2">
            <span className="font-semibold text-sm text-foreground">{senderName}</span>
            <span className="text-xs text-muted-foreground">{formatTime(timestamp)}</span>
            {isBroadcast && (
              <span className="text-xs bg-orange-600/20 text-orange-400 px-2 py-0.5 rounded-full">
                📢 Broadcast
              </span>
            )}
            {isPayment && (
              <span className="text-xs bg-green-600/20 text-green-400 px-2 py-0.5 rounded-full">
                💳 Payment
              </span>
            )}
          </div>
          <p className={cn('text-sm leading-relaxed', getTextColorClass())}>{text}</p>
        </div>
        
        <div className={cn('mt-2 transition-opacity', showReactions ? 'opacity-100' : 'opacity-0')}>
          <MessageReactionBar messageId={id} reactions={reactions} onReaction={onReaction} />
        </div>
      </div>
    </div>
  );
};
