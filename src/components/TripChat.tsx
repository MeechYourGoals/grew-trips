
import React, { useState, useEffect } from 'react';
import { MessageCircle } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { demoModeService } from '@/services/demoModeService';
import { getTripById } from '@/data/tripsData';
import { getMockAvatar, currentUserAvatar } from '@/utils/mockAvatars';
import { MockMessage, paulGeorgeMessages } from './chat/mockMessages';
import { createUserMessage, isPaulGeorgeTrip } from './chat/messageUtils';
import { ChatMessage } from './chat/ChatMessage';
import { TripChatInput } from './chat/TripChatInput';
import { LoadingState } from './chat/LoadingState';
import { EmptyState } from './chat/EmptyState';

interface TripChatProps {
  groupChatEnabled?: boolean;
}

export const TripChat = ({ groupChatEnabled = true }: TripChatProps) => {
  const { tripId, eventId } = useParams();
  const [messages, setMessages] = useState<MockMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(true);
  const [reactions, setReactions] = useState<Record<string, Record<string, { count: number; userReacted: boolean }>>>({});

  const currentTripId = tripId || eventId || 'default-trip';

  useEffect(() => {
    const loadMockMessages = async () => {
      setLoading(true);
      
      // Check if this is the Paul George trip (flexible matching)
      if (isPaulGeorgeTrip(currentTripId)) {
        setMessages(paulGeorgeMessages);
        setLoading(false);
        return;
      }
      
      const tripIdNum = parseInt(currentTripId, 10);
      const trip = tripIdNum ? getTripById(tripIdNum) : null;
      const tripType = demoModeService.getTripType(trip);
      
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
    
    const newMessage = createUserMessage(inputValue, currentUserAvatar);
    setMessages(prev => [...prev, newMessage]);
    setInputValue('');
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

  if (loading) {
    return <LoadingState />;
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
            <EmptyState />
          ) : (
            messages.map((message) => (
              <ChatMessage
                key={message.id}
                message={message}
                reactions={reactions[message.id]}
                onReaction={handleReaction}
              />
            ))
          )}
        </div>

        {/* Message Input */}
        <TripChatInput
          value={inputValue}
          onChange={setInputValue}
          onSend={handleSendMessage}
        />
      </div>
    </div>
  );
};
