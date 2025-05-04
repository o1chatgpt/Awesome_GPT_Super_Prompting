"use server"
import { redirect } from "next/navigation"
import { supabase } from "@/lib/database"
import { validateInvitationToken } from "./invitations"

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

export async function signIn(formData: FormData) {
  const identifier = formData.get("identifier") as string // Can be email or username
  const password = formData.get("password") as string

  // Check if identifier is an email
  const isEmail = identifier.includes("@")

  let authResponse

  if (isEmail) {
    // Sign in with email
    authResponse = await supabase.auth.signInWithPassword({
      email: identifier,
      password,
    })
  } else {
    // Sign in with username - first get the email associated with the username
    const { data: userData, error: userError } = await supabase
      .from("profiles")
      .select("email")
      .eq("username", identifier)
      .single()

    if (userError || !userData) {
      return { error: "Username not found" }
    }

    // Now sign in with the email
    authResponse = await supabase.auth.signInWithPassword({
      email: userData.email,
      password,
    })
  }

  const { data, error } = authResponse

  if (error) {
    return { error: error.message }
  }

  return { success: true, user: data.user }
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()

  if (error) {
    return { error: error.message }
  }

  redirect("/auth/sign-in")
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
