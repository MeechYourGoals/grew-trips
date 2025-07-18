import React from 'react';
import { Send } from 'lucide-react';

interface AiChatInputProps {
  inputMessage: string;
  onInputChange: (message: string) => void;
  onSendMessage: () => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
  isTyping: boolean;
}

export const AiChatInput = ({ 
  inputMessage, 
  onInputChange, 
  onSendMessage, 
  onKeyPress, 
  isTyping 
}: AiChatInputProps) => {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSendMessage();
    } else {
      onKeyPress(e);
    }
  };

  return (
    <div className="flex gap-3 items-end">
      <textarea
        value={inputMessage}
        onChange={(e) => onInputChange(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="Ask about your trip..."
        rows={2}
        className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 resize-none"
      />
      <button
        onClick={onSendMessage}
        disabled={!inputMessage.trim() || isTyping}
        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white p-3 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Send size={16} />
      </button>
    </div>
  );
};