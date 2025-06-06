export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          full_name: string | null
          avatar_url: string | null
          wallet_address: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          full_name?: string | null
          avatar_url?: string | null
          wallet_address?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string | null
          avatar_url?: string | null
          wallet_address?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      events: {
        Row: {
          id: string
          title: string
          description: string | null
          image_url: string | null
          date: string
          time: string | null
          location: string
          address: string | null
          organizer_id: string
          category: string | null
          status: "draft" | "on_sale" | "upcoming" | "completed" | "canceled"
          total_capacity: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          image_url?: string | null
          date: string
          time?: string | null
          location: string
          address?: string | null
          organizer_id: string
          category?: string | null
          status?: "draft" | "on_sale" | "upcoming" | "completed" | "canceled"
          total_capacity?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          image_url?: string | null
          date?: string
          time?: string | null
          location?: string
          address?: string | null
          organizer_id?: string
          category?: string | null
          status?: "draft" | "on_sale" | "upcoming" | "completed" | "canceled"
          total_capacity?: number
          created_at?: string
          updated_at?: string
        }
      }
      ticket_types: {
        Row: {
          id: string
          event_id: string
          name: string
          description: string | null
          price: number
          quantity: number
          max_per_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          event_id: string
          name: string
          description?: string | null
          price: number
          quantity: number
          max_per_order?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          event_id?: string
          name?: string
          description?: string | null
          price?: number
          quantity?: number
          max_per_order?: number
          created_at?: string
          updated_at?: string
        }
      }
      tickets: {
        Row: {
          id: string
          ticket_type_id: string
          event_id: string
          user_id: string
          status: "active" | "used" | "transferred" | "refunded"
          blockchain_token_id: string | null
          purchase_date: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          ticket_type_id: string
          event_id: string
          user_id: string
          status?: "active" | "used" | "transferred" | "refunded"
          blockchain_token_id?: string | null
          purchase_date?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          ticket_type_id?: string
          event_id?: string
          user_id?: string
          status?: "active" | "used" | "transferred" | "refunded"
          blockchain_token_id?: string | null
          purchase_date?: string
          created_at?: string
          updated_at?: string
        }
      }
      wallet: {
        Row: {
          id: string
          user_id: string
          address: string | null
          balance: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          address?: string | null
          balance?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          address?: string | null
          balance?: number
          created_at?: string
          updated_at?: string
        }
      }
      favorites: {
        Row: {
          id: string
          user_id: string
          event_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          event_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          event_id?: string
          created_at?: string
        }
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
  }
}
