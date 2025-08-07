export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      events: {
        Row: {
          id: string
          created_at: string
          title: string
          description: string
          location: string
          date: string
          image_url: string
          organizer_id: string
          category: string
          price: number
          capacity: number
          is_published: boolean
        }
        Insert: {
          id?: string
          created_at?: string
          title: string
          description: string
          location: string
          date: string
          image_url?: string
          organizer_id: string
          category: string
          price: number
          capacity: number
          is_published?: boolean
        }
        Update: {
          id?: string
          created_at?: string
          title?: string
          description?: string
          location?: string
          date?: string
          image_url?: string
          organizer_id?: string
          category?: string
          price?: number
          capacity?: number
          is_published?: boolean
        }
      }
      profiles: {
        Row: {
          id: string
          created_at: string
          username: string
          full_name: string
          avatar_url: string
          role: string
          wallet_address: string | null
        }
        Insert: {
          id: string
          created_at?: string
          username: string
          full_name: string
          avatar_url?: string
          role?: string
          wallet_address?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          username?: string
          full_name?: string
          avatar_url?: string
          role?: string
          wallet_address?: string | null
        }
      }
      tickets: {
        Row: {
          id: string
          created_at: string
          event_id: string
          user_id: string
          ticket_type: string
          price: number
          is_used: boolean
          purchase_date: string
          token_id: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          event_id: string
          user_id: string
          ticket_type: string
          price: number
          is_used?: boolean
          purchase_date?: string
          token_id?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          event_id?: string
          user_id?: string
          ticket_type?: string
          price?: number
          is_used?: boolean
          purchase_date?: string
          token_id?: string | null
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
