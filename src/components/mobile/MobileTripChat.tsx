import React, { useState, useRef, useEffect } from 'react';
import { ChatInput } from '../chat/ChatInput';
import { MessageList } from '../chat/MessageList';
import { InlineReplyComponent } from '../chat/InlineReplyComponent';
import { useChatComposer, ChatMessage } from '../../hooks/useChatComposer';
import { useKeyboardHandler } from '../../hooks/useKeyboardHandler';
import { hapticService } from '../../services/hapticService';

interface MobileTripChatProps {
  tripId: string;
}

export const MobileTripChat = ({ tripId }: MobileTripChatProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [reactions, setReactions] = useState<{ [messageId: string]: { [reaction: string]: { count: number; userReacted: boolean } } }>({});
  
  const {
    inputMessage,
    setInputMessage,
    replyingTo,
    clearReply,
    sendMessage
  } = useChatComposer({ tripId });

  // Handle keyboard visibility for better UX
  const { isKeyboardVisible } = useKeyboardHandler({
    preventZoom: true,
    adjustViewport: true,
    onShow: () => {
      // Scroll to bottom when keyboard appears
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 300);
    }
  });

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleMobileSendMessage = async (isBroadcast = false, isPayment = false, paymentData?: any) => {
    await hapticService.light();
    const message = await sendMessage({ isBroadcast, isPayment, paymentData });
    if (message) {
      setMessages(prev => [...prev, message]);
    }
  };

  const handleReaction = async (messageId: string, reactionType: string) => {
    await hapticService.light();
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

  const handleFileSelect = async (files: FileList) => {
    await hapticService.medium();
    // File upload logic will be handled by ChatInput
  };

  return (
    <div className="flex flex-col h-full bg-black">
      {/* Messages Container - Scrollable */}
      <div 
        className="flex-1 overflow-y-auto px-4 py-4"
        style={{
          maxHeight: isKeyboardVisible 
            ? 'calc(100vh - 300px)' 
            : 'calc(100vh - 280px)'
        }}
      >
        <MessageList
          messages={messages}
          reactions={reactions}
          onReaction={handleReaction}
          emptyStateTitle="Start the conversation"
          emptyStateDescription="Send your first message to the group"
        />
        <div ref={messagesEndRef} />
      </div>

      {/* Reply Bar (if replying) */}
      {replyingTo && (
        <div className="px-4 py-2 border-t border-white/10 bg-black/80">
          <InlineReplyComponent
            replyTo={replyingTo}
            onCancel={clearReply}
          />
        </div>
      )}

      {/* Input Area - Sticky at bottom */}
      <div className="sticky bottom-0 bg-black border-t border-white/10 px-4 py-3 safe-bottom">
        <ChatInput
          inputMessage={inputMessage}
          onInputChange={setInputMessage}
          onSendMessage={handleMobileSendMessage}
          onKeyPress={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleMobileSendMessage();
            }
          }}
          apiKey=""
          isTyping={false}
          tripMembers={[]}
        />
      </div>
    </div>
  );
};
