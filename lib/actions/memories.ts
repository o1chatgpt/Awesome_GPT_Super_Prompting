"use server"

import { supabase } from "@/lib/database"
import { getSession } from "./auth"
import type { Memory, UserActivity } from "@/lib/database"

export async function saveMemory(
  content: string,
  type: string,
  relevance: number,
  metadata?: Record<string, any>,
  isAdminVisible = false,
) {
  const session = await getSession()

  if (!session) {
    return { error: "You must be logged in to save memories" }
  }

  const memoryData: Partial<Memory> = {
    user_id: session.user.id,
    content,
    type,
    relevance,
    metadata,
    is_admin_visible: isAdminVisible,
  }

  const { data, error } = await supabase.from("memories").insert(memoryData).select().single()

  if (error) {
    return { error: error.message }
  }

  // Also log this as a user activity
  await logUserActivity(session.user.id, "create", "memory", data.id, { content, type })

  return { success: true, memory: data }
}

export async function getMemories(type?: string, limit = 10) {
  const session = await getSession()

  if (!session) {
    return { error: "You must be logged in to view memories" }
  }

  let query = supabase
    .from("memories")
    .select("*")
    .eq("user_id", session.user.id)
    .order("relevance", { ascending: false })
    .limit(limit)

  if (type) {
    query = query.eq("type", type)
  }

  const { data, error } = await query

  if (error) {
    return { error: error.message }
  }

  return { success: true, memories: data }
}

export async function getAllUserMemories(userId: string, limit = 50) {
  const session = await getSession()

  if (!session) {
    return { error: "You must be logged in to view memories" }
  }

  // Check if the current user is an admin
  const { data: userData, error: userError } = await supabase
    .from("users")
    .select("role")
    .eq("id", session.user.id)
    .single()

  if (userError || !userData || userData.role !== "admin") {
    return { error: "You must be an admin to view all user memories" }
  }

  const { data, error } = await supabase
    .from("memories")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit)

  if (error) {
    return { error: error.message }
  }

  return { success: true, memories: data }
}

export async function getAdminVisibleMemories(limit = 100) {
  const session = await getSession()

  if (!session) {
    return { error: "You must be logged in to view memories" }
  }

  // Check if the current user is an admin
  const { data: userData, error: userError } = await supabase
    .from("users")
    .select("role")
    .eq("id", session.user.id)
    .single()

  if (userError || !userData || userData.role !== "admin") {
    return { error: "You must be an admin to view admin-visible memories" }
  }

  const { data, error } = await supabase
    .from("memories")
    .select("*, users(full_name, email)")
    .eq("is_admin_visible", true)
    .order("created_at", { ascending: false })
    .limit(limit)

  if (error) {
    return { error: error.message }
  }

  return { success: true, memories: data }
}

export async function deleteMemory(memoryId: string) {
  const session = await getSession()

  if (!session) {
    return { error: "You must be logged in to delete memories" }
  }

  const { error } = await supabase.from("memories").delete().eq("id", memoryId).eq("user_id", session.user.id)

  if (error) {
    return { error: error.message }
  }

  return { success: true }
}

// User activity tracking
export async function logUserActivity(
  userId: string,
  action: string,
  resourceType: string,
  resourceId?: string,
  details?: Record<string, any>,
) {
  const activityData: Partial<UserActivity> = {
    user_id: userId,
    action,
    resource_type: resourceType,
    resource_id: resourceId,
    details,
  }

  const { error } = await supabase.from("user_activities").insert(activityData)

  if (error) {
    console.error("Failed to log user activity:", error)
  }

  return { success: !error }
}

export async function getUserActivities(userId: string, limit = 50) {
  const session = await getSession()

  if (!session) {
    return { error: "You must be logged in to view user activities" }
  }

  // Check if the current user is an admin or the user themselves
  if (session.user.id !== userId) {
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("role")
      .eq("id", session.user.id)
      .single()

    if (userError || !userData || userData.role !== "admin") {
      return { error: "You don't have permission to view this user's activities" }
    }
  }

  const { data, error } = await supabase
    .from("user_activities")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit)

  if (error) {
    return { error: error.message }
  }

  return { success: true, activities: data }
}
