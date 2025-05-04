"use server"

import { revalidatePath } from "next/cache"
import { supabase } from "@/lib/database"
import { checkUserRole, getCurrentUser } from "./auth"
import { v4 as uuidv4 } from "uuid"
import { redirect } from "next/navigation"

// Send an invitation to a new user
export async function sendInvitation(email: string, role: "user" | "admin" | "viewer" = "user") {
  // Check if the current user is an admin
  const isAdmin = await checkUserRole("admin")
  if (!isAdmin) {
    return { error: "Unauthorized access" }
  }

  // Get the current user
  const currentUser = await getCurrentUser()
  if (!currentUser) {
    return { error: "User not found" }
  }

  // Check if the email is already registered
  const { data: existingUser } = await supabase.from("profiles").select("id").eq("email", email).single()
  if (existingUser) {
    return { error: "User with this email already exists" }
  }

  // Check if there's already a pending invitation
  const { data: existingInvitation } = await supabase
    .from("invitations")
    .select("id, expires_at")
    .eq("email", email)
    .is("used_at", null)
    .single()

  if (existingInvitation) {
    // If invitation exists but is expired, delete it
    const now = new Date()
    const expiresAt = new Date(existingInvitation.expires_at)

    if (expiresAt > now) {
      return { error: "An invitation has already been sent to this email" }
    } else {
      // Delete expired invitation
      await supabase.from("invitations").delete().eq("id", existingInvitation.id)
    }
  }

  // Generate a unique token
  const token = uuidv4()

  // Set expiration date (7 days from now)
  const expiresAt = new Date()
  expiresAt.setDate(expiresAt.getDate() + 7)

  // Insert the invitation
  const { data, error } = await supabase
    .from("invitations")
    .insert({
      email,
      role,
      token,
      invited_by: currentUser.id,
      expires_at: expiresAt.toISOString(),
    })
    .select()
    .single()

  if (error) {
    return { error: error.message }
  }

  // In a real application, you would send an email here
  // For now, we'll just return the invitation link
  const invitationLink = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/auth/register?token=${token}`

  revalidatePath("/admin/users")
  return {
    success: true,
    invitation: data,
    invitationLink,
  }
}

// Get all invitations
export async function getInvitations() {
  // Check if the current user is an admin
  const isAdmin = await checkUserRole("admin")
  if (!isAdmin) {
    return { error: "Unauthorized access" }
  }

  const { data, error } = await supabase
    .from("invitations")
    .select(`
      *,
      inviter:invited_by(id, email, full_name, username)
    `)
    .order("created_at", { ascending: false })

  if (error) {
    return { error: error.message }
  }

  return { invitations: data }
}

// Resend an invitation
export async function resendInvitation(invitationId: string) {
  // Check if the current user is an admin
  const isAdmin = await checkUserRole("admin")
  if (!isAdmin) {
    return { error: "Unauthorized access" }
  }

  // Get the invitation
  const { data: invitation, error: fetchError } = await supabase
    .from("invitations")
    .select("*")
    .eq("id", invitationId)
    .single()

  if (fetchError || !invitation) {
    return { error: "Invitation not found" }
  }

  // Check if the invitation is already used
  if (invitation.used_at) {
    return { error: "This invitation has already been used" }
  }

  // Generate a new token
  const token = uuidv4()

  // Set new expiration date (7 days from now)
  const expiresAt = new Date()
  expiresAt.setDate(expiresAt.getDate() + 7)

  // Update the invitation
  const { error } = await supabase
    .from("invitations")
    .update({
      token,
      expires_at: expiresAt.toISOString(),
    })
    .eq("id", invitationId)

  if (error) {
    return { error: error.message }
  }

  // In a real application, you would send an email here
  // For now, we'll just return the invitation link
  const invitationLink = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/auth/register?token=${token}`

  revalidatePath("/admin/users")
  return {
    success: true,
    invitationLink,
  }
}

// Cancel an invitation
export async function cancelInvitation(invitationId: string) {
  // Check if the current user is an admin
  const isAdmin = await checkUserRole("admin")
  if (!isAdmin) {
    return { error: "Unauthorized access" }
  }

  const { error } = await supabase.from("invitations").delete().eq("id", invitationId)

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/admin/users")
  return { success: true }
}

// Validate an invitation token
export async function validateInvitationToken(token: string) {
  const { data, error } = await supabase.from("invitations").select("*").eq("token", token).is("used_at", null).single()

  if (error || !data) {
    redirect("/auth/sign-in?error=Invalid or expired invitation")
  }

  // Check if the invitation is expired
  const now = new Date()
  const expiresAt = new Date(data.expires_at)

  if (expiresAt < now) {
    redirect("/auth/sign-in?error=Invitation has expired")
  }

  return data
}

// Register a user from an invitation
export async function registerFromInvitation(
  token: string,
  userData: {
    full_name: string
    username: string
    password: string
  },
) {
  // Validate the invitation
  const { data: invitation, error: validationError } = await supabase
    .from("invitations")
    .select("*")
    .eq("token", token)
    .is("used_at", null)
    .single()

  if (validationError || !invitation) {
    return { error: "Invalid or expired invitation" }
  }

  // Check if the invitation is expired
  const now = new Date()
  const expiresAt = new Date(invitation.expires_at)

  if (expiresAt < now) {
    return { error: "Invitation has expired" }
  }

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

  // Automatically sign in the user
  const { error: signInError } = await supabase.auth.signInWithPassword({
    email: invitation.email,
    password: userData.password,
  })

  return {
    success: true,
    autoSignIn: !signInError,
  }
}
