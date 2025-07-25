import React, { useState } from 'react';
import { Send, MessageCircle } from 'lucide-react';
import { useMessages } from '../hooks/useMessages';
import { currentUserAvatar } from '@/utils/mockAvatars';

interface DemoChatProps {
  tripId: string;
}

export const DemoChat = ({ tripId }: DemoChatProps) => {
  const { messages, addMessage } = useMessages(tripId);
  const [inputValue, setInputValue] = useState('');

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;
    addMessage(inputValue, tripId);
    setInputValue('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="p-6">
      <div className="mb-4 flex items-center gap-2">
        <MessageCircle size={24} className="text-blue-400" />
        <h3 className="text-lg font-semibold text-white">Trip Chat</h3>
      </div>
      <div className="bg-gray-900/50 rounded-xl overflow-hidden">
        <div className="h-96 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="text-center py-8">
              <MessageCircle size={32} className="text-gray-600 mx-auto mb-2" />
              <p className="text-gray-500 text-sm">No messages yet</p>
            </div>
          ) : (
            messages.map((message) => (
              <div key={message.id} className="flex items-start gap-3">
                <img
                  src={message.senderAvatar || currentUserAvatar}
                  alt={message.senderName}
                  className="w-10 h-10 rounded-full flex-shrink-0 object-cover border border-gray-600"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-gray-300">{message.senderName}</span>
                    <span className="text-xs text-gray-500">{formatTime(message.timestamp)}</span>
                  </div>
                  <p className="text-gray-200 text-sm">{message.content}</p>
                </div>
              </div>
            ))
          )}
        </div>
        <div className="border-t border-gray-700 p-4">
          <div className="flex items-center gap-3">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="flex-1 bg-gray-800 text-white placeholder-gray-400 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-700"
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputValue.trim()}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white p-2 rounded-lg transition-colors flex items-center justify-center"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
