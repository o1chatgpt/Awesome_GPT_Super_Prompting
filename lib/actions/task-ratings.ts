"use server"

import { supabase } from "@/lib/database"
import { getSession } from "./auth"
import type { TaskRating } from "@/lib/database"

export async function rateTask(taskId: string, rating: number, feedback?: string) {
  const session = await getSession()

  if (!session) {
    return { error: "You must be logged in to rate a task" }
  }

  // Check if the user has already rated this task
  const { data: existingRating, error: checkError } = await supabase
    .from("task_ratings")
    .select("*")
    .eq("task_id", taskId)
    .eq("user_id", session.user.id)
    .single()

  if (checkError && checkError.code !== "PGRST116") {
    return { error: checkError.message }
  }

  if (existingRating) {
    // Update existing rating
    const { data, error } = await supabase
      .from("task_ratings")
      .update({ rating, feedback })
      .eq("id", existingRating.id)
      .select()
      .single()

    if (error) {
      return { error: error.message }
    }

    return { success: true, rating: data }
  } else {
    // Create new rating
    const ratingData: Partial<TaskRating> = {
      task_id: taskId,
      user_id: session.user.id,
      rating,
      feedback,
    }

    const { data, error } = await supabase.from("task_ratings").insert(ratingData).select().single()

    if (error) {
      return { error: error.message }
    }

    return { success: true, rating: data }
  }
}

export async function getTaskRating(taskId: string) {
  const session = await getSession()

  if (!session) {
    return { error: "You must be logged in to view task ratings" }
  }

  const { data, error } = await supabase
    .from("task_ratings")
    .select("*")
    .eq("task_id", taskId)
    .eq("user_id", session.user.id)
    .single()

  if (error && error.code !== "PGRST116") {
    return { error: error.message }
  }

  return { success: true, rating: data || null }
}

export async function getAverageRating(taskId: string) {
  const { data, error } = await supabase.from("task_ratings").select("rating").eq("task_id", taskId)

  if (error) {
    return { error: error.message }
  }

  if (!data || data.length === 0) {
    return { success: true, averageRating: 0, count: 0 }
  }

  const sum = data.reduce((acc, curr) => acc + curr.rating, 0)
  const average = sum / data.length

  return { success: true, averageRating: average, count: data.length }
}
