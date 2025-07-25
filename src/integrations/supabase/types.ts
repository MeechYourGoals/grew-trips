export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      broadcast_reactions: {
        Row: {
          broadcast_id: string
          created_at: string
          id: string
          reaction_type: string
          user_id: string
          user_name: string
        }
        Insert: {
          broadcast_id: string
          created_at?: string
          id?: string
          reaction_type: string
          user_id: string
          user_name: string
        }
        Update: {
          broadcast_id?: string
          created_at?: string
          id?: string
          reaction_type?: string
          user_id?: string
          user_name?: string
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
          content: string
          created_at: string
          id: string
          location: string | null
          scheduled_time: string | null
          sender_avatar: string
          sender_id: string
          sender_name: string
          tag: string | null
          trip_id: string
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          location?: string | null
          scheduled_time?: string | null
          sender_avatar: string
          sender_id: string
          sender_name: string
          tag?: string | null
          trip_id: string
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          location?: string | null
          scheduled_time?: string | null
          sender_avatar?: string
          sender_id?: string
          sender_name?: string
          tag?: string | null
          trip_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      calendar_integrations: {
        Row: {
          access_token: string | null
          calendar_provider: string
          created_at: string
          expires_at: string | null
          id: string
          refresh_token: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          access_token?: string | null
          calendar_provider: string
          created_at?: string
          expires_at?: string | null
          id?: string
          refresh_token?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          access_token?: string | null
          calendar_provider?: string
          created_at?: string
          expires_at?: string | null
          id?: string
          refresh_token?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      event_attendees: {
        Row: {
          attendance_status: string | null
          created_at: string
          event_id: string | null
          id: string
          rsvp_time: string | null
          user_id: string
        }
        Insert: {
          attendance_status?: string | null
          created_at?: string
          event_id?: string | null
          id?: string
          rsvp_time?: string | null
          user_id: string
        }
        Update: {
          attendance_status?: string | null
          created_at?: string
          event_id?: string | null
          id?: string
          rsvp_time?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_attendees_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "trip_events"
            referencedColumns: ["id"]
          },
        ]
      }
      expense_splits: {
        Row: {
          amount_owed: number
          created_at: string
          id: string
          payment_method: string | null
          payment_status: string | null
          receipt_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          amount_owed: number
          created_at?: string
          id?: string
          payment_method?: string | null
          payment_status?: string | null
          receipt_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          amount_owed?: number
          created_at?: string
          id?: string
          payment_method?: string | null
          payment_status?: string | null
          receipt_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "expense_splits_receipt_id_fkey"
            columns: ["receipt_id"]
            isOneToOne: false
            referencedRelation: "trip_receipts"
            referencedColumns: ["id"]
          },
        ]
      }
      file_ai_extractions: {
        Row: {
          confidence_score: number | null
          created_at: string
          extracted_data: Json
          extraction_type: string
          file_id: string | null
          id: string
        }
        Insert: {
          confidence_score?: number | null
          created_at?: string
          extracted_data?: Json
          extraction_type: string
          file_id?: string | null
          id?: string
        }
        Update: {
          confidence_score?: number | null
          created_at?: string
          extracted_data?: Json
          extraction_type?: string
          file_id?: string | null
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "file_ai_extractions_file_id_fkey"
            columns: ["file_id"]
            isOneToOne: false
            referencedRelation: "trip_files"
            referencedColumns: ["id"]
          },
        ]
      }
      locations: {
        Row: {
          address: string | null
          category: string
          city: string
          country: string | null
          created_at: string | null
          id: string
          lat: number
          lng: number
          name: string
          source: string
          state: string | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          category: string
          city: string
          country?: string | null
          created_at?: string | null
          id?: string
          lat: number
          lng: number
          name: string
          source: string
          state?: string | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          category?: string
          city?: string
          country?: string | null
          created_at?: string | null
          id?: string
          lat?: number
          lng?: number
          name?: string
          source?: string
          state?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      mock_broadcasts: {
        Row: {
          content: string
          created_at: string
          id: string
          location: string | null
          sender_name: string
          tag: string | null
          trip_type: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          location?: string | null
          sender_name: string
          tag?: string | null
          trip_type: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          location?: string | null
          sender_name?: string
          tag?: string | null
          trip_type?: string
        }
        Relationships: []
      }
      mock_messages: {
        Row: {
          created_at: string
          delay_seconds: number | null
          id: string
          message_content: string
          sender_name: string
          tags: string[] | null
          timestamp_offset_days: number | null
          trip_type: string
        }
        Insert: {
          created_at?: string
          delay_seconds?: number | null
          id?: string
          message_content: string
          sender_name: string
          tags?: string[] | null
          timestamp_offset_days?: number | null
          trip_type: string
        }
        Update: {
          created_at?: string
          delay_seconds?: number | null
          id?: string
          message_content?: string
          sender_name?: string
          tags?: string[] | null
          timestamp_offset_days?: number | null
          trip_type?: string
        }
        Relationships: []
      }
      payment_requests: {
        Row: {
          created_at: string
          expense_split_id: string | null
          id: string
          payment_link: string | null
          request_status: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          expense_split_id?: string | null
          id?: string
          payment_link?: string | null
          request_status?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          expense_split_id?: string | null
          id?: string
          payment_link?: string | null
          request_status?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "payment_requests_expense_split_id_fkey"
            columns: ["expense_split_id"]
            isOneToOne: false
            referencedRelation: "expense_splits"
            referencedColumns: ["id"]
          },
        ]
      }
      photo_albums: {
        Row: {
          album_name: string
          cover_photo_id: string | null
          created_at: string
          created_by: string
          id: string
          trip_id: string
          updated_at: string
        }
        Insert: {
          album_name: string
          cover_photo_id?: string | null
          created_at?: string
          created_by: string
          id?: string
          trip_id: string
          updated_at?: string
        }
        Update: {
          album_name?: string
          cover_photo_id?: string | null
          created_at?: string
          created_by?: string
          id?: string
          trip_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "photo_albums_cover_photo_id_fkey"
            columns: ["cover_photo_id"]
            isOneToOne: false
            referencedRelation: "trip_photos"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          display_name: string | null
          first_name: string | null
          id: string
          last_name: string | null
          show_email: boolean
          show_phone: boolean
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          show_email?: boolean
          show_phone?: boolean
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          show_email?: boolean
          show_phone?: boolean
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      review_sentiment_cache: {
        Row: {
          analyzed_at: string
          expires_at: string
          id: string
          platform: string
          review_id: string
          review_text: string
          sentiment_score: number
          themes: Json | null
          venue_id: string
        }
        Insert: {
          analyzed_at?: string
          expires_at?: string
          id?: string
          platform: string
          review_id: string
          review_text: string
          sentiment_score: number
          themes?: Json | null
          venue_id: string
        }
        Update: {
          analyzed_at?: string
          expires_at?: string
          id?: string
          platform?: string
          review_id?: string
          review_text?: string
          sentiment_score?: number
          themes?: Json | null
          venue_id?: string
        }
        Relationships: []
      }
      search_index: {
        Row: {
          category: string | null
          city: string | null
          country: string | null
          created_at: string | null
          date_range: string | null
          description: string | null
          embedding: string | null
          end_date: string | null
          formatted_date: string | null
          full_text: string
          id: string
          location: string | null
          participant_names: string[] | null
          participant_roles: string[] | null
          start_date: string | null
          state: string | null
          tags: string[] | null
          title: string
          trip_id: string
          trip_type: string
          updated_at: string | null
        }
        Insert: {
          category?: string | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          date_range?: string | null
          description?: string | null
          embedding?: string | null
          end_date?: string | null
          formatted_date?: string | null
          full_text: string
          id?: string
          location?: string | null
          participant_names?: string[] | null
          participant_roles?: string[] | null
          start_date?: string | null
          state?: string | null
          tags?: string[] | null
          title: string
          trip_id: string
          trip_type: string
          updated_at?: string | null
        }
        Update: {
          category?: string | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          date_range?: string | null
          description?: string | null
          embedding?: string | null
          end_date?: string | null
          formatted_date?: string | null
          full_text?: string
          id?: string
          location?: string | null
          participant_names?: string[] | null
          participant_roles?: string[] | null
          start_date?: string | null
          state?: string | null
          tags?: string[] | null
          title?: string
          trip_id?: string
          trip_type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      trend_keywords: {
        Row: {
          fetched_at: string | null
          id: string
          interest_score: number
          keyword: string
          location_name: string
          source: string
        }
        Insert: {
          fetched_at?: string | null
          id?: string
          interest_score: number
          keyword: string
          location_name: string
          source: string
        }
        Update: {
          fetched_at?: string | null
          id?: string
          interest_score?: number
          keyword?: string
          location_name?: string
          source?: string
        }
        Relationships: []
      }
      trip_events: {
        Row: {
          created_at: string
          created_by: string
          description: string | null
          end_time: string | null
          google_event_id: string | null
          id: string
          location: string | null
          metadata: Json | null
          start_time: string
          title: string
          trip_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by: string
          description?: string | null
          end_time?: string | null
          google_event_id?: string | null
          id?: string
          location?: string | null
          metadata?: Json | null
          start_time: string
          title: string
          trip_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string
          description?: string | null
          end_time?: string | null
          google_event_id?: string | null
          id?: string
          location?: string | null
          metadata?: Json | null
          start_time?: string
          title?: string
          trip_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      trip_files: {
        Row: {
          created_at: string
          file_name: string
          file_path: string
          file_size: number | null
          file_type: string
          id: string
          metadata: Json | null
          trip_id: string
          updated_at: string
          uploaded_by: string
        }
        Insert: {
          created_at?: string
          file_name: string
          file_path: string
          file_size?: number | null
          file_type: string
          id?: string
          metadata?: Json | null
          trip_id: string
          updated_at?: string
          uploaded_by: string
        }
        Update: {
          created_at?: string
          file_name?: string
          file_path?: string
          file_size?: number | null
          file_type?: string
          id?: string
          metadata?: Json | null
          trip_id?: string
          updated_at?: string
          uploaded_by?: string
        }
        Relationships: []
      }
      trip_invites: {
        Row: {
          created_at: string
          created_by: string
          current_uses: number
          expires_at: string | null
          id: string
          invite_token: string
          is_active: boolean
          max_uses: number | null
          require_approval: boolean
          trip_id: string
        }
        Insert: {
          created_at?: string
          created_by: string
          current_uses?: number
          expires_at?: string | null
          id?: string
          invite_token: string
          is_active?: boolean
          max_uses?: number | null
          require_approval?: boolean
          trip_id: string
        }
        Update: {
          created_at?: string
          created_by?: string
          current_uses?: number
          expires_at?: string | null
          id?: string
          invite_token?: string
          is_active?: boolean
          max_uses?: number | null
          require_approval?: boolean
          trip_id?: string
        }
        Relationships: []
      }
      trip_members: {
        Row: {
          id: string
          joined_at: string
          joined_via_invite_token: string | null
          role: string
          status: string
          trip_id: string
          user_id: string
        }
        Insert: {
          id?: string
          joined_at?: string
          joined_via_invite_token?: string | null
          role?: string
          status?: string
          trip_id: string
          user_id: string
        }
        Update: {
          id?: string
          joined_at?: string
          joined_via_invite_token?: string | null
          role?: string
          status?: string
          trip_id?: string
          user_id?: string
        }
        Relationships: []
      }
      trip_message_reactions: {
        Row: {
          created_at: string
          id: string
          message_id: string | null
          reaction_type: string
          user_id: string
          user_name: string
        }
        Insert: {
          created_at?: string
          id?: string
          message_id?: string | null
          reaction_type: string
          user_id: string
          user_name: string
        }
        Update: {
          created_at?: string
          id?: string
          message_id?: string | null
          reaction_type?: string
          user_id?: string
          user_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "trip_message_reactions_message_id_fkey"
            columns: ["message_id"]
            isOneToOne: false
            referencedRelation: "trip_messages"
            referencedColumns: ["id"]
          },
        ]
      }
      trip_messages: {
        Row: {
          content: string
          created_at: string
          id: string
          message_type: string
          trip_id: string
          updated_at: string
          user_avatar: string
          user_id: string
          user_name: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          message_type?: string
          trip_id: string
          updated_at?: string
          user_avatar: string
          user_id: string
          user_name: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          message_type?: string
          trip_id?: string
          updated_at?: string
          user_avatar?: string
          user_id?: string
          user_name?: string
        }
        Relationships: []
      }
      trip_photos: {
        Row: {
          caption: string | null
          created_at: string
          id: string
          metadata: Json | null
          photo_path: string
          thumbnail_path: string | null
          trip_id: string
          updated_at: string
          uploaded_by: string
        }
        Insert: {
          caption?: string | null
          created_at?: string
          id?: string
          metadata?: Json | null
          photo_path: string
          thumbnail_path?: string | null
          trip_id: string
          updated_at?: string
          uploaded_by: string
        }
        Update: {
          caption?: string | null
          created_at?: string
          id?: string
          metadata?: Json | null
          photo_path?: string
          thumbnail_path?: string | null
          trip_id?: string
          updated_at?: string
          uploaded_by?: string
        }
        Relationships: []
      }
      trip_receipts: {
        Row: {
          created_at: string
          currency: string | null
          file_url: string
          id: string
          parsed_data: Json | null
          total_amount: number | null
          trip_id: string
          updated_at: string
          uploader_id: string
        }
        Insert: {
          created_at?: string
          currency?: string | null
          file_url: string
          id?: string
          parsed_data?: Json | null
          total_amount?: number | null
          trip_id: string
          updated_at?: string
          uploader_id: string
        }
        Update: {
          created_at?: string
          currency?: string | null
          file_url?: string
          id?: string
          parsed_data?: Json | null
          total_amount?: number | null
          trip_id?: string
          updated_at?: string
          uploader_id?: string
        }
        Relationships: []
      }
      trip_venue_ideas: {
        Row: {
          created_at: string
          id: string
          notes: string | null
          proposed_by_avatar: string
          proposed_by_id: string
          proposed_by_name: string
          status: string
          trip_id: string
          updated_at: string
          venue_address: string | null
          venue_city: string | null
          venue_id: string
          venue_image_url: string | null
          venue_name: string
          venue_rating: number | null
        }
        Insert: {
          created_at?: string
          id?: string
          notes?: string | null
          proposed_by_avatar: string
          proposed_by_id: string
          proposed_by_name: string
          status?: string
          trip_id: string
          updated_at?: string
          venue_address?: string | null
          venue_city?: string | null
          venue_id: string
          venue_image_url?: string | null
          venue_name: string
          venue_rating?: number | null
        }
        Update: {
          created_at?: string
          id?: string
          notes?: string | null
          proposed_by_avatar?: string
          proposed_by_id?: string
          proposed_by_name?: string
          status?: string
          trip_id?: string
          updated_at?: string
          venue_address?: string | null
          venue_city?: string | null
          venue_id?: string
          venue_image_url?: string | null
          venue_name?: string
          venue_rating?: number | null
        }
        Relationships: []
      }
      trip_venue_votes: {
        Row: {
          created_at: string
          id: string
          user_avatar: string
          user_id: string
          user_name: string
          venue_idea_id: string | null
          vote_type: string
        }
        Insert: {
          created_at?: string
          id?: string
          user_avatar: string
          user_id: string
          user_name: string
          venue_idea_id?: string | null
          vote_type: string
        }
        Update: {
          created_at?: string
          id?: string
          user_avatar?: string
          user_id?: string
          user_name?: string
          venue_idea_id?: string | null
          vote_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "trip_venue_votes_venue_idea_id_fkey"
            columns: ["venue_idea_id"]
            isOneToOne: false
            referencedRelation: "trip_venue_ideas"
            referencedColumns: ["id"]
          },
        ]
      }
      user_preferences: {
        Row: {
          created_at: string
          id: string
          language: string | null
          notifications_email: boolean
          notifications_push: boolean
          notifications_sms: boolean
          theme: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          language?: string | null
          notifications_email?: boolean
          notifications_push?: boolean
          notifications_sms?: boolean
          theme?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          language?: string | null
          notifications_email?: boolean
          notifications_push?: boolean
          notifications_sms?: boolean
          theme?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_trips: {
        Row: {
          id: string
          joined_at: string
          role: string
          trip_id: string
          user_id: string
        }
        Insert: {
          id?: string
          joined_at?: string
          role?: string
          trip_id: string
          user_id: string
        }
        Update: {
          id?: string
          joined_at?: string
          role?: string
          trip_id?: string
          user_id?: string
        }
        Relationships: []
      }
      venue_audio_summaries: {
        Row: {
          audio_url: string
          duration_seconds: number | null
          file_size_bytes: number | null
          generated_at: string
          id: string
          script_text: string
          updated_at: string
          venue_id: string
        }
        Insert: {
          audio_url: string
          duration_seconds?: number | null
          file_size_bytes?: number | null
          generated_at?: string
          id?: string
          script_text: string
          updated_at?: string
          venue_id: string
        }
        Update: {
          audio_url?: string
          duration_seconds?: number | null
          file_size_bytes?: number | null
          generated_at?: string
          id?: string
          script_text?: string
          updated_at?: string
          venue_id?: string
        }
        Relationships: []
      }
      venue_sentiment_analysis: {
        Row: {
          created_at: string
          id: string
          last_analyzed_at: string
          overall_sentiment: number
          platform: string
          review_count: number | null
          sentiment_summary: string
          themes: Json | null
          updated_at: string
          venue_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          last_analyzed_at?: string
          overall_sentiment: number
          platform: string
          review_count?: number | null
          sentiment_summary: string
          themes?: Json | null
          updated_at?: string
          venue_id: string
        }
        Update: {
          created_at?: string
          id?: string
          last_analyzed_at?: string
          overall_sentiment?: number
          platform?: string
          review_count?: number | null
          sentiment_summary?: string
          themes?: Json | null
          updated_at?: string
          venue_id?: string
        }
        Relationships: []
      }
      vibe_scores: {
        Row: {
          expiration: string | null
          factors: Json | null
          id: string
          location_id: string | null
          score: number
          summary: string | null
          timestamp: string | null
        }
        Insert: {
          expiration?: string | null
          factors?: Json | null
          id?: string
          location_id?: string | null
          score: number
          summary?: string | null
          timestamp?: string | null
        }
        Update: {
          expiration?: string | null
          factors?: Json | null
          id?: string
          location_id?: string | null
          score?: number
          summary?: string | null
          timestamp?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "vibe_scores_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
        ]
      }
      vibe_signals: {
        Row: {
          id: string
          location_id: string | null
          metadata: Json | null
          signal_type: string
          source: string
          timestamp: string | null
          value: number
        }
        Insert: {
          id?: string
          location_id?: string | null
          metadata?: Json | null
          signal_type: string
          source: string
          timestamp?: string | null
          value: number
        }
        Update: {
          id?: string
          location_id?: string | null
          metadata?: Json | null
          signal_type?: string
          source?: string
          timestamp?: string | null
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "vibe_signals_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
        ]
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
      cleanup_expired_reviews: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      gtrgm_compress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gtrgm_decompress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gtrgm_in: {
        Args: { "": unknown }
        Returns: unknown
      }
      gtrgm_options: {
        Args: { "": unknown }
        Returns: undefined
      }
      gtrgm_out: {
        Args: { "": unknown }
        Returns: unknown
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
      join_trip_via_invite: {
        Args: { invite_token_param: string }
        Returns: Json
      }
      l2_norm: {
        Args: { "": unknown } | { "": unknown }
        Returns: number
      }
      l2_normalize: {
        Args: { "": string } | { "": unknown } | { "": unknown }
        Returns: string
      }
      refresh_search_index: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      set_limit: {
        Args: { "": number }
        Returns: number
      }
      show_limit: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      show_trgm: {
        Args: { "": string }
        Returns: string[]
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
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
