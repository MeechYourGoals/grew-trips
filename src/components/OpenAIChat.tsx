import React, { useState, useEffect } from 'react';
import { Sparkles, WifiOff, Wifi, AlertCircle, CheckCircle, Activity } from 'lucide-react';
import { useConsumerSubscription } from '../hooks/useConsumerSubscription';
import { TripPreferences } from '../types/consumer';
import { TripContextService } from '../services/tripContextService';
import { OpenAIConciergeService, OpenAIResponse } from '../services/openaiConciergeService';
import { useBasecamp } from '../contexts/BasecampContext';
import { ChatMessages } from './chat/ChatMessages';
import { AiChatInput } from './chat/AiChatInput';
import { PlusUpgrade } from './chat/PlusUpgrade';

interface OpenAIChatProps {
  tripId: string;
  basecamp?: { name: string; address: string };
  preferences?: TripPreferences;
}

interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: string;
  isFromOpenAI?: boolean;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export const OpenAIChat = ({ tripId, basecamp, preferences }: OpenAIChatProps) => {
  const { isPlus } = useConsumerSubscription();
  const { basecamp: globalBasecamp } = useBasecamp();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [aiStatus, setAiStatus] = useState<'checking' | 'connected' | 'limited' | 'error' | 'thinking'>('checking');
  const [healthStatus, setHealthStatus] = useState<{ isHealthy: boolean; model: string; latency: number } | null>(null);

  // Health check on component mount
  useEffect(() => {
    const checkHealth = async () => {
      try {
        const health = await OpenAIConciergeService.healthCheck();
        setHealthStatus(health);
        setAiStatus(health.isHealthy ? 'connected' : 'limited');
      } catch (error) {
        console.error('Health check failed:', error);
        setAiStatus('error');
      }
    };

    checkHealth();
  }, []);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

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
      // Get full trip context
      let tripContext;
      try {
        tripContext = await TripContextService.getTripContext(tripId, false);
      } catch (error) {
        console.warn('Could not fetch trip context, using minimal context');
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

      // Build chat history for context
      const chatHistory = messages.slice(-6).map(msg => ({
        role: msg.type === 'user' ? 'user' : 'assistant',
        content: msg.content
      }));

      // Send to OpenAI
      const response: OpenAIResponse = await OpenAIConciergeService.sendMessage(
        currentInput,
        tripContext,
        globalBasecamp || (basecamp ? { 
          name: basecamp.name, 
          address: basecamp.address, 
          coordinates: { lat: 0, lng: 0 },
          type: 'other' as const
        } : null),
        preferences,
        chatHistory
      );

      // Update AI status based on response
      if (response.success && response.isFromOpenAI) {
        setAiStatus('connected');
      } else {
        setAiStatus('limited');
      }

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: response.content,
        timestamp: new Date().toISOString(),
        isFromOpenAI: response.isFromOpenAI,
        usage: response.usage
      };
      
      setMessages(prev => [...prev, assistantMessage]);

    } catch (error) {
      console.error('OpenAI Chat error:', error);
      setAiStatus('error');
      
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: `I'm experiencing technical difficulties. Please try again in a moment. Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        timestamp: new Date().toISOString(),
        isFromOpenAI: false
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

  const getStatusIcon = () => {
    switch (aiStatus) {
      case 'connected':
        return <CheckCircle size={16} className="text-green-400" />;
      case 'limited':
        return <AlertCircle size={16} className="text-yellow-400" />;
      case 'error':
        return <WifiOff size={16} className="text-red-400" />;
      case 'thinking':
        return <Activity size={16} className="text-blue-400 animate-pulse" />;
      case 'checking':
        return <Activity size={16} className="text-gray-400 animate-spin" />;
      default:
        return <Sparkles size={16} className="text-blue-400" />;
    }
  };

  const getStatusText = () => {
    switch (aiStatus) {
      case 'connected':
        return 'OpenAI Connected';
      case 'limited':
        return 'Limited Mode';
      case 'error':
        return 'Connection Error';
      case 'thinking':
        return 'Thinking...';
      case 'checking':
        return 'Checking Status...';
      default:
        return 'Ready';
    }
  };

  const getStatusColor = () => {
    switch (aiStatus) {
      case 'connected':
        return 'text-green-400';
      case 'limited':
        return 'text-yellow-400';
      case 'error':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  if (!isPlus) {
    return <PlusUpgrade />;
  }

  return (
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
          <Sparkles size={20} className="text-white" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-white">OpenAI Concierge</h3>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              {getStatusIcon()}
              <span className={`text-xs ${getStatusColor()}`}>{getStatusText()}</span>
            </div>
            {healthStatus && (
              <span className="text-xs text-gray-500">
                • {healthStatus.model} • {healthStatus.latency}ms
              </span>
            )}
          </div>
        </div>
        <div className="bg-gradient-to-r from-glass-orange/20 to-glass-yellow/20 px-3 py-1 rounded-full">
          <span className="text-glass-orange text-sm font-medium">PLUS</span>
        </div>
      </div>

      {/* Basecamp Display */}
      {(globalBasecamp || basecamp) && (
        <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-3 mb-4">
          <p className="text-green-300 text-sm">
            📍 Basecamp: {globalBasecamp?.name || basecamp?.name} • {globalBasecamp?.address || basecamp?.address}
          </p>
        </div>
      )}

      {/* Status Alerts */}
      {aiStatus === 'limited' && (
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-3 mb-4">
          <p className="text-yellow-300 text-sm flex items-center gap-2">
            <AlertCircle size={14} />
            Limited Mode: OpenAI service unavailable, using fallback responses
          </p>
        </div>
      )}

      {aiStatus === 'error' && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 mb-4">
          <p className="text-red-300 text-sm flex items-center gap-2">
            <WifiOff size={14} />
            Connection Error: Unable to reach OpenAI service
          </p>
        </div>
      )}

      {aiStatus === 'connected' && (
        <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-3 mb-4">
          <p className="text-green-300 text-sm flex items-center gap-2">
            <CheckCircle size={14} />
            ✅ Live OpenAI GPT-4 with full trip context
          </p>
        </div>
      )}

      {/* Empty State */}
      {messages.length === 0 && (
        <div className="text-center py-8 mb-6">
          <h4 className="text-white font-medium mb-3">Your AI Travel Concierge</h4>
          <div className="text-sm text-gray-300 space-y-2 max-w-md mx-auto">
            <p>Powered by OpenAI GPT-4 with full trip context:</p>
            <div className="text-xs text-gray-400 space-y-1">
              <p>• "Where should I eat tonight?" (uses your Basecamp location)</p>
              <p>• "What's my Basecamp?" (shows current basecamp info)</p>
              <p>• "/context" (debug: show full context sent to OpenAI)</p>
              <p>• "/health" (check OpenAI API status)</p>
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
      />
    </div>
  );
};