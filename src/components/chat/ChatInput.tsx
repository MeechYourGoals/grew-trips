
import React from 'react';
import { Send } from 'lucide-react';

interface ChatInputProps {
  inputMessage: string;
  onInputChange: (message: string) => void;
  onSendMessage: () => void;
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
  return (
    <div className="flex gap-3 items-end">
      <textarea
        value={inputMessage}
        onChange={(e) => onInputChange(e.target.value)}
        onKeyPress={onKeyPress}
        placeholder="Ask me about restaurants, activities, or anything about your trip..."
        rows={2}
        className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 resize-none"
      />
      <button
        onClick={onSendMessage}
        disabled={!inputMessage.trim() || isTyping}
        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white p-3 rounded-xl transition-all duration-200"
      >
        <Send size={16} />
      </button>
    </div>
  );
};
