"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { getAdminVisibleMemories, getAllUserMemories } from "@/lib/actions/memories"
import { Search, Filter, Star, Clock } from "lucide-react"

export default function AdminMemoriesPage() {
  const [memories, setMemories] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [selectedUserId, setSelectedUserId] = useState("")
  const [activeTab, setActiveTab] = useState("all")

  useEffect(() => {
    const fetchMemories = async () => {
      setIsLoading(true)
      try {
        const result = await getAdminVisibleMemories()
        if (result.success) {
          setMemories(result.memories)
        } else {
          toast({
            title: "Error",
            description: result.error,
            variant: "destructive",
          })
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load memories",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchMemories()
  }, [])

  const handleUserSelect = async (userId: string) => {
    if (!userId) return

    setIsLoading(true)
    try {
      const result = await getAllUserMemories(userId)
      if (result.success) {
        setMemories(result.memories)
        setSelectedUserId(userId)
      } else {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load user memories",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleTabChange = async (value: string) => {
    setActiveTab(value)
    setIsLoading(true)

    try {
      if (value === "all") {
        const result = await getAdminVisibleMemories()
        if (result.success) {
          setMemories(result.memories)
        }
      } else if (value === "user" && selectedUserId) {
        const result = await getAllUserMemories(selectedUserId)
        if (result.success) {
          setMemories(result.memories)
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load memories",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString() + " " + new Date(dateString).toLocaleTimeString()
  }

  const filteredMemories = memories.filter((memory) => {
    if (typeFilter !== "all" && memory.type !== typeFilter) {
      return false
    }

    if (searchQuery && !memory.content.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false
    }

    return true
  })

  const memoryTypes = [...new Set(memories.map((memory) => memory.type))]

  // Mock users for the demo
  const mockUsers = [
    { id: "user1", name: "Alex Johnson", email: "alex@example.com" },
    { id: "user2", name: "Sam Taylor", email: "sam@example.com" },
    { id: "user3", name: "Jordan Lee", email: "jordan@example.com" },
  ]

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Memory Management</h1>
      <p className="text-muted-foreground">View and analyze user memories and activity patterns across the platform.</p>

      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <TabsList>
          <TabsTrigger value="all">All Admin-Visible Memories</TabsTrigger>
          <TabsTrigger value="user">User-Specific Memories</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Admin-Visible Memories</CardTitle>
              <CardDescription>View memories that have been flagged for admin visibility</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-2 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search memories..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-[180px]">
                    <div className="flex items-center gap-2">
                      <Filter className="h-4 w-4" />
                      <SelectValue placeholder="Filter by type" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    {memoryTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {isLoading ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Loading memories...</p>
                </div>
              ) : filteredMemories.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No memories match your search criteria.</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Content</TableHead>
                      <TableHead>Relevance</TableHead>
                      <TableHead>Created</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredMemories.map((memory) => (
                      <TableRow key={memory.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarFallback>{memory.users?.full_name?.charAt(0) || "U"}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-sm font-medium">{memory.users?.full_name || "Unknown"}</p>
                              <p className="text-xs text-muted-foreground">{memory.users?.email || ""}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{memory.type}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="max-w-md truncate">{memory.content}</div>
                        </TableCell>
                        <TableCell>
                          <div className="flex">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star key={i} className="h-3 w-3" fill={i < memory.relevance ? "gold" : "none"} />
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>{formatDate(memory.created_at)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="user" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>User-Specific Memories</CardTitle>
              <CardDescription>View all memories for a specific user</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <Label htmlFor="user-select">Select User</Label>
                <Select value={selectedUserId} onValueChange={handleUserSelect}>
                  <SelectTrigger id="user-select">
                    <SelectValue placeholder="Select a user" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockUsers.map((user) => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.name} ({user.email})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {!selectedUserId ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Please select a user to view their memories.</p>
                </div>
              ) : isLoading ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Loading user memories...</p>
                </div>
              ) : filteredMemories.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No memories found for this user.</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                  {filteredMemories.map((memory) => (
                    <div key={memory.id} className="border rounded-lg p-3 relative">
                      <div className="flex justify-between items-start">
                        <Badge variant="outline">{memory.type}</Badge>
                        <div className="text-xs text-muted-foreground">
                          <Clock className="h-3 w-3 inline mr-1" />
                          {formatDate(memory.created_at)}
                        </div>
                      </div>
                      <p className="my-2">{memory.content}</p>
                      <div className="flex justify-between items-center text-xs text-muted-foreground">
                        <div className="flex items-center">
                          <span className="mr-1">Relevance:</span>
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} className="h-3 w-3" fill={i < memory.relevance ? "gold" : "none"} />
                          ))}
                        </div>
                      </div>
                      {memory.metadata && (
                        <div className="mt-2 pt-2 border-t text-xs text-muted-foreground">
                          <details>
                            <summary className="cursor-pointer">Additional Details</summary>
                            <pre className="mt-1 p-2 bg-muted rounded text-xs overflow-x-auto">
                              {JSON.stringify(memory.metadata, null, 2)}
                            </pre>
                          </details>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Missing Label component
function Label({ htmlFor, children }: { htmlFor: string; children: React.ReactNode }) {
  return (
    <label htmlFor={htmlFor} className="text-sm font-medium leading-none mb-2 block">
      {children}
    </label>
  )
}
