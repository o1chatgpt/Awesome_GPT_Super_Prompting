"use server"

import { revalidatePath } from "next/cache"
import { supabase } from "@/lib/database"
import { checkUserRole } from "./auth"

// Get all users with pagination and search
export async function getUsers({
  page = 1,
  limit = 10,
  search = "",
  role = "",
  status = "",
  sortBy = "created_at",
  sortOrder = "desc",
}: {
  page?: number
  limit?: number
  search?: string
  role?: string
  status?: string
  sortBy?: string
  sortOrder?: "asc" | "desc"
}) {
  // Check if the current user is an admin
  const isAdmin = await checkUserRole("admin")
  if (!isAdmin) {
    return { error: "Unauthorized access" }
  }

  const offset = (page - 1) * limit

  let query = supabase
    .from("profiles")
    .select("id, email, full_name, username, role, created_at, avatar_url, is_active, auth_provider, last_login", {
      count: "exact",
    })

  // Apply search filter if provided
  if (search) {
    query = query.or(`email.ilike.%${search}%,full_name.ilike.%${search}%,username.ilike.%${search}%`)
  }

  // Apply role filter if provided
  if (role) {
    query = query.eq("role", role)
  }

  // Apply status filter if provided
  if (status === "active") {
    query = query.eq("is_active", true)
  } else if (status === "inactive") {
    query = query.eq("is_active", false)
  }

  // Apply sorting
  query = query.order(sortBy, { ascending: sortOrder === "asc" })

  const { data, error, count } = await query.range(offset, offset + limit - 1)

  if (error) {
    return { error: error.message }
  }

  return {
    users: data,
    totalCount: count || 0,
    totalPages: count ? Math.ceil(count / limit) : 0,
    currentPage: page,
  }
}

// Get user by ID
export async function getUserById(userId: string) {
  // Check if the current user is an admin
  const isAdmin = await checkUserRole("admin")
  if (!isAdmin) {
    return { error: "Unauthorized access" }
  }

  const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).single()

  if (error) {
    return { error: error.message }
  }

  return { user: data }
}

// Create new user
export async function createUser({
  email,
  password,
  fullName,
  role = "user",
}: {
  email: string
  password: string
  fullName: string
  role: "admin" | "user" | "viewer"
}) {
  // Check if the current user is an admin
  const isAdmin = await checkUserRole("admin")
  if (!isAdmin) {
    return { error: "Unauthorized access" }
  }

  // First, create the auth user
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true, // Auto-confirm the email
    user_metadata: {
      full_name: fullName,
    },
  })

  if (authError) {
    return { error: authError.message }
  }

  // Then, update the profile with the role
  if (authData.user) {
    const { error: profileError } = await supabase
      .from("profiles")
      .update({ role, full_name: fullName })
      .eq("id", authData.user.id)

    if (profileError) {
      return { error: profileError.message }
    }
  }

  revalidatePath("/admin/users")
  return { success: true, userId: authData.user?.id }
}

// Update user profile
export async function updateUser(
  userId: string,
  {
    fullName,
    username,
    avatarUrl,
  }: {
    fullName: string
    username?: string
    avatarUrl?: string
  },
) {
  // Check if the current user is an admin
  const isAdmin = await checkUserRole("admin")
  if (!isAdmin) {
    return { error: "Unauthorized access" }
  }

  const updates = {
    full_name: fullName,
    ...(username && { username }),
    ...(avatarUrl && { avatar_url: avatarUrl }),
    updated_at: new Date().toISOString(),
  }

  const { error } = await supabase.from("profiles").update(updates).eq("id", userId)

  if (error) {
    return { error: error.message }
  }

  revalidatePath(`/admin/users/${userId}`)
  revalidatePath("/admin/users")
  return { success: true }
}

// Update user role
export async function updateUserRole(userId: string, role: "admin" | "user" | "viewer") {
  // Check if the current user is an admin
  const isAdmin = await checkUserRole("admin")
  if (!isAdmin) {
    return { error: "Unauthorized access" }
  }

  const { error } = await supabase.from("profiles").update({ role }).eq("id", userId)

  if (error) {
    return { error: error.message }
  }

  revalidatePath(`/admin/users/${userId}`)
  revalidatePath("/admin/users")
  return { success: true }
}

// Toggle user active status
export async function toggleUserStatus(userId: string, isActive: boolean) {
  // Check if the current user is an admin
  const isAdmin = await checkUserRole("admin")
  if (!isAdmin) {
    return { error: "Unauthorized access" }
  }

  const { error } = await supabase.from("profiles").update({ is_active: isActive }).eq("id", userId)

  if (error) {
    return { error: error.message }
  }

  revalidatePath(`/admin/users/${userId}`)
  revalidatePath("/admin/users")
  return { success: true }
}

// Delete user
export async function deleteUser(userId: string) {
  // Check if the current user is an admin
  const isAdmin = await checkUserRole("admin")
  if (!isAdmin) {
    return { error: "Unauthorized access" }
  }

  // Delete the user from auth
  const { error: authError } = await supabase.auth.admin.deleteUser(userId)

  if (authError) {
    return { error: authError.message }
  }

  // The profile should be deleted by the database trigger, but we'll make sure
  const { error: profileError } = await supabase.from("profiles").delete().eq("id", userId)

  if (profileError) {
    return { error: profileError.message }
  }

  revalidatePath("/admin/users")
  return { success: true }
}

// Reset user password
export async function resetUserPassword(userId: string) {
  // Check if the current user is an admin
  const isAdmin = await checkUserRole("admin")
  if (!isAdmin) {
    return { error: "Unauthorized access" }
  }

  // Get the user's email
  const { data: userData, error: userError } = await supabase.from("profiles").select("email").eq("id", userId).single()

  if (userError || !userData) {
    return { error: userError?.message || "User not found" }
  }

  // Send password reset email
  const { error } = await supabase.auth.resetPasswordForEmail(userData.email, {
    redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password/confirm`,
  })

  if (error) {
    return { error: error.message }
  }

  return { success: true }
}

// Get user activity
export async function getUserActivity(userId: string) {
  // Check if the current user is an admin
  const isAdmin = await checkUserRole("admin")
  if (!isAdmin) {
    return { error: "Unauthorized access" }
  }

  const { data, error } = await supabase
    .from("user_activities")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(20)

  if (error) {
    return { error: error.message }
  }

  return { activities: data }
}
