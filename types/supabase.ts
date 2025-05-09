export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string
          username: string
          avatar_url?: string
          role: "admin" | "user" | "viewer"
          is_active: boolean
          created_at: string
          last_login?: string
          preferences?: Json
        }
        Insert: {
          id: string
          email: string
          full_name: string
          username: string
          avatar_url?: string
          role?: "admin" | "user" | "viewer"
          is_active?: boolean
          created_at?: string
          last_login?: string
          preferences?: Json
        }
        Update: {
          id?: string
          email?: string
          full_name?: string
          username?: string
          avatar_url?: string
          role?: "admin" | "user" | "viewer"
          is_active?: boolean
          created_at?: string
          last_login?: string
          preferences?: Json
        }
      }
      // Add other tables as needed
    }
  }
}
