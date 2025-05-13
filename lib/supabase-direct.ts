import { createClient } from "@supabase/supabase-js"

// Create a client with hardcoded values from the environment variables
// This is a fallback for when the environment variables aren't accessible
export const supabaseDirect = createClient(
  "https://your-project-ref.supabase.co", // Replace with your actual Supabase URL
  "your-anon-key", // Replace with your actual anon key
)
