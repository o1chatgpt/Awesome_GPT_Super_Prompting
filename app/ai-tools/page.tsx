"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bot, FileText, Lightbulb, BookOpen } from "lucide-react"
import AIChatInterface from "@/app/components/ai-chat-interface"
import AIKnowledgeBase from "@/app/components/ai-knowledge-base"

export default function AIToolsPage() {
  const [activeTab, setActiveTab] = useState("chat")
  const [chatInput, setChatInput] = useState("")

  const handleSelectQuestion = (question: string) => {
    setChatInput(question)
    setActiveTab("chat")
  }

  return (
    <div className="container py-6 space-y-6">
      <h1 className="text-3xl font-bold">AI Tools</h1>
      <p className="text-muted-foreground">AI-powered tools to enhance your web scraping workflow</p>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center gap-2">
            <Bot className="h-5 w-5" />
            <div>
              <CardTitle>AI Assistant</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm">
              Ask questions about web scraping, get help with your tasks, and receive guidance on best practices.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center gap-2">
            <FileText className="h-5 w-5" />
            <div>
              <CardTitle>Data Analysis</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm">Use AI to analyze your scraped data, extract insights, and generate reports.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center gap-2">
            <Lightbulb className="h-5 w-5" />
            <div>
              <CardTitle>Scraping Templates</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm">
              Browse and use pre-built scraping templates for common websites and data structures.
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-8">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="chat" className="flex items-center gap-2">
            <Bot className="h-4 w-4" />
            Chat with AI
          </TabsTrigger>
          <TabsTrigger value="knowledge" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Knowledge Base
          </TabsTrigger>
        </TabsList>

        <TabsContent value="chat" className="mt-4">
          <AIChatInterface initialInput={chatInput} />
        </TabsContent>

        <TabsContent value="knowledge" className="mt-4">
          <AIKnowledgeBase onSelectQuestion={handleSelectQuestion} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
