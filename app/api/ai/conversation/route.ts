import { type NextRequest, NextResponse } from "next/server"
import { createConversation, getConversationHistory, saveMessage } from "@/lib/services/ai-service"
import { supabase } from "@/lib/database"

// Helper function to get the current user
async function getCurrentUser(req: NextRequest) {
  const { data, error } = await supabase.auth.getSession()

  if (error || !data.session) {
    return null
  }

  return data.session.user
}

// Create a new conversation
export async function POST(req: NextRequest) {
  try {
    // Authenticate user
    const user = await getCurrentUser(req)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Parse request body
    const body = await req.json()
    const { title } = body

    if (!title || typeof title !== "string") {
      return NextResponse.json({ error: "Title is required" }, { status: 400 })
    }

    // Create conversation
    const conversation = await createConversation(user.id, title)

    return NextResponse.json({ conversation }, { status: 201 })
  } catch (error) {
    console.error("Error creating conversation:", error)
    return NextResponse.json({ error: "Failed to create conversation" }, { status: 500 })
  }
}

// Get conversation history
export async function GET(req: NextRequest) {
  try {
    // Authenticate user
    const user = await getCurrentUser(req)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get conversation ID from URL
    const url = new URL(req.url)
    const conversationId = url.searchParams.get("id")

    if (!conversationId) {
      return NextResponse.json({ error: "Conversation ID is required" }, { status: 400 })
    }

    // Verify user owns this conversation
    const { data: conversation, error: conversationError } = await supabase
      .from("ai_conversations")
      .select("*")
      .eq("id", conversationId)
      .eq("user_id", user.id)
      .single()

    if (conversationError || !conversation) {
      return NextResponse.json({ error: "Conversation not found" }, { status: 404 })
    }

    // Get conversation history
    const messages = await getConversationHistory(conversationId)

    return NextResponse.json({ messages }, { status: 200 })
  } catch (error) {
    console.error("Error getting conversation history:", error)
    return NextResponse.json({ error: "Failed to get conversation history" }, { status: 500 })
  }
}

// Add message to conversation
export async function PUT(req: NextRequest) {
  try {
    // Authenticate user
    const user = await getCurrentUser(req)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Parse request body
    const body = await req.json()
    const { conversationId, role, content } = body

    if (!conversationId || !role || !content) {
      return NextResponse.json({ error: "Conversation ID, role, and content are required" }, { status: 400 })
    }

    if (!["user", "assistant", "system"].includes(role)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 })
    }

    // Verify user owns this conversation
    const { data: conversation, error: conversationError } = await supabase
      .from("ai_conversations")
      .select("*")
      .eq("id", conversationId)
      .eq("user_id", user.id)
      .single()

    if (conversationError || !conversation) {
      return NextResponse.json({ error: "Conversation not found" }, { status: 404 })
    }

    // Save message
    await saveMessage(conversationId, role, content)

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error("Error adding message to conversation:", error)
    return NextResponse.json({ error: "Failed to add message to conversation" }, { status: 500 })
  }
}

// Delete conversation
export async function DELETE(req: NextRequest) {
  try {
    // Authenticate user
    const user = await getCurrentUser(req)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get conversation ID from URL
    const url = new URL(req.url)
    const conversationId = url.searchParams.get("id")

    if (!conversationId) {
      return NextResponse.json({ error: "Conversation ID is required" }, { status: 400 })
    }

    // Verify user owns this conversation
    const { data: conversation, error: conversationError } = await supabase
      .from("ai_conversations")
      .select("*")
      .eq("id", conversationId)
      .eq("user_id", user.id)
      .single()

    if (conversationError || !conversation) {
      return NextResponse.json({ error: "Conversation not found" }, { status: 404 })
    }

    // Delete conversation messages first
    const { error: messagesError } = await supabase.from("ai_messages").delete().eq("conversation_id", conversationId)

    if (messagesError) {
      console.error("Error deleting conversation messages:", messagesError)
      return NextResponse.json({ error: "Failed to delete conversation messages" }, { status: 500 })
    }

    // Delete conversation
    const { error: deleteError } = await supabase.from("ai_conversations").delete().eq("id", conversationId)

    if (deleteError) {
      console.error("Error deleting conversation:", deleteError)
      return NextResponse.json({ error: "Failed to delete conversation" }, { status: 500 })
    }

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error("Error deleting conversation:", error)
    return NextResponse.json({ error: "Failed to delete conversation" }, { status: 500 })
  }
}
