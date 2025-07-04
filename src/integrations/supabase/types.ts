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
      cleanup_expired_reviews: {
        Args: Record<PropertyKey, never>
        Returns: undefined
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
