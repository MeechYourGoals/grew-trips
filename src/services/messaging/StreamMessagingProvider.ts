import { StreamChat, Channel } from 'stream-chat';
import { 
  IMessagingProvider, 
  Message, 
  SendMessageOptions, 
  MessagingConfig 
} from "./IMessagingProvider";

export class StreamMessagingProvider implements IMessagingProvider {
  private client: StreamChat | null = null;
  private channel: Channel | null = null;
  private config: MessagingConfig | null = null;
  private messageCallback: ((message: Message) => void) | null = null;

  async connect(config: MessagingConfig): Promise<void> {
    this.config = config;
    
    // Initialize Stream client
    const apiKey = import.meta.env.VITE_STREAM_API_KEY;
    if (!apiKey) {
      throw new Error('Stream API key not configured');
    }

    this.client = StreamChat.getInstance(apiKey);
    
    // Connect user (would need token from backend)
    // await this.client.connectUser({ id: config.userId, name: config.userName }, token);
    
    // Get or create channel
    this.channel = this.client.channel('messaging', config.tripId);
    
    await this.channel.watch();
    
    // Subscribe to new messages
    this.channel.on('message.new', (event) => {
      if (this.messageCallback && event.message) {
        const message = this.transformToMessage(event.message);
        this.messageCallback(message);
      }
    });
  }

  async disconnect(): Promise<void> {
    if (this.channel) {
      await this.channel.stopWatching();
      this.channel = null;
    }
    
    if (this.client) {
      await this.client.disconnectUser();
      this.client = null;
    }
    
    this.config = null;
    this.messageCallback = null;
  }

  async sendMessage(options: SendMessageOptions): Promise<Message> {
    if (!this.channel || !this.config) {
      throw new Error('Provider not connected');
    }

    const response = await this.channel.sendMessage({
      text: options.content,
      attachments: options.attachments?.map(att => ({
        type: att.type,
        asset_url: att.url,
        title: att.name
      }))
    });

    return this.transformToMessage(response.message);
  }

  onMessage(callback: (message: Message) => void): () => void {
    this.messageCallback = callback;
    return () => {
      this.messageCallback = null;
    };
  }

  async getMessages(limit: number = 50, before?: Date): Promise<Message[]> {
    if (!this.channel) {
      throw new Error('Provider not connected');
    }

    const response = await this.channel.query({
      messages: { 
        limit,
        id_lt: before ? before.toISOString() : undefined
      }
    });

    return (response.messages || []).map(this.transformToMessage);
  }

  async getUnreadCount(): Promise<number> {
    if (!this.channel) return 0;
    
    const state = this.channel.state;
    return state.unreadCount || 0;
  }

  async markAsRead(): Promise<void> {
    if (!this.channel) return;
    await this.channel.markRead();
  }

  async deleteMessage(messageId: string): Promise<void> {
    if (!this.client) {
      throw new Error('Provider not connected');
    }

    await this.client.deleteMessage(messageId);
  }

  isConnected(): boolean {
    return this.client !== null && this.channel !== null;
  }

  private transformToMessage(streamMessage: any): Message {
    return {
      id: streamMessage.id,
      content: streamMessage.text || '',
      userId: streamMessage.user?.id || '',
      userName: streamMessage.user?.name || 'Unknown',
      userAvatar: streamMessage.user?.image,
      timestamp: new Date(streamMessage.created_at),
      metadata: streamMessage.custom_data,
      attachments: (streamMessage.attachments || []).map((att: any) => ({
        id: att.id || streamMessage.id,
        type: att.type,
        url: att.asset_url || att.image_url,
        name: att.title
      }))
    };
  }
}
