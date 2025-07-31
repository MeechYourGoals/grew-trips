
import React, { useState } from 'react';
import { Send, Sparkles, MessageCircle, ExternalLink, AlertCircle, Wifi, WifiOff } from 'lucide-react';
import { useConsumerSubscription } from '../hooks/useConsumerSubscription';
import { TripPreferences } from '../types/consumer';
import { OpenAIService } from '../services/OpenAIService';
import { TripContext } from '../types/tripContext';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from './ui/sheet';
import { Button } from './ui/button';

interface UniversalTripAIProps {
  tripContext: TripContext;
}

interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: string;
  sources?: Array<{ title: string; url: string; snippet: string }>;
  isFromFallback?: boolean;
}

export const UniversalTripAI = ({ tripContext }: UniversalTripAIProps) => {
  const { isPlus } = useConsumerSubscription();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [aiStatus, setAiStatus] = useState<'connected' | 'fallback' | 'error'>('connected');

  const canUseAI = isPlus || tripContext.isPro || false;
  const contextLimit = tripContext.isPro ? 'Advanced (5x larger)' : 'Standard';

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
      const context = OpenAIService.buildTripContext(tripContext);
      const response = await OpenAIService.queryWithContext(inputMessage, context);
      
      // Update AI status based on response
      setAiStatus('connected');
      
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: response.content,
        timestamp: new Date().toISOString(),
        sources: response.sources,
        isFromFallback: false
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch (err) {
      setAiStatus('error');
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      
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

  if (!canUseAI) {
    return (
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
        <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
          <Sparkles size={16} className="mr-2" />
          Concierge
        </Button>
        </SheetTrigger>
        <SheetContent className="bg-black border-white/20 text-white">
          <SheetHeader>
            <SheetTitle className="text-white">Concierge</SheetTitle>
            <SheetDescription className="text-gray-400">
              Upgrade to unlock AI-powered trip assistance
            </SheetDescription>
          </SheetHeader>
          <div className="mt-6 text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-glass-orange to-glass-yellow rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles size={32} className="text-white" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Upgrade to access Concierge</h3>
            <p className="text-gray-400 text-sm mb-4">
              Get instant answers about your trip with web search and contextual insights.
            </p>
            <Button className="bg-gradient-to-r from-glass-orange to-glass-yellow">
              {tripContext.isPro ? 'Available in Pro' : 'Upgrade to Plus'}
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    );
  }

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

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
          <Sparkles size={16} className="mr-2" />
          Concierge
        </Button>
      </SheetTrigger>
      <SheetContent className="bg-black border-white/20 text-white w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles size={20} className="text-blue-400" />
              Concierge for {tripContext.title}
            </div>
            <div className="flex items-center gap-1 text-xs">
              {getStatusIcon()}
              <span className="text-gray-400">{getStatusText()}</span>
            </div>
          </SheetTitle>
          <SheetDescription className="text-gray-400">
            Context: {contextLimit}
          </SheetDescription>
        </SheetHeader>

        {aiStatus === 'fallback' && (
          <div className="mt-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-3">
            <p className="text-yellow-300 text-sm flex items-center gap-2">
              <WifiOff size={14} />
              Running in limited mode - basic responses available
            </p>
          </div>
        )}

        <div className="mt-6 flex flex-col h-[calc(100vh-120px)]">
          <div className="flex-1 space-y-4 mb-4 overflow-y-auto">
            {messages.length === 0 ? (
              <div className="text-center py-8">
                <MessageCircle size={48} className="text-gray-600 mx-auto mb-4" />
                <h4 className="text-lg font-medium text-gray-400 mb-2">Ask me about your trip</h4>
                <div className="text-gray-500 text-sm space-y-1">
                  <p>"What's the weather like during our trip?"</p>
                  <p>"Find restaurants near our hotel"</p>
                  <p>"What did everyone agree on yesterday?"</p>
                </div>
              </div>
            ) : (
              messages.map((message) => (
                <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] px-4 py-3 rounded-2xl ${
                    message.type === 'user'
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                      : `${message.isFromFallback ? 'bg-yellow-900/20 border border-yellow-500/30' : 'bg-gray-800 border border-gray-700'} text-gray-300`
                  }`}>
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    {message.isFromFallback && (
                      <p className="text-xs text-yellow-400 mt-2 flex items-center gap-1">
                        <WifiOff size={10} />
                        Limited response
                      </p>
                    )}
                    {message.sources && message.sources.length > 0 && (
                      <div className="mt-2 space-y-1">
                        <p className="text-xs text-gray-400">Sources:</p>
                        {message.sources.map((source, index) => (
                          <div key={index} className="text-xs bg-white/10 hover:bg-white/20 px-2 py-1 rounded flex items-center gap-1">
                            <ExternalLink size={10} />
                            <span className="truncate">{source.title}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-800 rounded-2xl p-4 border border-gray-700">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-3 items-end">
            <textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about your trip..."
              rows={2}
              className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 resize-none"
            />
            <Button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isTyping}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send size={16} />
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
