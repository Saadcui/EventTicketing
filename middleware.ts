import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Simplify the middleware to allow access to all pages for testing
export async function middleware(req: NextRequest) {
  try {
    const res = NextResponse.next()

    // For testing purposes, we'll skip the authentication check
    // and allow access to all pages
    return res
  } catch (error) {
    console.error("Middleware error:", error)
    // If there's an error, still allow the request to continue
    return NextResponse.next()
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     * - auth/callback (auth callback route)
     */
    "/((?!_next/static|_next/image|favicon.ico|public|auth/callback).*)",
  ],
}
