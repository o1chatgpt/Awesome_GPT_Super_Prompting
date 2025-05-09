import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()

  // Create a Supabase client configured to use cookies
  const supabase = createMiddlewareClient({ req, res })

  // Refresh session if expired - required for Server Components
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Get the pathname from the URL
  const path = req.nextUrl.pathname

  // Define protected routes and their required roles
  const adminRoutes = ["/admin", "/admin/users", "/admin/memories"]
  const authRoutes = ["/dashboard", "/scheduled", "/results", "/export", "/team", "/shared", "/proxies", "/settings"]

  console.log("Middleware checking path:", path, "Session exists:", !!session)

  // Check if the path is an admin route
  if (adminRoutes.some((route) => path.startsWith(route))) {
    // If not authenticated, redirect to sign in
    if (!session) {
      console.log("No session, redirecting to sign-in from admin route")
      return NextResponse.redirect(new URL("/auth/sign-in", req.url))
    }

    // Check if the user has admin role
    const { data: profile } = await supabase.from("profiles").select("role").eq("id", session.user.id).single()

    if (!profile || profile.role !== "admin") {
      console.log("User is not admin, redirecting to dashboard")
      // Redirect non-admin users to the dashboard
      return NextResponse.redirect(new URL("/dashboard", req.url))
    }
  }

  // Check if the path is a protected route
  else if (authRoutes.some((route) => path.startsWith(route))) {
    // If not authenticated, redirect to sign in
    if (!session) {
      console.log("No session, redirecting to sign-in from protected route")
      return NextResponse.redirect(new URL("/auth/sign-in", req.url))
    }
  }

  // Check if the user is trying to access auth pages while already logged in
  else if (path.startsWith("/auth/sign-in") || path.startsWith("/auth/register")) {
    if (session) {
      console.log("User already authenticated, redirecting to dashboard")
      // Redirect authenticated users to the dashboard
      return NextResponse.redirect(new URL("/dashboard", req.url))
    }
  }

  return res
}

// Only run middleware on specific paths
export const config = {
  matcher: [
    "/admin/:path*",
    "/dashboard/:path*",
    "/scheduled/:path*",
    "/results/:path*",
    "/export/:path*",
    "/team/:path*",
    "/shared/:path*",
    "/proxies/:path*",
    "/settings/:path*",
    "/auth/sign-in",
    "/auth/sign-up",
  ],
}
