import React, { useEffect, useMemo, useState } from 'react';
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
import { useTripChat } from '@/hooks/useTripChat';
import { useAuth } from '@/hooks/useAuth';

interface TripChatProps {
  enableGroupChat?: boolean;
  showBroadcasts?: boolean;
  isEvent?: boolean;
  tripId?: string;
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
  enableGroupChat = true,
  showBroadcasts = true,
  isEvent = false,
  tripId: tripIdProp
}: TripChatProps) => {
  const [demoMessages, setDemoMessages] = useState<MockMessage[]>([]);
  const [demoLoading, setDemoLoading] = useState(true);
  const [reactions, setReactions] = useState<{ [messageId: string]: { [reaction: string]: { count: number; userReacted: boolean } } }>({});

  const params = useParams<{ tripId?: string; proTripId?: string; eventId?: string }>();
  const resolvedTripId = useMemo(() => {
    return tripIdProp || params.tripId || params.proTripId || params.eventId || '';
  }, [tripIdProp, params.tripId, params.proTripId, params.eventId]);
  const demoMode = useDemoMode();
  const { tripMembers } = useTripMembers(resolvedTripId);
  const { user } = useAuth();
  const {
    messages: liveMessages,
    isLoading: liveLoading,
    sendMessageAsync: sendTripMessage,
    isCreating: isSendingMessage
  } = useTripChat(resolvedTripId);

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
  } = useChatComposer({ tripId: resolvedTripId, demoMode: demoMode.isDemoMode, isEvent });

  const shouldUseDemoData = demoMode.isDemoMode || !resolvedTripId;

  const liveFormattedMessages = useMemo(() => {
    if (shouldUseDemoData) return [];
    return liveMessages.map(message => ({
      id: message.id,
      text: message.content,
      sender: {
        id: message.author_name || 'unknown',
        name: message.author_name || 'Unknown',
        avatar: getMockAvatar(message.author_name || 'Unknown')
      },
      createdAt: message.created_at,
      isBroadcast: message.privacy_mode === 'broadcast',
      isPayment: false,
      tags: [] as string[]
    }));
  }, [liveMessages, shouldUseDemoData]);

  const handleSendMessage = async (isBroadcast = false, isPayment = false, paymentData?: any) => {
    const message = await sendMessage({
      isBroadcast, 
      isPayment, 
      paymentData 
    });
    
    if (!message) {
      return;
    }

    if (shouldUseDemoData) {
      setDemoMessages(prev => [...prev, message as MockMessage]);
      return;
    }

    const authorName = user?.displayName || user?.email?.split('@')[0] || 'You';
    try {
      await sendTripMessage(message.text, authorName);
    } catch (error) {
      console.error('Failed to send chat message:', error);
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
    if (!shouldUseDemoData) {
      setDemoMessages([]);
      setDemoLoading(false);
      return;
    }

    const loadDemoData = async () => {
      setDemoLoading(true);
      // Exclude payment messages from chat
      const demoMessagesData = await demoModeService.getMockMessages('friends-trip', true);

      const formattedMessages = demoMessagesData.map(msg => ({
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

      setDemoMessages(formattedMessages);
      setDemoLoading(false);
    };

    loadDemoData();
  }, [shouldUseDemoData, isEvent]);

  const filteredMessages = filterMessages(shouldUseDemoData ? demoMessages : liveFormattedMessages);

  const isLoading = shouldUseDemoData ? demoLoading : liveLoading;

  if (isLoading) {
    return <div>Loading messages...</div>;
  }

  return (
    <div className="flex flex-col h-full">
      {filteredMessages.length > 0 && (
        <div className="p-4 border-b border-gray-700">
          <MessageFilters
            activeFilter={messageFilter}
            onFilterChange={setMessageFilter}
            hidePayments={true}
          />
        </div>
      )}

      <div className="flex-1 overflow-y-auto bg-gray-800/30 rounded-lg mx-4 mb-4">
        <div className="p-4">
          <MessageList
            messages={filteredMessages}
            reactions={reactions}
            onReaction={handleReaction}
            emptyStateTitle={shouldUseDemoData ? undefined : 'No messages yet'}
            emptyStateDescription={shouldUseDemoData ? undefined : 'Start the conversation with your team'}
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
          isTyping={isSendingMessage}
          tripMembers={tripMembers}
          hidePayments={isEvent}
        />
      </div>
    </div>
  );
};
