"use server"
import { supabase } from "@/lib/database"
import { cookies } from "next/headers"
import { createServerClient } from "@supabase/ssr"
import { recordSession } from "./sessions"
import { headers } from "next/headers"

// Constants for session durations
const DEFAULT_SESSION_LENGTH = 3600 // 1 hour in seconds
const EXTENDED_SESSION_LENGTH = 2592000 // 30 days in seconds

export async function signUp(formData: FormData) {
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
    return { error: error.message }
  }

  return { success: true, user: data.user }
}

// New function for sign-in with remember me option
export async function signInWithRememberMe(formData: FormData) {
  const identifier = formData.get("identifier") as string
  const password = formData.get("password") as string
  const rememberMe = formData.get("rememberMe") === "true"

  if (!identifier || !password) {
    return { error: "Username/email and password are required" }
  }

  // Set session expiration based on remember me option
  const expiresIn = rememberMe ? EXTENDED_SESSION_LENGTH : DEFAULT_SESSION_LENGTH
  const expiresAt = new Date(Date.now() + expiresIn * 1000)

  console.log(`Signing in with ${rememberMe ? "extended" : "default"} session (${expiresIn} seconds)`)

  // Create a server client with cookies
  const cookieStore = cookies()
  const supabaseServer = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
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
    },
  )

  try {
    // Check if identifier is an email
    const isEmail = identifier.includes("@")
    let authResponse

    if (isEmail) {
      // Sign in with email
      console.log(`Attempting login with email: ${identifier}`)
      authResponse = await supabaseServer.auth.signInWithPassword({
        email: identifier,
        password,
      })
    } else {
      // Sign in with username - first get the email associated with the username
      console.log(`Attempting login with username: ${identifier}`)
      const { data: userData, error: userError } = await supabaseServer
        .from("profiles")
        .select("email")
        .eq("username", identifier)
        .single()

      if (userError || !userData) {
        console.log("Username lookup error:", userError)
        return { error: "Username not found" }
      }

      console.log(`Found email for username ${identifier}: ${userData.email}`)

      // Now sign in with the email
      authResponse = await supabaseServer.auth.signInWithPassword({
        email: userData.email,
        password,
      })
    }

    const { data, error } = authResponse

    if (error) {
      console.log("Auth error:", error)
      return { error: error.message }
    }

    console.log("Login successful for user:", data.user.id)
    console.log("Session created:", !!data.session)

    // Check if a profile exists for this user, create one if it doesn't
    const { count } = await supabaseServer
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .eq("id", data.user.id)

    if (count === 0) {
      console.log("No profile found for user, creating one")
      // Create a basic profile for the user
      const { error: profileError } = await supabaseServer.from("profiles").insert({
        id: data.user.id,
        email: isEmail ? identifier : userData.email,
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
      const { error: refreshError } = await supabaseServer.auth.refreshSession({
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
      await supabaseServer.from("profiles").update({ last_login: new Date().toISOString() }).eq("id", data.user.id)

      // Record the session
      const headersList = headers()
      const userAgent = headersList.get("user-agent") || "Unknown"
      const ipAddress = headersList.get("x-forwarded-for") || headersList.get("x-real-ip") || "Unknown"

      await recordSession(data.user.id, userAgent, ipAddress, expiresAt, rememberMe)
    }

    return { success: true, user: data.user }
  } catch (error) {
    console.error("Unexpected error during sign in:", error)
    return { error: "An unexpected error occurred during sign in" }
  }
}

// Keep the original signIn function for backward compatibility
export async function signIn(formData: FormData) {
  // Add rememberMe=false to use the default session length
  formData.append("rememberMe", "false")
  return signInWithRememberMe(formData)
}

// Update the signOut function to properly clear the session
export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut()

    if (error) {
      return { error: error.message }
    }

    return { success: true }
  } catch (error) {
    console.error("Error signing out:", error)
    return { error: "Failed to sign out" }
  }
}

export async function getSession() {
  const { data, error } = await supabase.auth.getSession()

  if (error || !data.session) {
    return null
  }

  return data.session
}

export async function getUserProfile() {
  const session = await getSession()

  if (!session) {
    return null
  }

  const { data, error } = await supabase.from("profiles").select("*").eq("id", session.user.id).single()

  if (error || !data) {
    return null
  }

  return data
}

export async function checkUserRole(requiredRole: string) {
  const profile = await getUserProfile()

  if (!profile) {
    return false
  }

  return profile.role === requiredRole
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
    // Validate the invitation token
    const invitation = await validateInvitationToken(token)

    // Create the user account
    const { data: authData, error: signUpError } = await supabase.auth.signUp({
      email: invitation.email,
      password: userData.password,
    })

    if (signUpError || !authData.user) {
      return { error: signUpError?.message || "Failed to create user account" }
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
      return { error: profileError.message }
    }

    // Mark the invitation as used
    await supabase.from("invitations").update({ used_at: new Date().toISOString() }).eq("id", invitation.id)

    return { success: true }
  } catch (error) {
    return { error: "Invalid or expired invitation" }
  }
}

export async function getCurrentUser() {
  const session = await getSession()
  if (!session) {
    return null
  }

  return session.user
}

// Password reset request function
export async function requestPasswordReset(email: string) {
  try {
    if (!email) {
      return { error: "Email is required" }
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
      return { success: true } // Return success even if email doesn't exist
    }

    // Use Supabase's built-in password reset functionality
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password/confirm`,
    })

    if (error) {
      console.error("Password reset request error:", error)
      return { error: "Failed to send password reset email. Please try again later." }
    }

    return { success: true }
  } catch (error) {
    console.error("Unexpected error during password reset request:", error)
    return { error: "An unexpected error occurred. Please try again later." }
  }
}

// Password reset confirmation function
export async function confirmPasswordReset(token: string, newPassword: string) {
  try {
    if (!token || !newPassword) {
      return { error: "Token and new password are required" }
    }

    // Use Supabase's built-in password update functionality
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    })

    if (error) {
      console.error("Password reset confirmation error:", error)
      return { error: "Failed to reset password. The link may have expired." }
    }

    return { success: true }
  } catch (error) {
    console.error("Unexpected error during password reset confirmation:", error)
    return { error: "An unexpected error occurred. Please try again later." }
  }
}

export async function directLogin(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    })

    if (error) {
      console.error("Direct login error:", error)
      return { error: error.message }
    }

    return { success: true, data }
  } catch (error) {
    console.error("Unexpected error during direct login:", error)
    return { error: "An unexpected error occurred. Please try again later." }
  }
}

// Add this function to the file, near the other auth-related functions

export async function ensureUserProfile(userId: string, email: string) {
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
}

// Import this at the top of the file
import { validateInvitationToken } from "./invitations"
