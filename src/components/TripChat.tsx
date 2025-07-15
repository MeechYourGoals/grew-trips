
import React, { useState, useEffect } from 'react';
import { Send, MessageCircle } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { demoModeService } from '@/services/demoModeService';
import { getTripById } from '@/data/tripsData';
import { proTripMockData } from '@/data/proTripMockData';
import { getMockAvatar, currentUserAvatar } from '@/utils/mockAvatars';
import { MessageReactionBar } from './chat/MessageReactionBar';
import { MessageAIAnalyzer } from './MessageAIAnalyzer';
import { InlineReplyComponent } from './chat/InlineReplyComponent';
import { detectTripTier } from '@/utils/tripTierDetector';
import { AddToCalendarData } from '../types/calendar';

interface TripChatProps {
  groupChatEnabled?: boolean;
}

interface MockMessage {
  id: string;
  text: string;
  user: {
    id: string;
    name: string;
    image: string;
  };
  created_at: string;
  isMock: boolean;
  reactions?: Record<string, { count: number; userReacted: boolean }>;
  replyTo?: {
    id: string;
    text: string;
    senderName: string;
  };
}

export const TripChat = ({ groupChatEnabled = true }: TripChatProps) => {
  const { tripId, eventId, proTripId } = useParams();
  const [messages, setMessages] = useState<MockMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(true);
  const [reactions, setReactions] = useState<Record<string, Record<string, { count: number; userReacted: boolean }>>>({});
  const [replyingTo, setReplyingTo] = useState<{id: string; text: string; senderName: string} | null>(null);

  const handleEventAdded = (eventData: AddToCalendarData) => {
    console.log('Calendar event added from chat:', eventData);
    // In real app, this would sync with calendar service
  };

  const currentTripId = proTripId || tripId || eventId || 'default-trip';
  const tripTier = detectTripTier(currentTripId);

  useEffect(() => {
    const loadMockMessages = async () => {
      setLoading(true);
      
      // Auto-enable demo mode for consumer trips
      if (tripTier === 'consumer') {
        demoModeService.enableDemoMode();
      }
      
      // Check if this is a pro trip first
      const proTrip = proTripMockData[currentTripId];
      let tripType: string;
      
      if (proTrip) {
        // For pro trips, determine type based on category
        if (proTrip.category?.includes('Sports')) {
          tripType = 'sports-pro';
        } else if (proTrip.category?.includes('Music') || proTrip.category?.includes('Entertainment')) {
          tripType = 'entertainment-pro';
        } else if (proTrip.category?.includes('Corporate')) {
          tripType = 'corporate-pro';
        } else {
          tripType = 'entertainment-pro'; // default for pro trips
        }
      } else {
        // Regular trip logic
        const tripIdNum = parseInt(currentTripId, 10);
        const trip = tripIdNum ? getTripById(tripIdNum) : null;
        tripType = demoModeService.getTripType(trip);
      }
      
      const mockMessages = await demoModeService.getMockMessages(tripType);
      
      const formattedMessages: MockMessage[] = mockMessages.map((mock, index) => {
        const createdAt = new Date();
        createdAt.setDate(createdAt.getDate() - (mock.timestamp_offset_days || 1));
        createdAt.setHours(createdAt.getHours() - Math.floor(Math.random() * 12));
        
        return {
          id: `mock_${mock.id}_${index}`,
          text: mock.message_content,
          user: {
            id: `user_${mock.sender_name.replace(/\s+/g, '_').toLowerCase()}`,
            name: mock.sender_name,
            image: getMockAvatar(mock.sender_name)
          },
          created_at: createdAt.toISOString(),
          isMock: true
        };
      });

      // Sort messages by date (oldest first)
      formattedMessages.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
      
      setMessages(formattedMessages);
      setLoading(false);
    };

    loadMockMessages();
  }, [currentTripId]);

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;
    
    const newMessage: MockMessage = {
      id: `user_${Date.now()}`,
      text: inputValue,
      user: {
        id: 'current_user',
        name: 'You',
        image: currentUserAvatar
      },
      created_at: new Date().toISOString(),
      isMock: false,
      replyTo: replyingTo || undefined
    };
    
    setMessages(prev => [...prev, newMessage]);
    setInputValue('');
    setReplyingTo(null);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleReaction = (messageId: string, reactionType: string) => {
    setReactions(prev => {
      const messageReactions = prev[messageId] || {};
      const currentReaction = messageReactions[reactionType] || { count: 0, userReacted: false };
      
      const newReactions = {
        ...prev,
        [messageId]: {
          ...messageReactions,
          [reactionType]: {
            count: currentReaction.userReacted ? currentReaction.count - 1 : currentReaction.count + 1,
            userReacted: !currentReaction.userReacted
          }
        }
      };
      
      return newReactions;
    });
  };

  const handleReplyToMessage = (messageId: string, messageText: string, senderName: string) => {
    setReplyingTo({
      id: messageId,
      text: messageText,
      senderName: senderName
    });
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <MessageCircle size={48} className="text-blue-400 mx-auto mb-4 animate-pulse" />
          <h4 className="text-lg font-medium text-gray-300 mb-2">Loading Chat...</h4>
          <p className="text-gray-500 text-sm">Setting up messages</p>
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
            <h3 className="text-lg font-semibold text-white">Trip Chat</h3>
            <p className="text-gray-400 text-sm">
              Group conversation
            </p>
          </div>
        </div>
      </div>

      {/* Chat Interface */}
      <div className="bg-gray-900/50 rounded-xl overflow-hidden">
        {/* Messages Container */}
        <div className="h-96 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="text-center py-8">
              <MessageCircle size={32} className="text-gray-600 mx-auto mb-2" />
              <p className="text-gray-500 text-sm">No messages yet</p>
            </div>
          ) : (
            messages.map((message) => (
              <div key={message.id} className="group relative">
                {/* Reply context */}
                {message.replyTo && (
                  <div className="ml-11 mb-2">
                    <div className="bg-gray-800/30 border-l-2 border-blue-500 p-2 rounded-r-lg">
                      <p className="text-xs text-gray-400 mb-1">Replying to {message.replyTo.senderName}</p>
                      <p className="text-sm text-gray-300 truncate">{message.replyTo.text}</p>
                    </div>
                  </div>
                )}
                
                <div className="flex items-start gap-3">
                  <img
                    src={message.user.image}
                    alt={message.user.name}
                    className="w-8 h-8 rounded-full flex-shrink-0 object-cover border border-gray-600"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-gray-300">
                        {message.user.name}
                      </span>
                      <span className="text-xs text-gray-500">
                        {formatTime(message.created_at)}
                      </span>
                      <button
                        onClick={() => handleReplyToMessage(message.id, message.text, message.user.name)}
                        className="opacity-0 group-hover:opacity-100 text-xs text-blue-400 hover:text-blue-300 transition-opacity"
                      >
                        Reply
                      </button>
                    </div>
                    <div className="text-sm text-gray-200 leading-relaxed">
                      {message.text}
                    </div>
                    <MessageReactionBar
                      messageId={message.id}
                      reactions={reactions[message.id]}
                      onReaction={handleReaction}
                    />
                    <MessageAIAnalyzer
                      messageText={message.text}
                      onEventAdded={handleEventAdded}
                    />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Message Input */}
        <div className="border-t border-gray-700 p-4">
          <InlineReplyComponent 
            replyTo={replyingTo || undefined}
            onRemoveReply={() => setReplyingTo(null)}
          />
          <div className="flex items-center gap-3">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={replyingTo ? `Replying to ${replyingTo.senderName}...` : "Type your message..."}
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
