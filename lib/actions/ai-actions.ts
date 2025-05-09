"use server"

import { openai } from "@ai-sdk/openai"
import { generateText } from "ai"
import { supabase } from "@/lib/database"
import { getUserProfile } from "@/lib/actions/auth"

// Create a new conversation
export async function createConversation(initialMessage: string) {
  const user = await getUserProfile()

  if (!user) {
    throw new Error("User not authenticated")
  }

  // Create a title for the conversation based on the initial message
  const titleResponse = await generateText({
    model: openai("gpt-4o"),
    prompt: `Generate a short, concise title (max 6 words) for a conversation that starts with this message: "${initialMessage}"`,
    maxTokens: 20,
  })

  const title = titleResponse.text.replace(/"/g, "").trim()

  // Create the conversation in the database
  const { data, error } = await supabase
    .from("ai_conversations")
    .insert({
      user_id: user.id,
      title: title || "New Conversation",
    })
    .select()
    .single()

  if (error) {
    console.error("Error creating conversation:", error)
    throw new Error("Failed to create conversation")
  }

  return data
}

// Get conversation history
export async function getConversationHistory(conversationId: string) {
  const user = await getUserProfile()

  if (!user) {
    throw new Error("User not authenticated")
  }

  // First verify the conversation belongs to the user
  const { data: conversation, error: convError } = await supabase
    .from("ai_conversations")
    .select("*")
    .eq("id", conversationId)
    .eq("user_id", user.id)
    .single()

  if (convError || !conversation) {
    throw new Error("Conversation not found or access denied")
  }

  // Get the messages
  const { data, error } = await supabase
    .from("ai_messages")
    .select("*")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true })

  if (error) {
    console.error("Error fetching conversation history:", error)
    throw new Error("Failed to fetch conversation history")
  }

  return data
}

// Get all conversations for the current user
export async function getUserConversations() {
  const user = await getUserProfile()

  if (!user) {
    throw new Error("User not authenticated")
  }

  const { data, error } = await supabase
    .from("ai_conversations")
    .select("*")
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false })

  if (error) {
    console.error("Error fetching user conversations:", error)
    throw new Error("Failed to fetch conversations")
  }

  return data
}

// Send a message to the AI and get a response
export async function sendMessage(conversationId: string, message: string) {
  const user = await getUserProfile()

  if (!user) {
    throw new Error("User not authenticated")
  }

  // Save the user message
  const { error: userMsgError } = await supabase.from("ai_messages").insert({
    conversation_id: conversationId,
    role: "user",
    content: message,
  })

  if (userMsgError) {
    console.error("Error saving user message:", userMsgError)
    throw new Error("Failed to save user message")
  }

  // Get conversation history
  const history = await getConversationHistory(conversationId)

  // Format messages for the AI
  const messages = history.map((msg) => ({
    role: msg.role,
    content: msg.content,
  }))

  // Add system message if not present
  if (!messages.some((msg) => msg.role === "system")) {
    messages.unshift({
      role: "system",
      content: `You are an AI assistant for a web scraping platform. Help users with web scraping techniques, data extraction, analysis, and using the platform's features. 
      
Current date: ${new Date().toISOString().split("T")[0]}
User: ${user.full_name || user.email}

Be helpful, concise, and provide practical advice. If asked about illegal activities or unethical scraping, remind users to respect website terms of service, robots.txt files, and rate limits.`,
    })
  }

  try {
    // Generate AI response
    const response = await generateText({
      model: openai("gpt-4o"),
      messages,
      temperature: 0.7,
      maxTokens: 1000,
    })

    // Save the AI response
    const { error: aiMsgError } = await supabase.from("ai_messages").insert({
      conversation_id: conversationId,
      role: "assistant",
      content: response.text,
      tokens: response.usage?.totalTokens || 0,
    })

    if (aiMsgError) {
      console.error("Error saving AI response:", aiMsgError)
    }

    // Update conversation timestamp
    await supabase.from("ai_conversations").update({ updated_at: new Date().toISOString() }).eq("id", conversationId)

    // Update user AI usage
    if (response.usage) {
      await updateAIUsage(user.id, {
        totalTokens: response.usage.totalTokens,
        promptTokens: response.usage.promptTokens,
        completionTokens: response.usage.completionTokens,
      })
    }

    return { text: response.text, usage: response.usage }
  } catch (error) {
    console.error("Error generating AI response:", error)
    throw new Error("Failed to generate AI response")
  }
}

// Update user AI usage
async function updateAIUsage(
  userId: string,
  usage: { totalTokens: number; promptTokens: number; completionTokens: number },
) {
  const { data: profile, error: fetchError } = await supabase
    .from("profiles")
    .select("ai_usage")
    .eq("id", userId)
    .single()

  if (fetchError) {
    console.error("Error fetching user profile for AI usage update:", fetchError)
    return
  }

  const currentUsage = profile.ai_usage || {
    total_tokens: 0,
    prompt_tokens: 0,
    completion_tokens: 0,
    embedding_tokens: 0,
  }

  const updatedUsage = {
    total_tokens: (currentUsage.total_tokens || 0) + usage.totalTokens,
    prompt_tokens: (currentUsage.prompt_tokens || 0) + usage.promptTokens,
    completion_tokens: (currentUsage.completion_tokens || 0) + usage.completionTokens,
    embedding_tokens: currentUsage.embedding_tokens || 0,
  }

  const { error: updateError } = await supabase
    .from("profiles")
    .update({
      ai_usage: updatedUsage,
      ai_credits: supabase.rpc("decrement_credits", { amount: usage.totalTokens }),
    })
    .eq("id", userId)

  if (updateError) {
    console.error("Error updating AI usage:", updateError)
  }
}

// Delete a conversation
export async function deleteConversation(conversationId: string) {
  const user = await getUserProfile()

  if (!user) {
    throw new Error("User not authenticated")
  }

  // First verify the conversation belongs to the user
  const { data: conversation, error: convError } = await supabase
    .from("ai_conversations")
    .select("*")
    .eq("id", conversationId)
    .eq("user_id", user.id)
    .single()

  if (convError || !conversation) {
    throw new Error("Conversation not found or access denied")
  }

  // Delete the conversation (messages will be deleted via cascade)
  const { error } = await supabase.from("ai_conversations").delete().eq("id", conversationId)

  if (error) {
    console.error("Error deleting conversation:", error)
    throw new Error("Failed to delete conversation")
  }

  return { success: true }
}
