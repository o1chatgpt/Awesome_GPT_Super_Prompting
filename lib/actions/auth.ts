"use server"

import { cookies } from "next/headers"
import { createServerClient } from "@supabase/ssr"
import { recordSession } from "./sessions"
import { headers } from "next/headers"
import { validateInvitationToken } from "./invitations"

// Constants for session durations
const DEFAULT_SESSION_LENGTH = 3600 // 1 hour in seconds
const EXTENDED_SESSION_LENGTH = 2592000 // 30 days in seconds

// Helper function to ensure responses are serializable
function createResponse(success: boolean, data?: any, errorMessage?: string) {
  // Ensure we're returning a plain object that can be serialized
  return {
    success: success,
    data: data || null,
    error: errorMessage || null,
  }
}

// Helper function to create a Supabase client
function createSupabaseClient() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseKey) {
      console.error("Missing Supabase environment variables")
      return null
    }

    const cookieStore = cookies()
    return createServerClient(supabaseUrl, supabaseKey, {
      cookies: {
        get: (name) => {
          return cookieStore.get(name)?.value
        },
        set: (name, value, options) => {
          cookieStore.set({ name, value, ...options })
        },
        remove: (name, options) => {
          cookieStore.set({ name, value: "", ...options })
        },
      },
    })
  } catch (error) {
    console.error("Error creating Supabase client:", error)
    return null
  }
}

export async function signUp(formData: FormData) {
  try {
    const supabase = createSupabaseClient()
    if (!supabase) {
      return createResponse(false, null, "Authentication service unavailable")
    }

    const email = formData.get("email") as string
    const password = formData.get("password") as string
    const fullName = formData.get("name") as string
    const username = formData.get("username") as string

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          username: username,
          role: "user", // Default role for new users
        },
      },
    })

    if (error) {
      return createResponse(false, null, error.message)
    }

    return createResponse(true, { user: data.user }, null)
  } catch (error: any) {
    console.error("Error in signUp:", error)
    return createResponse(false, null, error?.message || "An unexpected error occurred during sign up")
  }
}

// New function for sign-in with remember me option
export async function signInWithRememberMe(formData: FormData) {
  try {
    const supabase = createSupabaseClient()
    if (!supabase) {
      return createResponse(false, null, "Authentication service unavailable")
    }

    const identifier = formData.get("identifier") as string
    const password = formData.get("password") as string
    const rememberMe = formData.get("rememberMe") === "true"

    if (!identifier || !password) {
      return createResponse(false, null, "Username/email and password are required")
    }

    // Set session expiration based on remember me option
    const expiresIn = rememberMe ? EXTENDED_SESSION_LENGTH : DEFAULT_SESSION_LENGTH
    const expiresAt = new Date(Date.now() + expiresIn * 1000)

    console.log(`Signing in with ${rememberMe ? "extended" : "default"} session (${expiresIn} seconds)`)

    // Check if identifier is an email
    const isEmail = identifier.includes("@")
    let authResponse
    let userEmail = ""

    try {
      if (isEmail) {
        // Sign in with email
        console.log(`Attempting login with email: ${identifier}`)
        userEmail = identifier
        authResponse = await supabase.auth.signInWithPassword({
          email: identifier,
          password,
        })
      } else {
        // Sign in with username - first get the email associated with the username
        console.log(`Attempting login with username: ${identifier}`)
        const { data: userData, error: userError } = await supabase
          .from("profiles")
          .select("email")
          .eq("username", identifier)
          .single()

        if (userError || !userData) {
          console.log("Username lookup error:", userError)
          return createResponse(false, null, "Username not found")
        }

        userEmail = userData.email
        console.log(`Found email for username ${identifier}: ${userEmail}`)

        // Now sign in with the email
        authResponse = await supabase.auth.signInWithPassword({
          email: userEmail,
          password,
        })
      }

      const { data, error } = authResponse

      if (error) {
        console.log("Auth error:", error)
        return createResponse(false, null, error.message)
      }

      console.log("Login successful for user:", data.user.id)
      console.log("Session created:", !!data.session)

      // Check if a profile exists for this user, create one if it doesn't
      const { count } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true })
        .eq("id", data.user.id)

      if (count === 0) {
        console.log("No profile found for user, creating one")
        // Create a basic profile for the user
        const { error: profileError } = await supabase.from("profiles").insert({
          id: data.user.id,
          email: userEmail,
          full_name: data.user.user_metadata.full_name || "User",
          username: data.user.user_metadata.username || `user_${Date.now().toString().slice(-6)}`,
          role: "user",
          is_active: true,
          created_at: new Date().toISOString(),
        })

        if (profileError) {
          console.error("Error creating profile:", profileError)
          // Continue anyway, as the user is still logged in
        }
      }

      // If remember me is checked, extend the session
      if (rememberMe && data.session) {
        // We need to create a new session with the extended expiration
        const { error: refreshError } = await supabase.auth.refreshSession({
          refresh_token: data.session.refresh_token,
          expiresIn,
        })

        if (refreshError) {
          console.error("Error extending session:", refreshError)
          // Continue anyway, as the user is still logged in
        } else {
          console.log(`Session extended to ${expiresIn} seconds`)
        }
      }

      // Update last login time
      if (data.user) {
        await supabase.from("profiles").update({ last_login: new Date().toISOString() }).eq("id", data.user.id)

        // Record the session
        const headersList = headers()
        const userAgent = headersList.get("user-agent") || "Unknown"
        const ipAddress = headersList.get("x-forwarded-for") || headersList.get("x-real-ip") || "Unknown"

        try {
          await recordSession(data.user.id, userAgent, ipAddress, expiresAt, rememberMe)
        } catch (sessionError) {
          console.error("Error recording session:", sessionError)
          // Continue anyway, as the user is still logged in
        }
      }

      return createResponse(true, { user: data.user }, null)
    } catch (authError: any) {
      console.error("Authentication error:", authError)
      return createResponse(false, null, authError?.message || "Authentication failed")
    }
  } catch (error: any) {
    console.error("Unexpected error during sign in:", error)
    return createResponse(false, null, error?.message || "An unexpected error occurred during sign in")
  }
}

