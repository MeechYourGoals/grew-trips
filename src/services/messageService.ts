import { supabase } from './supabaseClient'; // Assuming you have a supabaseClient export
import type { PostgrestSingleResponse, PostgrestResponse } from '@supabase/supabase-js';

// Define the structure of your message object if you haven't already
export interface Message {
  id: string; // UUID
  trip_id: string;
  user_id: string; // ID of the user who created the message
  content: string;
  created_at: string; // ISO string
  updated_at?: string; // ISO string
  // Priority fields from the migration
  priority?: 'urgent' | 'reminder' | 'fyi' | 'none' | null;
  priority_score?: number | null;
  priority_reason?: string | null;
  priority_processed_at?: string | null; // ISO string
  // Add other fields like sender_name, reactions, etc., as needed
}

export interface CreateMessagePayload {
  trip_id: string;
  user_id: string;
  content: string;
}

export interface UpdateMessagePriorityPayload {
  priority: 'urgent' | 'reminder' | 'fyi' | 'none';
  priority_score?: number;
  priority_reason?: string;
}

const MESSAGES_TABLE = 'messages'; // Ensure this matches your actual table name

export class MessageService {
  /**
   * Creates a new message.
   */
  static async createMessage(payload: CreateMessagePayload): Promise<PostgrestSingleResponse<Message>> {
    if (!payload.user_id) {
      return { data: null, error: { message: 'User ID is required to create a message.', details: '', hint: '', code: '400'}, status: 400, statusText: 'Bad Request', count: null };
    }
    if (!payload.trip_id) {
        return { data: null, error: { message: 'Trip ID is required to create a message.', details: '', hint: '', code: '400'}, status: 400, statusText: 'Bad Request', count: null };
    }
    if (!payload.content || payload.content.trim() === '') {
        return { data: null, error: { message: 'Message content cannot be empty.', details: '', hint: '', code: '400'}, status: 400, statusText: 'Bad Request', count: null };
    }

    // Insert the new message, default priority will be set by DB or can be explicit here
    return supabase
      .from(MESSAGES_TABLE)
      .insert({
        ...payload,
        // priority: 'none', // Can be set here or rely on DB default
        // priority_processed_at: null // Explicitly null or let DB handle
      })
      .select()
      .single();
  }

  /**
   * Updates the priority of an existing message.
   */
  static async updateMessagePriority(
    messageId: string,
    priorityInfo: UpdateMessagePriorityPayload
  ): Promise<PostgrestSingleResponse<Message>> {
    if (!messageId) {
      return { data: null, error: { message: 'Message ID is required.', details: '', hint: '', code: '400'}, status: 400, statusText: 'Bad Request', count: null };
    }

    const updates = {
      ...priorityInfo,
      priority_processed_at: new Date().toISOString(),
    };

    return supabase
      .from(MESSAGES_TABLE)
      .update(updates)
      .eq('id', messageId)
      .select()
      .single();
  }

  /**
   * Fetches messages for a trip.
   * Add pagination, sorting, filtering as needed.
   */
  static async getMessagesForTrip(tripId: string, limit = 50): Promise<PostgrestResponse<Message>> {
    return supabase
      .from(MESSAGES_TABLE)
      .select('*') // Adjust columns as needed, e.g., '*, user:user_id(*)' to fetch sender info
      .eq('trip_id', tripId)
      .order('created_at', { ascending: false }) // Or true, depending on display order
      .limit(limit);
  }

  // Add other methods like getMessageById, deleteMessage, updateMessageContent etc.
}

// Example of how this might be used in a component after sending a message:
// async function handleNewMessage(content: string, tripId: string, userId: string) {
//   const createResponse = await MessageService.createMessage({ content, tripId, userId });
//   if (createResponse.data && !createResponse.error) {
//     const newMessage = createResponse.data;
//     console.log('Message created:', newMessage);
//
//     // Asynchronously classify and update priority
//     AiFeatureService.classifyMessagePriority(newMessage.content /*, pass tripContext if available */)
//       .then(priorityResponse => {
//         if (priorityResponse.success && priorityResponse.data) {
//           MessageService.updateMessagePriority(newMessage.id, priorityResponse.data)
//             .then(updatedMsgResponse => {
//               if (updatedMsgResponse.data && !updatedMsgResponse.error) {
//                 console.log('Message priority updated:', updatedMsgResponse.data);
//                 // Here you might want to update your local state / UI with the new priority
//               } else {
//                 console.error('Failed to update message priority in DB:', updatedMsgResponse.error);
//               }
//             });
//         } else {
//           console.error('Failed to classify message priority:', priorityResponse.error);
//         }
//       });
//     return newMessage;
//   } else {
//     console.error('Failed to create message:', createResponse.error);
//     return null;
//   }
// }
