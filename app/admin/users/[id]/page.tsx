"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Shield, UserIcon, Eye, Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "@/components/ui/use-toast"
import { UserActivityLog } from "@/app/components/user-activity-log"
import { UserStatistics } from "@/app/components/user-statistics"
import { supabase } from "@/lib/database"
import { updateUserRole, toggleUserStatus } from "@/lib/actions/user-management"

export default function UserProfilePage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const userId = params.id

  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true)

      const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).single()

      if (error) {
        toast({
          title: "Error",
          description: "Failed to load user profile",
          variant: "destructive",
        })
        router.push("/admin/users")
      } else {
        setUser(data)
      }

      setLoading(false)
    }

    fetchUser()
  }, [userId, router])

  // Handle role change
  const handleRoleChange = async (newRole: "admin" | "user" | "viewer") => {
    const result = await updateUserRole(userId, newRole)

    if (result.error) {
      toast({
        title: "Error",
        description: result.error,
        variant: "destructive",
      })
    } else {
      toast({
        title: "Success",
        description: "User role updated successfully",
      })

      // Update local state
      setUser({ ...user, role: newRole })
    }
  }

  // Handle status toggle
  const handleStatusToggle = async () => {
    const newStatus = !user.is_active
    const result = await toggleUserStatus(userId, newStatus)

    if (result.error) {
      toast({
        title: "Error",
        description: result.error,
        variant: "destructive",
      })
    } else {
      toast({
        title: "Success",
        description: `User ${newStatus ? "activated" : "deactivated"} successfully`,
      })

      // Update local state
      setUser({ ...user, is_active: newStatus })
    }
  }

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  // Role icon mapping
  const getRoleIcon = (role: string) => {
    switch (role) {
      case "admin":
        return <Shield className="h-4 w-4 text-red-500" />
      case "user":
        return <UserIcon className="h-4 w-4 text-blue-500" />
      case "viewer":
        return <Eye className="h-4 w-4 text-green-500" />
      default:
        return <UserIcon className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => router.push("/admin/users")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">User Profile</h1>
        </div>

        {!loading && user && (
          <Button variant={user.is_active ? "destructive" : "default"} onClick={handleStatusToggle}>
            {user.is_active ? (
              <>
                <X className="h-4 w-4 mr-2" />
                Deactivate User
              </>
            ) : (
              <>
                <Check className="h-4 w-4 mr-2" />
                Activate User
              </>
            )}
          </Button>
        )}
      </div>

      {loading ? (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-4">
                <Skeleton className="h-16 w-16 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-6 w-48" />
                  <Skeleton className="h-4 w-64" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      ) : user ? (
        <>
          <Card>
            <CardHeader>
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={user.avatar_url || "/placeholder.svg"} />
                  <AvatarFallback>{user.full_name?.charAt(0) || "U"}</AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-xl font-semibold">{user.full_name}</h2>
                  <p className="text-muted-foreground">{user.email}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge
                      variant={user.role === "admin" ? "destructive" : user.role === "user" ? "default" : "secondary"}
                    >
                      {getRoleIcon(user.role)}
                      <span className="ml-1 capitalize">{user.role}</span>
                    </Badge>
                    <Badge variant={user.is_active ? "outline" : "destructive"}>
                      {user.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">User Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="grid grid-cols-2 gap-1">
                      <div className="text-sm font-medium text-muted-foreground">Username</div>
                      <div className="text-sm">{user.username || "-"}</div>
                    </div>
                    <div className="grid grid-cols-2 gap-1">
                      <div className="text-sm font-medium text-muted-foreground">User ID</div>
                      <div className="text-sm font-mono text-xs">{user.id}</div>
                    </div>
                    <div className="grid grid-cols-2 gap-1">
                      <div className="text-sm font-medium text-muted-foreground">Joined Date</div>
                      <div className="text-sm">{formatDate(user.created_at)}</div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Role Management</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-2">
                      <Button
                        variant={user.role === "admin" ? "destructive" : "outline"}
                        size="sm"
                        className="justify-start"
                        onClick={() => handleRoleChange("admin")}
                        disabled={user.role === "admin"}
                      >
                        <Shield className="h-4 w-4 mr-2" />
                        Admin
                      </Button>
                      <Button
                        variant={user.role === "user" ? "default" : "outline"}
                        size="sm"
                        className="justify-start"
                        onClick={() => handleRoleChange("user")}
                        disabled={user.role === "user"}
                      >
                        <UserIcon className="h-4 w-4 mr-2" />
                        User
                      </Button>
                      <Button
                        variant={user.role === "viewer" ? "secondary" : "outline"}
                        size="sm"
                        className="justify-start"
                        onClick={() => handleRoleChange("viewer")}
                        disabled={user.role === "viewer"}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Viewer
                      </Button>
                    </div>

                    <div className="mt-4 text-sm">
                      <p className="font-medium">Current Role: {user.role}</p>
                      <p className="text-muted-foreground mt-1">
                        {user.role === "admin" &&
                          "Full access to all features including user management and system settings."}
                        {user.role === "user" && "Can create and manage their own scraping tasks and view results."}
                        {user.role === "viewer" && "Read-only access to view scraping results and shared content."}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <UserActivityLog userId={userId} />
            <UserStatistics userId={userId} />
          </div>

          <Tabs defaultValue="tasks">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="tasks">Tasks</TabsTrigger>
              <TabsTrigger value="results">Results</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
            <TabsContent value="tasks" className="pt-4">
              <Card>
                <CardHeader>
                  <CardTitle>User Tasks</CardTitle>
                  <CardDescription>Tasks created by this user</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-muted-foreground">Task listing coming soon</div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="results" className="pt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Scraping Results</CardTitle>
                  <CardDescription>Results from tasks created by this user</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-muted-foreground">Results listing coming soon</div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="settings" className="pt-4">
              <Card>
                <CardHeader>
                  <CardTitle>User Settings</CardTitle>
                  <CardDescription>Manage user account settings</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-muted-foreground">User settings coming soon</div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      ) : (
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold">User not found</h2>
          <p className="text-muted-foreground mt-2">The requested user profile could not be found</p>
          <Button className="mt-4" onClick={() => router.push("/admin/users")}>
            Back to Users
          </Button>
        </div>
      )}
    </div>
  )
}
