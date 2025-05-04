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
}: {
  page?: number
  limit?: number
  search?: string
  role?: string
}) {
  // Check if the current user is an admin
  const isAdmin = await checkUserRole("admin")
  if (!isAdmin) {
    return { error: "Unauthorized access" }
  }

  const offset = (page - 1) * limit

  let query = supabase
    .from("profiles")
    .select("id, email, full_name, username, role, created_at, avatar_url, is_active", { count: "exact" })

  // Apply search filter if provided
  if (search) {
    query = query.or(`email.ilike.%${search}%,full_name.ilike.%${search}%,username.ilike.%${search}%`)
  }

  // Apply role filter if provided
  if (role) {
    query = query.eq("role", role)
  }

  const { data, error, count } = await query.order("created_at", { ascending: false }).range(offset, offset + limit - 1)

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

  revalidatePath("/admin/users")
  return { success: true }
}

// Delete user (soft delete by deactivating)
export async function deleteUser(userId: string) {
  // Check if the current user is an admin
  const isAdmin = await checkUserRole("admin")
  if (!isAdmin) {
    return { error: "Unauthorized access" }
  }

  // Instead of actually deleting, we'll just deactivate
  const { error } = await supabase.from("profiles").update({ is_active: false }).eq("id", userId)

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/admin/users")
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
