
import React, { useState } from 'react';
import { Send, Radio, Users, MessageCircle } from 'lucide-react';
import { useTripVariant } from '../contexts/TripVariantContext';
import { useMessages } from '../hooks/useMessages';
import { VoiceAssistant } from './VoiceAssistant';
import { useParams } from 'react-router-dom';
import { proTripMockData } from '../data/proTripMockData';
import { AiMessageModal } from './ai/AiMessageModal';
import { AiMessageButton } from './ai/AiMessageButton';

export const TourChat = () => {
  const { proTripId, tourId } = useParams();
  const finalTourId = proTripId?.replace(/^pro-/, '') || tourId || '1';
  const { getMessagesForTour, addMessage } = useMessages();
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showAiModal, setShowAiModal] = useState(false);
  const { accentColors } = useTripVariant();

  // Get tour data for context
  const tourData = proTripMockData[finalTourId];
  const tourName = tourData?.title || 'Event';

  const tourMessages = getMessagesForTour(finalTourId);

  const handleSendMessage = () => {
    if (!message.trim()) return;
    addMessage(message, undefined, finalTourId);
    setMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
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
            <div key={msg.id} className="flex items-start gap-3">
              <img
                src={msg.senderAvatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face'}
                alt={msg.senderName}
                className="w-8 h-8 rounded-full"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-white font-medium text-sm">{msg.senderName}</span>
                  <span className="text-gray-400 text-xs">{formatTime(msg.timestamp)}</span>
                </div>
                <p className="text-gray-300 text-sm">{msg.content}</p>
              </div>
            </div>
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

      {/* Message Input */}
      <div className="flex gap-3 items-end">
        <div className="w-10 h-10 bg-gradient-to-r from-glass-green/30 to-glass-yellow/30 backdrop-blur-sm rounded-full flex items-center justify-center">
          <Users size={16} className="text-glass-green" />
        </div>
        <div className="flex-1 relative">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder=""
            rows={2}
            className={`w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-3 pr-20 text-white placeholder-gray-400 focus:outline-none focus:border-${accentColors.primary} resize-none`}
          />
          <div className="absolute right-2 bottom-2 flex items-center gap-2">
            <VoiceAssistant isProTrip={true} />
            <button
              onClick={handleSendMessage}
              disabled={!message.trim()}
              className={`bg-gradient-to-r ${accentColors.gradient} hover:from-${accentColors.primary}/80 hover:to-${accentColors.secondary}/80 disabled:opacity-50 disabled:cursor-not-allowed text-white p-2 rounded-lg transition-all duration-200`}
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      </div>

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
