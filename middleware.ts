import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  // Check if the user is authenticated
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Get the pathname from the URL
  const path = req.nextUrl.pathname

  // Define protected routes and their required roles
  const adminRoutes = ["/admin", "/admin/users", "/admin/memories"]
  const authRoutes = ["/dashboard", "/scheduled", "/results", "/export", "/team", "/shared", "/proxies", "/settings"]

  // Check if the path is an admin route
  if (adminRoutes.some((route) => path.startsWith(route))) {
    // If not authenticated, redirect to sign in
    if (!session) {
      return NextResponse.redirect(new URL("/auth/sign-in", req.url))
    }

    // Check if the user has admin role
    const { data: profile } = await supabase.from("profiles").select("role").eq("id", session.user.id).single()

    if (!profile || profile.role !== "admin") {
      // Redirect non-admin users to the dashboard
      return NextResponse.redirect(new URL("/dashboard", req.url))
    }
  }

  // Check if the path is a protected route
  else if (authRoutes.some((route) => path.startsWith(route))) {
    // If not authenticated, redirect to sign in
    if (!session) {
      return NextResponse.redirect(new URL("/auth/sign-in", req.url))
    }
  }

  // Check if the user is trying to access auth pages while already logged in
  else if ((path.startsWith("/auth/sign-in") || path.startsWith("/auth/sign-up")) && session) {
    // Redirect authenticated users to the dashboard
    return NextResponse.redirect(new URL("/dashboard", req.url))
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
