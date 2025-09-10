// Generated types for Supabase database schema
// This file should be updated when the database schema changes

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
      wineries: {
        Row: {
          id: string
          name: string
          domain: string | null
          klaviyo_account_id: string | null
          klaviyo_private_key: string | null
          klaviyo_public_key: string | null
          klaviyo_webhook_secret: string | null
          anthropic_api_key: string | null
          timezone: string
          currency: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          domain?: string | null
          klaviyo_account_id?: string | null
          klaviyo_private_key?: string | null
          klaviyo_public_key?: string | null
          klaviyo_webhook_secret?: string | null
          anthropic_api_key?: string | null
          timezone?: string
          currency?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          domain?: string | null
          klaviyo_account_id?: string | null
          klaviyo_private_key?: string | null
          klaviyo_public_key?: string | null
          klaviyo_webhook_secret?: string | null
          anthropic_api_key?: string | null
          timezone?: string
          currency?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          role: Database['public']['Enums']['user_role']
          winery_id: string | null
          preferences: Json
          last_login: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          role?: Database['public']['Enums']['user_role']
          winery_id?: string | null
          preferences?: Json
          last_login?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          role?: Database['public']['Enums']['user_role']
          winery_id?: string | null
          preferences?: Json
          last_login?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_winery_id_fkey"
            columns: ["winery_id"]
            isOneToOne: false
            referencedRelation: "wineries"
            referencedColumns: ["id"]
          }
        ]
      }
      query_logs: {
        Row: {
          id: string
          user_id: string
          winery_id: string
          query: string
          response: string | null
          query_type: string | null
          metrics_used: Json | null
          response_time_ms: number | null
          tokens_used: number | null
          model_used: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          winery_id: string
          query: string
          response?: string | null
          query_type?: string | null
          metrics_used?: Json | null
          response_time_ms?: number | null
          tokens_used?: number | null
          model_used?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          winery_id?: string
          query?: string
          response?: string | null
          query_type?: string | null
          metrics_used?: Json | null
          response_time_ms?: number | null
          tokens_used?: number | null
          model_used?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "query_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "query_logs_winery_id_fkey"
            columns: ["winery_id"]
            isOneToOne: false
            referencedRelation: "wineries"
            referencedColumns: ["id"]
          }
        ]
      }
      saved_reports: {
        Row: {
          id: string
          user_id: string
          winery_id: string
          title: string
          description: string | null
          report_type: string | null
          data: Json
          filters: Json | null
          is_public: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          winery_id: string
          title: string
          description?: string | null
          report_type?: string | null
          data: Json
          filters?: Json | null
          is_public?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          winery_id?: string
          title?: string
          description?: string | null
          report_type?: string | null
          data?: Json
          filters?: Json | null
          is_public?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "saved_reports_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "saved_reports_winery_id_fkey"
            columns: ["winery_id"]
            isOneToOne: false
            referencedRelation: "wineries"
            referencedColumns: ["id"]
          }
        ]
      }
      user_preferences: {
        Row: {
          id: string
          user_id: string
          winery_id: string
          preferences: Json
          dashboard_layout: Json | null
          notification_settings: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          winery_id: string
          preferences?: Json
          dashboard_layout?: Json | null
          notification_settings?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          winery_id?: string
          preferences?: Json
          dashboard_layout?: Json | null
          notification_settings?: Json | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_preferences_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_preferences_winery_id_fkey"
            columns: ["winery_id"]
            isOneToOne: false
            referencedRelation: "wineries"
            referencedColumns: ["id"]
          }
        ]
      }
      campaign_analytics: {
        Row: {
          id: string
          winery_id: string
          klaviyo_campaign_id: string
          campaign_name: string | null
          campaign_type: string | null
          status: Database['public']['Enums']['campaign_status'] | null
          sent_count: number
          delivered_count: number
          opened_count: number
          clicked_count: number
          unsubscribed_count: number
          bounced_count: number
          revenue: number
          open_rate: number
          click_rate: number
          unsubscribe_rate: number
          bounce_rate: number
          revenue_per_email: number
          sent_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          winery_id: string
          klaviyo_campaign_id: string
          campaign_name?: string | null
          campaign_type?: string | null
          status?: Database['public']['Enums']['campaign_status'] | null
          sent_count?: number
          delivered_count?: number
          opened_count?: number
          clicked_count?: number
          unsubscribed_count?: number
          bounced_count?: number
          revenue?: number
          open_rate?: number
          click_rate?: number
          unsubscribe_rate?: number
          bounce_rate?: number
          revenue_per_email?: number
          sent_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          winery_id?: string
          klaviyo_campaign_id?: string
          campaign_name?: string | null
          campaign_type?: string | null
          status?: Database['public']['Enums']['campaign_status'] | null
          sent_count?: number
          delivered_count?: number
          opened_count?: number
          clicked_count?: number
          unsubscribed_count?: number
          bounced_count?: number
          revenue?: number
          open_rate?: number
          click_rate?: number
          unsubscribe_rate?: number
          bounce_rate?: number
          revenue_per_email?: number
          sent_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "campaign_analytics_winery_id_fkey"
            columns: ["winery_id"]
            isOneToOne: false
            referencedRelation: "wineries"
            referencedColumns: ["id"]
          }
        ]
      }
      flow_analytics: {
        Row: {
          id: string
          winery_id: string
          klaviyo_flow_id: string
          flow_name: string | null
          flow_type: string | null
          status: Database['public']['Enums']['flow_status'] | null
          enrolled_count: number
          completed_count: number
          conversion_rate: number
          revenue: number
          avg_time_to_complete: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          winery_id: string
          klaviyo_flow_id: string
          flow_name?: string | null
          flow_type?: string | null
          status?: Database['public']['Enums']['flow_status'] | null
          enrolled_count?: number
          completed_count?: number
          conversion_rate?: number
          revenue?: number
          avg_time_to_complete?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          winery_id?: string
          klaviyo_flow_id?: string
          flow_name?: string | null
          flow_type?: string | null
          status?: Database['public']['Enums']['flow_status'] | null
          enrolled_count?: number
          completed_count?: number
          conversion_rate?: number
          revenue?: number
          avg_time_to_complete?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "flow_analytics_winery_id_fkey"
            columns: ["winery_id"]
            isOneToOne: false
            referencedRelation: "wineries"
            referencedColumns: ["id"]
          }
        ]
      }
      segment_analytics: {
        Row: {
          id: string
          winery_id: string
          klaviyo_segment_id: string
          segment_name: string | null
          segment_type: Database['public']['Enums']['segment_type'] | null
          size: number
          growth_rate: number
          engagement_score: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          winery_id: string
          klaviyo_segment_id: string
          segment_name?: string | null
          segment_type?: Database['public']['Enums']['segment_type'] | null
          size?: number
          growth_rate?: number
          engagement_score?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          winery_id?: string
          klaviyo_segment_id?: string
          segment_name?: string | null
          segment_type?: Database['public']['Enums']['segment_type'] | null
          size?: number
          growth_rate?: number
          engagement_score?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "segment_analytics_winery_id_fkey"
            columns: ["winery_id"]
            isOneToOne: false
            referencedRelation: "wineries"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_role: "admin" | "manager" | "analyst" | "viewer"
      campaign_status: "draft" | "scheduled" | "sending" | "sent" | "paused" | "cancelled"
      flow_status: "draft" | "active" | "paused" | "stopped"
      segment_type: "static" | "dynamic" | "smart"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type DatabaseRow<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = Tables<PublicTableNameOrOptions, TableName>

export type DatabaseInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = TablesInsert<PublicTableNameOrOptions, TableName>

export type DatabaseUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = TablesUpdate<PublicTableNameOrOptions, TableName>

export type DatabaseEnum<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = Enums<PublicEnumNameOrOptions, EnumName>
