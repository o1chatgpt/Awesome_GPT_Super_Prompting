"use server"

import { supabase } from "@/lib/database"
import { getSession } from "./auth"
import type { ScrapingTask } from "@/lib/database"

export async function createScrapingTask(formData: FormData) {
  const session = await getSession()

  if (!session) {
    return { error: "You must be logged in to create a scraping task" }
  }

  const url = formData.get("url") as string
  const contentType = formData.get("contentType") as string
  const depth = formData.get("depth") as string
  const format = formData.get("format") as string
  const scheduleType = formData.get("scheduleType") as string

  const taskData: Partial<ScrapingTask> = {
    user_id: session.user.id,
    url,
    content_type: contentType,
    depth,
    format,
    schedule_type: scheduleType,
    status: scheduleType === "once" ? "pending" : "scheduled",
  }

  if (scheduleType === "recurring") {
    taskData.schedule_frequency = formData.get("scheduleFrequency") as string
    taskData.schedule_time = formData.get("scheduleTime") as string

    if (taskData.schedule_frequency === "weekly") {
      taskData.schedule_day = formData.get("scheduleDay") as string
    }

    // Calculate next run time
    const now = new Date()
    const [hours, minutes] = (taskData.schedule_time || "00:00").split(":").map(Number)
    const nextRun = new Date(now)
    nextRun.setHours(hours, minutes, 0, 0)

    if (nextRun <= now) {
      nextRun.setDate(nextRun.getDate() + 1)
    }

    if (taskData.schedule_frequency === "weekly") {
      const days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"]
      const targetDay = days.indexOf(taskData.schedule_day || "monday")
      const currentDay = nextRun.getDay()
      const daysUntilTarget = (targetDay + 7 - currentDay) % 7

      nextRun.setDate(nextRun.getDate() + daysUntilTarget)
    }

    taskData.next_run = nextRun.toISOString()
  }

  const { data, error } = await supabase.from("scraping_tasks").insert(taskData).select().single()

  if (error) {
    return { error: error.message }
  }

  return { success: true, task: data }
}

export async function getScrapingTasks() {
  const session = await getSession()

  if (!session) {
    return { error: "You must be logged in to view scraping tasks" }
  }

  const { data, error } = await supabase
    .from("scraping_tasks")
    .select("*")
    .eq("user_id", session.user.id)
    .order("created_at", { ascending: false })

  if (error) {
    return { error: error.message }
  }

  return { success: true, tasks: data }
}

export async function getScrapingTask(taskId: string) {
  const session = await getSession()

  if (!session) {
    return { error: "You must be logged in to view a scraping task" }
  }

  const { data, error } = await supabase
    .from("scraping_tasks")
    .select("*")
    .eq("id", taskId)
    .eq("user_id", session.user.id)
    .single()

  if (error) {
    return { error: error.message }
  }

  return { success: true, task: data }
}

export async function updateScrapingTask(taskId: string, updates: Partial<ScrapingTask>) {
  const session = await getSession()

  if (!session) {
    return { error: "You must be logged in to update a scraping task" }
  }

  const { data, error } = await supabase
    .from("scraping_tasks")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", taskId)
    .eq("user_id", session.user.id)
    .select()
    .single()

  if (error) {
    return { error: error.message }
  }

  return { success: true, task: data }
}

export async function deleteScrapingTask(taskId: string) {
  const session = await getSession()

  if (!session) {
    return { error: "You must be logged in to delete a scraping task" }
  }

  const { error } = await supabase.from("scraping_tasks").delete().eq("id", taskId).eq("user_id", session.user.id)

  if (error) {
    return { error: error.message }
  }

  return { success: true }
}
