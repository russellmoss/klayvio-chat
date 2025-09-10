export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          role: 'admin' | 'manager' | 'user'
          winery_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          role?: 'admin' | 'manager' | 'user'
          winery_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          role?: 'admin' | 'manager' | 'user'
          winery_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_winery_id_fkey"
            columns: ["winery_id"]
            referencedRelation: "wineries"
            referencedColumns: ["id"]
          }
        ]
      }
      wineries: {
        Row: {
          id: string
          name: string
          description: string | null
          website: string | null
          address: Json | null
          contact_email: string | null
          contact_phone: string | null
          klaviyo_account_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          website?: string | null
          address?: Json | null
          contact_email?: string | null
          contact_phone?: string | null
          klaviyo_account_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          website?: string | null
          address?: Json | null
          contact_email?: string | null
          contact_phone?: string | null
          klaviyo_account_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      query_logs: {
        Row: {
          id: string
          user_id: string
          query: string
          query_type: string
          response_data: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          query: string
          query_type: string
          response_data?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          query?: string
          query_type?: string
          response_data?: Json | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "query_logs_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      saved_reports: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string | null
          report_data: Json
          report_type: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          description?: string | null
          report_data: Json
          report_type: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          description?: string | null
          report_data?: Json
          report_type?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "saved_reports_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      user_preferences: {
        Row: {
          id: string
          user_id: string
          preferences: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          preferences: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          preferences?: Json
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_preferences_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      campaign_analytics: {
        Row: {
          id: string
          winery_id: string
          campaign_id: string
          campaign_name: string
          metrics: Json
          date: string
          created_at: string
        }
        Insert: {
          id?: string
          winery_id: string
          campaign_id: string
          campaign_name: string
          metrics: Json
          date: string
          created_at?: string
        }
        Update: {
          id?: string
          winery_id?: string
          campaign_id?: string
          campaign_name?: string
          metrics?: Json
          date?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "campaign_analytics_winery_id_fkey"
            columns: ["winery_id"]
            referencedRelation: "wineries"
            referencedColumns: ["id"]
          }
        ]
      }
      flow_analytics: {
        Row: {
          id: string
          winery_id: string
          flow_id: string
          flow_name: string
          metrics: Json
          date: string
          created_at: string
        }
        Insert: {
          id?: string
          winery_id: string
          flow_id: string
          flow_name: string
          metrics: Json
          date: string
          created_at?: string
        }
        Update: {
          id?: string
          winery_id?: string
          flow_id?: string
          flow_name?: string
          metrics?: Json
          date?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "flow_analytics_winery_id_fkey"
            columns: ["winery_id"]
            referencedRelation: "wineries"
            referencedColumns: ["id"]
          }
        ]
      }
      segment_analytics: {
        Row: {
          id: string
          winery_id: string
          segment_id: string
          segment_name: string
          metrics: Json
          date: string
          created_at: string
        }
        Insert: {
          id?: string
          winery_id: string
          segment_id: string
          segment_name: string
          metrics: Json
          date: string
          created_at?: string
        }
        Update: {
          id?: string
          winery_id?: string
          segment_id?: string
          segment_name?: string
          metrics?: Json
          date?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "segment_analytics_winery_id_fkey"
            columns: ["winery_id"]
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
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
