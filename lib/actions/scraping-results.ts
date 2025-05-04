"use server"

import { supabase } from "@/lib/database"
import { getSession } from "./auth"
import type { ScrapingResult } from "@/lib/database"

export async function saveScrapingResult(taskId: string, rawData: string, formattedData?: string, aiAnalysis?: any) {
  const session = await getSession()

  if (!session) {
    return { error: "You must be logged in to save scraping results" }
  }

  const resultData: Partial<ScrapingResult> = {
    task_id: taskId,
    user_id: session.user.id,
    raw_data: rawData,
    formatted_data: formattedData,
    ai_analysis: aiAnalysis ? JSON.stringify(aiAnalysis) : undefined,
  }

  const { data, error } = await supabase.from("scraping_results").insert(resultData).select().single()

  if (error) {
    return { error: error.message }
  }

  // Update the task status to completed
  await supabase
    .from("scraping_tasks")
    .update({
      status: "completed",
      last_run: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq("id", taskId)
    .eq("user_id", session.user.id)

  return { success: true, result: data }
}

export async function getScrapingResults(taskId: string) {
  const session = await getSession()

  if (!session) {
    return { error: "You must be logged in to view scraping results" }
  }

  const { data, error } = await supabase
    .from("scraping_results")
    .select("*")
    .eq("task_id", taskId)
    .eq("user_id", session.user.id)
    .order("created_at", { ascending: false })

  if (error) {
    return { error: error.message }
  }

  return { success: true, results: data }
}

export async function getLatestScrapingResult(taskId: string) {
  const session = await getSession()

  if (!session) {
    return { error: "You must be logged in to view scraping results" }
  }

  const { data, error } = await supabase
    .from("scraping_results")
    .select("*")
    .eq("task_id", taskId)
    .eq("user_id", session.user.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .single()

  if (error) {
    return { error: error.message }
  }

  return { success: true, result: data }
}
