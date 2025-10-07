
import React, { useState, useEffect } from 'react';
import { Sparkles, WifiOff, Wifi, AlertCircle, CheckCircle, Activity, Search } from 'lucide-react';
import { useConsumerSubscription } from '../hooks/useConsumerSubscription';
import { TripPreferences } from '../types/consumer';
import { TripContextService } from '../services/tripContextService';
import { EnhancedTripContextService } from '../services/enhancedTripContextService';
import { PerplexityConciergeService, PerplexityResponse } from '../services/perplexityConciergeService';
import { useBasecamp } from '../contexts/BasecampContext';
import { ChatMessages } from './chat/ChatMessages';
import { AiChatInput } from './chat/AiChatInput';
import { PlusUpgrade } from './chat/PlusUpgrade';

interface PerplexityChatProps {
  tripId: string;
  basecamp?: { name: string; address: string };
  preferences?: TripPreferences;
  isDemoMode?: boolean;
}

interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: string;
  isFromPerplexity?: boolean;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
  sources?: Array<{
    title: string;
    url: string;
    snippet: string;
  }>;
}

export const PerplexityChat = ({ tripId, basecamp, preferences, isDemoMode = false }: PerplexityChatProps) => {
  const { isPlus } = useConsumerSubscription();
  const { basecamp: globalBasecamp } = useBasecamp();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [aiStatus, setAiStatus] = useState<'checking' | 'connected' | 'limited' | 'error' | 'thinking'>('checking');
  const [healthStatus, setHealthStatus] = useState<{ healthy: boolean; model?: string; latency?: number; error?: string } | null>(null);

  // Health check on component mount and periodically
  useEffect(() => {
    const checkHealth = async () => {
      try {
        const health = await PerplexityConciergeService.healthCheck();
        setHealthStatus(health);
        setAiStatus(health.healthy ? 'connected' : 'limited');
      } catch (error) {
        console.error('❌ Health check failed:', error);
        setAiStatus('error');
      }
    };

    checkHealth();
    const healthInterval = setInterval(() => {
      if (aiStatus !== 'connected') {
        checkHealth();
      }
    }, 30000);

    return () => clearInterval(healthInterval);
  }, [aiStatus]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isTyping) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputMessage;
    setInputMessage('');
    setIsTyping(true);
    setAiStatus('thinking');

    try {
      // Get full trip context with enhanced contextual data
      let tripContext;
      try {
        // Try enhanced context service first for better contextual awareness
        tripContext = await EnhancedTripContextService.getEnhancedTripContext(tripId, false);
      } catch (error) {
        console.warn('Enhanced context failed, falling back to basic context:', error);
        try {
          tripContext = await TripContextService.getTripContext(tripId, false);
        } catch (fallbackError) {
          console.warn('Basic context also failed, using minimal context:', fallbackError);
          tripContext = {
            tripId,
            title: 'Current Trip',
            location: globalBasecamp?.address || basecamp?.address || 'Unknown location',
            dateRange: new Date().toISOString().split('T')[0],
            participants: [],
            itinerary: [],
            accommodation: globalBasecamp?.name || basecamp?.name,
            currentDate: new Date().toISOString().split('T')[0],
            upcomingEvents: [],
            recentUpdates: [],
            confirmationNumbers: {}
          };
        }
      }

      // Build chat history for context
      const chatHistory = messages.slice(-6).map(msg => ({
        role: msg.type === 'user' ? 'user' : 'assistant',
        content: msg.content
      }));

      // Prepare basecamp location for the service call - ensure name is always present
      const basecampLocation = globalBasecamp ? {
        name: globalBasecamp.name || 'Basecamp',
        address: globalBasecamp.address
      } : (basecamp ? {
        name: basecamp.name || 'Basecamp',
        address: basecamp.address
      } : undefined);

      // Send to Perplexity
      const response: PerplexityResponse = await PerplexityConciergeService.sendMessage(
        currentInput,
        tripContext,
        basecampLocation,
        preferences,
        chatHistory
      );

      // Update AI status based on response
      if (response.success) {
        setAiStatus('connected');
      } else {
        setAiStatus('limited');
      }

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: response.response || `Sorry, I encountered an error: ${response.error}`,
        timestamp: new Date().toISOString(),
        isFromPerplexity: response.success,
        usage: response.usage,
        sources: response.sources || response.citations
      };
      
      setMessages(prev => [...prev, assistantMessage]);

    } catch (error) {
      console.error('❌ Perplexity Chat error:', error);
      setAiStatus('error');
      
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: `I'm having trouble connecting to my AI services right now. Please try again in a moment.`,
        timestamp: new Date().toISOString(),
        isFromPerplexity: false
      };
      
      setMessages(prev => [...prev, errorMessage]);
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

  // Only show paywall if not demo mode
  if (!isPlus && !isDemoMode) {
    return <PlusUpgrade />;
  }

  return (
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
          <Search size={20} className="text-white" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-white">AI Concierge</h3>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <CheckCircle size={16} className="text-green-400" />
              <span className="text-xs text-green-400">Ready with Web Search</span>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-r from-glass-orange/20 to-glass-yellow/20 px-3 py-1 rounded-full">
          <span className="text-glass-orange text-sm font-medium">PLUS</span>
        </div>
      </div>

      {/* Empty State */}
      {messages.length === 0 && (
        <div className="text-center py-8 mb-6">
          <h4 className="text-white font-medium mb-3">Your AI Travel Concierge</h4>
          <div className="text-sm text-gray-300 space-y-2 max-w-md mx-auto">
            <p>Ask me anything about your trip with real-time web search:</p>
            <div className="text-xs text-gray-400 space-y-1">
              <p>• "What are the best restaurants open tonight?"</p>
              <p>• "What's the current weather like?"</p>
              <p>• "Find events happening this weekend"</p>
              <p>• "Show me nearby attractions"</p>
            </div>
            <div className="mt-3 text-xs text-green-400 bg-green-500/10 rounded px-3 py-2 inline-block">
              ✨ Powered by Perplexity AI with real-time web search
            </div>
          </div>
        </div>
      )}

      {/* Chat Messages */}
      <div className="space-y-4 mb-6 max-h-80 overflow-y-auto">
        <ChatMessages messages={messages} isTyping={isTyping} />
      </div>

      {/* Input */}
      <AiChatInput
        inputMessage={inputMessage}
        onInputChange={setInputMessage}
        onSendMessage={handleSendMessage}
        onKeyPress={handleKeyPress}
        isTyping={isTyping}
        disabled={aiStatus === 'error'}
      />
    </div>
  );
};
