"use client"

import { useState, useEffect } from "react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, CheckCircle, Info } from "lucide-react"
import { Button } from "@/components/ui/button"

export function EnvChecker() {
  const [envStatus, setEnvStatus] = useState<{
    url: boolean
    key: boolean
    checked: boolean
    connectionTested: boolean
    connectionOk: boolean
  }>({
    url: false,
    key: false,
    checked: false,
    connectionTested: false,
    connectionOk: false,
  })

  const checkEnvironmentVariables = () => {
    const url = !!process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    setEnvStatus((prev) => ({
      ...prev,
      url,
      key,
      checked: true,
    }))

    return { url, key }
  }

  const testConnection = async () => {
    try {
      // Simple fetch to test if we can reach Supabase
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL
      if (!url) return false

      const response = await fetch(`${url}/rest/v1/?apikey=${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })

      const connectionOk = response.ok

      setEnvStatus((prev) => ({
        ...prev,
        connectionTested: true,
        connectionOk,
      }))

      return connectionOk
    } catch (error) {
      console.error("Connection test failed:", error)
      setEnvStatus((prev) => ({
        ...prev,
        connectionTested: true,
        connectionOk: false,
      }))
      return false
    }
  }

  useEffect(() => {
    checkEnvironmentVariables()
  }, [])

  if (!envStatus.checked) {
    return null
  }

  const allVariablesAvailable = envStatus.url && envStatus.key

  return (
    <Alert variant={allVariablesAvailable ? "default" : "destructive"} className="mb-4">
      <div className="flex items-start">
        {allVariablesAvailable ? (
          <CheckCircle className="h-4 w-4 mt-0.5 mr-2 text-green-500" />
        ) : (
          <AlertCircle className="h-4 w-4 mt-0.5 mr-2" />
        )}
        <div className="w-full">
          <AlertTitle>Environment Variables Status</AlertTitle>
          <AlertDescription>
            <div className="mt-2 text-sm space-y-1">
              <div className="flex items-center">
                <span
                  className={`w-6 h-6 inline-flex items-center justify-center rounded-full mr-2 ${envStatus.url ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}
                >
                  {envStatus.url ? "✓" : "✗"}
                </span>
                <span>NEXT_PUBLIC_SUPABASE_URL: {envStatus.url ? "Available" : "Missing"}</span>
              </div>
              <div className="flex items-center">
                <span
                  className={`w-6 h-6 inline-flex items-center justify-center rounded-full mr-2 ${envStatus.key ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}
                >
                  {envStatus.key ? "✓" : "✗"}
                </span>
                <span>NEXT_PUBLIC_SUPABASE_ANON_KEY: {envStatus.key ? "Available" : "Missing"}</span>
              </div>

              {envStatus.connectionTested && (
                <div className="flex items-center mt-2">
                  <span
                    className={`w-6 h-6 inline-flex items-center justify-center rounded-full mr-2 ${envStatus.connectionOk ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}
                  >
                    {envStatus.connectionOk ? "✓" : "✗"}
                  </span>
                  <span>Connection test: {envStatus.connectionOk ? "Successful" : "Failed"}</span>
                </div>
              )}

              {allVariablesAvailable && !envStatus.connectionTested && (
                <Button variant="outline" size="sm" className="mt-2" onClick={testConnection}>
                  <Info className="h-4 w-4 mr-1" />
                  Test Connection
                </Button>
              )}

              {!allVariablesAvailable && (
                <div className="mt-2 p-2 bg-red-50 dark:bg-red-900/20 rounded text-xs">
                  <p className="font-medium">Missing required environment variables!</p>
                  <p className="mt-1">
                    Please check the{" "}
                    <code className="bg-red-100 dark:bg-red-900/40 px-1 py-0.5 rounded">
                      docs/supabase-env-setup.md
                    </code>{" "}
                    file for setup instructions.
                  </p>
                </div>
              )}
            </div>
          </AlertDescription>
        </div>
      </div>
    </Alert>
  )
}
