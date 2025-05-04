"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"

export default function CrewAIPanel() {
  const [isProcessing, setIsProcessing] = useState(false)
  const [results, setResults] = useState<null | {
    summary: string
    entities: Array<{ name: string; type: string }>
    sentiment: string
    topics: string[]
    recommendations: string[]
  }>(null)

  const handleAnalyze = () => {
    setIsProcessing(true)

    // Simulate AI processing
    setTimeout(() => {
      setResults({
        summary:
          "This is a webpage about web scraping tools and techniques. It discusses various methods for extracting data from websites, including scheduled scraping and data transformation.",
        entities: [
          { name: "Web Scraping", type: "Concept" },
          { name: "Data Extraction", type: "Concept" },
          { name: "HTML", type: "Technology" },
          { name: "API", type: "Technology" },
        ],
        sentiment: "Neutral",
        topics: ["Web Development", "Data Collection", "Automation"],
        recommendations: [
          "Try using CSS selectors for more precise data extraction",
          "Consider implementing rate limiting to avoid IP blocks",
          "Add proxy rotation for large-scale scraping projects",
        ],
      })
      setIsProcessing(false)
    }, 3000)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>CrewAI Analysis</CardTitle>
        <CardDescription>Analyze your scraped data with our specialized AI agents</CardDescription>
      </CardHeader>
      <CardContent>
        {!results ? (
          <div className="space-y-4">
            <p>
              CrewAI uses multiple specialized AI agents working together to analyze your scraped data from different
              perspectives.
            </p>
            <div className="grid grid-cols-2 gap-2">
              <div className="border rounded p-2">
                <h4 className="font-semibold">Researcher Agent</h4>
                <p className="text-sm">Extracts key information and entities</p>
              </div>
              <div className="border rounded p-2">
                <h4 className="font-semibold">Analyst Agent</h4>
                <p className="text-sm">Identifies patterns and insights</p>
              </div>
              <div className="border rounded p-2">
                <h4 className="font-semibold">Critic Agent</h4>
                <p className="text-sm">Evaluates quality and reliability</p>
              </div>
              <div className="border rounded p-2">
                <h4 className="font-semibold">Advisor Agent</h4>
                <p className="text-sm">Provides actionable recommendations</p>
              </div>
            </div>
            <Button onClick={handleAnalyze} className="w-full" disabled={isProcessing}>
              {isProcessing ? "Processing..." : "Analyze with CrewAI"}
            </Button>
          </div>
        ) : (
          <Tabs defaultValue="summary">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="summary">Summary</TabsTrigger>
              <TabsTrigger value="entities">Entities</TabsTrigger>
              <TabsTrigger value="insights">Insights</TabsTrigger>
              <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
            </TabsList>

            <TabsContent value="summary" className="space-y-4">
              <div className="mt-4">
                <h3 className="font-semibold mb-2">Content Summary</h3>
                <p>{results.summary}</p>
              </div>
              <Button onClick={() => setResults(null)} variant="outline">
                Reset Analysis
              </Button>
            </TabsContent>

            <TabsContent value="entities">
              <div className="mt-4">
                <h3 className="font-semibold mb-2">Identified Entities</h3>
                <div className="space-y-2">
                  {results.entities.map((entity, index) => (
                    <div key={index} className="flex justify-between items-center border-b pb-2">
                      <span>{entity.name}</span>
                      <Badge>{entity.type}</Badge>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="insights">
              <div className="mt-4 space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Overall Sentiment</h3>
                  <Badge
                    className={
                      results.sentiment === "Positive"
                        ? "bg-green-500"
                        : results.sentiment === "Negative"
                          ? "bg-red-500"
                          : "bg-gray-500"
                    }
                  >
                    {results.sentiment}
                  </Badge>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Main Topics</h3>
                  <div className="flex flex-wrap gap-2">
                    {results.topics.map((topic, index) => (
                      <Badge key={index} variant="outline">
                        {topic}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="recommendations">
              <div className="mt-4">
                <h3 className="font-semibold mb-2">Recommendations</h3>
                <ul className="space-y-2 list-disc pl-5">
                  {results.recommendations.map((rec, index) => (
                    <li key={index}>{rec}</li>
                  ))}
                </ul>
              </div>
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  )
}
