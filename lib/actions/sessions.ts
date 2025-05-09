"use server"

import { supabase } from "@/lib/database"
import { getSession } from "./auth"
import { UAParser } from "ua-parser-js"

export interface SessionInfo {
  id: string
  device_info: string
  browser: string
  operating_system: string
  ip_address: string
  location?: string
  is_current: boolean
  created_at: string
  last_active: string
  expires_at: string
  is_remembered: boolean
}

// Record a new session when user logs in
export async function recordSession(
  userId: string,
  userAgent: string,
  ipAddress: string,
  expiresAt: Date,
  isRemembered = false,
) {
  try {
    // Parse user agent to get device info
    const parser = new UAParser(userAgent)
    const browser = `${parser.getBrowser().name || "Unknown"} ${parser.getBrowser().version || ""}`
    const os = `${parser.getOS().name || "Unknown"} ${parser.getOS().version || ""}`
    const device = parser.getDevice().vendor
      ? `${parser.getDevice().vendor} ${parser.getDevice().model || ""}`
      : "Desktop/Laptop"

    // Get approximate location from IP (in a real app, you'd use a geolocation service)
    // For demo purposes, we'll just use a placeholder
    const location = "Unknown location"

    // First, set all existing sessions for this user to not current
    await supabase.from("sessions").update({ is_current: false }).eq("user_id", userId)

    // Create the new session record
    const { data, error } = await supabase
      .from("sessions")
      .insert({
        user_id: userId,
        device_info: device,
        browser,
        operating_system: os,
        ip_address: ipAddress,
        location,
        is_current: true,
        expires_at: expiresAt.toISOString(),
        user_agent: userAgent,
        is_remembered: isRemembered,
      })
      .select()
      .single()

    if (error) {
      console.error("Error recording session:", error)
      return null
    }

    return data
  } catch (error) {
    console.error("Unexpected error recording session:", error)
    return null
  }
}

// Get all active sessions for the current user
export async function getUserSessions() {
  try {
    const session = await getSession()
    if (!session) {
      return { error: "Not authenticated" }
    }

    const { data, error } = await supabase
      .from("sessions")
      .select("*")
      .eq("user_id", session.user.id)
      .order("last_active", { ascending: false })

    if (error) {
      console.error("Error fetching sessions:", error)
      return { error: error.message }
    }

    return { sessions: data as SessionInfo[] }
  } catch (error) {
    console.error("Unexpected error fetching sessions:", error)
    return { error: "An unexpected error occurred" }
  }
}

// Revoke a specific session
export async function revokeSession(sessionId: string) {
  try {
    const session = await getSession()
    if (!session) {
      return { error: "Not authenticated" }
    }

    // Check if the session belongs to the current user
    const { data: sessionData, error: sessionError } = await supabase
      .from("sessions")
      .select("user_id, is_current")
      .eq("id", sessionId)
      .single()

    if (sessionError || !sessionData) {
      return { error: "Session not found" }
    }

    if (sessionData.user_id !== session.user.id) {
      return { error: "Unauthorized" }
    }

    // If revoking the current session, sign out
    const isCurrentSession = sessionData.is_current

    // Delete the session from the database
    const { error } = await supabase.from("sessions").delete().eq("id", sessionId)

    if (error) {
      return { error: error.message }
    }

    // If current session was revoked, sign out
    if (isCurrentSession) {
      // Sign out from Supabase
      await supabase.auth.signOut()
      return { success: true, signedOut: true }
    }

    return { success: true }
  } catch (error) {
    console.error("Unexpected error revoking session:", error)
    return { error: "An unexpected error occurred" }
  }
}

// Revoke all sessions except the current one
export async function revokeAllOtherSessions() {
  try {
    const session = await getSession()
    if (!session) {
      return { error: "Not authenticated" }
    }

    // Get the current session ID
    const { data: currentSession, error: currentSessionError } = await supabase
      .from("sessions")
      .select("id")
      .eq("user_id", session.user.id)
      .eq("is_current", true)
      .single()

    if (currentSessionError) {
      console.error("Error finding current session:", currentSessionError)
      return { error: "Current session not found" }
    }

    // Delete all other sessions
    const { error } = await supabase
      .from("sessions")
      .delete()
      .eq("user_id", session.user.id)
      .neq("id", currentSession.id)

    if (error) {
      return { error: error.message }
    }

    return { success: true }
  } catch (error) {
    console.error("Unexpected error revoking sessions:", error)
    return { error: "An unexpected error occurred" }
  }
}

// Update the last active time for the current session
export async function updateSessionActivity() {
  try {
    const session = await getSession()
    if (!session) {
      return { error: "Not authenticated" }
    }

    // Get the current session
    const { data: currentSession, error: currentSessionError } = await supabase
      .from("sessions")
      .select("id")
      .eq("user_id", session.user.id)
      .eq("is_current", true)
      .single()

    if (currentSessionError || !currentSession) {
      console.error("Error finding current session:", currentSessionError)
      return { error: "Current session not found" }
    }

    // Update the last active time
    const { error } = await supabase
      .from("sessions")
      .update({ last_active: new Date().toISOString() })
      .eq("id", currentSession.id)

    if (error) {
      return { error: error.message }
    }

    return { success: true }
  } catch (error) {
    console.error("Unexpected error updating session activity:", error)
    return { error: "An unexpected error occurred" }
  }
}
