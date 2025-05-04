"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Clock, Star, Trash2, Filter, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getMemories, deleteMemory, getUserActivities } from "@/lib/actions/memories"
import { toast } from "@/components/ui/use-toast"
import type { Memory, UserActivity } from "@/lib/database"

export default function EnhancedMemorySystem() {
  const [memories, setMemories] = useState<Memory[]>([])
  const [activities, setActivities] = useState<UserActivity[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [activeTab, setActiveTab] = useState("memories")

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        // Fetch memories
        const memoriesResult = await getMemories()
        if (memoriesResult.success) {
          setMemories(memoriesResult.memories)
        } else {
          toast({
            title: "Error",
            description: memoriesResult.error,
            variant: "destructive",
          })
        }

        // Fetch user activities
        const activitiesResult = await getUserActivities("current")
        if (activitiesResult.success) {
          setActivities(activitiesResult.activities)
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load memory data",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleDeleteMemory = async (id: string) => {
    try {
      const result = await deleteMemory(id)
      if (result.success) {
        setMemories(memories.filter((memory) => memory.id !== id))
        toast({
          title: "Memory Deleted",
          description: "The memory has been removed",
        })
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
        description: "Failed to delete memory",
        variant: "destructive",
      })
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString() + " " + date.toLocaleTimeString()
  }

  const formatActivityAction = (action: string) => {
    return action.charAt(0).toUpperCase() + action.slice(1)
  }

  const formatResourceType = (type: string) => {
    return type.charAt(0).toUpperCase() + type.slice(1)
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Memory & Activity System</CardTitle>
        <CardDescription>
          Your AI assistant remembers important information and tracks your activities to provide better assistance
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="memories">Memories</TabsTrigger>
            <TabsTrigger value="activities">Activity History</TabsTrigger>
          </TabsList>

          <TabsContent value="memories" className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-2 mt-4">
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
                <p className="text-muted-foreground">
                  {searchQuery || typeFilter !== "all"
                    ? "No memories match your search criteria."
                    : "No memories stored yet. As you use the system, relevant information will be remembered."}
                </p>
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                {filteredMemories.map((memory) => (
                  <div key={memory.id} className="border rounded-lg p-3 relative">
                    <div className="flex justify-between items-start">
                      <Badge variant="outline">{memory.type}</Badge>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => handleDeleteMemory(memory.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="my-2">{memory.content}</p>
                    <div className="flex justify-between items-center text-xs text-muted-foreground">
                      <div className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {formatDate(memory.created_at)}
                      </div>
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
          </TabsContent>

          <TabsContent value="activities" className="space-y-4">
            {isLoading ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Loading activity history...</p>
              </div>
            ) : activities.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No activity history available yet.</p>
              </div>
            ) : (
              <div className="space-y-1 max-h-96 overflow-y-auto pr-2">
                {activities.map((activity) => (
                  <div key={activity.id} className="border rounded-lg p-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <Badge variant="outline" className="mb-2">
                          {formatActivityAction(activity.action)}
                        </Badge>
                        <Badge variant="secondary" className="ml-2">
                          {formatResourceType(activity.resource_type)}
                        </Badge>
                      </div>
                      <div className="text-xs text-muted-foreground">{formatDate(activity.created_at)}</div>
                    </div>
                    {activity.details && (
                      <div className="mt-2 text-sm">
                        <details>
                          <summary className="cursor-pointer text-xs">Details</summary>
                          <pre className="mt-1 p-2 bg-muted rounded text-xs overflow-x-auto">
                            {JSON.stringify(activity.details, null, 2)}
                          </pre>
                        </details>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full">
          View All History
        </Button>
      </CardFooter>
    </Card>
  )
}
