export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      ai_queries: {
        Row: {
          created_at: string | null
          id: string
          query_text: string | null
          response_text: string | null
          source_count: number | null
          trip_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          query_text?: string | null
          response_text?: string | null
          source_count?: number | null
          trip_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          query_text?: string | null
          response_text?: string | null
          source_count?: number | null
          trip_id?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      broadcast_reactions: {
        Row: {
          broadcast_id: string
          created_at: string
          id: string
          reaction_type: string
          user_id: string
        }
        Insert: {
          broadcast_id: string
          created_at?: string
          id?: string
          reaction_type: string
          user_id: string
        }
        Update: {
          broadcast_id?: string
          created_at?: string
          id?: string
          reaction_type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "broadcast_reactions_broadcast_id_fkey"
            columns: ["broadcast_id"]
            isOneToOne: false
            referencedRelation: "broadcasts"
            referencedColumns: ["id"]
          },
        ]
      }
      broadcasts: {
        Row: {
          created_at: string
          created_by: string
          id: string
          is_sent: boolean | null
          message: string
          metadata: Json | null
          priority: string | null
          scheduled_for: string | null
          trip_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by: string
          id?: string
          is_sent?: boolean | null
          message: string
          metadata?: Json | null
          priority?: string | null
          scheduled_for?: string | null
          trip_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string
          id?: string
          is_sent?: boolean | null
          message?: string
          metadata?: Json | null
          priority?: string | null
          scheduled_for?: string | null
          trip_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      invite_links: {
        Row: {
          code: string
          created_at: string
          created_by: string
          current_uses: number | null
          expires_at: string | null
          id: string
          is_active: boolean | null
          max_uses: number | null
          trip_id: string
          updated_at: string
        }
        Insert: {
          code: string
          created_at?: string
          created_by: string
          current_uses?: number | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          max_uses?: number | null
          trip_id: string
          updated_at?: string
        }
        Update: {
          code?: string
          created_at?: string
          created_by?: string
          current_uses?: number | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          max_uses?: number | null
          trip_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      kb_chunks: {
        Row: {
          chunk_index: number | null
          content: string | null
          created_at: string | null
          doc_id: string | null
          embedding: string | null
          id: string
          modality: string | null
        }
        Insert: {
          chunk_index?: number | null
          content?: string | null
          created_at?: string | null
          doc_id?: string | null
          embedding?: string | null
          id?: string
          modality?: string | null
        }
        Update: {
          chunk_index?: number | null
          content?: string | null
          created_at?: string | null
          doc_id?: string | null
          embedding?: string | null
          id?: string
          modality?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "kb_chunks_doc_id_fkey"
            columns: ["doc_id"]
            isOneToOne: false
            referencedRelation: "kb_documents"
            referencedColumns: ["id"]
          },
        ]
      }
      kb_documents: {
        Row: {
          chunk_count: number | null
          created_at: string | null
          id: string
          metadata: Json | null
          modality: string | null
          plain_text: string | null
          source: string
          source_id: string | null
          trip_id: string
          updated_at: string | null
        }
        Insert: {
          chunk_count?: number | null
          created_at?: string | null
          id?: string
          metadata?: Json | null
          modality?: string | null
          plain_text?: string | null
          source: string
          source_id?: string | null
          trip_id: string
          updated_at?: string | null
        }
        Update: {
          chunk_count?: number | null
          created_at?: string | null
          id?: string
          metadata?: Json | null
          modality?: string | null
          plain_text?: string | null
          source?: string
          source_id?: string | null
          trip_id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      payment_splits: {
        Row: {
          amount_owed: number
          created_at: string
          debtor_user_id: string
          id: string
          is_settled: boolean | null
          payment_message_id: string
          settled_at: string | null
          settlement_method: string | null
          updated_at: string
        }
        Insert: {
          amount_owed: number
          created_at?: string
          debtor_user_id: string
          id?: string
          is_settled?: boolean | null
          payment_message_id: string
          settled_at?: string | null
          settlement_method?: string | null
          updated_at?: string
        }
        Update: {
          amount_owed?: number
          created_at?: string
          debtor_user_id?: string
          id?: string
          is_settled?: boolean | null
          payment_message_id?: string
          settled_at?: string | null
          settlement_method?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "payment_splits_payment_message_id_fkey"
            columns: ["payment_message_id"]
            isOneToOne: false
            referencedRelation: "trip_payment_messages"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          display_name: string | null
          email: string | null
          first_name: string | null
          id: string
          last_name: string | null
          notification_settings: Json | null
          phone: string | null
          role: string | null
          show_email: boolean | null
          show_phone: boolean | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string | null
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          notification_settings?: Json | null
          phone?: string | null
          role?: string | null
          show_email?: boolean | null
          show_phone?: boolean | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string | null
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          notification_settings?: Json | null
          phone?: string | null
          role?: string | null
          show_email?: boolean | null
          show_phone?: boolean | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      receipts: {
        Row: {
          amount: number
          category: string | null
          created_at: string
          description: string | null
          id: string
          receipt_url: string | null
          trip_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          receipt_url?: string | null
          trip_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          receipt_url?: string | null
          trip_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      saved_recommendations: {
        Row: {
          city: string | null
          created_at: string
          data: Json
          external_link: string | null
          id: string
          image_url: string | null
          location: string | null
          rec_id: number
          rec_type: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          city?: string | null
          created_at?: string
          data?: Json
          external_link?: string | null
          id?: string
          image_url?: string | null
          location?: string | null
          rec_id: number
          rec_type: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          city?: string | null
          created_at?: string
          data?: Json
          external_link?: string | null
          id?: string
          image_url?: string | null
          location?: string | null
          rec_id?: number
          rec_type?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      secure_storage: {
        Row: {
          created_at: string
          id: string
          key: string
          updated_at: string
          user_id: string
          value: string
        }
        Insert: {
          created_at?: string
          id?: string
          key: string
          updated_at?: string
          user_id: string
          value: string
        }
        Update: {
          created_at?: string
          id?: string
          key?: string
          updated_at?: string
          user_id?: string
          value?: string
        }
        Relationships: []
      }
      task_status: {
        Row: {
          completed: boolean
          completed_at: string | null
          created_at: string
          id: string
          task_id: string
          user_id: string
        }
        Insert: {
          completed?: boolean
          completed_at?: string | null
          created_at?: string
          id?: string
          task_id: string
          user_id: string
        }
        Update: {
          completed?: boolean
          completed_at?: string | null
          created_at?: string
          id?: string
          task_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "task_status_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "trip_tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      trip_chat_messages: {
        Row: {
          author_name: string
          content: string
          created_at: string
          id: string
          link_preview: Json | null
          media_type: string | null
          media_url: string | null
          privacy_encrypted: boolean | null
          privacy_mode: string | null
          sentiment: string | null
          trip_id: string
          updated_at: string
        }
        Insert: {
          author_name: string
          content: string
          created_at?: string
          id?: string
          link_preview?: Json | null
          media_type?: string | null
          media_url?: string | null
          privacy_encrypted?: boolean | null
          privacy_mode?: string | null
          sentiment?: string | null
          trip_id: string
          updated_at?: string
        }
        Update: {
          author_name?: string
          content?: string
          created_at?: string
          id?: string
          link_preview?: Json | null
          media_type?: string | null
          media_url?: string | null
          privacy_encrypted?: boolean | null
          privacy_mode?: string | null
          sentiment?: string | null
          trip_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      trip_events: {
        Row: {
          created_at: string
          created_by: string
          description: string | null
          end_time: string | null
          event_category: string | null
          id: string
          include_in_itinerary: boolean | null
          location: string | null
          source_data: Json | null
          source_type: string | null
          start_time: string
          title: string
          trip_id: string
          updated_at: string
          version: number | null
        }
        Insert: {
          created_at?: string
          created_by: string
          description?: string | null
          end_time?: string | null
          event_category?: string | null
          id?: string
          include_in_itinerary?: boolean | null
          location?: string | null
          source_data?: Json | null
          source_type?: string | null
          start_time: string
          title: string
          trip_id: string
          updated_at?: string
          version?: number | null
        }
        Update: {
          created_at?: string
          created_by?: string
          description?: string | null
          end_time?: string | null
          event_category?: string | null
          id?: string
          include_in_itinerary?: boolean | null
          location?: string | null
          source_data?: Json | null
          source_type?: string | null
          start_time?: string
          title?: string
          trip_id?: string
          updated_at?: string
          version?: number | null
        }
        Relationships: []
      }
      trip_files: {
        Row: {
          ai_summary: string | null
          content_text: string | null
          created_at: string
          extracted_events: number
          file_type: string
          id: string
          name: string
          trip_id: string
          updated_at: string
          uploaded_by: string
        }
        Insert: {
          ai_summary?: string | null
          content_text?: string | null
          created_at?: string
          extracted_events?: number
          file_type: string
          id?: string
          name: string
          trip_id: string
          updated_at?: string
          uploaded_by: string
        }
        Update: {
          ai_summary?: string | null
          content_text?: string | null
          created_at?: string
          extracted_events?: number
          file_type?: string
          id?: string
          name?: string
          trip_id?: string
          updated_at?: string
          uploaded_by?: string
        }
        Relationships: []
      }
      trip_invites: {
        Row: {
          code: string
          created_at: string
          created_by: string
          current_uses: number
          expires_at: string | null
          id: string
          is_active: boolean
          max_uses: number | null
          trip_id: string
          updated_at: string
        }
        Insert: {
          code: string
          created_at?: string
          created_by: string
          current_uses?: number
          expires_at?: string | null
          id?: string
          is_active?: boolean
          max_uses?: number | null
          trip_id: string
          updated_at?: string
        }
        Update: {
          code?: string
          created_at?: string
          created_by?: string
          current_uses?: number
          expires_at?: string | null
          id?: string
          is_active?: boolean
          max_uses?: number | null
          trip_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      trip_link_index: {
        Row: {
          created_at: string | null
          domain: string | null
          favicon_url: string | null
          id: string
          message_id: string | null
          og_description: string | null
          og_image_url: string | null
          og_title: string | null
          trip_id: string
          url: string
        }
        Insert: {
          created_at?: string | null
          domain?: string | null
          favicon_url?: string | null
          id?: string
          message_id?: string | null
          og_description?: string | null
          og_image_url?: string | null
          og_title?: string | null
          trip_id: string
          url: string
        }
        Update: {
          created_at?: string | null
          domain?: string | null
          favicon_url?: string | null
          id?: string
          message_id?: string | null
          og_description?: string | null
          og_image_url?: string | null
          og_title?: string | null
          trip_id?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "trip_link_index_message_id_fkey"
            columns: ["message_id"]
            isOneToOne: false
            referencedRelation: "trip_chat_messages"
            referencedColumns: ["id"]
          },
        ]
      }
      trip_links: {
        Row: {
          added_by: string
          category: string | null
          created_at: string
          description: string | null
          id: string
          title: string
          trip_id: string
          updated_at: string
          url: string
          votes: number
        }
        Insert: {
          added_by: string
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          title: string
          trip_id: string
          updated_at?: string
          url: string
          votes?: number
        }
        Update: {
          added_by?: string
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          title?: string
          trip_id?: string
          updated_at?: string
          url?: string
          votes?: number
        }
        Relationships: []
      }
      trip_media_index: {
        Row: {
          created_at: string | null
          file_size: number | null
          filename: string | null
          id: string
          media_type: string
          media_url: string
          message_id: string | null
          metadata: Json | null
          mime_type: string | null
          trip_id: string
        }
        Insert: {
          created_at?: string | null
          file_size?: number | null
          filename?: string | null
          id?: string
          media_type: string
          media_url: string
          message_id?: string | null
          metadata?: Json | null
          mime_type?: string | null
          trip_id: string
        }
        Update: {
          created_at?: string | null
          file_size?: number | null
          filename?: string | null
          id?: string
          media_type?: string
          media_url?: string
          message_id?: string | null
          metadata?: Json | null
          mime_type?: string | null
          trip_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "trip_media_index_message_id_fkey"
            columns: ["message_id"]
            isOneToOne: false
            referencedRelation: "trip_chat_messages"
            referencedColumns: ["id"]
          },
        ]
      }
      trip_members: {
        Row: {
          created_at: string
          id: string
          role: string
          trip_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: string
          trip_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: string
          trip_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      trip_payment_messages: {
        Row: {
          amount: number
          created_at: string
          created_by: string
          currency: string
          description: string
          id: string
          is_settled: boolean | null
          message_id: string | null
          payment_methods: Json
          split_count: number
          split_participants: Json
          trip_id: string
          updated_at: string
          version: number | null
        }
        Insert: {
          amount: number
          created_at?: string
          created_by: string
          currency?: string
          description: string
          id?: string
          is_settled?: boolean | null
          message_id?: string | null
          payment_methods?: Json
          split_count: number
          split_participants?: Json
          trip_id: string
          updated_at?: string
          version?: number | null
        }
        Update: {
          amount?: number
          created_at?: string
          created_by?: string
          currency?: string
          description?: string
          id?: string
          is_settled?: boolean | null
          message_id?: string | null
          payment_methods?: Json
          split_count?: number
          split_participants?: Json
          trip_id?: string
          updated_at?: string
          version?: number | null
        }
        Relationships: []
      }
      trip_polls: {
        Row: {
          created_at: string
          created_by: string
          id: string
          options: Json
          question: string
          status: string
          total_votes: number
          trip_id: string
          updated_at: string
          version: number | null
        }
        Insert: {
          created_at?: string
          created_by: string
          id?: string
          options?: Json
          question: string
          status?: string
          total_votes?: number
          trip_id: string
          updated_at?: string
          version?: number | null
        }
        Update: {
          created_at?: string
          created_by?: string
          id?: string
          options?: Json
          question?: string
          status?: string
          total_votes?: number
          trip_id?: string
          updated_at?: string
          version?: number | null
        }
        Relationships: []
      }
      trip_preferences: {
        Row: {
          accessibility: Json
          budget_max: number
          budget_min: number
          business: Json
          created_at: string
          dietary: Json
          entertainment: Json
          id: string
          lifestyle: Json
          time_preference: string
          trip_id: string
          updated_at: string
          vibe: Json
        }
        Insert: {
          accessibility?: Json
          budget_max?: number
          budget_min?: number
          business?: Json
          created_at?: string
          dietary?: Json
          entertainment?: Json
          id?: string
          lifestyle?: Json
          time_preference?: string
          trip_id: string
          updated_at?: string
          vibe?: Json
        }
        Update: {
          accessibility?: Json
          budget_max?: number
          budget_min?: number
          business?: Json
          created_at?: string
          dietary?: Json
          entertainment?: Json
          id?: string
          lifestyle?: Json
          time_preference?: string
          trip_id?: string
          updated_at?: string
          vibe?: Json
        }
        Relationships: []
      }
      trip_privacy_configs: {
        Row: {
          ai_access_enabled: boolean
          can_change_privacy: boolean
          created_at: string
          created_by: string
          id: string
          participants_notified: boolean
          privacy_mode: string
          trip_id: string
          updated_at: string
        }
        Insert: {
          ai_access_enabled?: boolean
          can_change_privacy?: boolean
          created_at?: string
          created_by: string
          id?: string
          participants_notified?: boolean
          privacy_mode?: string
          trip_id: string
          updated_at?: string
        }
        Update: {
          ai_access_enabled?: boolean
          can_change_privacy?: boolean
          created_at?: string
          created_by?: string
          id?: string
          participants_notified?: boolean
          privacy_mode?: string
          trip_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "trip_privacy_configs_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: true
            referencedRelation: "trips"
            referencedColumns: ["id"]
          },
        ]
      }
      trip_receipts: {
        Row: {
          amount: number
          category: string | null
          created_at: string
          description: string | null
          id: string
          receipt_url: string | null
          trip_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          receipt_url?: string | null
          trip_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          receipt_url?: string | null
          trip_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      trip_tasks: {
        Row: {
          completed: boolean
          completed_at: string | null
          created_at: string
          creator_id: string
          description: string | null
          due_at: string | null
          id: string
          is_poll: boolean
          title: string
          trip_id: string
          updated_at: string
          version: number | null
        }
        Insert: {
          completed?: boolean
          completed_at?: string | null
          created_at?: string
          creator_id: string
          description?: string | null
          due_at?: string | null
          id?: string
          is_poll?: boolean
          title: string
          trip_id: string
          updated_at?: string
          version?: number | null
        }
        Update: {
          completed?: boolean
          completed_at?: string | null
          created_at?: string
          creator_id?: string
          description?: string | null
          due_at?: string | null
          id?: string
          is_poll?: boolean
          title?: string
          trip_id?: string
          updated_at?: string
          version?: number | null
        }
        Relationships: []
      }
      trips: {
        Row: {
          ai_access_enabled: boolean | null
          basecamp_address: string | null
          basecamp_name: string | null
          cover_image_url: string | null
          created_at: string
          created_by: string
          description: string | null
          destination: string | null
          end_date: string | null
          id: string
          is_archived: boolean | null
          name: string
          privacy_mode: string | null
          start_date: string | null
          trip_type: string | null
          updated_at: string
        }
        Insert: {
          ai_access_enabled?: boolean | null
          basecamp_address?: string | null
          basecamp_name?: string | null
          cover_image_url?: string | null
          created_at?: string
          created_by: string
          description?: string | null
          destination?: string | null
          end_date?: string | null
          id: string
          is_archived?: boolean | null
          name: string
          privacy_mode?: string | null
          start_date?: string | null
          trip_type?: string | null
          updated_at?: string
        }
        Update: {
          ai_access_enabled?: boolean | null
          basecamp_address?: string | null
          basecamp_name?: string | null
          cover_image_url?: string | null
          created_at?: string
          created_by?: string
          description?: string | null
          destination?: string | null
          end_date?: string | null
          id?: string
          is_archived?: boolean | null
          name?: string
          privacy_mode?: string | null
          start_date?: string | null
          trip_type?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      user_payment_methods: {
        Row: {
          created_at: string
          display_name: string | null
          id: string
          identifier: string
          is_preferred: boolean | null
          is_visible: boolean | null
          method_type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          display_name?: string | null
          id?: string
          identifier: string
          is_preferred?: boolean | null
          is_visible?: boolean | null
          method_type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          display_name?: string | null
          id?: string
          identifier?: string
          is_preferred?: boolean | null
          is_visible?: boolean | null
          method_type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_preferences: {
        Row: {
          created_at: string
          id: string
          preferences: Json
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          preferences?: Json
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          preferences?: Json
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      binary_quantize: {
        Args: { "": string } | { "": unknown }
        Returns: unknown
      }
      create_event_with_conflict_check: {
        Args: {
          p_created_by: string
          p_description: string
          p_end_time: string
          p_location: string
          p_start_time: string
          p_title: string
          p_trip_id: string
        }
        Returns: string
      }
      create_payment_with_splits: {
        Args: {
          p_amount: number
          p_created_by: string
          p_currency: string
          p_description: string
          p_payment_methods: Json
          p_split_count: number
          p_split_participants: Json
          p_trip_id: string
        }
        Returns: string
      }
      ensure_trip_membership: {
        Args: { p_trip_id: string; p_user_id: string }
        Returns: boolean
      }
      halfvec_avg: {
        Args: { "": number[] }
        Returns: unknown
      }
      halfvec_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      halfvec_send: {
        Args: { "": unknown }
        Returns: string
      }
      halfvec_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
      hnsw_bit_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnsw_halfvec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnsw_sparsevec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnswhandler: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflat_bit_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflat_halfvec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflathandler: {
        Args: { "": unknown }
        Returns: unknown
      }
      l2_norm: {
        Args: { "": unknown } | { "": unknown }
        Returns: number
      }
      l2_normalize: {
        Args: { "": string } | { "": unknown } | { "": unknown }
        Returns: unknown
      }
      match_kb_chunks: {
        Args: {
          filter_trip?: string
          match_count?: number
          query_embedding: string
        }
        Returns: {
          content: string
          doc_id: string
          id: string
          metadata: Json
          similarity: number
          source: string
          trip_id: string
        }[]
      }
      sparsevec_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      sparsevec_send: {
        Args: { "": unknown }
        Returns: string
      }
      sparsevec_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
      toggle_task_status: {
        Args: {
          p_completed: boolean
          p_current_version: number
          p_task_id: string
          p_user_id: string
        }
        Returns: boolean
      }
      vector_avg: {
        Args: { "": number[] }
        Returns: string
      }
      vector_dims: {
        Args: { "": string } | { "": unknown }
        Returns: number
      }
      vector_norm: {
        Args: { "": string }
        Returns: number
      }
      vector_out: {
        Args: { "": string }
        Returns: unknown
      }
      vector_send: {
        Args: { "": string }
        Returns: string
      }
      vector_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
      vote_on_poll: {
        Args: {
          p_current_version: number
          p_option_id: string
          p_poll_id: string
          p_user_id: string
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
