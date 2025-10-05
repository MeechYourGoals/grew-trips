import { supabase } from "@/integrations/supabase/client";
import { 
  IMessagingProvider, 
  Message, 
  SendMessageOptions, 
  MessagingConfig 
} from "./IMessagingProvider";

export class SupabaseMessagingProvider implements IMessagingProvider {
  private config: MessagingConfig | null = null;
  private subscription: any = null;
  private messageCallback: ((message: Message) => void) | null = null;

  async connect(config: MessagingConfig): Promise<void> {
    this.config = config;
    
    // Subscribe to real-time messages for this trip
    this.subscription = supabase
      .channel(`trip-chat-${config.tripId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'trip_chat_messages',
          filter: `trip_id=eq.${config.tripId}`
        },
        (payload) => {
          if (this.messageCallback) {
            const message = this.transformToMessage(payload.new);
            this.messageCallback(message);
          }
        }
      )
      .subscribe();
  }

  async disconnect(): Promise<void> {
    if (this.subscription) {
      await supabase.removeChannel(this.subscription);
      this.subscription = null;
    }
    this.config = null;
    this.messageCallback = null;
  }

  async sendMessage(options: SendMessageOptions): Promise<Message> {
    if (!this.config) {
      throw new Error('Provider not connected');
    }

    const { data, error } = await supabase
      .from('trip_chat_messages')
      .insert({
        trip_id: this.config.tripId,
        content: options.content,
        author_name: this.config.userName,
        media_url: options.attachments?.[0]?.url,
        media_type: options.attachments?.[0]?.type
      })
      .select()
      .single();

    if (error) throw error;
    return this.transformToMessage(data);
  }

  onMessage(callback: (message: Message) => void): () => void {
    this.messageCallback = callback;
    return () => {
      this.messageCallback = null;
    };
  }

  async getMessages(limit: number = 50, before?: Date): Promise<Message[]> {
    if (!this.config) {
      throw new Error('Provider not connected');
    }

    let query = supabase
      .from('trip_chat_messages')
      .select('*')
      .eq('trip_id', this.config.tripId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (before) {
      query = query.lt('created_at', before.toISOString());
    }

    const { data, error } = await query;
    if (error) throw error;

    return (data || []).map(this.transformToMessage).reverse();
  }

  async getUnreadCount(): Promise<number> {
    // Supabase implementation doesn't track unread - return 0
    return 0;
  }

  async markAsRead(messageIds: string[]): Promise<void> {
    // No-op for Supabase - doesn't track read status
  }

  async deleteMessage(messageId: string): Promise<void> {
    const { error } = await supabase
      .from('trip_chat_messages')
      .delete()
      .eq('id', messageId);

    if (error) throw error;
  }

  isConnected(): boolean {
    return this.config !== null && this.subscription !== null;
  }

  private transformToMessage(data: any): Message {
    return {
      id: data.id,
      content: data.content,
      userId: data.author_name, // Supabase uses author_name as identifier
      userName: data.author_name,
      timestamp: new Date(data.created_at),
      metadata: data.link_preview || {},
      attachments: data.media_url ? [{
        id: data.id,
        type: data.media_type || 'file',
        url: data.media_url
      }] : []
    };
  }
}
