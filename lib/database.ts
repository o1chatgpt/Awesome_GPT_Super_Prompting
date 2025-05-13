import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/types/supabase"

// Define the types for our database tables
export interface Profile {
  id: string
  email: string
  full_name: string
  username: string
  avatar_url?: string
  role: "admin" | "user" | "viewer"
  is_active: boolean
  created_at: string
  last_login?: string
  preferences?: {
    theme?: string
    emailNotifications?: boolean
    dashboardLayout?: string
    language?: string
    [key: string]: any
  }
}

export interface Invitation {
  id: string
  email: string
  role: "admin" | "user" | "viewer"
  token: string
  invited_by: string
  created_at: string
  expires_at: string
  used_at?: string
  template_id?: string
  inviter?: Profile
}

export interface InvitationTemplate {
  id: string
  name: string
  subject: string
  content: string
  is_default: boolean
  created_by: string
  created_at: string
  updated_at?: string
}

export interface ScrapingTask {
  id: string
  user_id: string
  url: string
  content_type: string
  depth: string
  format: string
  schedule_type: string
  schedule_frequency?: string
  schedule_time?: string
  schedule_day?: string
  status: string
  last_run?: string
  next_run?: string
  created_at: string
  updated_at: string
}

export interface ScrapingResult {
  id: string
  task_id: string
  user_id: string
  raw_data: string
  formatted_data?: string
  ai_analysis?: string
  error?: string
  created_at: string
}

export interface TaskRating {
  id: string
  task_id: string
  user_id: string
  rating: number
  feedback?: string
  created_at: string
}

export interface Memory {
  id: string
  user_id: string
  content: string
  type: string
  relevance: number
  created_at: string
  metadata?: Record<string, any>
  is_admin_visible?: boolean
}

export interface UserActivity {
  id: string
  user_id: string
  action: string
  resource_type: string
  resource_id?: string
  details?: Record<string, any>
  created_at: string
}

// Create a function to get the Supabase client
// This allows us to handle missing environment variables gracefully
let supabaseInstance: ReturnType<typeof createClient<Database>> | null = null

export function getSupabaseClient() {
  // If we already have an instance, return it
  if (supabaseInstance) {
    return supabaseInstance
  }

  // Check if the required environment variables are available
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // Log missing environment variables
  if (!supabaseUrl) {
    console.error("NEXT_PUBLIC_SUPABASE_URL is not defined")
  }

  if (!supabaseAnonKey) {
    console.error("NEXT_PUBLIC_SUPABASE_ANON_KEY is not defined")
  }

  // Only create the client if both URL and key are available
  if (supabaseUrl && supabaseAnonKey) {
    try {
      supabaseInstance = createClient<Database>(supabaseUrl, supabaseAnonKey)
      console.log("Supabase client initialized successfully")
      return supabaseInstance
    } catch (error) {
      console.error("Failed to initialize Supabase client:", error)
      throw new Error("Failed to initialize Supabase client. Check your environment variables.")
    }
  } else {
    throw new Error("Supabase URL and API key are required. Please check your environment variables.")
  }
}

// Export a dummy client for type compatibility
// This will be replaced with the actual client when getSupabaseClient is called
export const supabase = {} as ReturnType<typeof createClient<Database>>

export type { Memory, UserActivity, ScrapingTask, ScrapingResult, TaskRating }
