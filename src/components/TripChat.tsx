import React, { useState, useEffect } from 'react';
import { addMinutes } from 'date-fns';
import { useParams } from 'react-router-dom';
import { demoModeService, MockMessage as DemoMockMessage } from '../services/demoModeService';
import { useDemoMode } from '../hooks/useDemoMode';
import { MessageCircle, Megaphone } from 'lucide-react';
import { ChatInput } from './chat/ChatInput';
import { MessageReactionBar } from './chat/MessageReactionBar';
import { InlineReplyComponent } from './chat/InlineReplyComponent';
import { ReplyData } from './chat/types';

interface TripChatProps {
  groupChatEnabled?: boolean;
  showBroadcasts?: boolean;
}

interface MockMessage {
  id: string;
  text: string;
  sender: { id: string; name: string; avatar?: string };
  createdAt: string;
  isAiMessage?: boolean;
  isBroadcast?: boolean;
  reactions?: { [key: string]: string[] };
  replyTo?: { id: string; text: string; sender: string };
  // Added these fields to match demoModeService.MockMessage
  trip_type?: string;
  sender_name?: string;
  message_content?: string;
  delay_seconds?: number;
  timestamp_offset_days?: number;
  tags?: string[];
}

export const TripChat = ({ 
  groupChatEnabled = true,
  showBroadcasts = true 
}: TripChatProps) => {
  const [messages, setMessages] = useState<MockMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [inputMessage, setInputMessage] = useState('');
  const [messageFilter, setMessageFilter] = useState<'all' | 'chat' | 'broadcast'>('all');
  const [reactions, setReactions] = useState<{ [messageId: string]: { [reaction: string]: { count: number; userReacted: boolean } } }>({});
  const [replyingTo, setReplyingTo] = useState<{ id: string; text: string; senderName: string } | null>(null);

  const { tripId } = useParams();
  const demoMode = useDemoMode();

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleSendMessage = (isBroadcast = false) => {
    if (inputMessage.trim() === '') return;

    const newMessage: MockMessage = {
      id: `msg_${Date.now()}`,
      text: inputMessage,
      sender: { 
        id: 'user1', 
        name: 'You', 
        avatar: '/default-avatar.png' 
      },
      createdAt: new Date().toISOString(),
      isBroadcast,
      reactions: {},
      replyTo: replyingTo ? {
        id: replyingTo.id,
        text: replyingTo.text,
        sender: replyingTo.senderName
      } : undefined
    };

    setMessages(prev => [...prev, newMessage]);
    setInputMessage('');
    setReplyingTo(null);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleReaction = (messageId: string, reactionType: string) => {
    const updatedReactions = { ...reactions };
    if (!updatedReactions[messageId]) {
      updatedReactions[messageId] = {};
    }

    const currentReaction = updatedReactions[messageId][reactionType] || { count: 0, userReacted: false };
    currentReaction.userReacted = !currentReaction.userReacted;
    currentReaction.count += currentReaction.userReacted ? 1 : -1;

    updatedReactions[messageId][reactionType] = currentReaction;
    setReactions(updatedReactions);
  };

  const handleReplyToMessage = (messageId: string, messageText: string, senderName: string) => {
    setReplyingTo({ id: messageId, text: messageText, senderName });
  };

  useEffect(() => {
    const loadDemoData = async () => {
      // Always load demo data for consumer trips, with fallback to 'demo' type
      const demoMessages = await demoModeService.getMockMessages('friends-trip');
      
      // Map the demo service messages to our local format
      const formattedMessages = demoMessages.map(msg => ({
        id: msg.id,
        text: msg.message_content || '', // Use message_content as text
        sender: { 
          id: msg.id, 
          name: msg.sender_name || 'Unknown',
          avatar: '/default-avatar.png' 
        },
        createdAt: new Date(Date.now() - (msg.timestamp_offset_days || 0) * 86400000).toISOString(),
        isBroadcast: msg.tags?.includes('logistics') || msg.tags?.includes('urgent') || msg.tags?.includes('broadcast') || false,
        trip_type: msg.trip_type,
        sender_name: msg.sender_name,
        message_content: msg.message_content,
        delay_seconds: msg.delay_seconds,
        timestamp_offset_days: msg.timestamp_offset_days,
        tags: msg.tags
      }));
      
      setMessages(formattedMessages);
      setLoading(false);
    };

    loadDemoData();
  }, [demoMode.isDemoMode]);

  const filteredMessages = messages.filter(message => {
    if (messageFilter === 'all') return true;
    if (messageFilter === 'broadcast') return message.isBroadcast;
    if (messageFilter === 'chat') return !message.isBroadcast;
    return true;
  });

  if (loading) {
    return <div>Loading messages...</div>;
  }

  return (
    <div className="flex flex-col h-full">
      {/* Message Filters */}
      {messages.length > 0 && (
        <div className="flex gap-2 p-4 border-b border-gray-700">
          <button
            onClick={() => setMessageFilter('all')}
            className={`px-3 py-1 rounded-full text-sm transition-all ${
              messageFilter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            All Messages
          </button>
          <button
            onClick={() => setMessageFilter('chat')}
            className={`px-3 py-1 rounded-full text-sm transition-all ${
              messageFilter === 'chat' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Chat Only
          </button>
          <button
            onClick={() => setMessageFilter('broadcast')}
            className={`px-3 py-1 rounded-full text-sm transition-all ${
              messageFilter === 'broadcast' ? 'bg-orange-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Broadcasts Only
          </button>
        </div>
      )}

      {filteredMessages.length === 0 ? (
        <div className="text-center py-8">
          <MessageCircle size={48} className="text-gray-600 mx-auto mb-4" />
          <h4 className="text-lg font-medium text-gray-400 mb-2">
            {messageFilter === 'all' ? 'Start your trip chat' : 
             messageFilter === 'broadcast' ? 'No broadcasts yet' : 
             'No chat messages yet'}
          </h4>
          <p className="text-gray-500 text-sm">
            {messageFilter === 'all' ? 'Send a message to get the conversation started!' :
             messageFilter === 'broadcast' ? 'Send an announcement to all trip members' :
             'Start chatting with your fellow travelers'}
          </p>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto space-y-4 p-4">
          {filteredMessages.map((message) => (
            <div key={message.id} className={`flex flex-col ${message.sender.name === 'You' ? 'items-end' : 'items-start'}`}>
              <div className={`
                max-w-md p-3 rounded-2xl relative font-medium
                ${message.isBroadcast
                  ? 'bg-gradient-to-r from-red-900/60 to-orange-900/60 border-2 border-red-500/70 text-white shadow-lg shadow-red-500/20 font-bold'
                  : message.sender.name === 'You' 
                    ? 'bg-gray-800 text-white' 
                    : 'bg-gray-700 text-gray-200'
                }
              `}>
                {message.isBroadcast && (
                  <div className="flex items-center gap-1 text-xs text-red-300 mb-2 font-bold">
                    <Megaphone size={14} className="text-red-400" />
                    <span className="text-red-300">📢 BROADCAST ALERT</span>
                  </div>
                )}
                {message.replyTo && (
                  <div className="text-xs text-gray-400 mb-1">
                    Replying to {message.replyTo.sender}: {message.replyTo.text}
                  </div>
                )}
                <div>{message.text}</div>
                <div className="text-xs text-gray-500 mt-1">{formatTime(message.createdAt)}</div>
                
                <MessageReactionBar 
                  reactions={reactions[message.id] || {}} 
                  onReactMessage={(reactionType) => handleReaction(message.id, reactionType)}
                />
                
                <button 
                  onClick={() => handleReplyToMessage(message.id, message.text, message.sender.name)}
                  className="text-xs text-gray-400 hover:text-gray-200 mt-1"
                >
                  Reply
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {replyingTo && (
        <InlineReplyComponent 
          replyTo={{ 
            id: replyingTo.id, 
            text: replyingTo.text,
            senderName: replyingTo.senderName 
          }}
          onCancel={() => setReplyingTo(null)} 
        />
      )}

      <div className="p-4">
        <ChatInput
          inputMessage={inputMessage}
          onInputChange={setInputMessage}
          onSendMessage={handleSendMessage}
          onKeyPress={handleKeyPress}
          apiKey=""
          isTyping={false}
        />
      </div>
    </div>
  );
};