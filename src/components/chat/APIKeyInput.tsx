
import React from 'react';
import { AlertCircle } from 'lucide-react';

interface APIKeyInputProps {
  apiKey: string;
  onApiKeyChange: (key: string) => void;
}

export const APIKeyInput = ({ apiKey, onApiKeyChange }: APIKeyInputProps) => {
  if (apiKey) return null;

  return (
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
            onChange={(e) => onApiKeyChange(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500"
          />
          <p className="text-yellow-200/70 text-xs mt-2">
            Get your API key from <a href="https://makersuite.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="underline">Google AI Studio</a>
          </p>
        </div>
      </div>
    </div>
  );
};
