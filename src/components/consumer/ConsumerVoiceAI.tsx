import React, { useState } from 'react';
import { Mic, Bot, Brain, Volume2, Settings, Sliders, TestTube, Zap } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export const ConsumerVoiceAI = () => {
  const { user } = useAuth();
  const [isTestingVoice, setIsTestingVoice] = useState(false);

  const handleVoiceTest = () => {
    setIsTestingVoice(true);
    // Simulate voice test
    setTimeout(() => {
      setIsTestingVoice(false);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold text-white flex items-center gap-2">
        <Brain size={24} className="text-glass-orange" />
        Voice & AI Features
      </h3>

      {/* Voice Assistant Settings */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-6">
        <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Mic size={20} className="text-glass-orange" />
          Voice Assistant
        </h4>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
            <div>
              <div className="text-white font-medium">Voice Assistant</div>
              <div className="text-sm text-gray-400">Enable voice commands and responses</div>
            </div>
            <button className="relative w-12 h-6 rounded-full bg-glass-orange">
              <div className="absolute w-5 h-5 bg-white rounded-full top-0.5 translate-x-6 transition-transform" />
            </button>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
            <div>
              <div className="text-white font-medium">Wake Word Detection</div>
              <div className="text-sm text-gray-400">Respond to "Hey ravel" wake word</div>
            </div>
            <button className="relative w-12 h-6 rounded-full bg-gray-600">
              <div className="absolute w-5 h-5 bg-white rounded-full top-0.5 translate-x-0.5 transition-transform" />
            </button>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
            <div>
              <div className="text-white font-medium">Voice Responses</div>
              <div className="text-sm text-gray-400">Get audio responses from the assistant</div>
            </div>
            <button className="relative w-12 h-6 rounded-full bg-glass-orange">
              <div className="absolute w-5 h-5 bg-white rounded-full top-0.5 translate-x-6 transition-transform" />
            </button>
          </div>
          
          <div className="p-4 bg-white/5 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <div className="text-white font-medium">Voice Settings</div>
              <button
                onClick={handleVoiceTest}
                disabled={isTestingVoice}
                className="bg-glass-orange hover:bg-glass-orange/80 disabled:opacity-50 text-white px-3 py-1 rounded-lg text-sm transition-colors"
              >
                {isTestingVoice ? 'Testing...' : 'Test Voice'}
              </button>
            </div>
            
            <div className="space-y-3">
              <div>
                <label className="block text-sm text-gray-300 mb-2">Voice Speed</label>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-400">Slow</span>
                  <div className="flex-1 bg-gray-600 rounded-full h-2">
                    <div className="bg-glass-orange h-2 rounded-full" style={{ width: '60%' }} />
                  </div>
                  <span className="text-xs text-gray-400">Fast</span>
                </div>
              </div>
              
              <div>
                <label className="block text-sm text-gray-300 mb-2">Voice Pitch</label>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-400">Low</span>
                  <div className="flex-1 bg-gray-600 rounded-full h-2">
                    <div className="bg-glass-orange h-2 rounded-full" style={{ width: '40%' }} />
                  </div>
                  <span className="text-xs text-gray-400">High</span>
                </div>
              </div>
              
              <div>
                <label className="block text-sm text-gray-300 mb-2">Voice Type</label>
                <select className="w-full bg-gray-800/50 border border-gray-600 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-glass-orange/50">
                  <option>Natural (Female)</option>
                  <option>Natural (Male)</option>
                  <option>Professional</option>
                  <option>Friendly</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Features */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-6">
        <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Bot size={20} className="text-glass-orange" />
          AI Features
        </h4>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
            <div>
              <div className="text-white font-medium">Smart Calendar Detection</div>
              <div className="text-sm text-gray-400">Automatically detect dates and events in messages</div>
            </div>
            <button className="relative w-12 h-6 rounded-full bg-glass-orange">
              <div className="absolute w-5 h-5 bg-white rounded-full top-0.5 translate-x-6 transition-transform" />
            </button>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
            <div>
              <div className="text-white font-medium">Photo Analysis</div>
              <div className="text-sm text-gray-400">Get AI insights from your travel photos</div>
            </div>
            <button className="relative w-12 h-6 rounded-full bg-glass-orange">
              <div className="absolute w-5 h-5 bg-white rounded-full top-0.5 translate-x-6 transition-transform" />
            </button>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
            <div>
              <div className="text-white font-medium">Smart Suggestions</div>
              <div className="text-sm text-gray-400">Get AI-powered recommendations for your trips</div>
            </div>
            <button className="relative w-12 h-6 rounded-full bg-glass-orange">
              <div className="absolute w-5 h-5 bg-white rounded-full top-0.5 translate-x-6 transition-transform" />
            </button>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
            <div>
              <div className="text-white font-medium">Auto-summarization</div>
              <div className="text-sm text-gray-400">Automatically summarize long conversations</div>
            </div>
            <button className="relative w-12 h-6 rounded-full bg-gray-600">
              <div className="absolute w-5 h-5 bg-white rounded-full top-0.5 translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {/* AI Confidence Settings */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-6">
        <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Sliders size={20} className="text-glass-orange" />
          AI Confidence & Accuracy
        </h4>
        
        <div className="space-y-4">
          <div className="p-4 bg-white/5 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <div className="text-white font-medium">Calendar Detection Confidence</div>
              <span className="text-glass-orange text-sm">85%</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-gray-400">Low</span>
              <div className="flex-1 bg-gray-600 rounded-full h-2">
                <div className="bg-glass-orange h-2 rounded-full" style={{ width: '85%' }} />
              </div>
              <span className="text-xs text-gray-400">High</span>
            </div>
            <p className="text-xs text-gray-400 mt-2">Higher confidence means fewer false positives</p>
          </div>
          
          <div className="p-4 bg-white/5 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <div className="text-white font-medium">Photo Analysis Sensitivity</div>
              <span className="text-glass-orange text-sm">70%</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-gray-400">Conservative</span>
              <div className="flex-1 bg-gray-600 rounded-full h-2">
                <div className="bg-glass-orange h-2 rounded-full" style={{ width: '70%' }} />
              </div>
              <span className="text-xs text-gray-400">Aggressive</span>
            </div>
            <p className="text-xs text-gray-400 mt-2">Lower sensitivity provides more detailed analysis</p>
          </div>
          
          <div className="p-4 bg-white/5 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <div className="text-white font-medium">Suggestion Frequency</div>
              <span className="text-glass-orange text-sm">Medium</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-gray-400">Minimal</span>
              <div className="flex-1 bg-gray-600 rounded-full h-2">
                <div className="bg-glass-orange h-2 rounded-full" style={{ width: '60%' }} />
              </div>
              <span className="text-xs text-gray-400">Frequent</span>
            </div>
            <p className="text-xs text-gray-400 mt-2">How often AI provides suggestions during conversations</p>
          </div>
        </div>
      </div>

      {/* AI Learning */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-6">
        <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Zap size={20} className="text-glass-orange" />
          AI Learning & Privacy
        </h4>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
            <div>
              <div className="text-white font-medium">Learn from My Preferences</div>
              <div className="text-sm text-gray-400">Allow AI to learn from your travel patterns</div>
            </div>
            <button className="relative w-12 h-6 rounded-full bg-glass-orange">
              <div className="absolute w-5 h-5 bg-white rounded-full top-0.5 translate-x-6 transition-transform" />
            </button>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
            <div>
              <div className="text-white font-medium">Anonymous Data Sharing</div>
              <div className="text-sm text-gray-400">Help improve AI features (anonymized data only)</div>
            </div>
            <button className="relative w-12 h-6 rounded-full bg-gray-600">
              <div className="absolute w-5 h-5 bg-white rounded-full top-0.5 translate-x-0.5 transition-transform" />
            </button>
          </div>
          
          <button className="w-full flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 rounded-lg transition-colors">
            <div className="text-left">
              <div className="text-white font-medium">Reset AI Learning</div>
              <div className="text-sm text-gray-400">Clear all learned preferences and start fresh</div>
            </div>
            <div className="text-glass-orange">Reset</div>
          </button>
        </div>
      </div>
    </div>
  );
};