import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import type { Database } from "@/types/supabase"
import { cache } from "react"

export const createServerSupabaseClient = cache(() => {
  const cookieStore = cookies()

  // Check if environment variables are available
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    console.error("Missing NEXT_PUBLIC_SUPABASE_URL environment variable")
    throw new Error("Supabase URL is required. Please check your environment variables.")
  }

  return createServerComponentClient<Database>({ cookies: () => cookieStore })
})

export async function getServerSession() {
  const supabase = createServerSupabaseClient()
  try {
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
  const session = await getServerSession()
  return session?.user || null
}
