"use client"

import { useAuth } from "@/app/providers/auth-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function AuthTestPage() {
  const { user, profile, session, isLoading } = useAuth()

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Authentication Test Page</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium">Loading State:</h3>
              <p>{isLoading ? "Loading..." : "Loaded"}</p>
            </div>

            <div>
              <h3 className="font-medium">Authentication Status:</h3>
              <p>{session ? "Authenticated" : "Not Authenticated"}</p>
            </div>

            {user && (
              <div>
                <h3 className="font-medium">User Info:</h3>
                <pre className="bg-gray-100 p-4 rounded overflow-auto">{JSON.stringify(user, null, 2)}</pre>
              </div>
            )}

            {profile && (
              <div>
                <h3 className="font-medium">Profile Info:</h3>
                <pre className="bg-gray-100 p-4 rounded overflow-auto">{JSON.stringify(profile, null, 2)}</pre>
              </div>
            )}

            {session && (
              <div>
                <h3 className="font-medium">Session Info:</h3>
                <pre className="bg-gray-100 p-4 rounded overflow-auto">
                  {JSON.stringify(
                    {
                      ...session,
                      access_token: session.access_token ? "[REDACTED]" : null,
                      refresh_token: session.refresh_token ? "[REDACTED]" : null,
                    },
                    null,
                    2,
                  )}
                </pre>
              </div>
            )}

            <div className="flex gap-4 pt-4">
              <Button asChild>
                <Link href="/dashboard">Go to Dashboard</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/auth/sign-in">Go to Sign In</Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
