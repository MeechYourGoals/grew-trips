import React, { useState, useRef, useEffect } from 'react';
import { useTripChat } from '@/hooks/useTripChat';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, Loader2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface TripChatUpdatedProps {
  tripId: string;
}

export const TripChatUpdated = ({ tripId }: TripChatUpdatedProps) => {
  const [newMessage, setNewMessage] = useState('');
  const { messages, isLoading, sendMessage, isCreating } = useTripChat(tripId);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (newMessage.trim() && !isCreating) {
      sendMessage(newMessage.trim(), 'Current User'); // TODO: Get real user name
      setNewMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin" />
        <span className="ml-2">Loading chat...</span>
      </div>
    );
  }

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader>
        <CardTitle>Trip Chat</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        <div className="flex-1 overflow-y-auto space-y-3 mb-4">
          {messages.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              No messages yet. Start the conversation!
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className="flex flex-col space-y-1 p-3 rounded-lg bg-muted"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-sm">{message.author_name}</span>
                  <span className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}
                  </span>
                </div>
                <p className="text-sm">{message.content}</p>
                {message.media_url && (
                  <div className="mt-2">
                    {message.media_type?.startsWith('image') ? (
                      <img
                        src={message.media_url}
                        alt="Shared media"
                        className="max-w-sm rounded-lg"
                      />
                    ) : (
                      <a
                        href={message.media_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        View attachment
                      </a>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="flex space-x-2">
          <Textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            className="flex-1 min-h-[40px] max-h-32"
            disabled={isCreating}
          />
          <Button
            onClick={handleSend}
            disabled={!newMessage.trim() || isCreating}
            size="sm"
          >
            {isCreating ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};