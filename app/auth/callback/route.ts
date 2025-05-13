import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const requestUrl = new URL(request.url)
    const code = requestUrl.searchParams.get("code")
    const error = requestUrl.searchParams.get("error")
    const error_description = requestUrl.searchParams.get("error_description")

    // If there's an error, redirect back to the sign-in page with the error
    if (error || error_description) {
      console.error("Auth callback error:", { error, error_description })
      return NextResponse.redirect(
        `${requestUrl.origin}/auth/sign-in?error=${error}&error_description=${encodeURIComponent(error_description || "Authentication failed")}`,
      )
    }

    // If there's no code, redirect back to the sign-in page
    if (!code) {
      console.error("No code provided in auth callback")
      return NextResponse.redirect(
        `${requestUrl.origin}/auth/sign-in?error=no_code&error_description=${encodeURIComponent("No code provided")}`,
      )
    }

    // Exchange the code for a session
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

    console.log("Exchanging code for session...")
    await supabase.auth.exchangeCodeForSession(code)
    console.log("Session exchange successful")

    // Redirect to the dashboard
    return NextResponse.redirect(`${requestUrl.origin}/dashboard`)
  } catch (error) {
    console.error("Error in auth callback:", error)
    const requestUrl = new URL(request.url)
    return NextResponse.redirect(
      `${requestUrl.origin}/auth/sign-in?error=exchange_failed&error_description=${encodeURIComponent("Failed to complete authentication")}`,
    )
  }
}
