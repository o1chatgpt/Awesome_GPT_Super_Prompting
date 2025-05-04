"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Check, ChevronLeft, ChevronRight, MoreHorizontal, Search, Shield, User, Eye, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "@/components/ui/use-toast"
import { getUsers, updateUserRole, toggleUserStatus } from "@/lib/actions/user-management"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

// Import the invitation components
import { InviteUserDialog } from "@/app/components/invite-user-dialog"
import { InvitationsList } from "@/app/components/invitations-list"
import { Separator } from "@/components/ui/separator"

export default function UsersPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [totalPages, setTotalPages] = useState(1)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalUsers, setTotalUsers] = useState(0)
  const [searchQuery, setSearchQuery] = useState("")
  const [roleFilter, setRoleFilter] = useState("")
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [userDialogOpen, setUserDialogOpen] = useState(false)

  // Load users on initial render and when filters change
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true)
      const result = await getUsers({
        page: currentPage,
        limit: 10,
        search: searchQuery,
        role: roleFilter,
      })

      if (result.error) {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        })
      } else {
        setUsers(result.users || [])
        setTotalPages(result.totalPages || 1)
        setTotalUsers(result.totalCount || 0)
      }

      setLoading(false)
    }

    fetchUsers()
  }, [currentPage, searchQuery, roleFilter])

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setCurrentPage(1) // Reset to first page on new search
  }

  // Handle role change
  const handleRoleChange = async (userId: string, newRole: "admin" | "user" | "viewer") => {
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
      setUsers(users.map((user) => (user.id === userId ? { ...user, role: newRole } : user)))
    }
  }

  // Handle status toggle
  const handleStatusToggle = async (userId: string, isActive: boolean) => {
    const result = await toggleUserStatus(userId, isActive)

    if (result.error) {
      toast({
        title: "Error",
        description: result.error,
        variant: "destructive",
      })
    } else {
      toast({
        title: "Success",
        description: `User ${isActive ? "activated" : "deactivated"} successfully`,
      })

      // Update local state
      setUsers(users.map((user) => (user.id === userId ? { ...user, is_active: isActive } : user)))
    }
  }

  // View user details
  const viewUserDetails = (user: any) => {
    setSelectedUser(user)
    setUserDialogOpen(true)
  }

  // Role icon mapping
  const getRoleIcon = (role: string) => {
    switch (role) {
      case "admin":
        return <Shield className="h-4 w-4 text-red-500" />
      case "user":
        return <User className="h-4 w-4 text-blue-500" />
      case "viewer":
        return <Eye className="h-4 w-4 text-green-500" />
      default:
        return <User className="h-4 w-4" />
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

  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
          <p className="text-muted-foreground">Manage users and their roles in the system.</p>
        </div>
        <InviteUserDialog />
      </div>

      <Separator />

      <InvitationsList />

      <Separator />

      <div className="space-y-4">
        {/* Existing user management components would go here */}
        <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
          <form onSubmit={handleSearch} className="flex items-center space-x-2">
            <Input
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full md:w-80"
            />
            <Button type="submit">
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </form>

          <div className="flex items-center space-x-2">
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="user">User</SelectItem>
                <SelectItem value="viewer">Viewer</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Users</CardTitle>
            <CardDescription>Manage user accounts and permissions.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Username</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  // Loading skeletons
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Skeleton className="h-10 w-10 rounded-full" />
                          <div className="space-y-1">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-3 w-32" />
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-20" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-16" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-16" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-24" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-8 w-8 float-right" />
                      </TableCell>
                    </TableRow>
                  ))
                ) : users.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No users found
                    </TableCell>
                  </TableRow>
                ) : (
                  users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={user.avatar_url || "/placeholder.svg"} />
                            <AvatarFallback>{user.full_name?.charAt(0) || "U"}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{user.full_name}</div>
                            <div className="text-sm text-muted-foreground">{user.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{user.username || "-"}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getRoleIcon(user.role)}
                          <span className="capitalize">{user.role}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={user.is_active ? "default" : "destructive"}>
                          {user.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatDate(user.created_at)}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Actions</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => viewUserDetails(user)}>View Details</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuLabel>Change Role</DropdownMenuLabel>
                            <DropdownMenuItem
                              onClick={() => handleRoleChange(user.id, "admin")}
                              disabled={user.role === "admin"}
                            >
                              <Shield className="h-4 w-4 mr-2 text-red-500" />
                              Admin
                              {user.role === "admin" && <Check className="h-4 w-4 ml-auto" />}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleRoleChange(user.id, "user")}
                              disabled={user.role === "user"}
                            >
                              <User className="h-4 w-4 mr-2 text-blue-500" />
                              User
                              {user.role === "user" && <Check className="h-4 w-4 ml-auto" />}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleRoleChange(user.id, "viewer")}
                              disabled={user.role === "viewer"}
                            >
                              <Eye className="h-4 w-4 mr-2 text-green-500" />
                              Viewer
                              {user.role === "viewer" && <Check className="h-4 w-4 ml-auto" />}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleStatusToggle(user.id, !user.is_active)}>
                              {user.is_active ? (
                                <>
                                  <X className="h-4 w-4 mr-2 text-red-500" />
                                  Deactivate User
                                </>
                              ) : (
                                <>
                                  <Check className="h-4 w-4 mr-2 text-green-500" />
                                  Activate User
                                </>
                              )}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>

            {/* Pagination */}
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-muted-foreground">
                Showing {users.length} of {totalUsers} users
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1 || loading}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="text-sm">
                  Page {currentPage} of {totalPages}
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages || loading}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* User Details Dialog */}
        <Dialog open={userDialogOpen} onOpenChange={setUserDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>User Details</DialogTitle>
              <DialogDescription>Detailed information about the selected user.</DialogDescription>
            </DialogHeader>

            {selectedUser && (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={selectedUser.avatar_url || "/placeholder.svg"} />
                    <AvatarFallback>{selectedUser.full_name?.charAt(0) || "U"}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-lg font-medium">{selectedUser.full_name}</h3>
                    <p className="text-sm text-muted-foreground">{selectedUser.email}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge
                        variant={
                          selectedUser.role === "admin"
                            ? "destructive"
                            : selectedUser.role === "user"
                              ? "default"
                              : "secondary"
                        }
                      >
                        {getRoleIcon(selectedUser.role)}
                        <span className="ml-1 capitalize">{selectedUser.role}</span>
                      </Badge>
                      <Badge variant={selectedUser.is_active ? "outline" : "destructive"}>
                        {selectedUser.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                  </div>
                </div>

                <Tabs defaultValue="details">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="details">User Details</TabsTrigger>
                    <TabsTrigger value="activity">Recent Activity</TabsTrigger>
                  </TabsList>
                  <TabsContent value="details" className="space-y-4 pt-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground">Username</h4>
                        <p>{selectedUser.username || "-"}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground">User ID</h4>
                        <p className="font-mono text-xs">{selectedUser.id}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground">Joined Date</h4>
                        <p>{formatDate(selectedUser.created_at)}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground">Last Login</h4>
                        <p>{selectedUser.last_login ? formatDate(selectedUser.last_login) : "Never"}</p>
                      </div>
                    </div>

                    <div className="pt-4">
                      <h4 className="text-sm font-medium mb-2">Role Permissions</h4>
                      <div className="space-y-2">
                        {selectedUser.role === "admin" && (
                          <div className="text-sm">
                            <p className="font-medium">Admin</p>
                            <p className="text-muted-foreground">
                              Full access to all features including user management and system settings.
                            </p>
                          </div>
                        )}
                        {selectedUser.role === "user" && (
                          <div className="text-sm">
                            <p className="font-medium">User</p>
                            <p className="text-muted-foreground">
                              Can create and manage their own scraping tasks and view results.
                            </p>
                          </div>
                        )}
                        {selectedUser.role === "viewer" && (
                          <div className="text-sm">
                            <p className="font-medium">Viewer</p>
                            <p className="text-muted-foreground">
                              Read-only access to view scraping results and shared content.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="activity" className="pt-4">
                    <div className="space-y-4">
                      <p className="text-sm text-muted-foreground">Recent user activity will be displayed here.</p>
                      {/* Activity would be loaded here */}
                      <div className="text-center py-8">
                        <p className="text-muted-foreground">Activity tracking coming soon</p>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>

                <DialogFooter>
                  <Button variant="outline" onClick={() => setUserDialogOpen(false)}>
                    Close
                  </Button>
                  <Button
                    variant={selectedUser.is_active ? "destructive" : "default"}
                    onClick={() => {
                      handleStatusToggle(selectedUser.id, !selectedUser.is_active)
                      setUserDialogOpen(false)
                    }}
                  >
                    {selectedUser.is_active ? "Deactivate User" : "Activate User"}
                  </Button>
                </DialogFooter>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
