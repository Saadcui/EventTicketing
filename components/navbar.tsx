"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { usePathname, useRouter } from "next/navigation"
import { useState } from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { User, Ticket, LayoutDashboard, LogOut, Settings, PlusCircle, Menu, X } from "lucide-react"
import { useAuth } from "@/lib/auth-provider"
import { Skeleton } from "@/components/ui/skeleton"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export default function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, isLoading, signOut } = useAuth()
  const [isOpen, setIsOpen] = useState(false)

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
          <nav className="hidden md:flex items-center space-x-4 lg:space-x-6">
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
            <Link
              href="/dashboard"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                pathname.startsWith("/dashboard") ? "text-primary" : "text-muted-foreground"
              }`}
            >
              Dashboard
            </Link>
            <Link
              href="/tickets"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                pathname.startsWith("/tickets") ? "text-primary" : "text-muted-foreground"
              }`}
            >
              My Tickets
            </Link>
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
                      <p className="text-xs leading-none text-muted-foreground">User</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
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
                  <DropdownMenuItem asChild>
                    <Link href="/tickets" className="flex items-center">
                      <Ticket className="mr-2 h-4 w-4" />
                      <span>My Tickets</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/wallet/setup" className="flex items-center">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Wallet Setup</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => signOut()} className="flex items-center">
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
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <div className="flex flex-col h-full">
                  <div className="flex items-center justify-between border-b pb-4">
                    <Link href="/" className="flex items-center space-x-2" onClick={() => setIsOpen(false)}>
                      <Ticket className="h-5 w-5" />
                      <span className="font-bold text-xl">BlockTix</span>
                    </Link>
                    <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                      <X className="h-5 w-5" />
                      <span className="sr-only">Close menu</span>
                    </Button>
                  </div>
                  <nav className="flex flex-col gap-4 py-4">
                    <Link
                      href="/"
                      className={`text-sm font-medium transition-colors hover:text-primary ${
                        isActive("/") ? "text-primary" : "text-muted-foreground"
                      }`}
                      onClick={() => setIsOpen(false)}
                    >
                      Home
                    </Link>
                    <Link
                      href="/discover"
                      className={`text-sm font-medium transition-colors hover:text-primary ${
                        isActive("/discover") ? "text-primary" : "text-muted-foreground"
                      }`}
                      onClick={() => setIsOpen(false)}
                    >
                      Discover
                    </Link>
                    <Link
                      href="/dashboard"
                      className={`text-sm font-medium transition-colors hover:text-primary ${
                        pathname.startsWith("/dashboard") ? "text-primary" : "text-muted-foreground"
                      }`}
                      onClick={() => setIsOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <Link
                      href="/tickets"
                      className={`text-sm font-medium transition-colors hover:text-primary ${
                        pathname.startsWith("/tickets") ? "text-primary" : "text-muted-foreground"
                      }`}
                      onClick={() => setIsOpen(false)}
                    >
                      My Tickets
                    </Link>
                  </nav>
                  <div className="mt-auto border-t pt-4">
                    {isLoading ? (
                      <div className="flex flex-col gap-2">
                        <Skeleton className="h-9 w-full" />
                        <Skeleton className="h-9 w-full" />
                      </div>
                    ) : user ? (
                      <div className="flex flex-col gap-2">
                        <Button variant="ghost" className="justify-start" asChild>
                          <Link href="/dashboard" onClick={() => setIsOpen(false)}>
                            <LayoutDashboard className="mr-2 h-4 w-4" />
                            Dashboard
                          </Link>
                        </Button>
                        <Button variant="ghost" className="justify-start" asChild>
                          <Link href="/tickets" onClick={() => setIsOpen(false)}>
                            <Ticket className="mr-2 h-4 w-4" />
                            My Tickets
                          </Link>
                        </Button>
                        <Button variant="ghost" className="justify-start" asChild>
                          <Link href="/wallet/setup" onClick={() => setIsOpen(false)}>
                            <Settings className="mr-2 h-4 w-4" />
                            Wallet Setup
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          className="justify-start"
                          onClick={() => {
                            signOut()
                            setIsOpen(false)
                          }}
                        >
                          <LogOut className="mr-2 h-4 w-4" />
                          Logout
                        </Button>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-2">
                        <Button variant="outline" asChild className="w-full">
                          <Link href="/auth/login" onClick={() => setIsOpen(false)}>
                            Login
                          </Link>
                        </Button>
                        <Button asChild className="w-full">
                          <Link href="/auth/register" onClick={() => setIsOpen(false)}>
                            Sign Up
                          </Link>
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}
