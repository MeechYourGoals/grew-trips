
import React, { useState } from 'react';
import { Sparkles, WifiOff, Wifi, AlertCircle } from 'lucide-react';
import { useConsumerSubscription } from '../hooks/useConsumerSubscription';
import { TripPreferences } from '../types/consumer';
import { SciraAIService, TripContext } from '../services/sciraAI';
import { UniversalConciergeService, SearchResult } from '../services/universalConciergeService';
import { ChatMessages } from './chat/ChatMessages';
import { ChatInput } from './chat/ChatInput';
import { GeminiPlusUpgrade } from './chat/GeminiPlusUpgrade';
import { SearchResultsPane } from './SearchResultsPane';

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
  searchResults?: SearchResult[];
  isFromFallback?: boolean;
}

export const GeminiAIChat = ({ tripId, basecamp, preferences }: GeminiAIChatProps) => {
  const { isPlus } = useConsumerSubscription();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [aiStatus, setAiStatus] = useState<'connected' | 'fallback' | 'error'>('connected');

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

      const response = await UniversalConciergeService.processMessage(inputMessage, tripContext);
      
      // Update AI status based on response
      if (response.isFromFallback) {
        setAiStatus('fallback');
      } else {
        setAiStatus('connected');
      }
      
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: response.content,
        timestamp: new Date().toISOString(),
        searchResults: response.searchResults,
        isFromFallback: response.isFromFallback
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch (err) {
      setAiStatus('error');
      const errorResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: `I'm having trouble connecting right now. Please try again in a moment.`,
        timestamp: new Date().toISOString(),
        isFromFallback: true
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

  const getStatusIcon = () => {
    switch (aiStatus) {
      case 'connected':
        return <Wifi size={16} className="text-green-400" />;
      case 'fallback':
        return <WifiOff size={16} className="text-yellow-400" />;
      case 'error':
        return <AlertCircle size={16} className="text-red-400" />;
      default:
        return <Sparkles size={16} className="text-blue-400" />;
    }
  };

  const getStatusText = () => {
    switch (aiStatus) {
      case 'connected':
        return 'Connected';
      case 'fallback':
        return 'Limited Mode';
      case 'error':
        return 'Reconnecting...';
      default:
        return 'Ready';
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
          <h3 className="text-lg font-semibold text-white">Concierge</h3>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              {getStatusIcon()}
              <span className="text-gray-400 text-xs">{getStatusText()}</span>
            </div>
          </div>
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

      {aiStatus === 'fallback' && (
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-3 mb-4">
          <p className="text-yellow-300 text-sm flex items-center gap-2">
            <WifiOff size={14} />
            Running in limited mode - basic responses available
          </p>
        </div>
      )}

      {messages.length === 0 && (
        <div className="text-center py-8 mb-6">
          <h4 className="text-white font-medium mb-3">Your Trip Assistant</h4>
          <div className="text-sm text-gray-300 space-y-2 max-w-md mx-auto">
            <p>Ask me anything about your trip:</p>
            <div className="text-xs text-gray-400 space-y-1">
              <p>• "Find all receipts over $50"</p>
              <p>• "Show me the flight tickets"</p>
              <p>• "What events do we have tomorrow?"</p>
              <p>• "Who uploaded the hotel confirmation?"</p>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4 mb-6 max-h-80 overflow-y-auto">
        <ChatMessages messages={messages} isTyping={isTyping} />
        
        {/* Show search results for the last message if available */}
        {messages.length > 0 && messages[messages.length - 1].searchResults && (
          <SearchResultsPane 
            results={messages[messages.length - 1].searchResults!}
          />
        )}
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
