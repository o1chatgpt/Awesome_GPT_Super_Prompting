"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function TestServerActionPage() {
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const testServerAction = async () => {
    try {
      // Create a simple object to test serialization
      const testObject = {
        success: true,
        data: {
          message: "This is a test",
          timestamp: new Date().toISOString(),
        },
      }

      // Simulate a server action response
      setResult(testObject)
      setError(null)
    } catch (err) {
      console.error("Error testing server action:", err)
      setError("An error occurred while testing the server action")
      setResult(null)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-xl font-bold">Test Server Action</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={testServerAction} className="w-full">
            Test Server Action
          </Button>

          {error && <div className="p-4 bg-red-50 text-red-800 rounded">{error}</div>}

          {result && (
            <div className="p-4 bg-gray-50 rounded">
              <pre className="whitespace-pre-wrap overflow-auto">{JSON.stringify(result, null, 2)}</pre>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
