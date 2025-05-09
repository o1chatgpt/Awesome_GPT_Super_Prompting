"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import AIChatInterface from "@/app/components/ai-chat-interface"
import ConversationHistory from "@/app/components/conversation-history"

export default function AIAssistantPage() {
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null)

  const handleSelectConversation = (id: string) => {
    setSelectedConversationId(id)
  }

  const handleNewConversation = () => {
    setSelectedConversationId(null)
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center mb-6">
        <Button variant="outline" size="icon" asChild className="mr-4">
          <Link href="/ai-tools">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">AI Assistant</h1>
          <p className="text-muted-foreground">Chat with your AI assistant for help with web scraping</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1">
          <ConversationHistory
            onSelectConversation={handleSelectConversation}
            onNewConversation={handleNewConversation}
            selectedConversationId={selectedConversationId}
          />
        </div>
        <div className="md:col-span-3">
          <AIChatInterface />
        </div>
      </div>
    </div>
  )
}
