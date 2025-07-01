import React, { useState } from 'react';
import { OpenAIService } from '../services/OpenAIService';
import { useMessages } from '../hooks/useMessages';
import { Send } from 'lucide-react';

export const AiMessageComposer = () => {
  const { addMessage } = useMessages();
  const [prompt, setPrompt] = useState('');
  const [tone, setTone] = useState<'friendly' | 'professional' | 'funny'>('friendly');
  const [isSending, setIsSending] = useState(false);

  const send = async () => {
    if (!prompt.trim()) return;
    setIsSending(true);
    try {
      const response = await OpenAIService.queryOpenAI(prompt, { tone });
      await addMessage(response);
      setPrompt('');
    } catch (e) {
      console.error(e);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="space-y-2 bg-slate-800/30 p-4 rounded-xl">
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        rows={3}
        className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white"
        placeholder="Ask the AI to craft a message..."
      />
      <div className="flex items-center justify-between gap-2">
        <select
          value={tone}
          onChange={(e) => setTone(e.target.value as any)}
          className="bg-slate-900 text-white border border-slate-700 rounded px-2 py-1"
        >
          <option value="friendly">Friendly</option>
          <option value="professional">Professional</option>
          <option value="funny">Funny</option>
        </select>
        <button
          onClick={send}
          disabled={isSending || !prompt.trim()}
          className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
        >
          <Send size={16} /> Send
        </button>
      </div>
    </div>
  );
};
