
import React, { useState, useEffect } from 'react';
import { Send, Search, MessageCircle, User, Settings, AlertTriangle, Clock, Info } from 'lucide-react'; // Added icons
import { useMessages } from '../hooks/useMessages';
import { useParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth'; // Assuming useAuth provides the current user
import { MessageService } from '../services/messageService'; // For creating message in DB
import { AiFeatureService } from '../services/aiFeatures'; // For classification
import type { Message } from '../types/messaging'; // Assuming Message type is defined here or in services

interface TripChatProps {
  groupChatEnabled?: boolean;
}

export const TripChat = ({ groupChatEnabled = true }: TripChatProps) => {
  const { tripId, eventId } = useParams();
  const { user } = useAuth(); // Get current user
  const {
    messages: localMessages, // Renaming to avoid conflict if fetching real messages later
    addMessage: addMessageToLocalState, // Keep local state update for responsiveness
    getTripUnreadCount
  } = useMessages();

  const [messageContent, setMessageContent] = useState(''); // Renamed from 'message'
  const [searchQuery, setSearchQuery] = useState('');

  // TODO: This component should ideally fetch and display messages from MessageService
  // For now, it continues to use localMessages from useMessages hook for display.
  // This means priority updates won't reflect immediately unless local state is also updated.
  const [displayedMessages, setDisplayedMessages] = useState<Message[]>([]);


  const currentTripId = tripId || eventId || 'default-trip';
  // const tripMessages = getMessagesForTrip(currentTripId); // From useMessages (local state)
  const unreadCount = getTripUnreadCount(currentTripId); // From useMessages (local state)

  useEffect(() => {
    // Simulate fetching messages or use localMessages
    // In a real app, fetch from MessageService.getMessagesForTrip(currentTripId)
    // For now, just use the local mock messages from the hook
    const localMockMessages = localMessages.filter(msg => msg.tripId === currentTripId || msg.tourId === currentTripId);
    setDisplayedMessages(localMockMessages);
  }, [localMessages, currentTripId]);


  const filteredMessages = displayedMessages.filter(msg =>
    msg.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (msg.senderName && msg.senderName.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleSendMessage = async () => {
    if (!messageContent.trim() || !groupChatEnabled || !user) return;

    const tempMessageId = Date.now().toString(); // Temporary ID for local state

    // 1. Optimistically update local UI (using existing useMessages hook)
    addMessageToLocalState(messageContent, currentTripId);

    const currentMessageText = messageContent;
    setMessageContent(''); // Clear input field

    try {
      // 2. Actually create message in DB
      const createResponse = await MessageService.createMessage({
        content: currentMessageText,
        trip_id: currentTripId,
        user_id: user.id, // Assuming user object has id
      });

      if (createResponse.data && !createResponse.error) {
        const dbMessage = createResponse.data;
        console.log('Message created in DB:', dbMessage);

        // TODO: Update local state message with the ID from DB if necessary,
        // or refactor useMessages to handle this. For now, local state has a temp ID.

        // 3. Asynchronously classify priority
        AiFeatureService.classifyMessagePriority(dbMessage.content /*, tripContext */)
          .then(classificationResponse => {
            if (classificationResponse.success && classificationResponse.data) {
              const { priority, score, reason } = classificationResponse.data;
              MessageService.updateMessagePriority(dbMessage.id, { priority, priority_score: score, priority_reason: reason })
                .then(updateResponse => {
                  if (updateResponse.data && !updateResponse.error) {
                    console.log('Message priority updated in DB:', updateResponse.data);
                    // TODO: Update the specific message in displayedMessages state with new priority
                    // This is important for UI to reflect the change.
                    // For now, this requires manually finding and updating the message in displayedMessages
                    // or a more robust state management solution.
                    setDisplayedMessages(prev => prev.map(m =>
                      m.id === tempMessageId || m.id === dbMessage.id // Try to match by temp or db id
                        ? { ...m, priority: priority as Message['priority'], priority_score: score, priority_reason: reason }
                        : m
                    ));

                  } else {
                    console.error('Failed to update message priority in DB:', updateResponse.error);
                  }
                });
            } else {
              console.error('Failed to classify message priority:', classificationResponse.error);
            }
          });
      } else {
        console.error('Failed to create message in DB:', createResponse.error);
        // Optionally, remove the optimistically added message from local state here
      }
    } catch (error) {
      console.error('Error sending message or classifying priority:', error);
    }
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

  // Show disabled chat notice for large events
  if (!groupChatEnabled) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-8 max-w-md mx-auto">
            <Settings size={48} className="text-gray-500 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-300 mb-2">
              Group Chat Disabled
            </h4>
            <p className="text-gray-500 text-sm mb-4">
              Group chat has been disabled for this event to manage large-scale communication. 
              You can still access broadcasts, calendar updates, and other event information.
            </p>
            <div className="flex items-center justify-center gap-2 text-blue-400 text-sm">
              <MessageCircle size={16} />
              <span>Check Broadcasts for important updates</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <MessageCircle size={24} className="text-blue-400" />
          <div>
            <h3 className="text-lg font-semibold text-white">Event Chat</h3>
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
                  {msg.priority && msg.priority !== 'none' && (
                    <span title={`Priority: ${msg.priority}${msg.priority_reason ? ` - ${msg.priority_reason}` : ''}${msg.priority_score ? ` (${(msg.priority_score * 100).toFixed(0)}%)` : ''}`} className="ml-1">
                      {msg.priority === 'urgent' && <AlertTriangle size={14} className="text-red-400" />}
                      {msg.priority === 'reminder' && <Clock size={14} className="text-yellow-400" />}
                      {msg.priority === 'fyi' && <Info size={14} className="text-blue-400" />}
                    </span>
                  )}
                  {!msg.isRead && (
                    <div className="w-2 h-2 bg-blue-400 rounded-full ml-auto"></div>
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
              {searchQuery ? 'Try a different search term' : 'Start the conversation with your event attendees!'}
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
