
import React, { useState } from 'react';
import { Send, Search, MessageCircle, User } from 'lucide-react';
import { useMessages } from '../hooks/useMessages';
import { useParams } from 'react-router-dom';

export const TripChat = () => {
  const { tripId } = useParams();
  const { getMessagesForTrip, addMessage, getTripUnreadCount } = useMessages();
  const [message, setMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const tripMessages = getMessagesForTrip(tripId || 'default-trip');
  const unreadCount = getTripUnreadCount(tripId || 'default-trip');

  const filteredMessages = tripMessages.filter(msg =>
    msg.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    msg.senderName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSendMessage = () => {
    if (!message.trim()) return;
    addMessage(message, tripId);
    setMessage('');
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
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <MessageCircle size={24} className="text-blue-400" />
          <div>
            <h3 className="text-lg font-semibold text-white">Trip Chat</h3>
            <p className="text-gray-400 text-sm">
              {unreadCount > 0 ? `${unreadCount} unread messages` : 'You\'re all caught up!'}
            </p>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative mb-6">
        <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search messages..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-gray-800 border border-gray-700 rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
        />
      </div>

      {/* Messages */}
      <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
        {filteredMessages.length > 0 ? (
          filteredMessages.map((msg) => (
            <div key={msg.id} className="flex items-start gap-3">
              <img
                src={msg.senderAvatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face'}
                alt={msg.senderName}
                className="w-10 h-10 rounded-full"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-white font-medium">{msg.senderName}</span>
                  <span className="text-gray-400 text-xs">{formatTime(msg.timestamp)}</span>
                  {!msg.isRead && (
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  )}
                </div>
                <p className="text-gray-300">{msg.content}</p>
                {msg.mentions && msg.mentions.includes('everyone') && (
                  <div className="mt-2">
                    <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded flex items-center gap-1 w-fit">
                      <User size={10} />
                      @everyone
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12">
            <MessageCircle size={48} className="text-slate-600 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-slate-400 mb-2">
              {searchQuery ? 'No messages found' : 'No messages yet'}
            </h4>
            <p className="text-slate-500 text-sm">
              {searchQuery ? 'Try a different search term' : 'Start the conversation with your trip mates!'}
            </p>
          </div>
        )}
      </div>

      {/* Message Input */}
      <div className="flex gap-4 items-end">
        <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full flex items-center justify-center">
          <div className="w-3 h-3 bg-green-400 rounded-full"></div>
        </div>
        <div className="flex-1 relative">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            rows={2}
            className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 pr-12 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 resize-none"
          />
          <button
            onClick={handleSendMessage}
            disabled={!message.trim()}
            className="absolute right-2 bottom-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white p-2 rounded-lg transition-colors"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
