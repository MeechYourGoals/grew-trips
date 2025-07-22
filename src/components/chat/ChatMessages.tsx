
import React from 'react';
import { MessageCircle } from 'lucide-react';
import { ChatMessage } from './types';

interface ChatMessagesProps {
  messages: ChatMessage[];
  isTyping: boolean;
}

export const ChatMessages = ({ messages, isTyping }: ChatMessagesProps) => {
  if (messages.length === 0) {
    return (
      <div className="text-center py-8">
        <MessageCircle size={48} className="text-gray-600 mx-auto mb-4" />
        <h4 className="text-lg font-medium text-gray-400 mb-2">Start the conversation</h4>
        <p className="text-gray-500 text-sm">Send a message to get the chat started!</p>
      </div>
    );
  }

  return (
    <>
      {messages.map((message) => (
        <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
          <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
            message.type === 'user'
              ? 'bg-gray-800 text-white'
              : 'bg-gradient-to-r from-blue-600/20 to-purple-600/20 text-gray-300 border border-blue-500/20'
          }`}>
            <p className="text-sm whitespace-pre-wrap">{message.content}</p>
          </div>
        </div>
      ))}
      {isTyping && (
        <div className="flex justify-start">
          <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-2xl p-4 border border-blue-500/20">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
