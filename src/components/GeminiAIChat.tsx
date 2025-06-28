
import React, { useState } from 'react';
import { Send, Sparkles, Crown, MessageCircle, AlertCircle } from 'lucide-react';
import { useConsumerSubscription } from '../hooks/useConsumerSubscription';
import { TripPreferences } from '../types/consumer';

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
  const { isPlus, upgradeToPlus } = useConsumerSubscription();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [error, setError] = useState<string | null>(null);

  const buildContextPrompt = (userMessage: string) => {
    let contextInfo = `You are a helpful travel assistant. The user is planning a trip and needs recommendations.`;
    
    if (basecamp) {
      contextInfo += `\n\nBasecamp Location: ${basecamp.name} at ${basecamp.address}`;
    }
    
    if (preferences) {
      if (preferences.dietary.length > 0) {
        contextInfo += `\nDietary preferences: ${preferences.dietary.join(', ')}`;
      }
      if (preferences.vibe.length > 0) {
        contextInfo += `\nPreferred activities/vibe: ${preferences.vibe.join(', ')}`;
      }
      contextInfo += `\nBudget range: ${preferences.budget}`;
      contextInfo += `\nTime preference: ${preferences.timePreference}`;
    }
    
    contextInfo += `\n\nPlease provide helpful, specific recommendations based on this context. Focus on practical advice and real places/activities near their basecamp location.`;
    contextInfo += `\n\nUser question: ${userMessage}`;
    
    return contextInfo;
  };

  const callGeminiAPI = async (message: string): Promise<string> => {
    if (!apiKey.trim()) {
      throw new Error('Please enter your Google Gemini API key first');
    }

    const contextualPrompt = buildContextPrompt(message);
    
    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=' + apiKey, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: contextualPrompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        }
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`API Error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    
    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
      throw new Error('Invalid response format from Gemini API');
    }
    
    return data.candidates[0].content.parts[0].text;
  };

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
      const aiResponse = await callGeminiAPI(inputMessage);
      
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: aiResponse,
        timestamp: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      
      const errorResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: `Sorry, I encountered an error: ${errorMessage}. Please check your API key and try again.`,
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
    return (
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden relative">
        {/* Blurred Preview Content */}
        <div className="p-6 filter blur-sm opacity-60">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              <Sparkles size={20} className="text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">AI Travel Assistant</h3>
              <p className="text-gray-400 text-sm">Powered by Google Gemini</p>
            </div>
          </div>

          {/* Mock conversation preview */}
          <div className="space-y-4 mb-6">
            <div className="bg-gray-800 rounded-2xl p-4 max-w-xs">
              <p className="text-gray-300 text-sm">Find vegetarian restaurants near our Airbnb</p>
            </div>
            <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-2xl p-4 ml-8">
              <p className="text-gray-300 text-sm">Here are 3 sushi spots near your Basecamp ranked by reviews...</p>
            </div>
            <div className="bg-gray-800 rounded-2xl p-4 max-w-xs">
              <p className="text-gray-300 text-sm">Suggest nightlife spots within walking distance</p>
            </div>
            <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-2xl p-4 ml-8">
              <p className="text-gray-300 text-sm">Looks like your group prefers day adventures. Want to add this kayaking trip?</p>
            </div>
          </div>

          <div className="flex gap-3 items-center">
            <input
              type="text"
              placeholder="Ask me anything about your trip..."
              className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white"
              disabled
            />
            <button className="bg-blue-600 p-3 rounded-xl" disabled>
              <Send size={16} className="text-white" />
            </button>
          </div>
        </div>

        {/* Glassmorphism Overlay */}
        <div className="absolute inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center">
          <div className="text-center max-w-md p-8">
            <div className="w-16 h-16 bg-gradient-to-r from-glass-orange to-glass-yellow rounded-full flex items-center justify-center mx-auto mb-6">
              <Crown size={32} className="text-white" />
            </div>
            
            <h3 className="text-2xl font-bold text-white mb-3">✨ Unlock Smart Trip Planning with Trips Plus</h3>
            <p className="text-gray-300 mb-6">Your personal AI travel assistant—powered by Google Gemini—is ready to build the perfect trip.</p>
            
            <div className="space-y-2 text-left mb-8">
              <div className="flex items-center gap-2 text-gray-300">
                <span className="text-green-400">✅</span> AI Chatbot powered by Google Gemini
              </div>
              <div className="flex items-center gap-2 text-gray-300">
                <span className="text-green-400">✅</span> Smart suggestions based on your Basecamp
              </div>
              <div className="flex items-center gap-2 text-gray-300">
                <span className="text-green-400">✅</span> Tailored recs using group preferences
              </div>
              <div className="flex items-center gap-2 text-gray-300">
                <span className="text-green-400">✅</span> Real-time help planning food, activities, and more
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 mb-6">
              <p className="text-white font-semibold">$9.99/month – Start your free trial today</p>
            </div>

            <div className="space-y-3">
              <button
                onClick={upgradeToPlus}
                className="w-full bg-gradient-to-r from-glass-orange to-glass-yellow hover:from-glass-orange/80 hover:to-glass-yellow/80 text-white font-bold py-4 rounded-xl transition-all duration-200 hover:scale-105 shadow-lg text-lg"
              >
                🔓 Unlock with Trips Plus
              </button>
              <button className="text-gray-400 hover:text-white text-sm">
                No thanks
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
          <Sparkles size={20} className="text-white" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-white">AI Travel Assistant</h3>
          <p className="text-gray-400 text-sm">Powered by Google Gemini</p>
        </div>
        <div className="bg-gradient-to-r from-glass-orange/20 to-glass-yellow/20 px-3 py-1 rounded-full">
          <span className="text-glass-orange text-sm font-medium">PLUS</span>
        </div>
      </div>

      {/* API Key Input */}
      {!apiKey && (
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 mb-4">
          <div className="flex items-start gap-3">
            <AlertCircle size={20} className="text-yellow-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="text-yellow-300 font-medium mb-2">Google Gemini API Key Required</h4>
              <p className="text-yellow-200 text-sm mb-3">Enter your Google Gemini API key to start chatting with AI.</p>
              <input
                type="password"
                placeholder="Enter your Google Gemini API key..."
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500"
              />
              <p className="text-yellow-200/70 text-xs mt-2">
                Get your API key from <a href="https://makersuite.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="underline">Google AI Studio</a>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Context Info */}
      {basecamp && (
        <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-3 mb-4">
          <p className="text-green-300 text-sm">
            📍 Basecamp: {basecamp.name} • {basecamp.address}
          </p>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 mb-4">
          <div className="flex items-center gap-2">
            <AlertCircle size={16} className="text-red-400" />
            <p className="text-red-300 text-sm">{error}</p>
          </div>
        </div>
      )}

      {/* Chat Messages */}
      <div className="space-y-4 mb-6 max-h-80 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="text-center py-8">
            <MessageCircle size={48} className="text-gray-600 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-400 mb-2">Start planning with AI</h4>
            <p className="text-gray-500 text-sm">Ask me about restaurants, activities, or anything about your trip!</p>
          </div>
        ) : (
          messages.map((message) => (
            <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                message.type === 'user'
                  ? 'bg-gray-800 text-white'
                  : 'bg-gradient-to-r from-blue-600/20 to-purple-600/20 text-gray-300 border border-blue-500/20'
              }`}>
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              </div>
            </div>
          ))
        )}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-2xl p-4 border border-blue-500/20">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="flex gap-3 items-end">
        <textarea
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ask me about restaurants, activities, or anything about your trip..."
          rows={2}
          disabled={!apiKey}
          className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 resize-none disabled:opacity-50 disabled:cursor-not-allowed"
        />
        <button
          onClick={handleSendMessage}
          disabled={!inputMessage.trim() || !apiKey || isTyping}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white p-3 rounded-xl transition-all duration-200"
        >
          <Send size={16} />
        </button>
      </div>
    </div>
  );
};
