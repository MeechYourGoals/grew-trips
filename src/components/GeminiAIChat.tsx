
import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { useConsumerSubscription } from '../hooks/useConsumerSubscription';
import { TripPreferences } from '../types/consumer';
import { SciraAIService, TripContext } from '../services/sciraAI';
import { ChatMessages } from './chat/ChatMessages';
import { ChatInput } from './chat/ChatInput';
import { GeminiPlusUpgrade } from './chat/GeminiPlusUpgrade';

interface GeminiAIChatProps {
  tripId: string;
  basecamp?: { name: string; address: string };
  preferences?: TripPreferences;
}

interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export const GeminiAIChat = ({ tripId, basecamp, preferences }: GeminiAIChatProps) => {
  const { isPlus } = useConsumerSubscription();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);
    setError(null);

    try {
      const tripContext: TripContext = {
        id: tripId,
        title: 'Current Trip',
        location: basecamp?.address || 'Unknown location',
        dateRange: 'Current dates',
        basecamp,
        preferences,
        isPro: false
      };

      const context = SciraAIService.buildTripContext(tripContext);
      const response = await SciraAIService.querySciraAI(inputMessage, context, {
        temperature: 0.7,
        maxTokens: 1024,
        webSearch: true
      });
      
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: response.content,
        timestamp: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      
      const errorResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: `Sorry, I encountered an error: ${errorMessage}. Please try again.`,
        timestamp: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isPlus) {
    return <GeminiPlusUpgrade />;
  }

  return (
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
          <Sparkles size={20} className="text-white" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-white">AI Travel Assistant</h3>
          <p className="text-gray-400 text-sm">Powered by Scira AI</p>
        </div>
        <div className="bg-gradient-to-r from-glass-orange/20 to-glass-yellow/20 px-3 py-1 rounded-full">
          <span className="text-glass-orange text-sm font-medium">PLUS</span>
        </div>
      </div>

      {basecamp && (
        <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-3 mb-4">
          <p className="text-green-300 text-sm">
            📍 Basecamp: {basecamp.name} • {basecamp.address}
          </p>
        </div>
      )}

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 mb-4">
          <p className="text-red-300 text-sm">{error}</p>
        </div>
      )}

      <div className="space-y-4 mb-6 max-h-80 overflow-y-auto">
        <ChatMessages messages={messages} isTyping={isTyping} />
      </div>

      <ChatInput
        inputMessage={inputMessage}
        onInputChange={setInputMessage}
        onSendMessage={handleSendMessage}
        onKeyPress={handleKeyPress}
        apiKey=""
        isTyping={isTyping}
      />
    </div>
  );
};
