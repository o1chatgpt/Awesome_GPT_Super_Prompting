import { NextResponse } from "next/server"
import { supabase } from "@/lib/database"

export async function GET() {
  try {
    const { data, error } = await supabase.auth.getSession()

    if (error) {
      console.error("Error getting session:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    if (!data.session) {
      return NextResponse.json({ authenticated: false }, { status: 200 })
    }

    // Get user profile
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", data.session.user.id)
      .single()

    if (profileError) {
      console.error("Error getting profile:", profileError)
    }

    return NextResponse.json(
      {
        authenticated: true,
        user: {
          id: data.session.user.id,
          email: data.session.user.email,
          profile: profile || null,
        },
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Unexpected error in auth status:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
