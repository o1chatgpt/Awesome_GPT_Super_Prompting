"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { toast } from "@/components/ui/use-toast"
import { Search, ExternalLink, Download, Share2 } from "lucide-react"

// Mock shared tasks data
const mockSharedTasks = [
  {
    id: "1",
    url: "https://example.com",
    sharedBy: {
      name: "Alex Johnson",
      email: "alex@example.com",
      avatar: "",
    },
    sharedAt: "2023-05-01T12:00:00Z",
    status: "completed",
    resultsCount: 3,
  },
  {
    id: "2",
    url: "https://news.ycombinator.com",
    sharedBy: {
      name: "Sam Taylor",
      email: "sam@example.com",
      avatar: "",
    },
    sharedAt: "2023-05-02T14:30:00Z",
    status: "completed",
    resultsCount: 5,
  },
  {
    id: "3",
    url: "https://github.com/trending",
    sharedBy: {
      name: "Jordan Lee",
      email: "jordan@example.com",
      avatar: "",
    },
    sharedAt: "2023-05-03T09:15:00Z",
    status: "in_progress",
    resultsCount: 0,
  },
]

export default function SharedPage() {
  const [sharedTasks, setSharedTasks] = useState(mockSharedTasks)
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
  }, [])

  const handleViewResults = (taskId: string) => {
    // In a real app, this would navigate to the results page
    toast({
      title: "Viewing Results",
      description: `Viewing results for task ${taskId}`,
    })
  }

  const handleDownloadResults = (taskId: string) => {
    // In a real app, this would download the results
    toast({
      title: "Downloading Results",
      description: `Downloading results for task ${taskId}`,
    })
  }

  const filteredTasks = sharedTasks.filter(
    (task) =>
      task.url.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.sharedBy.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.sharedBy.email.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  if (isLoading) {
    return (
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold mb-6">Shared With Me</h1>
        <Card>
          <CardContent className="p-8 text-center">Loading shared tasks...</CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold mb-6">Shared With Me</h1>

      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search shared tasks..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Shared Scraping Tasks</CardTitle>
          <CardDescription>Tasks that have been shared with you by team members</CardDescription>
        </CardHeader>
        <CardContent>
          {filteredTasks.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No shared tasks found</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>URL</TableHead>
                  <TableHead>Shared By</TableHead>
                  <TableHead>Shared On</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Results</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTasks.map((task) => (
                  <TableRow key={task.id}>
                    <TableCell className="font-medium">{task.url}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={task.sharedBy.avatar || "/placeholder.svg"} />
                          <AvatarFallback>{task.sharedBy.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span>{task.sharedBy.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>{formatDate(task.sharedAt)}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          task.status === "completed"
                            ? "default"
                            : task.status === "in_progress"
                              ? "secondary"
                              : "outline"
                        }
                      >
                        {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>{task.resultsCount}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleViewResults(task.id)}
                          disabled={task.resultsCount === 0}
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDownloadResults(task.id)}
                          disabled={task.resultsCount === 0}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Share2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
