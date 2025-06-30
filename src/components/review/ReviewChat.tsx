
import React from 'react';
import { MessageSquare } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Button } from '../ui/button';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface ReviewChatProps {
  messages: ChatMessage[];
  input: string;
  onInputChange: (value: string) => void;
  onSubmit: () => void;
}

export const ReviewChat = ({ messages, input, onInputChange, onSubmit }: ReviewChatProps) => {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onSubmit();
    }
  };

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <Card className="bg-gray-900 border-gray-700 h-96">
          <CardHeader>
            <CardTitle className="text-white">AI Analysis Chat</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col h-80">
            <div className="flex-1 overflow-y-auto space-y-4 mb-4">
              {messages.length === 0 ? (
                <div className="text-center py-8">
                  <MessageSquare size={32} className="text-gray-600 mx-auto mb-2" />
                  <p className="text-gray-400">Ask questions about the review analysis</p>
                </div>
              ) : (
                messages.map((msg, index) => (
                  <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-xs px-4 py-2 rounded-lg ${
                      msg.role === 'user' 
                        ? 'bg-yellow-500 text-black' 
                        : 'bg-gray-800 text-white'
                    }`}>
                      {msg.content}
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="Ask about the reviews..."
                value={input}
                onChange={(e) => onInputChange(e.target.value)}
                onKeyPress={handleKeyPress}
                className="bg-gray-800 border-gray-600 text-white"
              />
              <Button onClick={onSubmit} className="bg-yellow-500 text-black">
                Send
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
