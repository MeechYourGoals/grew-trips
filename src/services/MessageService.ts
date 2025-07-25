import { Message, ScheduledMessage } from '../types/messaging';
import { getStreamService } from './getStreamService';

export interface MessageTemplate {
  id: string;
  name: string;
  content: string;
  category: string;
  tripType: string;
  placeholders: string[];
}

export interface ScheduledMessageRequest {
  content: string;
  sendAt: Date;
  tripId?: string;
  tourId?: string;
  userId: string;
  priority?: 'urgent' | 'reminder' | 'fyi';
  isRecurring?: boolean;
  recurrenceType?: 'daily' | 'weekly' | 'monthly';
  recurrenceEnd?: Date;
  templateId?: string;
}

export interface DailyDigest {
  id: string;
  userId: string;
  tripId?: string;
  tourId?: string;
  digestDate: string;
  summary: string;
  messageCount: number;
  urgentCount: number;
  reminderCount: number;
  createdAt: string;
}

export class MessageService {
  private static baseUrl = '/api';

  static async scheduleMessage(request: ScheduledMessageRequest): Promise<{ success: boolean; id?: string; error?: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/message-scheduler`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: request.content,
          send_at: request.sendAt.toISOString(),
          trip_id: request.tripId,
          tour_id: request.tourId,
          user_id: request.userId,
          priority: request.priority || 'fyi',
          is_recurring: request.isRecurring || false,
          recurrence_type: request.recurrenceType,
          recurrence_end: request.recurrenceEnd?.toISOString(),
          template_id: request.templateId,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return { success: true, id: data.id };
    } catch (error) {
      console.error('Failed to schedule message:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  static async getScheduledMessages(userId: string, tripId?: string, tourId?: string): Promise<ScheduledMessage[]> {
    try {
      const params = new URLSearchParams({ user_id: userId });
      if (tripId) params.append('trip_id', tripId);
      if (tourId) params.append('tour_id', tourId);

      const response = await fetch(`${this.baseUrl}/scheduled-messages?${params}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.scheduledMessages || [];
    } catch (error) {
      console.error('Failed to fetch scheduled messages:', error);
      return [];
    }
  }

  static async cancelScheduledMessage(messageId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/scheduled-messages/${messageId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return { success: true };
    } catch (error) {
      console.error('Failed to cancel scheduled message:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  static async updateScheduledMessage(
    messageId: string, 
    updates: Partial<ScheduledMessageRequest>
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/scheduled-messages/${messageId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: updates.content,
          send_at: updates.sendAt?.toISOString(),
          priority: updates.priority,
          is_recurring: updates.isRecurring,
          recurrence_type: updates.recurrenceType,
          recurrence_end: updates.recurrenceEnd?.toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return { success: true };
    } catch (error) {
      console.error('Failed to update scheduled message:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  static async getDailyDigest(userId: string, date: string, tripId?: string, tourId?: string): Promise<DailyDigest | null> {
    try {
      const params = new URLSearchParams({ 
        user_id: userId, 
        date: date 
      });
      if (tripId) params.append('trip_id', tripId);
      if (tourId) params.append('tour_id', tourId);

      const response = await fetch(`${this.baseUrl}/daily-digest?${params}`);
      
      if (!response.ok) {
        if (response.status === 404) return null;
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.digest;
    } catch (error) {
      console.error('Failed to fetch daily digest:', error);
      return null;
    }
  }

  static async generateDailyDigest(userId: string, tripId?: string, tourId?: string): Promise<{ success: boolean; digest?: DailyDigest; error?: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/daily-digest`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userId,
          trip_id: tripId,
          tour_id: tourId,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return { success: true, digest: data.digest };
    } catch (error) {
      console.error('Failed to generate daily digest:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  static async getMessageTemplates(tripType?: string, category?: string): Promise<MessageTemplate[]> {
    try {
      const params = new URLSearchParams();
      if (tripType) params.append('trip_type', tripType);
      if (category) params.append('category', category);

      const response = await fetch(`${this.baseUrl}/message-templates?${params}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.templates || [];
    } catch (error) {
      console.error('Failed to fetch message templates:', error);
      return [];
    }
  }

  static fillTemplate(template: string, context: Record<string, string>): string {
    let filledTemplate = template;
    
    // Replace placeholders like {{placeholder}} with context values
    Object.entries(context).forEach(([key, value]) => {
      const placeholder = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
      filledTemplate = filledTemplate.replace(placeholder, value || `[${key}]`);
    });
    
    return filledTemplate;
  }

  static extractPlaceholders(template: string): string[] {
    const matches = template.match(/\{\{(\w+)\}\}/g);
    if (!matches) return [];
    
    return matches.map(match => match.replace(/\{\{|\}\}/g, ''));
  }

  static async sendChatMessage(tripId: string, text: string): Promise<void> {
    const channel = await getStreamService.getOrCreateTripChannel(tripId);
    await channel.sendMessage({ text });
  }
}