
import React, { useState, useRef } from 'react';
import { Send, Radio, Users, MessageCircle, Megaphone, Share2, Image, Video, FileText, Mic, CreditCard } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useTripVariant } from '../contexts/TripVariantContext';
import { useMessages } from '../hooks/useMessages';
import { PaymentInput } from './payments/PaymentInput';
import { useTripMembers } from '../hooks/useTripMembers';

import { useParams } from 'react-router-dom';
import { proTripMockData } from '../data/proTripMockData';
import { AiMessageModal } from './ai/AiMessageModal';
import { AiMessageButton } from './ai/AiMessageButton';
import { MessageBubble } from './chat/MessageBubble';

export const TourChat = () => {
  const { proTripId, tourId } = useParams();
  const finalTourId = proTripId?.replace(/^pro-/, '') || tourId || '1';
  const { getMessagesForTour, addMessage } = useMessages();
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showAiModal, setShowAiModal] = useState(false);
  const [reactions, setReactions] = useState<Record<string, Record<string, { count: number; userReacted: boolean }>>>({});
  const [isBroadcastMode, setIsBroadcastMode] = useState(false);
  const [isPaymentMode, setIsPaymentMode] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { accentColors } = useTripVariant();

  // Get tour data for context
  const tourData = proTripMockData[finalTourId];
  const tourName = tourData?.title || 'Event';

  const tourMessages = getMessagesForTour(finalTourId);
  
  // Fetch actual trip members dynamically
  const { tripMembers } = useTripMembers(finalTourId);

  const handleSendMessage = (isBroadcast?: boolean, isPayment?: boolean, paymentData?: any) => {
    if (!isPayment && !message.trim()) return;
    
    if (isPayment && paymentData) {
      // Calculate per-person amount and create payment message
      const perPersonAmount = (paymentData.amount / paymentData.splitCount).toFixed(2);
      const paymentMessage = `${paymentData.description} - ${paymentData.currency} ${paymentData.amount.toFixed(2)} (split ${paymentData.splitCount} ways) • Pay me $${perPersonAmount} via Venmo: @yourvenmo`;
      addMessage(paymentMessage, undefined, finalTourId);
      
      // TODO: Save payment data to database
      console.log('Payment data:', paymentData);
      
      setIsPaymentMode(false);
    } else {
      addMessage(message, undefined, finalTourId);
      setMessage('');
      setIsBroadcastMode(false);
    }
  };

  const handlePaymentSubmit = (paymentData: any) => {
    handleSendMessage(false, true, paymentData);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!isPaymentMode) {
        handleSendMessage(isBroadcastMode);
      }
    }
  };

  const handleFileUpload = (files: FileList, type: 'image' | 'video' | 'document' | 'audio') => {
    // Implementation for file upload would go here
    console.log('File upload:', files, type);
  };

  const handleFileUploadByType = (type: 'image' | 'video' | 'document' | 'audio') => {
    if (!fileInputRef.current) return;
    
    const accept = {
      image: 'image/*',
      video: 'video/*',
      document: '.pdf,.doc,.docx,.txt,.xlsx,.pptx',
      audio: 'audio/*'
    };
    
    fileInputRef.current.accept = accept[type];
    fileInputRef.current.onchange = (e) => {
      const files = (e.target as HTMLInputElement).files;
      if (files && files.length > 0) {
        handleFileUpload(files, type);
      }
    };
    fileInputRef.current.click();
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
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

  return (
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className={`w-10 h-10 bg-gradient-to-r from-${accentColors.primary}/30 to-${accentColors.secondary}/30 backdrop-blur-sm rounded-xl flex items-center justify-center`}>
          <Radio size={20} className={`text-${accentColors.primary}`} />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white">Event Chat</h3>
          <p className="text-gray-400 text-sm">Messages across the event</p>
        </div>
      </div>

      {/* Voice Assistant removed - now integrated in message input */}

      {/* Messages */}
      <div className="space-y-4 mb-6 max-h-80 overflow-y-auto">
        {tourMessages.length > 0 ? (
          tourMessages.map((msg) => (
            <MessageBubble
              key={msg.id}
              id={msg.id}
              text={msg.content}
              senderName={msg.senderName}
              senderAvatar={msg.senderAvatar}
              timestamp={msg.timestamp}
              isBroadcast={false}
              isPayment={msg.content.includes('split') && msg.content.includes('Pay me')}
              reactions={reactions[msg.id]}
              onReaction={handleReaction}
            />
          ))
        ) : (
          <div className="text-center py-8">
            <MessageCircle size={48} className="text-slate-600 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-slate-400 mb-2">Start the event conversation</h4>
            <p className="text-slate-500 text-sm">Messages here are visible to everyone in the event</p>
          </div>
        )}
      </div>

      {/* Typing indicator */}
      {isTyping && (
        <div className="text-gray-400 text-xs mb-3">Someone is typing...</div>
      )}

      {/* Chat Controls */}
      <div className="flex justify-center gap-4 mb-4">
        <button
          onClick={() => {
            setIsBroadcastMode(false);
            setIsPaymentMode(false);
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
            !isBroadcastMode && !isPaymentMode
              ? 'bg-blue-600 text-white' 
              : 'border border-gray-600 text-gray-400 hover:text-white hover:border-gray-500'
          }`}
        >
          <MessageCircle size={16} />
          Group Chat
        </button>
        <button
          onClick={() => {
            setIsBroadcastMode(true);
            setIsPaymentMode(false);
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
            isBroadcastMode 
              ? 'bg-gradient-to-r from-orange-600 to-red-600 text-white' 
              : 'border border-orange-600 text-orange-400 hover:text-white hover:bg-orange-600/10'
          }`}
        >
          <Megaphone size={16} />
          Broadcast
        </button>
        <button
          onClick={() => {
            setIsPaymentMode(true);
            setIsBroadcastMode(false);
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
            isPaymentMode 
              ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white' 
              : 'border border-green-600 text-green-400 hover:text-white hover:bg-green-600/10'
          }`}
        >
          <CreditCard size={16} />
          Payments
        </button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button 
              className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border border-gray-600 text-gray-400 hover:text-white hover:border-gray-500 transition-all"
              aria-label="Share media, files, or links"
            >
              <Share2 size={16} />
              Share
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 z-50 bg-gray-800 border-gray-700">
            <DropdownMenuItem onClick={() => handleFileUploadByType('image')}>
              <Image className="w-4 h-4 mr-2" />
              Photo/Image
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleFileUploadByType('video')}>
              <Video className="w-4 h-4 mr-2" />
              Video
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleFileUploadByType('document')}>
              <FileText className="w-4 h-4 mr-2" />
              Document
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleFileUploadByType('audio')}>
              <Mic className="w-4 h-4 mr-2" />
              Audio/Voice
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Payment Input Form */}
      {isPaymentMode && (
        <div className="mb-4">
          <PaymentInput
            onSubmit={handlePaymentSubmit}
            tripMembers={tripMembers}
            isVisible={isPaymentMode}
          />
        </div>
      )}

      {/* Message Input */}
      {!isPaymentMode && (
        <div className="flex gap-3 items-end">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={
              isBroadcastMode 
                ? "Send an announcement to all event members..." 
                : "Type a message..."
            }
            rows={2}
            className={`flex-1 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none resize-none transition-all ${
              isBroadcastMode
                ? 'bg-gradient-to-r from-orange-900/20 to-red-900/20 border border-orange-500/50 focus:border-orange-400'
                : 'bg-white/10 backdrop-blur-sm border border-white/20 focus:border-blue-500'
            }`}
          />
          <button
            onClick={() => handleSendMessage(isBroadcastMode)}
            disabled={!message.trim()}
            className={`text-white p-3 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
              isBroadcastMode
                ? 'bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700'
                : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
            }`}
          >
            <Send size={16} />
          </button>

          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            multiple
          />
        </div>
      )}

      {/* AI Message Assistant for Pro */}
      <AiMessageButton onClick={() => setShowAiModal(true)} />

      {/* AI Message Modal */}
      <AiMessageModal
        isOpen={showAiModal}
        onClose={() => setShowAiModal(false)}
        tourId={finalTourId}
        tripContext={{
          id: finalTourId,
          title: tourData?.title,
          category: tourData?.category,
          isPro: true
        }}
      />
    </div>
  );
};
