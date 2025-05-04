"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import AIAssistant from "./components/ai-assistant"
import TaskRating from "./components/task-rating"
import { createScrapingTask } from "@/lib/actions/scraping-tasks"
import { saveScrapingResult } from "@/lib/actions/scraping-results"
import { rateTask } from "@/lib/actions/task-ratings"
import { saveMemory } from "@/lib/actions/memories"
import { toast } from "@/components/ui/use-toast"

export default function Home() {
  const [url, setUrl] = useState("")
  const [scrapingOptions, setScrapingOptions] = useState({
    contentType: "text",
    depth: "single",
    format: "raw",
  })
  const [scrapedData, setScrapedData] = useState<string | null>(null)
  const [scheduleType, setScheduleType] = useState("once")
  const [scheduleFrequency, setScheduleFrequency] = useState("daily")
  const [scheduleTime, setScheduleTime] = useState("12:00")
  const [scheduleDay, setScheduleDay] = useState("monday")
  const [taskId, setTaskId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleScrape = async () => {
    setIsLoading(true)
    try {
      // Create a FormData object to pass to the server action
      const formData = new FormData()
      formData.append("url", url)
      formData.append("contentType", scrapingOptions.contentType)
      formData.append("depth", scrapingOptions.depth)
      formData.append("format", scrapingOptions.format)
      formData.append("scheduleType", scheduleType)

      if (scheduleType === "recurring") {
        formData.append("scheduleFrequency", scheduleFrequency)
        formData.append("scheduleTime", scheduleTime)
        if (scheduleFrequency === "weekly") {
          formData.append("scheduleDay", scheduleDay)
        }
      }

      // Create the scraping task in the database
      const result = await createScrapingTask(formData)

      if (result.error) {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        })
        setIsLoading(false)
        return
      }

      // Store the task ID for later use
      setTaskId(result.task.id)

      // Simulate scraping process
      let scheduleInfo = ""
      if (scheduleType === "recurring") {
        scheduleInfo = `\nScheduled: ${scheduleFrequency} at ${scheduleTime}`
        if (scheduleFrequency === "weekly") {
          scheduleInfo += ` on ${scheduleDay}`
        }
      }

      const rawData = `Scraped data from ${url}:${scheduleInfo}\n\nContent Type: ${scrapingOptions.contentType}\nDepth: ${scrapingOptions.depth}\nFormat: ${scrapingOptions.format}\n\nThis is simulated scraped content.`
      setScrapedData(rawData)

      // Save the scraping result to the database
      const aiAnalysis = {
        mainTopic: "Web Scraping",
        sentiment: "Neutral",
        keyEntities: ["URL", "Content Type", "Depth", "Format"],
        suggestedActions: ["Try scraping with different content types for more comprehensive results"],
      }

      await saveScrapingResult(result.task.id, rawData, "Formatted version of the data", aiAnalysis)

      // Save a memory about this scraping task
      await saveMemory(`User scraped ${url} with content type ${scrapingOptions.contentType}`, "scrape_history", 5)

      toast({
        title: "Success",
        description: "Scraping task completed successfully!",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleRatingSubmit = async (rating: number, feedback: string) => {
    if (!taskId) return

    try {
      const result = await rateTask(taskId, rating, feedback)

      if (result.error) {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        })
        return
      }

      toast({
        title: "Thank you!",
        description: "Your feedback has been submitted.",
      })

      // Save a memory about this rating
      await saveMemory(
        `User rated scraping task for ${url} with ${rating} stars. Feedback: ${feedback || "None provided"}`,
        "user_feedback",
        rating,
      )
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred while submitting your rating.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center">Web Scraper Tool</h1>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Scraping Configuration</CardTitle>
          <CardDescription>Enter the URL, select scraping options, and set schedule</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Label htmlFor="url">URL to Scrape</Label>
            <Input id="url" placeholder="https://example.com" value={url} onChange={(e) => setUrl(e.target.value)} />
          </div>
          <div className="space-y-4 mb-4">
            <Label>Scraping Options</Label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="contentType">Content Type</Label>
                <Select
                  value={scrapingOptions.contentType}
                  onValueChange={(value) => setScrapingOptions((prev) => ({ ...prev, contentType: value }))}
                >
                  <SelectTrigger id="contentType">
                    <SelectValue placeholder="Select content type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="text">Text</SelectItem>
                    <SelectItem value="images">Images</SelectItem>
                    <SelectItem value="links">Links</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="depth">Scraping Depth</Label>
                <Select
                  value={scrapingOptions.depth}
                  onValueChange={(value) => setScrapingOptions((prev) => ({ ...prev, depth: value }))}
                >
                  <SelectTrigger id="depth">
                    <SelectValue placeholder="Select depth" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="single">Single Page</SelectItem>
                    <SelectItem value="domain">Entire Domain</SelectItem>
                    <SelectItem value="custom">Custom Depth</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="format">Output Format</Label>
                <Select
                  value={scrapingOptions.format}
                  onValueChange={(value) => setScrapingOptions((prev) => ({ ...prev, format: value }))}
                >
                  <SelectTrigger id="format">
                    <SelectValue placeholder="Select format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="raw">Raw HTML</SelectItem>
                    <SelectItem value="json">JSON</SelectItem>
                    <SelectItem value="csv">CSV</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <Label>Schedule</Label>
            <RadioGroup value={scheduleType} onValueChange={setScheduleType}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="once" id="once" />
                <Label htmlFor="once">Scrape Once</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="recurring" id="recurring" />
                <Label htmlFor="recurring">Recurring Schedule</Label>
              </div>
            </RadioGroup>
            {scheduleType === "recurring" && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="frequency">Frequency</Label>
                  <Select value={scheduleFrequency} onValueChange={setScheduleFrequency}>
                    <SelectTrigger id="frequency">
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="time">Time</Label>
                  <Input id="time" type="time" value={scheduleTime} onChange={(e) => setScheduleTime(e.target.value)} />
                </div>
                {scheduleFrequency === "weekly" && (
                  <div>
                    <Label htmlFor="day">Day of Week</Label>
                    <Select value={scheduleDay} onValueChange={setScheduleDay}>
                      <SelectTrigger id="day">
                        <SelectValue placeholder="Select day" />
                      </SelectTrigger>
                      <SelectContent>
                        {["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"].map((day) => (
                          <SelectItem key={day} value={day}>
                            {day.charAt(0).toUpperCase() + day.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleScrape} disabled={isLoading}>
            {isLoading ? "Processing..." : scheduleType === "once" ? "Start Scraping" : "Schedule Scraping"}
          </Button>
        </CardFooter>
      </Card>

      {scrapedData && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Scraping Results</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="raw">
                  <TabsList>
                    <TabsTrigger value="raw">Raw Data</TabsTrigger>
                    <TabsTrigger value="formatted">Formatted Data</TabsTrigger>
                    <TabsTrigger value="ai-analysis">AI Analysis</TabsTrigger>
                  </TabsList>
                  <TabsContent value="raw">
                    <Textarea value={scrapedData} readOnly className="w-full h-64" />
                  </TabsContent>
                  <TabsContent value="formatted">
                    <div className="prose">
                      <p>Formatted data would be displayed here.</p>
                      <p>
                        You could parse the raw data and display it in a more structured way, such as a table or list.
                      </p>
                    </div>
                  </TabsContent>
                  <TabsContent value="ai-analysis">
                    <div className="prose">
                      <h3>AI Analysis</h3>
                      <p>Our AI has analyzed the scraped content and found the following insights:</p>
                      <ul>
                        <li>Main topic: Web Scraping</li>
                        <li>Sentiment: Neutral</li>
                        <li>Key entities: URL, Content Type, Depth, Format</li>
                        <li>
                          Suggested actions: Try scraping with different content types for more comprehensive results
                        </li>
                      </ul>
                      <p>
                        This is a simulated AI analysis. In a real application, this would be generated by our AI models
                        based on the actual scraped content.
                      </p>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          <div>
            <TaskRating taskId={taskId || "unknown"} onRatingSubmit={handleRatingSubmit} />
          </div>
        </div>
      )}

      <AIAssistant />
    </div>
  )
}
