import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { createServerClient } from "@supabase/ssr"

export async function GET() {
  try {
    const cookieStore = cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name) {
            return cookieStore.get(name)?.value
          },
          set(name, value, options) {
            cookieStore.set({ name, value, ...options })
          },
          remove(name, options) {
            cookieStore.set({ name, value: "", ...options })
          },
        },
      },
    )

    const {
      data: { session },
      error,
    } = await supabase.auth.getSession()

    if (error) {
      console.error("Error getting session:", error)
      return NextResponse.json(
        {
          authenticated: false,
          error: error.message,
        },
        { status: 500 },
      )
    }

    if (!session) {
      return NextResponse.json({
        authenticated: false,
        message: "No active session",
      })
    }

    // Get user profile
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", session.user.id)
      .single()

    if (profileError) {
      console.error("Error getting profile:", profileError)
    }

    return NextResponse.json({
      authenticated: true,
      user: {
        id: session.user.id,
        email: session.user.email,
        role: profile?.role || "user",
      },
      sessionExpires: session.expires_at,
    })
  } catch (error) {
    console.error("Unexpected error in auth status route:", error)
    return NextResponse.json(
      {
        authenticated: false,
        error: "An unexpected error occurred",
      },
      { status: 500 },
    )
  }
}
