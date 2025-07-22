
import React from 'react';
import { Megaphone, AlertTriangle } from 'lucide-react';

interface MessageBubbleProps {
  text: string;
  senderName: string;
  timestamp: string;
  avatar: string;
  isBroadcast?: boolean;
  isEmergencyBroadcast?: boolean;
  replyTo?: {
    id: string;
    text: string;
    sender: string;
  };
  children?: React.ReactNode; // For reactions and actions
}

export const MessageBubble = ({
  text,
  senderName,
  timestamp,
  avatar,
  isBroadcast = false,
  isEmergencyBroadcast = false,
  replyTo,
  children
}: MessageBubbleProps) => {
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex items-start gap-3">
      {/* Avatar */}
      <img
        src={avatar}
        alt={senderName}
        className="w-10 h-10 rounded-full flex-shrink-0 object-cover border border-gray-600"
      />
      
      {/* Message Content */}
      <div className="flex-1 min-w-0">
        {/* Sender Name & Time */}
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm font-medium text-gray-300">
            {senderName}
          </span>
          <span className="text-xs text-gray-500">
            {formatTime(timestamp)}
          </span>
        </div>
        
        {/* Message Bubble */}
        <div className={`
          max-w-md p-3 rounded-lg relative
          ${isEmergencyBroadcast
            ? 'bg-red-100 border-2 border-red-400 text-red-900 shadow-lg'
            : isBroadcast
              ? 'bg-orange-100 border border-orange-300 text-orange-900'
              : 'bg-gray-700 text-gray-200'
          }
        `} role={isBroadcast ? 'alert' : undefined}
            aria-label={isBroadcast ? 'Broadcast message' : undefined}>
          
          {/* Broadcast Header */}
          {isBroadcast && (
            <div className="flex items-center gap-2 text-xs font-bold mb-2">
              {isEmergencyBroadcast ? (
                <>
                  <AlertTriangle size={14} className="text-red-600" />
                  <span className="text-red-600">🚨 EMERGENCY BROADCAST</span>
                </>
              ) : (
                <>
                  <Megaphone size={14} className="text-orange-600" />
                  <span className="text-orange-600">📢 BROADCAST</span>
                </>
              )}
            </div>
          )}
          
          {/* Reply Context */}
          {replyTo && (
            <div className="text-xs opacity-70 mb-2 p-2 bg-black/10 rounded border-l-2 border-gray-500">
              Replying to {replyTo.sender}: "{replyTo.text}"
            </div>
          )}
          
          {/* Message Text */}
          <div className="leading-relaxed">{text}</div>
        </div>
        
        {/* Message Actions (reactions, reply button, etc.) */}
        {children && (
          <div className="mt-2 space-y-1">
            {children}
          </div>
        )}
      </div>
    </div>
  );
};
