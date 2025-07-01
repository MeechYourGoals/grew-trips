
import React, { useState } from 'react';
import { Send, Sparkles, MessageCircle, ExternalLink } from 'lucide-react';
import { useConsumerSubscription } from '../hooks/useConsumerSubscription';
import { TripPreferences } from '../types/consumer';
import { SciraAIService, TripContext } from '../services/sciraAI';
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
}

export const UniversalTripAI = ({ tripContext }: UniversalTripAIProps) => {
  const { isPlus } = useConsumerSubscription();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canUseAI = isPlus || tripContext.isPro;
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
    setError(null);

    try {
      const context = SciraAIService.buildTripContext(tripContext);
      const response = await SciraAIService.querySciraAI(inputMessage, context, {
        temperature: 0.3,
        maxTokens: tripContext.isPro ? 2048 : 1024,
        webSearch: true,
        citations: true
      });
      
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: response.content,
        timestamp: new Date().toISOString(),
        sources: response.sources
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

  if (!canUseAI) {
    return (
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
            <Sparkles size={16} className="mr-2" />
            Ask about this trip
          </Button>
        </SheetTrigger>
        <SheetContent className="bg-black border-white/20 text-white">
          <SheetHeader>
            <SheetTitle className="text-white">Trip AI Assistant</SheetTitle>
            <SheetDescription className="text-gray-400">
              Upgrade to unlock AI-powered trip assistance
            </SheetDescription>
          </SheetHeader>
          <div className="mt-6 text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-glass-orange to-glass-yellow rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles size={32} className="text-white" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Upgrade to access TripSync AI</h3>
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

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
          <Sparkles size={16} className="mr-2" />
          Ask about this trip
        </Button>
      </SheetTrigger>
      <SheetContent className="bg-black border-white/20 text-white w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="text-white flex items-center gap-2">
            <Sparkles size={20} className="text-blue-400" />
            TripSync AI for {tripContext.title}
          </SheetTitle>
          <SheetDescription className="text-gray-400">
            Powered by Scira AI • Context: {contextLimit}
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 flex flex-col h-[calc(100vh-120px)]">
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 mb-4">
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          )}

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
                      : 'bg-gray-800 text-gray-300 border border-gray-700'
                  }`}>
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
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
