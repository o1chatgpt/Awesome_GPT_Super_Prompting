"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { getScrapingTasks, deleteScrapingTask, updateScrapingTask } from "@/lib/actions/scraping-tasks"
import { toast } from "@/components/ui/use-toast"
import type { ScrapingTask } from "@/lib/database"

export default function ScheduledTasks() {
  const [tasks, setTasks] = useState<ScrapingTask[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const result = await getScrapingTasks()
        if (result.success) {
          setTasks(result.tasks)
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
          description: "Failed to fetch scheduled tasks",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchTasks()
  }, [])

  const handleDelete = async (taskId: string) => {
    try {
      const result = await deleteScrapingTask(taskId)

      if (result.success) {
        setTasks(tasks.filter((task) => task.id !== taskId))
        toast({
          title: "Success",
          description: "Task deleted successfully",
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
        description: "Failed to delete task",
        variant: "destructive",
      })
    }
  }

  const handleToggleStatus = async (task: ScrapingTask) => {
    const newStatus = task.status === "scheduled" ? "paused" : "scheduled"

    try {
      const result = await updateScrapingTask(task.id, { status: newStatus })

      if (result.success) {
        setTasks(tasks.map((t) => (t.id === task.id ? { ...t, status: newStatus } : t)))
        toast({
          title: "Success",
          description: `Task ${newStatus === "scheduled" ? "activated" : "paused"} successfully`,
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
        description: "Failed to update task status",
        variant: "destructive",
      })
    }
  }

  const handleRunNow = async (taskId: string) => {
    try {
      const result = await updateScrapingTask(taskId, {
        status: "in_progress",
        last_run: new Date().toISOString(),
      })

      if (result.success) {
        setTasks(
          tasks.map((t) => (t.id === taskId ? { ...t, status: "in_progress", last_run: new Date().toISOString() } : t)),
        )

        // Simulate task completion after 2 seconds
        setTimeout(async () => {
          const completeResult = await updateScrapingTask(taskId, { status: "completed" })

          if (completeResult.success) {
            setTasks(tasks.map((t) => (t.id === taskId ? { ...t, status: "completed" } : t)))
            toast({
              title: "Success",
              description: "Task completed successfully",
            })
          }
        }, 2000)

        toast({
          title: "Task started",
          description: "The task is now running",
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
        description: "Failed to run task",
        variant: "destructive",
      })
    }
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Never"
    return new Date(dateString).toLocaleString()
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Scheduled Tasks</h1>
        <Card>
          <CardContent className="p-8 text-center">Loading scheduled tasks...</CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Scheduled Tasks</h1>

      <Card>
        <CardHeader>
          <CardTitle>Your Scheduled Scraping Tasks</CardTitle>
          <CardDescription>Manage and monitor your recurring scraping operations</CardDescription>
        </CardHeader>
        <CardContent>
          {tasks.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">You don't have any scheduled tasks yet.</p>
              <Button className="mt-4" onClick={() => (window.location.href = "/")}>
                Create a Task
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>URL</TableHead>
                  <TableHead>Frequency</TableHead>
                  <TableHead>Last Run</TableHead>
                  <TableHead>Next Run</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tasks.map((task) => (
                  <TableRow key={task.id}>
                    <TableCell className="font-medium">{task.url}</TableCell>
                    <TableCell>
                      {task.schedule_type === "once"
                        ? "One-time"
                        : `${task.schedule_frequency} at ${task.schedule_time}${task.schedule_day ? ` on ${task.schedule_day}` : ""}`}
                    </TableCell>
                    <TableCell>{formatDate(task.last_run)}</TableCell>
                    <TableCell>{task.schedule_type === "recurring" ? formatDate(task.next_run) : "N/A"}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          task.status === "completed"
                            ? "default"
                            : task.status === "in_progress"
                              ? "secondary"
                              : task.status === "scheduled"
                                ? "outline"
                                : task.status === "failed"
                                  ? "destructive"
                                  : "secondary"
                        }
                      >
                        {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        {task.schedule_type === "recurring" && (
                          <Button variant="outline" size="sm" onClick={() => handleToggleStatus(task)}>
                            {task.status === "scheduled" ? "Pause" : "Activate"}
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRunNow(task.id)}
                          disabled={task.status === "in_progress"}
                        >
                          Run Now
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => handleDelete(task.id)}>
                          Delete
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
