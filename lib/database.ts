import { createClient } from "@supabase/supabase-js"

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Type definitions for our database tables
export type User = {
  id: string
  email: string
  full_name: string
  username?: string
  avatar_url?: string
  created_at: string
  role: "user" | "admin" | "viewer"
  is_active: boolean
}

export type ScrapingTask = {
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
  status: "pending" | "in_progress" | "completed" | "failed" | "scheduled" | "paused"
  last_run?: string
  next_run?: string
  created_at: string
  updated_at: string
}

export type ScrapingResult = {
  id: string
  task_id: string
  user_id: string
  raw_data: string
  formatted_data?: string
  ai_analysis?: string
  error?: string
  created_at: string
}

export type TaskRating = {
  id: string
  task_id: string
  user_id: string
  rating: number
  feedback?: string
  created_at: string
}

export type Memory = {
  id: string
  user_id: string
  content: string
  type: string
  relevance: number
  metadata?: Record<string, any>
  is_admin_visible: boolean
  created_at: string
}

export type UserActivity = {
  id: string
  user_id: string
  action: string
  resource_type: string
  resource_id?: string
  details?: Record<string, any>
  created_at: string
}

// Add this type definition after the UserActivity type

export type Invitation = {
  id: string
  email: string
  role: "user" | "admin" | "viewer"
  token: string
  invited_by: string
  created_at: string
  expires_at: string
  used_at?: string
}
