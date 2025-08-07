"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useRouter } from "next/navigation"
import type { User } from "@supabase/auth-helpers-nextjs"
import type { Database } from "@/lib/supabase/database.types"

type Profile = Database["public"]["Tables"]["profiles"]["Row"]

type AuthContextType = {
  user: User | null
  profile: Profile | null
  isLoading: boolean
  signOut: () => Promise<void>
  refreshSession: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  isLoading: true,
  signOut: async () => {},
  refreshSession: async () => {},
})

export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const supabase = createClientComponentClient<Database>()

  const refreshSession = async () => {
    try {
      setIsLoading(true)
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (session) {
        const {
          data: { user },
        } = await supabase.auth.getUser()
        setUser(user)

        if (user) {
          const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

          setProfile(profile)
        }
      } else {
        setUser(null)
        setProfile(null)
      }
    } catch (error) {
      console.error("Error refreshing session:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    refreshSession()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setUser(session.user)
        refreshSession()
      } else {
        setUser(null)
        setProfile(null)
        setIsLoading(false)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const signOut = async () => {
    try {
      await supabase.auth.signOut()
      setUser(null)
      setProfile(null)
      router.refresh()
      router.push("/")
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  return (
    <AuthContext.Provider value={{ user, profile, isLoading, signOut, refreshSession }}>
      {children}
    </AuthContext.Provider>
  )
}