// Keep the original signIn function for backward compatibility
export async function signIn(formData: FormData) {
  try {
    // Add rememberMe=false to use the default session length
    const newFormData = new FormData()
    for (const [key, value] of formData.entries()) {
      newFormData.append(key, value)
    }
    newFormData.append("rememberMe", "false")
    return await signInWithRememberMe(newFormData)
  } catch (error: any) {
    console.error("Error in signIn:", error)
    return createResponse(false, null, error?.message || "An unexpected error occurred during sign in")
  }
}

// Update the signOut function to properly clear the session
export async function signOut() {
  try {
    const supabase = createSupabaseClient()
    if (!supabase) {
      return createResponse(false, null, "Authentication service unavailable")
    }

    const { error } = await supabase.auth.signOut()

    if (error) {
      return createResponse(false, null, error.message)
    }

    return createResponse(true, null, null)
  } catch (error: any) {
    console.error("Error signing out:", error)
    return createResponse(false, null, error?.message || "Failed to sign out")
  }
}

export async function getSession() {
  try {
    const supabase = createSupabaseClient()
    if (!supabase) {
      console.error("Supabase client not available in getSession")
      return null
    }

    const { data, error } = await supabase.auth.getSession()

    if (error || !data.session) {
      return null
    }

    return data.session
  } catch (error) {
    console.error("Error getting session:", error)
    return null
  }
}

export async function getUserProfile() {
  try {
    const session = await getSession()
    if (!session) {
      return null
    }

    const supabase = createSupabaseClient()
    if (!supabase) {
      console.error("Supabase client not available in getUserProfile")
      return null
    }

    const { data, error } = await supabase.from("profiles").select("*").eq("id", session.user.id).single()

    if (error || !data) {
      return null
    }

    return data
  } catch (error) {
    console.error("Error getting user profile:", error)
    return null
  }
}

export async function checkUserRole(requiredRole: string) {
  try {
    const profile = await getUserProfile()

    if (!profile) {
      return false
    }

    return profile.role === requiredRole
  } catch (error) {
    console.error("Error checking user role:", error)
    return false
  }
}

