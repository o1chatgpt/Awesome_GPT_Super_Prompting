"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Shield, UserIcon, Eye, Check, X, Mail, Activity, Settings, Key, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "@/components/ui/use-toast"
import {
  getUserById,
  updateUserRole,
  toggleUserStatus,
  deleteUser,
  resetUserPassword,
} from "@/lib/actions/user-management"
import { Separator } from "@/components/ui/separator"
import { UserActivityLog } from "@/app/components/user-activity-log"
import { UserStatistics } from "@/app/components/user-statistics"
import { EditUserDialog } from "@/app/components/edit-user-dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export default function UserProfilePage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const userId = params.id

  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [resetPasswordDialogOpen, setResetPasswordDialogOpen] = useState(false)
  const [actionInProgress, setActionInProgress] = useState(false)

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true)
      const result = await getUserById(userId)

      if (result.error) {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        })
        router.push("/admin/users")
      } else {
        setUser(result.user)
      }

      setLoading(false)
    }

    fetchUser()
  }, [userId, router])

  // Handle role change
  const handleRoleChange = async (newRole: "admin" | "user" | "viewer") => {
    setActionInProgress(true)
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
    setActionInProgress(false)
  }

  // Handle status toggle
  const handleStatusToggle = async () => {
    setActionInProgress(true)
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
    setActionInProgress(false)
  }

  // Handle user deletion
  const handleDeleteUser = async () => {
    setActionInProgress(true)
    const result = await deleteUser(userId)

    if (result.error) {
      toast({
        title: "Error",
        description: result.error,
        variant: "destructive",
      })
      setDeleteDialogOpen(false)
    } else {
      toast({
        title: "Success",
        description: "User deleted successfully",
      })
      router.push("/admin/users")
    }
    setActionInProgress(false)
  }

  // Handle password reset
  const handleResetPassword = async () => {
    setActionInProgress(true)
    const result = await resetUserPassword(userId)

    if (result.error) {
      toast({
        title: "Error",
        description: result.error,
        variant: "destructive",
      })
    } else {
      toast({
        title: "Success",
        description: "Password reset email sent successfully",
      })
    }
    setResetPasswordDialogOpen(false)
    setActionInProgress(false)
  }

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
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

  // Handle user update
  const handleUserUpdated = (updatedUser: any) => {
    setUser({ ...user, ...updatedUser })
    toast({
      title: "Success",
      description: "User profile updated successfully",
    })
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
          <div className="flex gap-2">
            <EditUserDialog user={user} onUserUpdated={handleUserUpdated} />

            <Button
              variant={user.is_active ? "destructive" : "default"}
              onClick={handleStatusToggle}
              disabled={actionInProgress}
            >
              {user.is_active ? (
                <>
                  <X className="h-4 w-4 mr-2" />
                  Deactivate
                </>
              ) : (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Activate
                </>
              )}
            </Button>
          </div>
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
                  <AvatarImage src={user.avatar_url || "/placeholder.svg?height=64&width=64&query=user"} />
                  <AvatarFallback>{user.full_name?.charAt(0) || "U"}</AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-xl font-semibold">{user.full_name || "Unnamed User"}</h2>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    <span>{user.email}</span>
                  </div>
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
                    {user.auth_provider && (
                      <Badge variant="outline" className="bg-blue-50">
                        {user.auth_provider}
                      </Badge>
                    )}
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
                    <div className="grid grid-cols-2 gap-1">
                      <div className="text-sm font-medium text-muted-foreground">Last Login</div>
                      <div className="text-sm">{user.last_login ? formatDate(user.last_login) : "Never"}</div>
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
                        disabled={user.role === "admin" || actionInProgress}
                      >
                        <Shield className="h-4 w-4 mr-2" />
                        Admin
                      </Button>
                      <Button
                        variant={user.role === "user" ? "default" : "outline"}
                        size="sm"
                        className="justify-start"
                        onClick={() => handleRoleChange("user")}
                        disabled={user.role === "user" || actionInProgress}
                      >
                        <UserIcon className="h-4 w-4 mr-2" />
                        User
                      </Button>
                      <Button
                        variant={user.role === "viewer" ? "secondary" : "outline"}
                        size="sm"
                        className="justify-start"
                        onClick={() => handleRoleChange("viewer")}
                        disabled={user.role === "viewer" || actionInProgress}
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
            <CardFooter className="border-t pt-6">
              <div className="flex flex-wrap gap-2 w-full justify-between">
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => setResetPasswordDialogOpen(true)}>
                    <Key className="h-4 w-4 mr-2" />
                    Reset Password
                  </Button>
                  <Button variant="outline" size="sm">
                    <Activity className="h-4 w-4 mr-2" />
                    Login History
                  </Button>
                </div>
                <Button variant="destructive" size="sm" onClick={() => setDeleteDialogOpen(true)}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete User
                </Button>
              </div>
            </CardFooter>
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
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h3 className="text-sm font-medium mb-2">Notification Preferences</h3>
                        <p className="text-sm text-muted-foreground">
                          {user.preferences?.emailNotifications
                            ? "Email notifications enabled"
                            : "Email notifications disabled"}
                        </p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium mb-2">Theme Preference</h3>
                        <p className="text-sm text-muted-foreground">{user.preferences?.theme || "System default"}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium mb-2">Dashboard Layout</h3>
                        <p className="text-sm text-muted-foreground">
                          {user.preferences?.dashboardLayout || "Default layout"}
                        </p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium mb-2">Language</h3>
                        <p className="text-sm text-muted-foreground">
                          {user.preferences?.language || "English (default)"}
                        </p>
                      </div>
                    </div>
                    <Separator />
                    <div>
                      <Button variant="outline" size="sm">
                        <Settings className="h-4 w-4 mr-2" />
                        Edit User Preferences
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Delete User Dialog */}
          <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure you want to delete this user?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the user account and remove their data from
                  our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel disabled={actionInProgress}>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={(e) => {
                    e.preventDefault()
                    handleDeleteUser()
                  }}
                  disabled={actionInProgress}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  {actionInProgress ? "Deleting..." : "Delete User"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          {/* Reset Password Dialog */}
          <AlertDialog open={resetPasswordDialogOpen} onOpenChange={setResetPasswordDialogOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Reset user password?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will send a password reset email to {user.email}. The user will be able to set a new password.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel disabled={actionInProgress}>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={(e) => {
                    e.preventDefault()
                    handleResetPassword()
                  }}
                  disabled={actionInProgress}
                >
                  {actionInProgress ? "Sending..." : "Send Reset Email"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
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
