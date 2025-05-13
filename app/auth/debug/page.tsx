"use client"

import { useState, useEffect } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2 } from "lucide-react"

export default function AuthDebugPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [connectionStatus, setConnectionStatus] = useState<"checking" | "success" | "error">("checking")
  const [envVars, setEnvVars] = useState<Record<string, string | undefined>>({})
  const [sessionInfo, setSessionInfo] = useState<any>(null)
  const supabase = createClientComponentClient()

  useEffect(() => {
    checkConnection()
    checkEnvironmentVars()
    checkSession()
  }, [])

  const checkConnection = async () => {
    try {
      setConnectionStatus("checking")
      // Simple query to check if we can connect to Supabase
      const { data, error } = await supabase.from("profiles").select("count").limit(1)

      if (error) {
        console.error("Supabase connection error:", error)
        setConnectionStatus("error")
        setError(`Connection error: ${error.message}`)
      } else {
        console.log("Supabase connection successful:", data)
        setConnectionStatus("success")
      }
    } catch (err: any) {
      console.error("Unexpected connection error:", err)
      setConnectionStatus("error")
      setError(`Unexpected error: ${err.message || err.toString()}`)
    } finally {
      setIsLoading(false)
    }
  }

  const checkEnvironmentVars = () => {
    // Check for environment variables
    const vars: Record<string, string | undefined> = {
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "***" : undefined,
      SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY ? "***" : undefined,
    }

    setEnvVars(vars)
  }

  const checkSession = async () => {
    try {
      const { data, error } = await supabase.auth.getSession()
      if (error) {
        console.error("Session error:", error)
      } else {
        console.log("Session data:", data)
        setSessionInfo(data)
      }
    } catch (err) {
      console.error("Unexpected session error:", err)
    }
  }

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Authentication Debug</CardTitle>
          <CardDescription>Check your Supabase connection and authentication setup</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {isLoading ? (
            <div className="flex items-center justify-center p-6">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <>
              <div>
                <h3 className="text-lg font-medium mb-2">Supabase Connection</h3>
                {connectionStatus === "success" ? (
                  <Alert className="bg-green-50 text-green-800 border-green-200">
                    <AlertDescription>Connection to Supabase successful!</AlertDescription>
                  </Alert>
                ) : (
                  <Alert variant="destructive">
                    <AlertDescription>
                      {error || "Failed to connect to Supabase. Check your configuration."}
                    </AlertDescription>
                  </Alert>
                )}
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">Environment Variables</h3>
                <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md">
                  <pre className="text-sm">
                    {Object.entries(envVars).map(([key, value]) => (
                      <div key={key}>
                        <strong>{key}:</strong> {value || "Not set"}
                      </div>
                    ))}
                  </pre>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">Session Information</h3>
                <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md">
                  <pre className="text-sm overflow-auto max-h-60">
                    {sessionInfo ? JSON.stringify(sessionInfo, null, 2) : "No session found"}
                  </pre>
                </div>
              </div>

              <div className="flex space-x-4">
                <Button onClick={checkConnection}>Refresh Connection</Button>
                <Button variant="outline" onClick={checkSession}>
                  Refresh Session
                </Button>
                <Button variant="outline" asChild>
                  <a href="/admin/create-default-user">Create Default User</a>
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
