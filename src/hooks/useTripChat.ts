import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from './use-toast';

interface TripChatMessage {
  id: string;
  trip_id: string;
  content: string;
  author_name: string;
  created_at: string;
  updated_at: string;
  media_type?: string;
  media_url?: string;
  sentiment?: string;
  link_preview?: any;
  privacy_mode?: string;
  privacy_encrypted?: boolean;
}

interface CreateMessageRequest {
  content: string;
  author_name: string;
  media_type?: string;
  media_url?: string;
}

export const useTripChat = (tripId: string) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Fetch messages from database
  const { data: messages = [], isLoading, error } = useQuery({
    queryKey: ['tripChat', tripId],
    queryFn: async (): Promise<TripChatMessage[]> => {
      const { data, error } = await supabase
        .from('trip_chat_messages')
        .select('*')
        .eq('trip_id', tripId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data || [];
    },
    enabled: !!tripId
  });

  // Real-time subscription for new messages
  useEffect(() => {
    if (!tripId) return;

    const channel = supabase
      .channel(`trip_chat_${tripId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'trip_chat_messages',
          filter: `trip_id=eq.${tripId}`
        },
        (payload) => {
          queryClient.setQueryData(['tripChat', tripId], (old: TripChatMessage[] = []) => [
            ...old,
            payload.new as TripChatMessage
          ]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [tripId, queryClient]);

  // Create message mutation
  const createMessageMutation = useMutation({
    mutationFn: async (message: CreateMessageRequest) => {
      const { data, error } = await supabase
        .from('trip_chat_messages')
        .insert({
          trip_id: tripId,
          content: message.content,
          author_name: message.author_name,
          media_type: message.media_type,
          media_url: message.media_url
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to send message. Please try again.',
        variant: 'destructive'
      });
    }
  });

  const sendMessage = (content: string, authorName: string, mediaType?: string, mediaUrl?: string) => {
    createMessageMutation.mutate({
      content,
      author_name: authorName,
      media_type: mediaType,
      media_url: mediaUrl
    });
  };

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    isCreating: createMessageMutation.isPending
  };
};