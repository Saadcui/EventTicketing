import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Create a list of protected routes that require authentication
  const protectedRoutes = ["/dashboard", "/analytics", "/create", "/tickets", "/wallet/setup", "/admin"]

  // Check if the current path is in the protected routes list
  const isProtectedRoute = protectedRoutes.some((route) => req.nextUrl.pathname.startsWith(route))

  // If accessing a protected route without a session, redirect to login
  if (isProtectedRoute && !session) {
    const redirectUrl = new URL("/auth/login", req.url)
    redirectUrl.searchParams.set("redirectedFrom", req.nextUrl.pathname)
    return NextResponse.redirect(redirectUrl)
  }

  // If already logged in and trying to access login/register pages, redirect to dashboard
  if (
    session &&
    (req.nextUrl.pathname.startsWith("/auth/login") || req.nextUrl.pathname.startsWith("/auth/register"))
  ) {
    return NextResponse.redirect(new URL("/dashboard", req.url))
  }

  return res
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - public files
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
