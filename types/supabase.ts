export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          username: string
          full_name: string
          role: string
          is_active: boolean
          created_at: string
          last_login: string | null
          auth_provider: string
        }
        Insert: {
          id: string
          email: string
          username: string
          full_name: string
          role?: string
          is_active?: boolean
          created_at?: string
          last_login?: string | null
          auth_provider?: string
        }
        Update: {
          id?: string
          email?: string
          username?: string
          full_name?: string
          role?: string
          is_active?: boolean
          created_at?: string
          last_login?: string | null
          auth_provider?: string
        }
      }
      // Other tables...
    }
    // Views, functions, etc.
  }
}

export type Profile = Database["public"]["Tables"]["profiles"]["Row"]
