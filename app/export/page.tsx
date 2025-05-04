"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { getScrapingTasks } from "@/lib/actions/scraping-tasks"
import { toast } from "@/components/ui/use-toast"
import type { ScrapingTask } from "@/lib/database"
import { Download, Calendar, FileText, TableIcon, FileJson, FileSpreadsheet } from "lucide-react"

export default function ExportPage() {
  const [tasks, setTasks] = useState<ScrapingTask[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedTasks, setSelectedTasks] = useState<string[]>([])
  const [exportFormat, setExportFormat] = useState("json")
  const [exportOptions, setExportOptions] = useState({
    includeRawData: true,
    includeFormattedData: true,
    includeAiAnalysis: true,
    includeMetadata: true,
  })
  const [fileName, setFileName] = useState("scraping-export")
  const [exportInProgress, setExportInProgress] = useState(false)

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
          description: "Failed to fetch tasks",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchTasks()
  }, [])

  const handleTaskSelect = (taskId: string) => {
    setSelectedTasks((prev) => (prev.includes(taskId) ? prev.filter((id) => id !== taskId) : [...prev, taskId]))
  }

  const handleSelectAll = () => {
    if (selectedTasks.length === tasks.length) {
      setSelectedTasks([])
    } else {
      setSelectedTasks(tasks.map((task) => task.id))
    }
  }

  const handleExport = () => {
    if (selectedTasks.length === 0) {
      toast({
        title: "No tasks selected",
        description: "Please select at least one task to export",
        variant: "destructive",
      })
      return
    }

    setExportInProgress(true)

    // Simulate export process
    setTimeout(() => {
      toast({
        title: "Export Complete",
        description: `${selectedTasks.length} tasks exported as ${exportFormat.toUpperCase()}`,
      })
      setExportInProgress(false)
    }, 2000)
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A"
    return new Date(dateString).toLocaleDateString()
  }

  if (isLoading) {
    return (
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold mb-6">Export Data</h1>
        <Card>
          <CardContent className="p-8 text-center">Loading tasks...</CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold mb-6">Export Data</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Select Tasks to Export</CardTitle>
              <CardDescription>Choose the scraping tasks you want to include in your export</CardDescription>
            </CardHeader>
            <CardContent>
              {tasks.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">You don't have any tasks to export.</p>
                  <Button className="mt-4" onClick={() => (window.location.href = "/")}>
                    Create a Task
                  </Button>
                </div>
              ) : (
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <Button variant="outline" size="sm" onClick={handleSelectAll}>
                      {selectedTasks.length === tasks.length ? "Deselect All" : "Select All"}
                    </Button>
                    <p className="text-sm text-muted-foreground">
                      {selectedTasks.length} of {tasks.length} selected
                    </p>
                  </div>

                  <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
                    {tasks.map((task) => (
                      <div
                        key={task.id}
                        className={`p-3 rounded-md border flex items-start gap-3 ${
                          selectedTasks.includes(task.id) ? "border-primary bg-primary/5" : "border-border"
                        }`}
                      >
                        <Checkbox
                          checked={selectedTasks.includes(task.id)}
                          onCheckedChange={() => handleTaskSelect(task.id)}
                          id={`task-${task.id}`}
                        />
                        <div className="flex-1">
                          <Label htmlFor={`task-${task.id}`} className="font-medium cursor-pointer flex items-center">
                            {task.url}
                          </Label>
                          <div className="flex gap-4 mt-1 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {formatDate(task.created_at)}
                            </div>
                            <div className="flex items-center gap-1">
                              <FileText className="h-3 w-3" />
                              {task.content_type}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Export Options</CardTitle>
              <CardDescription>Configure your export settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="fileName">File Name</Label>
                <Input id="fileName" value={fileName} onChange={(e) => setFileName(e.target.value)} className="mt-1" />
              </div>

              <div>
                <Label>Export Format</Label>
                <Tabs defaultValue={exportFormat} onValueChange={setExportFormat} className="mt-1">
                  <TabsList className="grid grid-cols-3">
                    <TabsTrigger value="json">
                      <FileJson className="h-4 w-4 mr-2" />
                      JSON
                    </TabsTrigger>
                    <TabsTrigger value="csv">
                      <TableIcon className="h-4 w-4 mr-2" />
                      CSV
                    </TabsTrigger>
                    <TabsTrigger value="xlsx">
                      <FileSpreadsheet className="h-4 w-4 mr-2" />
                      Excel
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              <div className="space-y-2">
                <Label>Include Data</Label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="includeRawData"
                      checked={exportOptions.includeRawData}
                      onCheckedChange={(checked) => setExportOptions({ ...exportOptions, includeRawData: !!checked })}
                    />
                    <Label htmlFor="includeRawData">Raw Data</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="includeFormattedData"
                      checked={exportOptions.includeFormattedData}
                      onCheckedChange={(checked) =>
                        setExportOptions({ ...exportOptions, includeFormattedData: !!checked })
                      }
                    />
                    <Label htmlFor="includeFormattedData">Formatted Data</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="includeAiAnalysis"
                      checked={exportOptions.includeAiAnalysis}
                      onCheckedChange={(checked) =>
                        setExportOptions({ ...exportOptions, includeAiAnalysis: !!checked })
                      }
                    />
                    <Label htmlFor="includeAiAnalysis">AI Analysis</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="includeMetadata"
                      checked={exportOptions.includeMetadata}
                      onCheckedChange={(checked) => setExportOptions({ ...exportOptions, includeMetadata: !!checked })}
                    />
                    <Label htmlFor="includeMetadata">Task Metadata</Label>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full"
                onClick={handleExport}
                disabled={selectedTasks.length === 0 || exportInProgress}
              >
                {exportInProgress ? (
                  "Exporting..."
                ) : (
                  <>
                    <Download className="h-4 w-4 mr-2" />
                    Export {selectedTasks.length} {selectedTasks.length === 1 ? "Task" : "Tasks"}
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
