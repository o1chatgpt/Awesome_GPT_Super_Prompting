import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import type { Database } from "@/types/supabase"
import { cache } from "react"

// Create a cached function to get the Supabase server client
export const createServerSupabaseClient = cache(() => {
  // Check if environment variables are available
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    console.error("Missing Supabase environment variables in server client")
    throw new Error("Supabase environment variables are required. Please check your configuration.")
  }

  const cookieStore = cookies()
  return createServerComponentClient<Database>({ cookies: () => cookieStore })
})

export async function getServerSession() {
  try {
    const supabase = createServerSupabaseClient()
    const {
      data: { session },
    } = await supabase.auth.getSession()
    return session
  } catch (error) {
    console.error("Error getting server session:", error)
    return null
  }
}

export async function getServerUser() {
  try {
    const session = await getServerSession()
    return session?.user || null
  } catch (error) {
    console.error("Error getting server user:", error)
    return null
  }
}
