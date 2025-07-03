
import React, { useState } from 'react';
import { Clock, MapPin, Users } from 'lucide-react';

interface BroadcastProps {
  id: string;
  sender: string;
  message: string;
  timestamp: Date;
  location?: string;
  category: 'chill' | 'logistics' | 'urgent';
  recipients: string;
  responses: {
    coming: number;
    wait: number;
    cant: number;
  };
  userResponse?: 'coming' | 'wait' | 'cant';
  onRespond: (broadcastId: string, response: 'coming' | 'wait' | 'cant') => void;
}

export const Broadcast = ({ 
  id, 
  sender, 
  message, 
  timestamp,
  location,
  category,
  recipients,
  responses,
  userResponse,
  onRespond
}: BroadcastProps) => {
  const getCategoryColors = () => {
    switch (category) {
      case 'chill':
        return 'bg-blue-600/20 border-blue-500/30';
      case 'logistics':
        return 'bg-yellow-600/20 border-yellow-500/30';
      case 'urgent':
        return 'bg-red-600/20 border-red-500/30';
      default:
        return 'bg-slate-600/20 border-slate-500/30';
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diffMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffMinutes < 60) {
      return `${diffMinutes}m ago`;
    } else if (diffMinutes < 1440) {
      return `${Math.floor(diffMinutes / 60)}h ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const handleResponse = (response: 'coming' | 'wait' | 'cant') => {
    onRespond(id, response);
  };

  const formatRecipients = () => {
    if (recipients === 'everyone') return 'Everyone';
    if (recipients.startsWith('role:')) return recipients.slice(5);
    if (recipients.startsWith('user:')) return 'Direct';
    return recipients;
  };

  return (
    <div className={`border rounded-lg p-4 ${getCategoryColors()}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
            <span className="text-xs font-medium text-white">
              {sender.charAt(0).toUpperCase()}
            </span>
          </div>
          <span className="font-medium text-white">{sender}</span>
          <span className="text-xs text-slate-400 capitalize">{category}</span>
        </div>
        <div className="flex items-center gap-1 text-slate-400 text-xs">
          <Clock size={12} />
          {formatTime(timestamp)}
        </div>
      </div>
      <div className="flex items-center gap-1 text-slate-400 text-xs mb-3 mt-1">
        <Users size={12} />
        Sent to: {formatRecipients()}
      </div>

      {/* Message */}
      <p className="text-white mb-3 leading-relaxed">{message}</p>

      {/* Location */}
      {location && (
        <div className="flex items-center gap-2 text-slate-300 text-sm mb-3">
          <MapPin size={14} />
          {location}
        </div>
      )}

      {/* Response Options */}
      <div className="flex items-center gap-3">
        <div className="flex gap-2">
          <button
            onClick={() => handleResponse('coming')}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors flex items-center gap-1 ${
              userResponse === 'coming' 
                ? 'bg-green-600 text-white' 
                : 'bg-slate-700 text-slate-300 hover:bg-green-600/50'
            }`}
          >
            ✅ Coming ({responses.coming})
          </button>
          <button
            onClick={() => handleResponse('wait')}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors flex items-center gap-1 ${
              userResponse === 'wait' 
                ? 'bg-yellow-600 text-white' 
                : 'bg-slate-700 text-slate-300 hover:bg-yellow-600/50'
            }`}
          >
            ✋ Wait ({responses.wait})
          </button>
          <button
            onClick={() => handleResponse('cant')}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors flex items-center gap-1 ${
              userResponse === 'cant' 
                ? 'bg-red-600 text-white' 
                : 'bg-slate-700 text-slate-300 hover:bg-red-600/50'
            }`}
          >
            ❌ Can't ({responses.cant})
          </button>
        </div>
      </div>
    </div>
  );
};
