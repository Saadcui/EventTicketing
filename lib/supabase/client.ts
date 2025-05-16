"use client"

import { createBrowserClient } from "@supabase/ssr"
import type { SupabaseClient } from "@supabase/supabase-js"
import type { Database } from "./database.types"

// Create a singleton instance to prevent multiple client instances
let supabaseClient: SupabaseClient<Database> | null = null

export function createClient() {
  if (!supabaseClient) {
    // Make sure we have the environment variables
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
      console.error("Missing Supabase environment variables")
      throw new Error("Missing Supabase environment variables")
    }

    supabaseClient = createBrowserClient<Database>(supabaseUrl, supabaseAnonKey)
  }
  return supabaseClient
}
