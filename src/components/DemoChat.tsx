
import React, { useState, useEffect } from 'react';
import { Send, MessageCircle, Megaphone, AlertTriangle } from 'lucide-react';
import { demoModeService } from '@/services/demoModeService';
import { getTripById } from '@/data/tripsData';
import { getMockAvatar, currentUserAvatar } from '@/utils/mockAvatars';
import { MessageReactionBar } from './chat/MessageReactionBar';

interface DemoChatProps {
  tripId: string;
}

interface DemoMessage {
  id: string;
  text: string;
  user: {
    id: string;
    name: string;
    image: string;
  };
  created_at: string;
  isMock: boolean;
  isBroadcast?: boolean;
  isEmergencyBroadcast?: boolean;
  reactions?: Record<string, { count: number; userReacted: boolean }>;
}

export const DemoChat = ({ tripId }: DemoChatProps) => {
  const [messages, setMessages] = useState<DemoMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(true);
  const [messageFilter, setMessageFilter] = useState<'all' | 'broadcast'>('all');
  const [reactions, setReactions] = useState<Record<string, Record<string, { count: number; userReacted: boolean }>>>({});

  useEffect(() => {
    const loadMockMessages = async () => {
      setLoading(true);
      
      const tripIdNum = parseInt(tripId, 10);
      const trip = tripIdNum ? getTripById(tripIdNum) : null;
      const tripType = demoModeService.getTripType(trip);
      
      const mockMessages = await demoModeService.getMockMessages(tripType);
      
      const formattedMessages: DemoMessage[] = mockMessages.map((mock, index) => {
        const createdAt = new Date();
        createdAt.setDate(createdAt.getDate() - (mock.timestamp_offset_days || 1));
        createdAt.setHours(createdAt.getHours() - Math.floor(Math.random() * 12));
        
        const isBroadcast = mock.tags?.includes('broadcast') || false;
        const isEmergencyBroadcast = mock.tags?.includes('emergency') || mock.tags?.includes('urgent') || false;
        
        return {
          id: `demo_${mock.id}_${index}`,
          text: mock.message_content,
          user: {
            id: `demo_user_${mock.sender_name.replace(/\s+/g, '_').toLowerCase()}`,
            name: mock.sender_name,
            image: getMockAvatar(mock.sender_name)
          },
          created_at: createdAt.toISOString(),
          isMock: true,
          isBroadcast,
          isEmergencyBroadcast
        };
      });

      formattedMessages.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
      
      setMessages(formattedMessages);
      setLoading(false);
    };

    loadMockMessages();
  }, [tripId]);

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;
    
    const newMessage: DemoMessage = {
      id: `demo_user_${Date.now()}`,
      text: inputValue,
      user: {
        id: 'demo_current_user',
        name: 'You',
        image: currentUserAvatar
      },
      created_at: new Date().toISOString(),
      isMock: false
    };
    
    setMessages(prev => [...prev, newMessage]);
    setInputValue('');
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

  const filteredMessages = messages.filter(message => {
    if (messageFilter === 'all') return true;
    if (messageFilter === 'broadcast') return message.isBroadcast;
    return true;
  });

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <MessageCircle size={48} className="text-blue-400 mx-auto mb-4 animate-pulse" />
          <h4 className="text-lg font-medium text-gray-300 mb-2">Loading Demo Chat...</h4>
          <p className="text-gray-500 text-sm">Setting up mock messages</p>
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
              Demo mode - Mock conversation
              <span className="ml-2 px-2 py-1 bg-yellow-500/20 text-yellow-400 text-xs rounded-md">DEMO</span>
            </p>
          </div>
        </div>
      </div>

      {/* Message Filters */}
      {messages.length > 0 && (
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setMessageFilter('all')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              messageFilter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            All Messages
          </button>
          <button
            onClick={() => setMessageFilter('broadcast')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
              messageFilter === 'broadcast' ? 'bg-orange-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            <Megaphone size={14} />
            Broadcasts
          </button>
        </div>
      )}

      {/* Chat Interface */}
      <div className="bg-gray-900/50 rounded-xl overflow-hidden">
        {/* Messages Container */}
        <div className="h-96 overflow-y-auto p-4 space-y-4">
          {filteredMessages.length === 0 ? (
            <div className="text-center py-8">
              <MessageCircle size={32} className="text-gray-600 mx-auto mb-2" />
              <p className="text-gray-500 text-sm">
                {messageFilter === 'all' ? 'No messages yet' : 'No broadcasts yet'}
              </p>
            </div>
          ) : (
            filteredMessages.map((message) => (
              <div key={message.id} className="flex items-start gap-3">
                {/* Avatar */}
                <img
                  src={message.user.image}
                  alt={message.user.name}
                  className="w-10 h-10 rounded-full flex-shrink-0 object-cover border border-gray-600"
                />
                
                {/* Message Content */}
                <div className="flex-1 min-w-0">
                  {/* Sender Name & Time */}
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-gray-300">
                      {message.user.name}
                    </span>
                    <span className="text-xs text-gray-500">
                      {formatTime(message.created_at)}
                    </span>
                    {message.isMock && (
                      <span className="text-xs text-yellow-500">mock</span>
                    )}
                  </div>
                  
                  {/* Message Bubble */}
                  <div className={`
                    max-w-md p-3 rounded-lg
                    ${message.isEmergencyBroadcast
                      ? 'bg-red-100 border-2 border-red-400 text-red-900 shadow-lg'
                      : message.isBroadcast
                        ? 'bg-orange-100 border border-orange-300 text-orange-900'
                        : 'bg-gray-800 text-gray-200'
                    }
                  `} role={message.isBroadcast ? 'alert' : undefined}
                      aria-label={message.isBroadcast ? 'Broadcast message' : undefined}>
                    
                    {/* Broadcast Header */}
                    {message.isBroadcast && (
                      <div className="flex items-center gap-2 text-xs font-bold mb-2">
                        {message.isEmergencyBroadcast ? (
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
                    
                    {/* Message Text */}
                    <div className="text-sm leading-relaxed">
                      {message.text}
                    </div>
                  </div>
                  
                  {/* Message Actions */}
                  <MessageReactionBar
                    messageId={message.id}
                    reactions={reactions[message.id]}
                    onReaction={handleReaction}
                  />
                </div>
              </div>
            ))
          )}
        </div>

        {/* Message Input */}
        <div className="border-t border-gray-700 p-4">
          <div className="flex items-center gap-3">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message... (demo mode)"
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
          <p className="text-xs text-gray-500 mt-2">
            Demo mode: Messages are for demonstration only and won't be saved
          </p>
        </div>
      </div>
    </div>
  );
};
