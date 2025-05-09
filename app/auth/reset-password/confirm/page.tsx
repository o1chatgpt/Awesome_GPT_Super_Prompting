"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Loader2, EyeIcon, EyeOffIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { confirmPasswordReset } from "@/lib/actions/auth"

export default function PasswordResetConfirmPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [status, setStatus] = useState<{ success?: boolean; message?: string } | null>(null)
  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    // Get token from URL
    const tokenFromUrl = searchParams.get("token")
    if (!tokenFromUrl) {
      setStatus({
        success: false,
        message: "Invalid or missing reset token. Please request a new password reset link.",
      })
    } else {
      setToken(tokenFromUrl)
    }
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      setStatus({ success: false, message: "Passwords do not match." })
      return
    }

    if (password.length < 8) {
      setStatus({ success: false, message: "Password must be at least 8 characters long." })
      return
    }

    if (!token) {
      setStatus({
        success: false,
        message: "Invalid or missing reset token. Please request a new password reset link.",
      })
      return
    }

    setIsLoading(true)
    setStatus(null)

    try {
      const result = await confirmPasswordReset(token, password)

      if (result.error) {
        setStatus({ success: false, message: result.error })
      } else {
        setStatus({
          success: true,
          message: "Your password has been successfully reset. You can now sign in with your new password.",
        })

        // Redirect to sign in page after 3 seconds
        setTimeout(() => {
          router.push("/auth/sign-in")
        }, 3000)
      }
    } catch (error) {
      setStatus({
        success: false,
        message: "An unexpected error occurred. Please try again later.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Set New Password</CardTitle>
          <CardDescription className="text-center">Create a new password for your account</CardDescription>
        </CardHeader>
        <CardContent>
          {status && (
            <Alert className={`mb-4 ${status.success ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"}`}>
              <AlertDescription>{status.message}</AlertDescription>
            </Alert>
          )}

          {!status?.success && token && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  New Password
                </label>
                <div className="relative mt-1">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter new password"
                    required
                    className="pr-10"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 flex items-center pr-3"
                    onClick={togglePasswordVisibility}
                  >
                    {showPassword ? (
                      <EyeOffIcon className="h-5 w-5 text-gray-400" />
                    ) : (
                      <EyeIcon className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                  Confirm New Password
                </label>
                <Input
                  id="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  required
                  className="mt-1"
                />
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Resetting...
                  </>
                ) : (
                  "Reset Password"
                )}
              </Button>
            </form>
          )}
        </CardContent>
        <CardFooter className="flex justify-center">
          <Link href="/auth/sign-in" className="flex items-center text-sm text-gray-600 hover:text-gray-900">
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back to Sign In
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}
