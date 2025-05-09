"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { supabase } from "@/lib/supabase-browser"
import { useRouter } from "next/navigation"
import type { Session, User } from "@supabase/supabase-js"
import type { Profile } from "@/lib/database"

type AuthContextType = {
  user: User | null
  profile: Profile | null
  session: Session | null
  isLoading: boolean
  signOut: () => Promise<void>
  refreshSession: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  session: null,
  isLoading: true,
  signOut: async () => {},
  refreshSession: async () => {},
})

export const useAuth = () => useContext(AuthContext)

// Update the AuthProvider to better handle session changes
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // Update the fetchProfile function to handle the case of multiple or no rows
  // Replace the existing fetchProfile function with this improved version:

  const fetchProfile = async (userId: string) => {
    try {
      console.log("Fetching profile for user ID:", userId)

      // First check if the profile exists
      const { count, error: countError } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true })
        .eq("id", userId)

      if (countError) {
        console.error("Error checking profile count:", countError)
        return null
      }

      console.log(`Found ${count} profiles for user ID ${userId}`)

      // If no profile exists, return null
      if (count === 0) {
        console.log("No profile found for user ID:", userId)
        return null
      }

      // If multiple profiles exist, log a warning and get the first one
      if (count > 1) {
        console.warn(`Multiple profiles (${count}) found for user ID ${userId}. Using the first one.`)

        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", userId)
          .order("created_at", { ascending: false })
          .limit(1)

        if (error) {
          console.error("Error fetching first profile:", error)
          return null
        }

        return data[0] as Profile
      }

      // Normal case - exactly one profile
      const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).maybeSingle()

      if (error) {
        console.error("Error fetching profile:", error)
        return null
      }

      return data as Profile
    } catch (error) {
      console.error("Unexpected error fetching profile:", error)
      return null
    }
  }

  // Refresh the session and user data
  const refreshSession = async () => {
    try {
      setIsLoading(true)
      const {
        data: { session: newSession },
        error,
      } = await supabase.auth.getSession()

      if (error) {
        console.error("Error refreshing session:", error)
        setUser(null)
        setProfile(null)
        setSession(null)
        return
      }

      if (newSession) {
        console.log("Session found in refreshSession:", newSession.user.id)
        setSession(newSession)
        setUser(newSession.user)

        const profile = await fetchProfile(newSession.user.id)
        setProfile(profile)
      } else {
        console.log("No session found in refreshSession")
        setUser(null)
        setProfile(null)
        setSession(null)
      }
    } catch (error) {
      console.error("Unexpected error refreshing session:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Sign out function
  const signOut = async () => {
    try {
      await supabase.auth.signOut()
      setUser(null)
      setProfile(null)
      setSession(null)
      router.push("/auth/sign-in")
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  // Initialize auth state
  useEffect(() => {
    console.log("AuthProvider initializing")
    refreshSession()

    // Set up auth state change listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      console.log("Auth state changed:", event, "Session exists:", !!newSession)

      if (newSession) {
        setSession(newSession)
        setUser(newSession.user)

        const profile = await fetchProfile(newSession.user.id)
        setProfile(profile)

        // If we just signed in, redirect to dashboard
        if (event === "SIGNED_IN") {
          console.log("User signed in, redirecting to dashboard")
          router.push("/dashboard")
        }
      } else {
        setUser(null)
        setProfile(null)
        setSession(null)
      }

      setIsLoading(false)

      // Force a router refresh to update server components
      router.refresh()
    })

    // Clean up subscription
    return () => {
      subscription.unsubscribe()
    }
  }, [router])

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        session,
        isLoading,
        signOut,
        refreshSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
