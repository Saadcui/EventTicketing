import { createServerClient as createSSRClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import type { SupabaseClient } from "@supabase/supabase-js"
import type { Database } from "../supabase/database.types"

// Export the createServerClient function directly
export function createServerClient(): SupabaseClient<Database> {
  const cookieStore = cookies()

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Missing Supabase environment variables")
  }

  return createSSRClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name) {
        return cookieStore.get(name)?.value
      },
      set(name, value, options) {
        try {
          cookieStore.set({ name, value, ...options })
        } catch (error) {
          // Handle cookie setting errors
          console.error("Error setting cookie:", error)
        }
      },
      remove(name, options) {
        try {
          cookieStore.set({ name, value: "", ...options })
        } catch (error) {
          // Handle cookie removal errors
          console.error("Error removing cookie:", error)
        }
      },
    },
  })
}

// Add these functions for backward compatibility with existing code
export const createServerSupabaseClient = createServerClient
export const createActionClient = createServerClient
