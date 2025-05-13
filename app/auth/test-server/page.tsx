"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { signOut } from "@/lib/actions/auth-actions"

export default function TestServerAuthPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<any>(null)

  const testServerAuth = async () => {
    setIsLoading(true)
    try {
      // Make a fetch request to a server endpoint that requires authentication
      const response = await fetch("/api/auth/status")
      const data = await response.json()
      setResult(data)
    } catch (error) {
      console.error("Error testing server auth:", error)
      setResult({ error: "Failed to test server authentication" })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignOut = async () => {
    await signOut()
  }

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Test Server Authentication</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex space-x-4">
            <Button onClick={testServerAuth} disabled={isLoading}>
              {isLoading ? "Testing..." : "Test Server Auth"}
            </Button>
            <Button variant="outline" onClick={handleSignOut}>
              Sign Out
            </Button>
          </div>

          {result && (
            <Alert className="mt-4">
              <AlertDescription>
                <pre className="whitespace-pre-wrap">{JSON.stringify(result, null, 2)}</pre>
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
