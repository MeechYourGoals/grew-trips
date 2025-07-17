import React, { useState, useEffect } from 'react';
import { addMinutes } from 'date-fns';
import { useParams } from 'react-router-dom';
import { demoModeService, MockMessage as DemoMockMessage } from '../services/demoModeService';
import { useDemoMode } from '../hooks/useDemoMode';
import { MessageCircle } from 'lucide-react';
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
  const [reactions, setReactions] = useState<{ [messageId: string]: { [reaction: string]: { count: number; userReacted: boolean } } }>({});
  const [replyingTo, setReplyingTo] = useState<{ id: string; text: string; senderName: string } | null>(null);

  const { tripId } = useParams();
  const demoMode = useDemoMode();

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleSendMessage = () => {
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
    if (demoMode.isDemoMode) {
      const loadDemoData = async () => {
        const demoMessages = await demoModeService.getMockMessages('demo');
        
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
    }
  }, [demoMode.isDemoMode]);

  if (loading) {
    return <div>Loading messages...</div>;
  }

  return (
    <div className="flex flex-col h-full">
      {messages.length === 0 ? (
        <div className="text-center py-8">
          <MessageCircle size={48} className="text-gray-600 mx-auto mb-4" />
          <h4 className="text-lg font-medium text-gray-400 mb-2">Start your trip chat</h4>
          <p className="text-gray-500 text-sm">Send a message to get the conversation started!</p>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto space-y-4 p-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex flex-col ${message.sender.name === 'You' ? 'items-end' : 'items-start'}`}>
              <div className={`
                max-w-md p-3 rounded-2xl 
                ${message.sender.name === 'You' ? 'bg-gray-800 text-white' : 'bg-gray-700 text-gray-200'}
              `}>
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