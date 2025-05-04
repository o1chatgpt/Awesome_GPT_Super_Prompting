"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getScrapingTasks } from "@/lib/actions/scraping-tasks"
import { getScrapingResults } from "@/lib/actions/scraping-results"
import { toast } from "@/components/ui/use-toast"
import type { ScrapingTask, ScrapingResult } from "@/lib/database"
import { Search, Filter, Download, ExternalLink } from "lucide-react"

export default function Results() {
  const [tasks, setTasks] = useState<ScrapingTask[]>([])
  const [results, setResults] = useState<ScrapingResult[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedTask, setSelectedTask] = useState<string | null>(null)
  const [selectedResult, setSelectedResult] = useState<ScrapingResult | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const tasksResult = await getScrapingTasks()
        if (tasksResult.success) {
          setTasks(tasksResult.tasks)

          // If there are tasks, select the first one and fetch its results
          if (tasksResult.tasks.length > 0) {
            const firstTaskId = tasksResult.tasks[0].id
            setSelectedTask(firstTaskId)

            const resultsResult = await getScrapingResults(firstTaskId)
            if (resultsResult.success) {
              setResults(resultsResult.results)
            }
          }
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load results data",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleTaskChange = async (taskId: string) => {
    setSelectedTask(taskId)
    setIsLoading(true)

    try {
      const resultsResult = await getScrapingResults(taskId)
      if (resultsResult.success) {
        setResults(resultsResult.results)
      } else {
        toast({
          title: "Error",
          description: resultsResult.error,
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load results for this task",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleResultSelect = (result: ScrapingResult) => {
    setSelectedResult(result)
  }

  const filteredTasks = tasks.filter((task) => {
    if (statusFilter !== "all" && task.status !== statusFilter) {
      return false
    }

    if (searchQuery && !task.url.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false
    }

    return true
  })

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A"
    return new Date(dateString).toLocaleString()
  }

  const handleExport = (format: string) => {
    if (!selectedResult) return

    // In a real app, this would generate and download the file
    // For now, we'll just show a toast
    toast({
      title: "Export Started",
      description: `Exporting data in ${format.toUpperCase()} format`,
    })

    // Simulate download
    setTimeout(() => {
      const element = document.createElement("a")
      const file = new Blob([selectedResult.raw_data], { type: "text/plain" })
      element.href = URL.createObjectURL(file)
      element.download = `scrape-result-${Date.now()}.${format}`
      document.body.appendChild(element)
      element.click()
      document.body.removeChild(element)

      toast({
        title: "Export Complete",
        description: `Data has been exported in ${format.toUpperCase()} format`,
      })
    }, 1000)
  }

  if (isLoading && tasks.length === 0) {
    return (
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold mb-6">Scraping Results</h1>
        <Card>
          <CardContent className="p-8 text-center">Loading results data...</CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold mb-6">Scraping Results</h1>

      {/* Search and Filter */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by URL..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <div className="w-40">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <div className="flex items-center gap-2">
                      <Filter className="h-4 w-4" />
                      <SelectValue placeholder="Filter by status" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                More Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {filteredTasks.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">No results match your search criteria.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Tasks List */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Scraping Tasks</CardTitle>
              <CardDescription>Select a task to view its results</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {filteredTasks.map((task) => (
                  <div
                    key={task.id}
                    className={`p-3 rounded-md cursor-pointer border ${
                      selectedTask === task.id ? "border-primary bg-primary/5" : "border-border"
                    }`}
                    onClick={() => handleTaskChange(task.id)}
                  >
                    <div className="flex justify-between items-start">
                      <div className="truncate flex-1">
                        <p className="font-medium truncate">{task.url}</p>
                        <p className="text-xs text-muted-foreground">{formatDate(task.created_at)}</p>
                      </div>
                      <Badge
                        variant={
                          task.status === "completed"
                            ? "default"
                            : task.status === "in_progress"
                              ? "secondary"
                              : task.status === "scheduled"
                                ? "outline"
                                : "destructive"
                        }
                        className="ml-2"
                      >
                        {task.status}
                      </Badge>
                    </div>
                    <div className="flex gap-2 mt-2 text-xs text-muted-foreground">
                      <span>{task.content_type}</span>
                      <span>•</span>
                      <span>{task.depth}</span>
                      <span>•</span>
                      <span>{task.format}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Results View */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Results</CardTitle>
              <CardDescription>
                {selectedTask
                  ? `Viewing results for ${tasks.find((t) => t.id === selectedTask)?.url}`
                  : "Select a task to view results"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-8">Loading results...</div>
              ) : results.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No results found for this task.</p>
                </div>
              ) : (
                <div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Size</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {results.map((result) => (
                        <TableRow
                          key={result.id}
                          className={`cursor-pointer ${selectedResult?.id === result.id ? "bg-muted" : ""}`}
                          onClick={() => handleResultSelect(result)}
                        >
                          <TableCell>{formatDate(result.created_at)}</TableCell>
                          <TableCell>
                            {result.error ? (
                              <Badge variant="destructive">Failed</Badge>
                            ) : (
                              <Badge variant="default">Success</Badge>
                            )}
                          </TableCell>
                          <TableCell>{result.raw_data.length} bytes</TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button variant="ghost" size="icon" onClick={() => handleResultSelect(result)}>
                                <ExternalLink className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" onClick={() => handleExport("json")}>
                                <Download className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>

                  {selectedResult && (
                    <div className="mt-6">
                      <Tabs defaultValue="raw">
                        <TabsList>
                          <TabsTrigger value="raw">Raw Data</TabsTrigger>
                          <TabsTrigger value="formatted">Formatted</TabsTrigger>
                          <TabsTrigger value="ai">AI Analysis</TabsTrigger>
                        </TabsList>
                        <TabsContent value="raw" className="mt-2">
                          <Card>
                            <CardContent className="p-4">
                              <pre className="whitespace-pre-wrap bg-muted p-4 rounded-md text-sm overflow-auto max-h-96">
                                {selectedResult.raw_data}
                              </pre>
                            </CardContent>
                          </Card>
                        </TabsContent>
                        <TabsContent value="formatted" className="mt-2">
                          <Card>
                            <CardContent className="p-4">
                              {selectedResult.formatted_data ? (
                                <pre className="whitespace-pre-wrap bg-muted p-4 rounded-md text-sm overflow-auto max-h-96">
                                  {selectedResult.formatted_data}
                                </pre>
                              ) : (
                                <p className="text-center py-4 text-muted-foreground">No formatted data available</p>
                              )}
                            </CardContent>
                          </Card>
                        </TabsContent>
                        <TabsContent value="ai" className="mt-2">
                          <Card>
                            <CardContent className="p-4">
                              {selectedResult.ai_analysis ? (
                                <div className="prose max-w-none">
                                  <h3>AI Analysis</h3>
                                  <p>Our AI has analyzed the scraped content and found the following insights:</p>
                                  <ul>
                                    <li>Main topic: Web Scraping</li>
                                    <li>Sentiment: Neutral</li>
                                    <li>Key entities: URL, Content Type, Depth, Format</li>
                                    <li>
                                      Suggested actions: Try scraping with different content types for more
                                      comprehensive results
                                    </li>
                                  </ul>
                                </div>
                              ) : (
                                <p className="text-center py-4 text-muted-foreground">No AI analysis available</p>
                              )}
                            </CardContent>
                          </Card>
                        </TabsContent>
                      </Tabs>

                      <div className="flex justify-end gap-2 mt-4">
                        <Button variant="outline" onClick={() => handleExport("csv")}>
                          <Download className="h-4 w-4 mr-2" />
                          Export as CSV
                        </Button>
                        <Button variant="outline" onClick={() => handleExport("json")}>
                          <Download className="h-4 w-4 mr-2" />
                          Export as JSON
                        </Button>
                        <Button onClick={() => handleExport("xlsx")}>
                          <Download className="h-4 w-4 mr-2" />
                          Export as Excel
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
