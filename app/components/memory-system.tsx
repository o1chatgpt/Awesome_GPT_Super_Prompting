"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, Star, Trash2 } from "lucide-react"

export default function MemorySystem() {
  const [memories, setMemories] = useState<
    Array<{
      id: string
      type: string
      content: string
      timestamp: string
      relevance: number
    }>
  >([])

  useEffect(() => {
    // Simulate loading memories from storage
    const sampleMemories = [
      {
        id: "mem1",
        type: "scrape_result",
        content: "Scraped data from example.com with text content type",
        timestamp: "2023-05-01T12:30:00Z",
        relevance: 5,
      },
      {
        id: "mem2",
        type: "user_preference",
        content: "User prefers JSON output format",
        timestamp: "2023-04-28T15:45:00Z",
        relevance: 4,
      },
      {
        id: "mem3",
        type: "ai_insight",
        content: "Recommended using CSS selectors for more precise extraction",
        timestamp: "2023-04-25T09:15:00Z",
        relevance: 3,
      },
    ]
    setMemories(sampleMemories)
  }, [])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString() + " " + date.toLocaleTimeString()
  }

  const deleteMemory = (id: string) => {
    setMemories(memories.filter((memory) => memory.id !== id))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Memory System</CardTitle>
        <CardDescription>
          Your AI assistant remembers important information to provide better assistance
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {memories.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">
              No memories stored yet. As you use the system, relevant information will be remembered.
            </p>
          ) : (
            <div className="space-y-3">
              {memories.map((memory) => (
                <div key={memory.id} className="border rounded-lg p-3 relative">
                  <div className="flex justify-between items-start">
                    <Badge variant="outline">{memory.type}</Badge>
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => deleteMemory(memory.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="my-2">{memory.content}</p>
                  <div className="flex justify-between items-center text-xs text-muted-foreground">
                    <div className="flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {formatDate(memory.timestamp)}
                    </div>
                    <div className="flex items-center">
                      <span className="mr-1">Relevance:</span>
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className="h-3 w-3" fill={i < memory.relevance ? "gold" : "none"} />
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          <Button variant="outline" className="w-full">
            View All Memories
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
