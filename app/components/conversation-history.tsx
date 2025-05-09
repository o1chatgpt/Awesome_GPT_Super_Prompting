"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MessageSquare, Trash2, Plus, Loader2 } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { getUserConversations, deleteConversation } from "@/lib/actions/ai-actions"

interface Conversation {
  id: string
  title: string
  created_at: string
  updated_at: string
}

interface ConversationHistoryProps {
  onSelectConversation: (id: string) => void
  onNewConversation: () => void
  selectedConversationId: string | null
}

export default function ConversationHistory({
  onSelectConversation,
  onNewConversation,
  selectedConversationId,
}: ConversationHistoryProps) {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDeleting, setIsDeleting] = useState<string | null>(null)

  useEffect(() => {
    fetchConversations()
  }, [])

  const fetchConversations = async () => {
    setIsLoading(true)
    try {
      const data = await getUserConversations()
      setConversations(data)
    } catch (error) {
      console.error("Error fetching conversations:", error)
      toast({
        title: "Error",
        description: "Failed to load conversation history",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteConversation = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setIsDeleting(id)

    try {
      await deleteConversation(id)
      setConversations((prev) => prev.filter((conv) => conv.id !== id))

      if (selectedConversationId === id) {
        onNewConversation()
      }

      toast({
        title: "Conversation Deleted",
        description: "The conversation has been removed",
      })
    } catch (error) {
      console.error("Error deleting conversation:", error)
      toast({
        title: "Error",
        description: "Failed to delete conversation",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(null)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))

    if (diffDays === 0) {
      return "Today"
    } else if (diffDays === 1) {
      return "Yesterday"
    } else if (diffDays < 7) {
      return `${diffDays} days ago`
    } else {
      return date.toLocaleDateString()
    }
  }

  return (
    <Card className="w-full h-[calc(100vh-12rem)]">
      <CardHeader className="pb-3">
        <CardTitle>Conversations</CardTitle>
        <CardDescription>Your chat history with the AI assistant</CardDescription>
      </CardHeader>
      <CardContent className="p-0 flex flex-col h-[calc(100%-5rem)]">
        <Button className="mx-4 mb-2" onClick={onNewConversation}>
          <Plus className="h-4 w-4 mr-2" />
          New Conversation
        </Button>

        <Separator />

        <ScrollArea className="flex-1 px-4 py-2">
          {isLoading ? (
            <div className="flex justify-center items-center h-full">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : conversations.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <MessageSquare className="h-8 w-8 mx-auto mb-2" />
              <p>No conversations yet</p>
              <p className="text-sm">Start a new chat with the AI assistant</p>
            </div>
          ) : (
            <div className="space-y-2">
              {conversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className={`p-3 rounded-md cursor-pointer flex justify-between items-center ${
                    selectedConversationId === conversation.id ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                  }`}
                  onClick={() => onSelectConversation(conversation.id)}
                >
                  <div className="overflow-hidden">
                    <div className="font-medium truncate">{conversation.title}</div>
                    <div
                      className={`text-xs ${
                        selectedConversationId === conversation.id
                          ? "text-primary-foreground/70"
                          : "text-muted-foreground"
                      }`}
                    >
                      {formatDate(conversation.updated_at)}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={`opacity-60 hover:opacity-100 ${
                      selectedConversationId === conversation.id ? "hover:bg-primary/90 text-primary-foreground" : ""
                    }`}
                    onClick={(e) => handleDeleteConversation(conversation.id, e)}
                    disabled={isDeleting === conversation.id}
                  >
                    {isDeleting === conversation.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
