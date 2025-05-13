"use client"

import type React from "react"

import { useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, AlertCircle, CheckCircle } from "lucide-react"

export default function CreateDefaultUser() {
  const [email, setEmail] = useState("gogiapandie@gmail.com")
  const [password, setPassword] = useState("")
  const [fullName, setFullName] = useState("Default Admin")
  const [username, setUsername] = useState("admin")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [debugInfo, setDebugInfo] = useState<string | null>(null)
  const supabase = createClientComponentClient()

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccess(null)
    setDebugInfo(null)

    try {
      // First check if user exists
      console.log("Checking if user exists:", email)
      const { data: existingUsers, error: checkError } = await supabase
        .from("profiles")
        .select("id, email")
        .eq("email", email)

      if (checkError) {
        console.error("Error checking for existing user:", checkError)
        setError("Error checking for existing user: " + checkError.message)
        setDebugInfo(JSON.stringify(checkError, null, 2))
        return
      }

      if (existingUsers && existingUsers.length > 0) {
        setSuccess(`User already exists with email ${email}. You can now sign in.`)
        console.log("User already exists:", existingUsers[0])
        return
      }

      // Create user with Supabase Auth
      console.log("Creating new user:", email)
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            username: username,
            role: "admin", // Make this user an admin
          },
        },
      })

      if (signUpError) {
        console.error("Error creating user:", signUpError)
        setError("Error creating user: " + signUpError.message)
        setDebugInfo(JSON.stringify(signUpError, null, 2))
        return
      }

      if (!authData.user) {
        setError("Failed to create user - no user returned")
        return
      }

      console.log("User created successfully:", authData.user)

      // Create profile entry
      const { error: profileError } = await supabase.from("profiles").insert({
        id: authData.user.id,
        email: email,
        full_name: fullName,
        username: username,
        role: "admin",
        is_active: true,
        created_at: new Date().toISOString(),
        auth_provider: "email",
      })

      if (profileError) {
        console.error("Error creating profile:", profileError)
        setError("User created but error creating profile: " + profileError.message)
        setDebugInfo(JSON.stringify(profileError, null, 2))
        return
      }

      setSuccess(`Default user created successfully with email ${email}. You can now sign in.`)
    } catch (err: any) {
      console.error("Unexpected error:", err)
      setError("An unexpected error occurred: " + (err.message || err.toString()))
      setDebugInfo(err.toString())
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 py-12 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Create Default User</CardTitle>
          <CardDescription className="text-center">
            Create a default admin user to get started with your application
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4 mr-2" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert variant="default" className="bg-green-50 text-green-800 border-green-200">
              <CheckCircle className="h-4 w-4 mr-2" />
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          {debugInfo && (
            <Alert variant="default" className="bg-yellow-50 text-yellow-800 border-yellow-200">
              <details>
                <summary className="cursor-pointer font-medium">Debug Information</summary>
                <pre className="mt-2 text-xs overflow-auto p-2 bg-yellow-100 rounded">{debugInfo}</pre>
              </details>
            </Alert>
          )}

          <form onSubmit={handleCreateUser} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
                placeholder="Enter a strong password"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating User...
                </>
              ) : (
                "Create Default User"
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <a href="/auth/sign-in" className="font-medium text-primary hover:underline">
              Sign in
            </a>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
