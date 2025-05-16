"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter, usePathname } from "next/navigation"

// Protected routes that require authentication
export const PROTECTED_ROUTES = ["/dashboard", "/tickets", "/wallet", "/settings", "/analytics"]

// Types
interface User {
  id: string
  name: string
  email: string
  role: "user" | "organizer" | "admin"
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  loginWithWallet: (walletId: string) => Promise<void>
  logout: () => void
  isAuthenticated: boolean
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Mock user data
const MOCK_USER: User = {
  id: "user-1",
  name: "John Doe",
  email: "john@example.com",
  role: "organizer",
}

// Provider component
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  // Check if user is authenticated on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    } else {
      // For testing purposes, always set a mock user
      setUser(MOCK_USER)
      localStorage.setItem("user", JSON.stringify(MOCK_USER))
    }
    setIsLoading(false)
  }, [])

  // Check if current route requires authentication
  useEffect(() => {
    if (!isLoading && !user) {
      const isProtectedRoute = PROTECTED_ROUTES.some((route) => pathname?.startsWith(route))
      if (isProtectedRoute) {
        router.push(`/auth/login?redirect=${encodeURIComponent(pathname || "/")}`)
      }
    }
  }, [pathname, user, isLoading, router])

  // Login function
  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      // Always set the mock user for testing
      setUser(MOCK_USER)
      localStorage.setItem("user", JSON.stringify(MOCK_USER))

      // Get redirect URL from query params or default to dashboard
      const params = new URLSearchParams(window.location.search)
      const redirectUrl = params.get("redirect") || "/dashboard"
      router.push(redirectUrl)
    } catch (error) {
      console.error("Login failed:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  // Login with wallet function
  const loginWithWallet = async (walletId: string) => {
    setIsLoading(true)
    try {
      // In a real app, this would be an API call to verify the wallet
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Mock successful login
      setUser(MOCK_USER)
      localStorage.setItem("user", JSON.stringify(MOCK_USER))

      // Get redirect URL from query params or default to dashboard
      const params = new URLSearchParams(window.location.search)
      const redirectUrl = params.get("redirect") || "/dashboard"
      router.push(redirectUrl)
    } catch (error) {
      console.error("Wallet login failed:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  // Logout function
  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
    router.push("/")
  }

  const value = {
    user,
    isLoading,
    login,
    loginWithWallet,
    logout,
    isAuthenticated: !!user,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// Hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
