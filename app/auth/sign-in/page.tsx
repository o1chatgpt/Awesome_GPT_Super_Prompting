"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Loader2, Eye, EyeOff, AlertCircle, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { signInWithRememberMe, ensureUserProfile } from "@/lib/actions/auth"

interface ValidationErrors {
  identifier?: string
  password?: string
  form?: string
}

export default function SignInPage() {
  const router = useRouter()
  const [signInData, setSignInData] = useState({
    identifier: "",
    password: "",
  })
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [showPassword, setShowPassword] = useState(false)
  const [formSubmitted, setFormSubmitted] = useState(false)

  // Validate form on input change
  useEffect(() => {
    if (Object.keys(touched).length > 0 || formSubmitted) {
      validateForm()
    }
  }, [signInData, touched, formSubmitted])

  const validateForm = () => {
    const errors: ValidationErrors = {}

    // Validate identifier (email or username)
    if (!signInData.identifier) {
      errors.identifier = "Username or email is required"
    } else if (signInData.identifier.includes("@")) {
      // If it looks like an email, validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(signInData.identifier)) {
        errors.identifier = "Please enter a valid email address"
      }
    } else if (signInData.identifier.length < 3) {
      errors.identifier = "Username must be at least 3 characters"
    }

    // Validate password
    if (!signInData.password) {
      errors.password = "Password is required"
    } else if (signInData.password.length < 6) {
      errors.password = "Password must be at least 6 characters"
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setSignInData((prev) => ({ ...prev, [name]: value }))

    // Clear server error when user starts typing
    if (serverError) {
      setServerError(null)
    }
  }

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target
    setTouched((prev) => ({ ...prev, [name]: true }))
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormSubmitted(true)

    // Validate form before submission
    if (!validateForm()) {
      return
    }

    setIsLoading(true)
    setServerError(null)

    const formData = new FormData()
    formData.append("identifier", signInData.identifier)
    formData.append("password", signInData.password)
    formData.append("rememberMe", rememberMe.toString())

    try {
      console.log("Attempting sign in with:", signInData.identifier)

      // Call the server action and handle the response
      const result = await signInWithRememberMe(formData)
      console.log("Sign in result:", result)

      if (!result || typeof result !== "object") {
        console.error("Invalid response format:", result)
        setServerError("Received an invalid response from the server. Please try again.")
        return
      }

      if (!result.success) {
        console.error("Sign in error:", result.error)
        setServerError(result.error || "An error occurred during sign in")
      } else {
        if (result.user) {
          try {
            const profileResult = await ensureUserProfile(result.user.id, result.user.email || "")
            if (!profileResult.success) {
              console.error("Profile creation error:", profileResult.error)
              // Continue anyway, as the user is still logged in
            }
          } catch (profileError) {
            console.error("Error ensuring user profile:", profileError)
            // Continue anyway, as the user is still logged in
          }

          console.log("Sign in successful, redirecting to dashboard...")
          // Force a hard navigation instead of client-side navigation
          window.location.href = "/dashboard"
        } else {
          setServerError("User information not found in the response")
        }
      }
    } catch (error) {
      console.error("Unexpected sign in error:", error)
      setServerError("An unexpected error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  // Helper function to determine if a field has an error
  const hasError = (field: keyof ValidationErrors) => {
    return (touched[field] || formSubmitted) && !!validationErrors[field]
  }

  // Helper function to determine if a field is valid
  const isValid = (field: keyof ValidationErrors) => {
    return (touched[field] || formSubmitted) && !validationErrors[field] && signInData[field as keyof typeof signInData]
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Sign In</CardTitle>
          <CardDescription className="text-center">Enter your credentials to access your account</CardDescription>
        </CardHeader>
        <CardContent>
          {serverError && (
            <Alert className="mb-4 bg-red-50 text-red-800">
              <AlertCircle className="h-4 w-4 mr-2" />
              <AlertDescription>{serverError}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <div className="flex items-center justify-between">
                <Label htmlFor="identifier" className="block text-sm font-medium text-gray-700">
                  Username or Email
                </Label>
                {hasError("identifier") && <span className="text-xs text-red-600">{validationErrors.identifier}</span>}
              </div>
              <div className="relative mt-1">
                <Input
                  id="identifier"
                  name="identifier"
                  type="text"
                  value={signInData.identifier}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Enter your username or email"
                  className={`${
                    hasError("identifier")
                      ? "border-red-500 pr-10"
                      : isValid("identifier")
                        ? "border-green-500 pr-10"
                        : ""
                  }`}
                  aria-invalid={hasError("identifier")}
                  aria-describedby={hasError("identifier") ? "identifier-error" : undefined}
                />
                {hasError("identifier") && (
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <AlertCircle className="h-5 w-5 text-red-500" />
                  </div>
                )}
                {isValid("identifier") && (
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  </div>
                )}
              </div>
              {hasError("identifier") && (
                <p className="mt-1 text-xs text-red-600" id="identifier-error">
                  {validationErrors.identifier}
                </p>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </Label>
                <Link
                  href="/auth/reset-password/request"
                  className="text-sm font-medium text-blue-600 hover:text-blue-500"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative mt-1">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={signInData.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Enter your password"
                  className={`${
                    hasError("password") ? "border-red-500" : isValid("password") ? "border-green-500" : ""
                  }`}
                  aria-invalid={hasError("password")}
                  aria-describedby={hasError("password") ? "password-error" : undefined}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              {hasError("password") && (
                <p className="mt-1 text-xs text-red-600" id="password-error">
                  {validationErrors.password}
                </p>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="remember-me"
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(checked === true)}
              />
              <Label
                htmlFor="remember-me"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Remember me for 30 days
              </Label>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <Link href="/auth/register" className="font-medium text-blue-600 hover:text-blue-500">
              Register
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
