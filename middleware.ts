import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Get the path of the request
  const path = request.nextUrl.pathname

  // Define public paths that don't require authentication
  const isPublicPath = 
    path === "/" || 
    path === "/api/auth/telegram" || 
    path.startsWith("/api/auth/telegram") ||
    path === "/api/auth/session" // Explicitly add session route

  // Get the session cookie
  const sessionCookie = request.cookies.get("user_session")?.value

  // If the path is the session route, always allow it
  if (path === "/api/auth/session") {
    return NextResponse.next()
  }

  // If the path is not public and there's no session cookie, redirect to the login page
  if (!isPublicPath && !sessionCookie) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  // If the path is public and there's a session cookie, redirect to the dashboard
  if (
    isPublicPath && 
    sessionCookie && 
    path !== "/api/auth/telegram" && 
    !path.startsWith("/api/auth/telegram")
  ) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return NextResponse.next()
}

// Configure the middleware to run on specific paths
export const config = {
  matcher: [
    "/", 
    "/dashboard/:path*", 
    "/api/:path*"
  ],
}