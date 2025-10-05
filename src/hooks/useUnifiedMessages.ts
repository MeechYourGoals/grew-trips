import { useState, useEffect, useCallback, useRef } from 'react';
import { MessagingFactory } from '@/services/messaging/MessagingFactory';
import { IMessagingProvider, Message, SendMessageOptions } from '@/services/messaging/IMessagingProvider';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface UseUnifiedMessagesOptions {
  tripId: string;
  tripType: 'consumer' | 'pro' | 'event';
  enabled?: boolean;
}

export function useUnifiedMessages({ tripId, tripType, enabled = true }: UseUnifiedMessagesOptions) {
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [user, setUser] = useState<any>(null);
  const providerRef = useRef<IMessagingProvider | null>(null);

  // Get current user
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });
  }, []);

  // Initialize provider
  useEffect(() => {
    if (!enabled || !user || !tripId) return;

    const initProvider = async () => {
      try {
        const provider = MessagingFactory.getProvider(tripId, tripType);
        providerRef.current = provider;

        // Connect if not already connected
        if (!provider.isConnected()) {
          await provider.connect({
            tripId,
            userId: user.id,
            userName: user.email || 'Unknown User',
            userAvatar: user.user_metadata?.avatar_url
          });
        }

        // Subscribe to new messages
        const unsubscribe = provider.onMessage((message) => {
          setMessages(prev => [...prev, message]);
        });

        // Load initial messages
        const initialMessages = await provider.getMessages(50);
        setMessages(initialMessages);
        setIsLoading(false);

        return () => {
          unsubscribe();
        };
      } catch (error) {
        console.error('Failed to initialize messaging provider:', error);
        toast({
          title: 'Connection Error',
          description: 'Failed to connect to messaging service',
          variant: 'destructive'
        });
        setIsLoading(false);
      }
    };

    initProvider();

    // Cleanup on unmount
    return () => {
      if (providerRef.current) {
        MessagingFactory.releaseProvider(tripId, tripType);
      }
    };
  }, [enabled, user, tripId, tripType, toast]);

  // Send message
  const sendMessage = useCallback(async (options: SendMessageOptions) => {
    if (!providerRef.current || !providerRef.current.isConnected()) {
      toast({
        title: 'Not Connected',
        description: 'Please wait for connection to establish',
        variant: 'destructive'
      });
      return;
    }

    setIsSending(true);
    try {
      const message = await providerRef.current.sendMessage(options);
      // Message will be added via onMessage callback for consistency
      return message;
    } catch (error) {
      console.error('Failed to send message:', error);
      toast({
        title: 'Send Failed',
        description: 'Failed to send message',
        variant: 'destructive'
      });
      throw error;
    } finally {
      setIsSending(false);
    }
  }, [toast]);

  // Load more messages
  const loadMore = useCallback(async () => {
    if (!providerRef.current || messages.length === 0) return;

    try {
      const oldestMessage = messages[0];
      const olderMessages = await providerRef.current.getMessages(50, oldestMessage.timestamp);
      setMessages(prev => [...olderMessages, ...prev]);
    } catch (error) {
      console.error('Failed to load more messages:', error);
    }
  }, [messages]);

  // Delete message
  const deleteMessage = useCallback(async (messageId: string) => {
    if (!providerRef.current) return;

    try {
      await providerRef.current.deleteMessage(messageId);
      setMessages(prev => prev.filter(m => m.id !== messageId));
    } catch (error) {
      console.error('Failed to delete message:', error);
      toast({
        title: 'Delete Failed',
        description: 'Failed to delete message',
        variant: 'destructive'
      });
    }
  }, [toast]);

  return {
    messages,
    isLoading,
    isSending,
    sendMessage,
    loadMore,
    deleteMessage,
    isConnected: providerRef.current?.isConnected() || false
  };
}
