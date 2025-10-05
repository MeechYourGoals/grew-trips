import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { demoModeService } from '../services/demoModeService';
import { useDemoMode } from '../hooks/useDemoMode';
import { useChatComposer } from '../hooks/useChatComposer';
import { ChatInput } from './chat/ChatInput';
import { MessageList } from './chat/MessageList';
import { MessageFilters } from './chat/MessageFilters';
import { InlineReplyComponent } from './chat/InlineReplyComponent';
import { getMockAvatar } from '../utils/mockAvatars';
import { useTripMembers } from '../hooks/useTripMembers';

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
  const [reactions, setReactions] = useState<{ [messageId: string]: { [reaction: string]: { count: number; userReacted: boolean } } }>({});

  const { tripId } = useParams();
  const demoMode = useDemoMode();
  const { tripMembers } = useTripMembers(tripId);
  
  const {
    inputMessage,
    setInputMessage,
    messageFilter,
    setMessageFilter,
    replyingTo,
    setReply,
    clearReply,
    sendMessage,
    filterMessages
  } = useChatComposer({ tripId, demoMode: demoMode.isDemoMode });

  const handleSendMessage = async (isBroadcast = false, isPayment = false, paymentData?: any) => {
    const message = await sendMessage({ 
      isBroadcast, 
      isPayment, 
      paymentData 
    });
    
    if (message) {
      setMessages(prev => [...prev, message as MockMessage]);
    }
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

  const filteredMessages = filterMessages(messages);

  if (loading) {
    return <div>Loading messages...</div>;
  }

  return (
    <div className="flex flex-col h-full">
      {messages.length > 0 && (
        <div className="p-4 border-b border-gray-700">
          <MessageFilters 
            activeFilter={messageFilter} 
            onFilterChange={setMessageFilter} 
          />
        </div>
      )}

      <div className="flex-1 overflow-y-auto bg-gray-800/30 rounded-lg mx-4 mb-4">
        <div className="p-4">
          <MessageList
            messages={filteredMessages}
            reactions={reactions}
            onReaction={handleReaction}
          />
        </div>
      </div>

      {replyingTo && (
        <InlineReplyComponent 
          replyTo={{ 
            id: replyingTo.id, 
            text: replyingTo.text,
            senderName: replyingTo.senderName 
          }}
          onCancel={clearReply} 
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
          tripMembers={tripMembers}
        />
      </div>
    </div>
  );
};
