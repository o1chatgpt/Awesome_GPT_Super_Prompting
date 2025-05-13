import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import type { Database } from "@/types/supabase"

// Create a singleton instance of the Supabase client
let supabaseInstance: ReturnType<typeof createClientComponentClient<Database>> | null = null

export function getSupabaseBrowserClient() {
  if (supabaseInstance) {
    return supabaseInstance
  }

  // Create client without explicit options - it will use env vars automatically
  supabaseInstance = createClientComponentClient<Database>()
  return supabaseInstance
}
