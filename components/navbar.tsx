"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { usePathname, useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { User, Ticket, LayoutDashboard, LogOut, Settings, PlusCircle } from "lucide-react"

export default function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [userRole, setUserRole] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function getUser() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()
        setUser(user)

        if (user) {
          // Get user role
          const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()

          setUserRole(profile?.role || null)
        }
      } catch (error) {
        console.error("Error getting user:", error)
      } finally {
        setIsLoading(false)
      }
    }

    getUser()

    // Set up auth state change listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null)

      if (session?.user) {
        // Get user role
        supabase
          .from("profiles")
          .select("role")
          .eq("id", session.user.id)
          .single()
          .then(({ data }) => {
            setUserRole(data?.role || null)
          })
      } else {
        setUserRole(null)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push("/")
    router.refresh()
  }

  const isActive = (path: string) => pathname === path

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex">
          <Link href="/" className="flex items-center space-x-2">
            <Ticket className="h-5 w-5" />
            <span className="font-bold text-xl">BlockTix</span>
          </Link>
        </div>
        <div className="flex items-center justify-between flex-1">
          <nav className="flex items-center space-x-4 lg:space-x-6">
            <Link
              href="/"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive("/") ? "text-primary" : "text-muted-foreground"
              }`}
            >
              Home
            </Link>
            <Link
              href="/discover"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive("/discover") ? "text-primary" : "text-muted-foreground"
              }`}
            >
              Discover
            </Link>
            {userRole === "organizer" && (
              <Link
                href="/dashboard"
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  pathname.startsWith("/dashboard") ? "text-primary" : "text-muted-foreground"
                }`}
              >
                Dashboard
              </Link>
            )}
            {user && (
              <Link
                href="/tickets"
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  pathname.startsWith("/tickets") ? "text-primary" : "text-muted-foreground"
                }`}
              >
                My Tickets
              </Link>
            )}
          </nav>
          <div className="flex items-center space-x-4">
            <ModeToggle />
            {isLoading ? (
              <div className="h-9 w-20 animate-pulse rounded-md bg-muted"></div>
            ) : user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.email}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {userRole === "organizer" ? "Event Organizer" : "Attendee"}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {userRole === "organizer" && (
                    <>
                      <DropdownMenuItem asChild>
                        <Link href="/dashboard" className="flex items-center">
                          <LayoutDashboard className="mr-2 h-4 w-4" />
                          <span>Dashboard</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/create" className="flex items-center">
                          <PlusCircle className="mr-2 h-4 w-4" />
                          <span>Create Event</span>
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuItem asChild>
                    <Link href="/tickets" className="flex items-center">
                      <Ticket className="mr-2 h-4 w-4" />
                      <span>My Tickets</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/settings" className="flex items-center">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="flex items-center">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button asChild variant="default" size="sm">
                <Link href="/auth/login">Sign In</Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
