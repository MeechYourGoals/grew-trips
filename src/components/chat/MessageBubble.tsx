import React, { useState } from 'react';
import { getMockAvatar } from '@/utils/mockAvatars';
import { MessageReactionBar } from './MessageReactionBar';
import { GoogleMapsWidget } from './GoogleMapsWidget';
import { ChatMessageWithGrounding } from '@/types/grounding';
import { ExternalLink } from 'lucide-react';
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
  // 🆕 Grounding support
  grounding?: {
    sources?: Array<{ id: string; title: string; url: string; snippet: string; source: string }>;
    googleMapsWidget?: string;
  };
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
  onReaction,
  grounding
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
        
        {/* 🆕 Google Maps Widget */}
        {grounding?.googleMapsWidget && (
          <div className="mt-3">
            <GoogleMapsWidget widgetToken={grounding.googleMapsWidget} height={250} />
          </div>
        )}
        
        {/* 🆕 Grounding Sources */}
        {grounding?.sources && grounding.sources.length > 0 && (
          <div className="mt-3 space-y-2">
            <div className="text-xs font-medium text-muted-foreground flex items-center gap-2">
              <span>Sources:</span>
              {grounding.sources.some(s => s.source === 'google_maps_grounding') && (
                <span className="bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded text-[10px]">
                  Verified by Google Maps
                </span>
              )}
            </div>
            <div className="space-y-1">
              {grounding.sources.map((source, idx) => (
                <a
                  key={source.id || idx}
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 p-2 bg-blue-500/10 rounded-lg transition-colors"
                >
                  <ExternalLink size={10} />
                  <span className="truncate">{source.title}</span>
                </a>
              ))}
            </div>
          </div>
        )}
        
        <div className={cn('mt-2 transition-opacity', showReactions ? 'opacity-100' : 'opacity-0')}>
          <MessageReactionBar messageId={id} reactions={reactions} onReaction={onReaction} />
        </div>
      </div>
    </div>
  );
};
