import { createClient } from "@supabase/supabase-js"

// Initialize the Supabase client
export const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

// Define database types
export type Profile = {
  id: string
  email: string
  username: string
  full_name: string
  role: "admin" | "user" | "viewer"
  created_at: string
  updated_at: string
  last_sign_in: string | null
  is_active: boolean
}

export type ScrapingTask = {
  id: string
  user_id: string
  url: string
  status: "pending" | "in_progress" | "completed" | "failed"
  created_at: string
  updated_at: string
  completed_at: string | null
  result_id: string | null
  schedule: string | null
  proxy_id: string | null
}

export type ScrapingResult = {
  id: string
  task_id: string
  content: any
  created_at: string
  metadata: any
}

export type Proxy = {
  id: string
  host: string
  port: number
  username: string | null
  password: string | null
  protocol: "http" | "https" | "socks4" | "socks5"
  is_active: boolean
  last_used: string | null
  success_count: number
  failure_count: number
  created_at: string
  updated_at: string
}

export type Memory = {
  id: string
  content: string
  metadata: any
  created_at: string
  updated_at: string
  user_id: string
  importance: number
  category: string
}

export type TaskRating = {
  id: string
  task_id: string
  user_id: string
  rating: number
  feedback: string | null
  created_at: string
}

export type Invitation = {
  id: string
  email: string
  role: "admin" | "user" | "viewer"
  token: string
  invited_by: string
  created_at: string
  expires_at: string
  used_at: string | null
  inviter?: Profile
}

export type UserActivity = {
  id: string
  user_id: string
  action: string
  details: any
  created_at: string
  ip_address: string | null
}
