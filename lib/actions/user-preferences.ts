"use server"

import { supabase } from "@/lib/database"
import { revalidatePath } from "next/cache"

export async function updateUserPreferences(userId: string, preferences: any) {
  try {
    // First, check if the user exists
    const { data: user, error: userError } = await supabase.from("profiles").select("id").eq("id", userId).single()

    if (userError || !user) {
      throw new Error("User not found")
    }

    // Update the user's preferences
    const { error } = await supabase.from("profiles").update({ preferences }).eq("id", userId)

    if (error) {
      throw new Error(error.message)
    }

    // Revalidate the profile page to reflect the changes
    revalidatePath("/profile")
    revalidatePath("/settings")

    return { success: true }
  } catch (error) {
    console.error("Error updating user preferences:", error)
    throw error
  }
}

export async function getUserPreferences(userId: string) {
  try {
    const { data, error } = await supabase.from("profiles").select("preferences").eq("id", userId).single()

    if (error || !data) {
      return null
    }

    return data.preferences
  } catch (error) {
    console.error("Error getting user preferences:", error)
    return null
  }
}
