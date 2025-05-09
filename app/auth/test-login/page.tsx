"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { directLogin } from "@/lib/actions/auth"

export default function TestLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("gogiapandie@gmail.com")
  const [password, setPassword] = useState("!July1872")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<any>(null)

  const handleEmailLogin = async () => {
    setIsLoading(true)
    setError(null)
    setResult(null)

    try {
      const result = await directLogin(email, password)
      setResult(result)

      if (result.error) {
        setError(result.error)
      } else {
        // Wait a moment before redirecting
        setTimeout(() => {
          router.push("/dashboard")
          router.refresh()
        }, 1000)
      }
    } catch (error) {
      setError("An unexpected error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleAdminLogin = async () => {
    setIsLoading(true)
    setError(null)
    setResult(null)

    try {
      const result = await directLogin("admin", "!July1872")
      setResult(result)

      if (result.error) {
        setError(result.error)
      } else {
        // Wait a moment before redirecting
        setTimeout(() => {
          router.push("/dashboard")
          router.refresh()
        }, 1000)
      }
    } catch (error) {
      setError("An unexpected error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Test Login</CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert className="mb-4 bg-red-50 text-red-800">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {result && (
            <div className="mb-4 p-4 bg-gray-100 rounded overflow-auto max-h-40">
              <pre className="text-xs">{JSON.stringify(result, null, 2)}</pre>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1"
              />
            </div>

            <Button onClick={handleEmailLogin} className="w-full" disabled={isLoading}>
              {isLoading ? "Logging in..." : "Login with Email"}
            </Button>

            <Button onClick={handleAdminLogin} className="w-full" variant="outline" disabled={isLoading}>
              {isLoading ? "Logging in..." : "Login as Admin"}
            </Button>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-gray-600">This is a test page to debug login issues</p>
        </CardFooter>
      </Card>
    </div>
  )
}
