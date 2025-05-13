"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import type { User, Session } from "@supabase/supabase-js"
import type { Profile } from "@/lib/database"

type AuthContextType = {
  user: User | null
  profile: Profile | null
  session: Session | null
  isLoading: boolean
  isGuest: boolean
  authError: string | null
  signOut: () => Promise<void>
  refreshSession: () => Promise<void>
  enableGuestMode: () => void
  disableGuestMode: () => void
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  session: null,
  isLoading: true,
  isGuest: false,
  authError: null,
  signOut: async () => {},
  refreshSession: async () => {},
  enableGuestMode: () => {},
  disableGuestMode: () => {},
})

export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isGuest, setIsGuest] = useState(false)
  const [authError, setAuthError] = useState<string | null>(null)
  const router = useRouter()

  // Create the Supabase client with explicit URL and key
  const supabase = createClientComponentClient({
    supabaseUrl: "https://your-project-url.supabase.co",
    supabaseKey: "your-anon-key",
  })

  // Fetch user profile
  const fetchProfile = async (userId: string) => {
    try {
      console.log("Fetching profile for user:", userId)
      const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).single()

      if (error) {
        console.error("Error fetching profile:", error)
        return null
      }

      console.log("Profile fetched successfully:", data)
      return data as Profile
    } catch (error) {
      console.error("Unexpected error fetching profile:", error)
      return null
    }
  }

  // Create profile if it doesn't exist
  const ensureProfile = async (user: User) => {
    try {
      console.log("Ensuring profile exists for user:", user.id)

      // Check if profile exists
      const { count, error: countError } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true })
        .eq("id", user.id)

      if (countError) {
        console.error("Error checking profile count:", countError)
        return null
      }

      console.log(`Found ${count} profiles for user ID ${user.id}`)

      // If no profile exists, create one
      if (count === 0) {
        console.log("Creating profile for user:", user.id)

        // Get provider-specific data
        const provider = user.app_metadata?.provider || "email"
        let username = `user_${Date.now().toString().slice(-6)}`
        let fullName = "User"

        // Extract name from provider data if available
        if (provider === "google" && user.user_metadata?.full_name) {
          fullName = user.user_metadata.full_name
        } else if (provider === "github" && user.user_metadata?.user_name) {
          username = user.user_metadata.user_name
          fullName = user.user_metadata.full_name || username
        } else if (user.user_metadata?.name) {
          fullName = user.user_metadata.name
        }

        console.log("Creating profile with data:", {
          id: user.id,
          email: user.email,
          username,
          fullName,
          provider,
        })

        const { data, error } = await supabase
          .from("profiles")
          .insert({
            id: user.id,
            email: user.email,
            username: username,
            full_name: fullName,
            role: "user",
            is_active: true,
            created_at: new Date().toISOString(),
            last_login: new Date().toISOString(),
            auth_provider: provider,
          })
          .select()
          .single()

        if (error) {
          console.error("Error creating profile:", error)
          return null
        }

        console.log("Profile created successfully:", data)
        return data as Profile
      }

      // Fetch existing profile
      return await fetchProfile(user.id)
    } catch (error) {
      console.error("Error ensuring profile:", error)
      return null
    }
  }

  // Refresh the session and user data
  const refreshSession = async () => {
    try {
      setIsLoading(true)
      setAuthError(null)

      console.log("Refreshing session...")
      const { data, error } = await supabase.auth.getSession()

      if (error) {
        console.error("Error refreshing session:", error)
        setAuthError("Failed to refresh authentication session")
        setUser(null)
        setProfile(null)
        setSession(null)
        return
      }

      if (data.session) {
        console.log("Session found:", data.session.user.id)
        setSession(data.session)
        setUser(data.session.user)

        // Ensure profile exists and fetch it
        const profile = await ensureProfile(data.session.user)
        setProfile(profile)
      } else {
        console.log("No session found")

        // Check if user is in guest mode
        const guestMode = localStorage.getItem("guestMode") === "true"

        if (guestMode) {
          console.log("Guest mode active")
          enableGuestMode()
        } else {
          setUser(null)
          setProfile(null)
          setSession(null)
        }
      }
    } catch (error) {
      console.error("Unexpected error refreshing session:", error)
      setAuthError("An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  // Sign out function
  const signOut = async () => {
    try {
      console.log("Signing out...")
      const { error } = await supabase.auth.signOut()

      if (error) {
        console.error("Error signing out:", error)
        setAuthError("Failed to sign out")
        return
      }

      console.log("Sign out successful")
      setUser(null)
      setProfile(null)
      setSession(null)
      setIsGuest(false)
      localStorage.removeItem("guestMode")

      router.push("/auth/sign-in")
    } catch (error) {
      console.error("Error signing out:", error)
      setAuthError("Failed to sign out")
    }
  }

  // Enable guest mode
  const enableGuestMode = () => {
    console.log("Enabling guest mode")
    localStorage.setItem("guestMode", "true")
    setIsGuest(true)
    setAuthError(null)

    // Create a guest profile
    setProfile({
      id: "guest",
      email: "guest@example.com",
      full_name: "Guest User",
      username: "guest",
      role: "guest",
      is_active: true,
      created_at: new Date().toISOString(),
      last_login: new Date().toISOString(),
      auth_provider: "guest",
    } as Profile)
  }

  // Disable guest mode
  const disableGuestMode = () => {
    console.log("Disabling guest mode")
    localStorage.removeItem("guestMode")
    setIsGuest(false)
    setProfile(null)
    router.push("/auth/sign-in")
  }

  // Initialize auth state
  useEffect(() => {
    console.log("Initializing auth provider...")
    refreshSession()

    // Set up auth state change listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      console.log("Auth state changed:", event)

      if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
        if (newSession) {
          console.log("New session detected:", newSession.user.id)
          setSession(newSession)
          setUser(newSession.user)
          setIsGuest(false)
          localStorage.removeItem("guestMode")

          // Ensure profile exists and fetch it
          const profile = await ensureProfile(newSession.user)
          setProfile(profile)

          // If we just signed in, redirect to dashboard
          if (event === "SIGNED_IN") {
            console.log("User signed in, redirecting to dashboard")
            router.push("/dashboard")
          }
        }
      } else if (event === "SIGNED_OUT") {
        console.log("User signed out")
        setUser(null)
        setProfile(null)
        setSession(null)

        // Only redirect if not in guest mode
        if (!isGuest) {
          router.push("/auth/sign-in")
        }
      }

      setIsLoading(false)
    })

    // Clean up subscription
    return () => {
      console.log("Cleaning up auth subscription")
      subscription.unsubscribe()
    }
  }, [router, supabase])

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        session,
        isLoading,
        isGuest,
        authError,
        signOut,
        refreshSession,
        enableGuestMode,
        disableGuestMode,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
