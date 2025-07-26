
import React, { useState } from 'react';
import { Sparkles, WifiOff, Wifi, AlertCircle } from 'lucide-react';
import { useConsumerSubscription } from '../hooks/useConsumerSubscription';
import { TripPreferences } from '../types/consumer';
import { SciraAIService, TripContext } from '../services/sciraAI';
import { UniversalConciergeService, SearchResult } from '../services/universalConciergeService';
import { ChatMessages } from './chat/ChatMessages';
import { AiChatInput } from './chat/AiChatInput';
import { GeminiPlusUpgrade } from './chat/GeminiPlusUpgrade';
import { UniversalSearchResultsPane } from './UniversalSearchResultsPane';

interface GeminiAIChatProps {
  tripId: string;
  basecamp?: { name: string; address: string };
  preferences?: TripPreferences;
}

interface SemanticSearchResult {
  id: string;
  objectType: string;
  objectId: string;
  tripId?: string;
  content: string;
  snippet: string;
  score: number;
  similarity: number;
  matchReason: string;
  deepLink?: string;
}

interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: string;
  searchResults?: (SearchResult | SemanticSearchResult)[];
  isFromFallback?: boolean;
}

export const GeminiAIChat = ({ tripId, basecamp, preferences }: GeminiAIChatProps) => {
  const { isPlus } = useConsumerSubscription();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [aiStatus, setAiStatus] = useState<'connected' | 'fallback' | 'error' | 'thinking' | 'searching'>('connected');

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
    setAiStatus('thinking');

    try {
      // Check if this is a search query for semantic search
      const isSearch = inputMessage.toLowerCase().includes('find') || 
                      inputMessage.toLowerCase().includes('search') ||
                      inputMessage.toLowerCase().includes('show me') ||
                      inputMessage.toLowerCase().includes('where') ||
                      inputMessage.toLowerCase().includes('recommend');

      let response;
      let searchResults: (SearchResult | SemanticSearchResult)[] = [];

      if (isSearch) {
        // Use semantic search for search-like queries
        setAiStatus('searching');
        try {
          const { supabase } = await import('../integrations/supabase/client');
          const { data: searchData, error: searchError } = await supabase.functions.invoke('semantic-search', {
            body: {
              query: inputMessage.trim(),
              tripId,
              limit: 5
            }
          });

          if (!searchError && searchData?.results?.length > 0) {
            searchResults = searchData.results;
            response = `I found ${searchResults.length} relevant results using AI semantic search for "${inputMessage}":

${searchResults.map((result, idx) => 
  `${idx + 1}. ${result.objectType.toUpperCase()}: ${result.snippet} ${('similarity' in result) ? `(${Math.round(result.similarity * 100)}% match)` : ''}`
).join('\n\n')}

These results are ranked by semantic similarity. Would you like me to elaborate on any of these?`;
            setAiStatus('connected');
          } else {
            throw new Error('No semantic results found');
          }
        } catch (error) {
          console.log('Semantic search failed, falling back to Universal Concierge:', error);
          setAiStatus('fallback');
          // Fall back to Universal Concierge
          const tripContext: TripContext = {
            id: tripId,
            title: 'Current Trip',
            location: basecamp?.address || 'Unknown location',
            dateRange: 'Current dates',
            basecamp,
            preferences,
            isPro: false
          };
          const fallbackResponse = await UniversalConciergeService.processMessage(inputMessage, tripContext);
          response = fallbackResponse.content;
          searchResults = fallbackResponse.searchResults || [];
        }
      } else {
        // Use Universal Concierge for general conversation
        setAiStatus('thinking');
        const tripContext: TripContext = {
          id: tripId,
          title: 'Current Trip',
          location: basecamp?.address || 'Unknown location',
          dateRange: 'Current dates',
          basecamp,
          preferences,
          isPro: false
        };

        const conciergeResponse = await UniversalConciergeService.processMessage(inputMessage, tripContext);
        response = conciergeResponse.content;
        searchResults = conciergeResponse.searchResults || [];
        
        if (conciergeResponse.isFromFallback) {
          setAiStatus('fallback');
        } else {
          setAiStatus('connected');
        }
      }
      
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: response,
        timestamp: new Date().toISOString(),
        searchResults: searchResults,
        isFromFallback: aiStatus === 'fallback'
      };
      
      setMessages(prev => [...prev, assistantMessage]);

    } catch (err) {
      console.error('Chat error:', err);
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
      case 'thinking':
        return <Sparkles size={16} className="text-blue-400 animate-pulse" />;
      case 'searching':
        return <Sparkles size={16} className="text-purple-400 animate-spin" />;
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
      case 'thinking':
        return 'Thinking...';
      case 'searching':
        return 'Searching...';
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
          <UniversalSearchResultsPane 
            results={messages[messages.length - 1].searchResults!}
          />
        )}
      </div>

      <AiChatInput
        inputMessage={inputMessage}
        onInputChange={setInputMessage}
        onSendMessage={handleSendMessage}
        onKeyPress={handleKeyPress}
        isTyping={isTyping}
      />
    </div>
  );
};
