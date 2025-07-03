import React, { useState } from 'react';
import { Send, Sparkles, X } from 'lucide-react';
import { useMessages } from '../../hooks/useMessages';
import { OpenAIService } from '../../services/OpenAIService';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '../ui/dialog';
import { Button } from '../ui/button';

interface AiMessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  tripId?: string;
  tourId?: string;
  tripContext?: any;
}

export const AiMessageModal = ({ 
  isOpen, 
  onClose, 
  tripId, 
  tourId, 
  tripContext 
}: AiMessageModalProps) => {
  const { addMessage } = useMessages();
  const [prompt, setPrompt] = useState('');
  const [tone, setTone] = useState<'friendly' | 'professional' | 'urgent' | 'direct' | 'cheerful'>('professional');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedMessage, setGeneratedMessage] = useState('');
  const [showPreview, setShowPreview] = useState(false);

  const toneOptions = [
    { value: 'friendly', label: 'Friendly' },
    { value: 'professional', label: 'Professional' },
    { value: 'urgent', label: 'Urgent' },
    { value: 'direct', label: 'Direct' },
    { value: 'cheerful', label: 'Cheerful' }
  ];

  const buildContextualPrompt = (userPrompt: string) => {
    const contextPrefix = tripContext?.isPro 
      ? `You are helping a ${tripContext.category || 'professional'} team manager craft a message for their team. `
      : 'You are helping craft a professional message for an event or team. ';
    
    const toneInstruction = `Use a ${tone} tone. `;
    const lengthInstruction = 'Keep it concise and actionable. ';
    
    return `${contextPrefix}${toneInstruction}${lengthInstruction}User request: ${userPrompt}`;
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setIsGenerating(true);
    try {
      const contextualPrompt = buildContextualPrompt(prompt);
      const response = await OpenAIService.queryOpenAI(contextualPrompt, { tone });
      setGeneratedMessage(response);
      setShowPreview(true);
    } catch (error) {
      console.error('Failed to generate message:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleInsertToChat = async () => {
    if (generatedMessage) {
      await addMessage(generatedMessage, tripId, tourId);
      handleClose();
    }
  };

  const handleClose = () => {
    setPrompt('');
    setGeneratedMessage('');
    setShowPreview(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] bg-black/95 backdrop-blur-xl border border-white/10 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-white">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              <Sparkles size={16} className="text-white" />
            </div>
            Ask AI to Write a Message
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {!showPreview ? (
            <>
              {/* Input Section */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-300">
                  What message should the AI help you write?
                </label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  rows={4}
                  placeholder="e.g., Politely remind team that checkout is at 10am and we need bags in lobby by 9:30am..."
                  className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 resize-none backdrop-blur-sm"
                />
              </div>

              {/* Tone Selection */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Tone</label>
                <select
                  value={tone}
                  onChange={(e) => setTone(e.target.value as any)}
                  className="w-full bg-white/5 border border-white/20 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500 backdrop-blur-sm"
                >
                  {toneOptions.map(option => (
                    <option key={option.value} value={option.value} className="bg-gray-900">
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Generate Button */}
              <Button
                onClick={handleGenerate}
                disabled={!prompt.trim() || isGenerating}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
              >
                {isGenerating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles size={16} className="mr-2" />
                    Generate Message
                  </>
                )}
              </Button>
            </>
          ) : (
            <>
              {/* Preview Section */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-300">
                  Generated Message Preview
                </label>
                <div className="bg-white/5 border border-white/20 rounded-xl p-4 backdrop-blur-sm">
                  <p className="text-white whitespace-pre-wrap">{generatedMessage}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button
                  onClick={handleInsertToChat}
                  className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
                >
                  <Send size={16} className="mr-2" />
                  Insert into Chat
                </Button>
                <Button
                  onClick={() => setShowPreview(false)}
                  variant="outline"
                  className="flex-1 border-white/20 text-white hover:bg-white/10"
                >
                  Edit First
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};