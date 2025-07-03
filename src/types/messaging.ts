
export interface Message {
  id: string;
  content: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  tripId?: string;
  tourId?: string;
  tripName?: string;
  tourName?: string;
  timestamp: string;
  isRead: boolean;
  priority?: 'urgent' | 'reminder' | 'fyi';
  mentions?: string[];
  recipients?: {
    type: 'individual' | 'all';
    userIds?: string[];
  };
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

export interface ScheduledMessage extends Message {
  sendAt: string;
  isSent: boolean;
}
