"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useRouter } from "next/navigation"
import type { User } from "@supabase/supabase-js"
import type { Database } from "./supabase/database.types"

type AuthContextType = {
  user: User | null
  loading: boolean
  signOut: () => Promise<void>
  refreshSession: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signOut: async () => {},
  refreshSession: async () => {},
})

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClientComponentClient<Database>()

  // Function to refresh the session
  const refreshSession = async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      setUser(session?.user || null)
    } catch (error) {
      console.error("Error refreshing session:", error)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  // Sign out function
  const signOut = async () => {
    try {
      setLoading(true)
      await supabase.auth.signOut()
      setUser(null)
      router.refresh() // Refresh the page to update UI
    } catch (error) {
      console.error("Error signing out:", error)
    } finally {
      setLoading(false)
    }
  }

  // Initial session check and auth state change listener
  useEffect(() => {
    // Check for existing session
    const initializeAuth = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession()
        setUser(session?.user || null)
      } catch (error) {
        console.error("Error getting session:", error)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    initializeAuth()

    // Set up auth state change listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null)

      // Refresh the router to update UI based on auth state
      if (event === "SIGNED_IN" || event === "SIGNED_OUT") {
        router.refresh()
      }
    })

    // Clean up subscription on unmount
    return () => {
      subscription.unsubscribe()
    }
  }, [router, supabase])

  return <AuthContext.Provider value={{ user, loading, signOut, refreshSession }}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
