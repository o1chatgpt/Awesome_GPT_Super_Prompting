"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getUserProfile } from "@/lib/actions/auth"
import { UserPreferences } from "@/components/user-preferences"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Shield } from "lucide-react"
import { useRouter } from "next/navigation"

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const profile = await getUserProfile()
        setUser(profile)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching user profile:", error)
        setLoading(false)
      }
    }

    fetchUser()
  }, [])

  if (loading) {
    return (
      <div className="container mx-auto py-10">
        <h1 className="text-2xl font-bold mb-6">Profile</h1>
        <div>Loading profile information...</div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="container mx-auto py-10">
        <h1 className="text-2xl font-bold mb-6">Profile</h1>
        <div>Please sign in to view your profile.</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Profile</h1>

      <Tabs defaultValue="profile">
        <TabsList className="mb-6">
          <TabsTrigger value="profile">Profile Information</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>User Information</CardTitle>
                <CardDescription>Your personal information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={user.avatar_url || "/placeholder.svg"} />
                    <AvatarFallback>{user.full_name?.charAt(0) || "U"}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-xl font-medium">{user.full_name}</h3>
                    <p className="text-muted-foreground">{user.role}</p>
                  </div>
                </div>

                <div className="grid gap-2">
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-muted-foreground">{user.email}</p>
                  </div>
                  <div>
                    <p className="font-medium">Username</p>
                    <p className="text-muted-foreground">{user.username}</p>
                  </div>
                  <div>
                    <p className="font-medium">Member Since</p>
                    <p className="text-muted-foreground">{new Date(user.created_at).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="font-medium">Last Login</p>
                    <p className="text-muted-foreground">
                      {user.last_login ? new Date(user.last_login).toLocaleString() : "Never"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Activity Summary</CardTitle>
                <CardDescription>Your recent activity on the platform</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="font-medium">Total Scraping Tasks</p>
                    <p className="text-3xl font-bold">{user.task_count || 0}</p>
                  </div>
                  <div>
                    <p className="font-medium">Completed Tasks</p>
                    <p className="text-3xl font-bold">{user.completed_task_count || 0}</p>
                  </div>
                  <div>
                    <p className="font-medium">Scheduled Tasks</p>
                    <p className="text-3xl font-bold">{user.scheduled_task_count || 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="preferences">
          <UserPreferences />
        </TabsContent>

        <TabsContent value="security">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="mr-2 h-5 w-5 text-primary" />
                  Account Security
                </CardTitle>
                <CardDescription>Manage your account security settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="font-medium">Password</p>
                  <p className="text-muted-foreground mb-2">
                    Change your password regularly to keep your account secure.
                  </p>
                  <Button variant="outline" onClick={() => router.push("/auth/reset-password/request")}>
                    Change Password
                  </Button>
                </div>

                <div>
                  <p className="font-medium">Active Sessions</p>
                  <p className="text-muted-foreground mb-2">
                    View and manage devices where you're currently logged in.
                  </p>
                  <Button variant="outline" onClick={() => router.push("/settings/sessions")}>
                    Manage Sessions
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Security Recommendations</CardTitle>
                <CardDescription>Tips to keep your account secure</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 list-disc pl-5">
                  <li>Use a strong, unique password</li>
                  <li>Don't share your login credentials</li>
                  <li>Sign out from shared devices</li>
                  <li>Check your active sessions regularly</li>
                  <li>Update your password periodically</li>
                  <li>Be cautious of suspicious emails or messages</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