// Add a function to check if a user is registering with a valid invitation
export async function registerWithInvitation(
  token: string,
  userData: {
    full_name: string
    username: string
    password: string
  },
) {
  try {
    const supabase = createSupabaseClient()
    if (!supabase) {
      return createResponse(false, null, "Authentication service unavailable")
    }

    // Validate the invitation token
    const invitation = await validateInvitationToken(token)

    // Create the user account
    const { data: authData, error: signUpError } = await supabase.auth.signUp({
      email: invitation.email,
      password: userData.password,
    })

    if (signUpError || !authData.user) {
      return createResponse(false, null, signUpError?.message || "Failed to create user account")
    }

    // Create the user profile
    const { error: profileError } = await supabase.from("profiles").insert({
      id: authData.user.id,
      email: invitation.email,
      full_name: userData.full_name,
      username: userData.username,
      role: invitation.role,
      is_active: true,
    })

    if (profileError) {
      return createResponse(false, null, profileError.message)
    }

    // Mark the invitation as used
    await supabase.from("invitations").update({ used_at: new Date().toISOString() }).eq("id", invitation.id)

    return createResponse(true, null, null)
  } catch (error: any) {
    return createResponse(false, null, error?.message || "Invalid or expired invitation")
  }
}

export async function getCurrentUser() {
  try {
    const session = await getSession()
    if (!session) {
      return null
    }

    return session.user
  } catch (error) {
    console.error("Error getting current user:", error)
    return null
  }
}

// Password reset request function
export async function requestPasswordReset(email: string) {
  try {
    const supabase = createSupabaseClient()
    if (!supabase) {
      return createResponse(false, null, "Authentication service unavailable")
    }

    if (!email) {
      return createResponse(false, null, "Email is required")
    }

    // Check if the email exists in our system
    const { data: userData, error: userError } = await supabase
      .from("profiles")
      .select("id")
      .eq("email", email)
      .single()

    if (userError) {
      // Don't reveal if the email exists or not for security reasons
      console.log("User lookup error:", userError)
      return createResponse(true, null, null) // Return success even if email doesn't exist
    }

    // Use Supabase's built-in password reset functionality
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password/confirm`,
    })

    if (error) {
      console.error("Password reset request error:", error)
      return createResponse(false, null, "Failed to send password reset email. Please try again later.")
    }

    return createResponse(true, null, null)
  } catch (error: any) {
    console.error("Unexpected error during password reset request:", error)
    return createResponse(false, null, error?.message || "An unexpected error occurred. Please try again later.")
  }
}

// Password reset confirmation function
export async function confirmPasswordReset(token: string, newPassword: string) {
  try {
    const supabase = createSupabaseClient()
    if (!supabase) {
      return createResponse(false, null, "Authentication service unavailable")
    }

    if (!token || !newPassword) {
      return createResponse(false, null, "Token and new password are required")
    }

    // Use Supabase's built-in password update functionality
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    })

    if (error) {
      console.error("Password reset confirmation error:", error)
      return createResponse(false, null, "Failed to reset password. The link may have expired.")
    }

    return createResponse(true, null, null)
  } catch (error: any) {
    console.error("Unexpected error during password reset confirmation:", error)
    return createResponse(false, null, error?.message || "An unexpected error occurred. Please try again later.")
  }
}

export async function directLogin(email: string, password: string) {
  try {
    const supabase = createSupabaseClient()
    if (!supabase) {
      return createResponse(false, null, "Authentication service unavailable")
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    })

    if (error) {
      console.error("Direct login error:", error)
      return createResponse(false, null, error.message)
    }

    return createResponse(true, { data }, null)
  } catch (error: any) {
    console.error("Unexpected error during direct login:", error)
    return createResponse(false, null, error?.message || "An unexpected error occurred. Please try again later.")
  }
}

// Add this function to the file, near the other auth-related functions
export async function ensureUserProfile(userId: string, email: string) {
  try {
    const supabase = createSupabaseClient()
    if (!supabase) {
      return createResponse(false, null, "Authentication service unavailable")
    }

    const { count } = await supabase.from("profiles").select("*", { count: "exact", head: true }).eq("id", userId)

    if (count === 0) {
      console.log("Creating profile for user:", userId)
      await supabase.from("profiles").insert({
        id: userId,
        email: email,
        full_name: "User",
        username: `user_${Date.now().toString().slice(-6)}`,
        role: "user",
        is_active: true,
        created_at: new Date().toISOString(),
      })
    }
    return createResponse(true, null, null)
  } catch (error: any) {
    console.error("Error ensuring user profile:", error)
    return createResponse(false, null, error?.message || "Failed to create user profile")
  }
}

// Add a function to enable guest mode
export async function enableGuestMode() {
  return createResponse(true, { guestMode: true }, null)
}

// Add a function to disable guest mode
export async function disableGuestMode() {
  return createResponse(true, { guestMode: false }, null)
}
