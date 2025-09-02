
import React, { useState, useEffect } from 'react';
import { addMinutes } from 'date-fns';
import { useParams } from 'react-router-dom';
import { demoModeService, MockMessage as DemoMockMessage } from '../services/demoModeService';
import { useDemoMode } from '../hooks/useDemoMode';
import { useChatMessageParser } from '../hooks/useChatMessageParser';
import { MessageCircle, Megaphone, DollarSign } from 'lucide-react';
import { ChatInput } from './chat/ChatInput';
import { MessageReactionBar } from './chat/MessageReactionBar';
import { InlineReplyComponent } from './chat/InlineReplyComponent';
import { ReplyData } from './chat/types';
import { getMockAvatar } from '../utils/mockAvatars';

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
  const [messageFilter, setMessageFilter] = useState<'all' | 'broadcast' | 'payments'>('all');
  const [reactions, setReactions] = useState<{ [messageId: string]: { [reaction: string]: { count: number; userReacted: boolean } } }>({});
  const [replyingTo, setReplyingTo] = useState<{ id: string; text: string; senderName: string } | null>(null);

  const { tripId } = useParams();
  const demoMode = useDemoMode();
  const { parseMessage } = useChatMessageParser();

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleSendMessage = async (isBroadcast = false, isPayment = false, paymentData?: any) => {
    if (!isPayment && inputMessage.trim() === '') return;

    const messageId = `msg_${Date.now()}`;
    
    if (isPayment && paymentData) {
      // Create payment message
      const paymentMessage: MockMessage = {
        id: messageId,
        text: `💳 Payment: ${paymentData.description} - ${paymentData.currency} ${paymentData.amount.toFixed(2)} (split ${paymentData.splitCount} ways)`,
        sender: { 
          id: 'user1', 
          name: 'You', 
          avatar: getMockAvatar('You')
        },
        createdAt: new Date().toISOString(),
        isBroadcast: false,
        reactions: {},
        replyTo: replyingTo ? {
          id: replyingTo.id,
          text: replyingTo.text,
          sender: replyingTo.senderName
        } : undefined
      };

      setMessages(prev => [...prev, paymentMessage]);
      
      // TODO: Save payment data to database
      console.log('Payment data:', paymentData);
      
    } else {
      // Regular message
      const newMessage: MockMessage = {
        id: messageId,
        text: inputMessage,
        sender: { 
          id: 'user1', 
          name: 'You', 
          avatar: getMockAvatar('You')
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
      
      // Parse message for media and links (only if not in demo mode)
      if (!demoMode.isDemoMode && tripId) {
        await parseMessage(messageId, inputMessage, tripId);
      }
      
      setInputMessage('');
    }
    
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
      const demoMessages = await demoModeService.getMockMessages('friends-trip');
      
      const formattedMessages = demoMessages.map(msg => ({
        id: msg.id,
        text: msg.message_content || '',
        sender: { 
          id: msg.id, 
          name: msg.sender_name || 'Unknown',
          avatar: getMockAvatar(msg.sender_name || 'Unknown')
        },
        createdAt: new Date(Date.now() - (msg.timestamp_offset_days || 0) * 86400000).toISOString(),
        isBroadcast: msg.tags?.includes('broadcast') || msg.tags?.includes('logistics') || msg.tags?.includes('urgent') || false,
        
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
    if (messageFilter === 'payments') return message.text.includes('💳 Payment');
    return true;
  });

  if (loading) {
    return <div>Loading messages...</div>;
  }

  return (
    <div className="flex flex-col h-full">
      {/* Message Filters - Only All Messages and Broadcasts */}
      {messages.length > 0 && (
        <div className="flex justify-center gap-2 p-4 border-b border-gray-700">
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
          <button
            onClick={() => setMessageFilter('payments')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
              messageFilter === 'payments' ? 'bg-payment-primary text-payment-primary-foreground' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            <DollarSign size={14} />
            Payments
          </button>
        </div>
      )}

      {filteredMessages.length === 0 ? (
        <div className="text-center py-8">
          <MessageCircle size={48} className="text-gray-600 mx-auto mb-4" />
          <h4 className="text-lg font-medium text-gray-400 mb-2">
            {messageFilter === 'all' ? 'Start your trip chat' : 
             messageFilter === 'broadcast' ? 'No broadcasts yet' : 'No payments yet'}
          </h4>
          <p className="text-gray-500 text-sm">
            {messageFilter === 'all' ? 'Send a message to get the conversation started!' :
             messageFilter === 'broadcast' ? 'Send an announcement to all trip members' :
             'Add a payment to track trip expenses'}
          </p>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto bg-gray-800/30 rounded-lg mx-4 mb-4">
          <div className="space-y-4 p-4">
            {filteredMessages.map((message) => (
            <div key={message.id} className="flex items-start gap-3">
              {/* Avatar */}
              <img
                src={message.sender.avatar || getMockAvatar(message.sender.name)}
                alt={message.sender.name}
                className="w-10 h-10 rounded-full flex-shrink-0 object-cover border border-gray-600"
              />
              
              {/* Message Content */}
              <div className="flex-1 min-w-0">
                {/* Sender Name */}
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium text-gray-300">
                    {message.sender.name}
                  </span>
                  <span className="text-xs text-gray-500">
                    {formatTime(message.createdAt)}
                  </span>
                </div>
                
                {/* Message Bubble */}
                <div className={`
                  max-w-md p-3 rounded-lg relative
                  ${message.isBroadcast
                    ? 'bg-orange-100 border border-orange-300 text-orange-900'
                    : 'bg-gray-700 text-gray-200'
                  }
                `} role={message.isBroadcast ? 'alert' : undefined}
                    aria-label={message.isBroadcast ? 'Broadcast message' : undefined}>
                  
                  {/* Broadcast Header */}
                  {message.isBroadcast && (
                    <div className="flex items-center gap-2 text-xs font-bold mb-2">
                      <Megaphone size={14} className="text-orange-600" />
                      <span className="text-orange-600">📢 BROADCAST</span>
                    </div>
                  )}
                  
                  {/* Reply Context */}
                  {message.replyTo && (
                    <div className="text-xs opacity-70 mb-2 p-2 bg-black/10 rounded border-l-2 border-gray-500">
                      Replying to {message.replyTo.sender}: "{message.replyTo.text}"
                    </div>
                  )}
                  
                  {/* Message Text */}
                  <div className="leading-relaxed">{message.text}</div>
                </div>
                
                {/* Message Actions */}
                <div className="mt-2 space-y-1">
                  <MessageReactionBar 
                    messageId={message.id}
                    reactions={reactions[message.id] || {}} 
                    onReaction={handleReaction}
                  />
                  
                  <button 
                    onClick={() => handleReplyToMessage(message.id, message.text, message.sender.name)}
                    className="text-xs text-gray-400 hover:text-gray-200 transition-colors"
                  >
                    Reply
                  </button>
                </div>
              </div>
            </div>
            ))}
          </div>
        </div>
      )}

      {/* Reply Context */}
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

      {/* Message Input */}
      <div className="p-4">
        <ChatInput
          inputMessage={inputMessage}
          onInputChange={setInputMessage}
          onSendMessage={handleSendMessage}
          onKeyPress={handleKeyPress}
          apiKey=""
          isTyping={false}
          tripMembers={[
            { id: 'user1', name: 'You', avatar: getMockAvatar('You') },
            { id: 'user2', name: 'Jamie Chen', avatar: getMockAvatar('Jamie Chen') },
            { id: 'user3', name: 'Alex Rivera', avatar: getMockAvatar('Alex Rivera') },
            { id: 'user4', name: 'Sam Johnson', avatar: getMockAvatar('Sam Johnson') }
          ]}
        />
      </div>
    </div>
  );
};
