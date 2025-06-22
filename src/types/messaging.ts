
export interface Message {
  id: string;
  content: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  tripId?: string;
  tourId?: string;
  timestamp: string;
  isRead: boolean;
  mentions?: string[];
  threadId?: string;
  replyToId?: string;
}

export interface MessageThread {
  id: string;
  tripId?: string;
  tourId?: string;
  participants: string[];
  lastMessage?: Message;
  unreadCount: number;
}

export interface UnifiedInboxData {
  messages: Message[];
  threads: MessageThread[];
  totalUnread: number;
}
