"use client"

import type React from "react"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Loader2, Mail, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/app/providers/auth-provider"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { FcGoogle } from "react-icons/fc"
import { FaGithub } from "react-icons/fa"
import { signInWithEmail } from "@/lib/actions/auth-actions"
import { EnvChecker } from "@/app/components/env-checker"

export default function SignInPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [isGuestLoading, setIsGuestLoading] = useState(false)
  const [isSocialLoading, setIsSocialLoading] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [debugInfo, setDebugInfo] = useState<string | null>(null)
  const router = useRouter()
  const { enableGuestMode } = useAuth()
  const supabase = createClientComponentClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setDebugInfo(null)

    // Validate inputs
    if (!email || !password) {
      setError("Email and password are required")
      return
    }

    // Use React's useTransition to handle the server action
    startTransition(async () => {
      try {
        // Create a FormData object to pass to the server action
        const formData = new FormData()
        formData.append("email", email)
        formData.append("password", password)
        formData.append("rememberMe", rememberMe ? "on" : "off")

        // Call the server action
        const result = await signInWithEmail(formData)

        if (result.error) {
          setError(result.error)
          if (result.debug) {
            setDebugInfo(result.debug)
          }
          return
        }

        // If successful, refresh the page and redirect
        router.push("/dashboard")
        router.refresh()
      } catch (err: any) {
        console.error("Client-side error during sign in:", err)
        setError("An unexpected error occurred. Please try again.")
        setDebugInfo(err.toString())
      }
    })
  }

  const handleSocialLogin = async (provider: "google" | "github") => {
    try {
      setIsSocialLoading(provider)
      setError(null)
      setDebugInfo(null)

      // Get the current URL for the redirect
      const redirectTo = `${window.location.origin}/auth/callback`

      // Sign in with the selected provider
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo,
          scopes: provider === "github" ? "user:email" : undefined,
        },
      })

      if (error) {
        console.error(`${provider} login error:`, error)
        setError(error.message || `Failed to sign in with ${provider}`)
        setDebugInfo(JSON.stringify(error, null, 2))
        setIsSocialLoading(null)
        return
      }

      // The user will be redirected to the provider's login page
    } catch (err: any) {
      console.error(`${provider} login error:`, err)
      setError(`Failed to sign in with ${provider}. Please try again.`)
      setDebugInfo(err.toString())
      setIsSocialLoading(null)
    }
  }

  const handleGuestMode = () => {
    setIsGuestLoading(true)
    try {
      enableGuestMode()
      router.push("/dashboard")
    } catch (error: any) {
      console.error("Error enabling guest mode:", error)
      setError("Failed to enable guest mode. Please try again.")
      setDebugInfo(error.toString())
    } finally {
      setIsGuestLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 py-12 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Sign in</CardTitle>
          <CardDescription className="text-center">Choose your preferred sign in method</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <EnvChecker />

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4 mr-2" />
              <AlertDescription>
                {error}
                {debugInfo && process.env.NODE_ENV !== "production" && (
                  <details className="mt-2">
                    <summary className="cursor-pointer text-xs font-medium">Technical details</summary>
                    <pre className="mt-1 text-xs overflow-auto p-2 bg-red-50 rounded">{debugInfo}</pre>
                  </details>
                )}
              </AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              onClick={() => handleSocialLogin("google")}
              disabled={isPending || !!isSocialLoading}
              className="flex items-center justify-center gap-2"
            >
              {isSocialLoading === "google" ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <FcGoogle className="h-5 w-5" />
              )}
              Google
            </Button>
            <Button
              variant="outline"
              onClick={() => handleSocialLogin("github")}
              disabled={isPending || !!isSocialLoading}
              className="flex items-center justify-center gap-2"
            >
              {isSocialLoading === "github" ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <FaGithub className="h-5 w-5" />
              )}
              GitHub
            </Button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or continue with email</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isPending}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link href="/auth/reset-password/request" className="text-sm font-medium text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isPending}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="remember"
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(checked === true)}
                disabled={isPending}
              />
              <Label
                htmlFor="remember"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Remember me
              </Label>
            </div>

            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  <Mail className="mr-2 h-4 w-4" />
                  Sign in with Email
                </>
              )}
            </Button>
          </form>

          <Separator />

          <Button
            type="button"
            variant="outline"
            onClick={handleGuestMode}
            className="w-full"
            disabled={isGuestLoading || isPending}
          >
            {isGuestLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading guest mode...
              </>
            ) : (
              "Continue as Guest"
            )}
          </Button>

          <div className="text-center">
            <Link href="/admin/create-default-user" className="text-sm text-blue-600 hover:underline">
              Create Default User
            </Link>
            {" | "}
            <Link href="/auth/debug" className="text-sm text-blue-600 hover:underline">
              Debug Auth
            </Link>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link href="/auth/register" className="font-medium text-primary hover:underline">
              Sign up
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
