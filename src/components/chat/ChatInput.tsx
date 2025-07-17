
import React, { useState } from 'react';
import { Send, MessageCircle, Megaphone } from 'lucide-react';

interface ChatInputProps {
  inputMessage: string;
  onInputChange: (message: string) => void;
  onSendMessage: (isBroadcast?: boolean) => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
  apiKey: string; // Keep for backward compatibility but won't be used
  isTyping: boolean;
}

export const ChatInput = ({ 
  inputMessage, 
  onInputChange, 
  onSendMessage, 
  onKeyPress, 
  isTyping 
}: ChatInputProps) => {
  const [isBroadcastMode, setIsBroadcastMode] = useState(false);

  const handleSend = () => {
    onSendMessage(isBroadcastMode);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    } else {
      onKeyPress(e);
    }
  };

  return (
    <div className="space-y-3">
      {/* Message Type Toggle */}
      <div className="flex bg-gray-800 rounded-lg p-1 w-fit">
        <button
          onClick={() => setIsBroadcastMode(false)}
          className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all ${
            !isBroadcastMode 
              ? 'bg-gray-700 text-white' 
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <MessageCircle size={14} />
          Group Chat
        </button>
        <button
          onClick={() => setIsBroadcastMode(true)}
          className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all ${
            isBroadcastMode 
              ? 'bg-gradient-to-r from-orange-600 to-red-600 text-white' 
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <Megaphone size={14} />
          Broadcast
        </button>
      </div>

      {/* Message Input */}
      <div className="flex gap-3 items-end">
        <textarea
          value={inputMessage}
          onChange={(e) => onInputChange(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={
            isBroadcastMode 
              ? "Send an announcement to all trip members..." 
              : "Ask me about restaurants, activities, or anything about your trip..."
          }
          rows={2}
          className={`flex-1 border rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none resize-none transition-all ${
            isBroadcastMode
              ? 'bg-gradient-to-r from-orange-900/20 to-red-900/20 border-orange-500/50 focus:border-orange-400'
              : 'bg-gray-800 border-gray-700 focus:border-blue-500'
          }`}
        />
        <button
          onClick={handleSend}
          disabled={!inputMessage.trim() || isTyping}
          className={`text-white p-3 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
            isBroadcastMode
              ? 'bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700'
              : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
          }`}
        >
          <Send size={16} />
        </button>
      </div>
    </div>
  );
};
