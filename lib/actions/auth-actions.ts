"use server"

import { cookies } from "next/headers"
import { createServerClient } from "@supabase/ssr"
import { redirect } from "next/navigation"

// Helper function to create a Supabase server client
function getSupabaseServer() {
  const cookieStore = cookies()
  return createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
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
  })
}

// Sign in with email and password
export async function signInWithEmail(formData: FormData) {
  try {
    const email = formData.get("email") as string
    const password = formData.get("password") as string
    const rememberMe = formData.get("rememberMe") === "on"

    if (!email || !password) {
      return { error: "Email and password are required", data: null }
    }

    const supabase = getSupabaseServer()

    // Sign in with email and password - wrap in try/catch to handle potential JSON parsing errors
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      // If there's an error, return it
      if (error) {
        console.error("Server-side auth error:", error)
        return {
          error: error.message || "Authentication failed",
          data: null,
          status: error.status,
        }
      }

      // If successful, return the user data
      return {
        error: null,
        data: {
          user: data.user,
          session: {
            expires_at: data.session?.expires_at,
          },
        },
      }
    } catch (supabaseError: any) {
      console.error("Supabase client error:", supabaseError)

      // Check if the error is related to JSON parsing
      const errorMessage = supabaseError.message || "Authentication failed"
      const isJsonError = errorMessage.includes("JSON") || errorMessage.includes("Unexpected token")

      if (isJsonError) {
        return {
          error: "Authentication service returned an invalid response. Please try again later.",
          data: null,
          debug: errorMessage,
        }
      }

      return {
        error: errorMessage,
        data: null,
        debug: supabaseError.toString(),
      }
    }
  } catch (error: any) {
    console.error("Unexpected server-side auth error:", error)
    return {
      error: "An unexpected error occurred",
      data: null,
      debug: error.toString(),
    }
  }
}

// Sign out
export async function signOut() {
  const supabase = getSupabaseServer()
  await supabase.auth.signOut()
  redirect("/auth/sign-in")
}

// Get the current session
export async function getSession() {
  const supabase = getSupabaseServer()
  try {
    const { data } = await supabase.auth.getSession()
    return data.session
  } catch (error) {
    console.error("Error getting session:", error)
    return null
  }
}
