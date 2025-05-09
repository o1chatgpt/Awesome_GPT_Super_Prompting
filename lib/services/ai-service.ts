import { openai } from "@ai-sdk/openai"
import { generateText, generateEmbedding } from "ai"
import { supabase } from "@/lib/database"

// Types
export interface AIMessage {
  role: "user" | "assistant" | "system"
  content: string
}

export interface AISettings {
  model: string
  temperature: number
  maxTokens: number
  contextWindow: number
  useMemory: boolean
  useEmbeddings: boolean
}

export interface AIResponse {
  text: string
  usage?: {
    totalTokens: number
    promptTokens: number
    completionTokens: number
  }
}

// Default settings
const DEFAULT_SETTINGS: AISettings = {
  model: "gpt-4o",
  temperature: 0.7,
  maxTokens: 1000,
  contextWindow: 10,
  useMemory: true,
  useEmbeddings: true,
}

// Get user AI settings
export async function getUserAISettings(userId: string): Promise<AISettings> {
  const { data, error } = await supabase.from("ai_settings").select("*").eq("user_id", userId).single()

  if (error || !data) {
    // Create default settings if not found
    const { error: insertError } = await supabase.from("ai_settings").insert({
      user_id: userId,
      model: DEFAULT_SETTINGS.model,
      temperature: DEFAULT_SETTINGS.temperature,
      max_tokens: DEFAULT_SETTINGS.maxTokens,
      context_window: DEFAULT_SETTINGS.contextWindow,
      use_memory: DEFAULT_SETTINGS.useMemory,
      use_embeddings: DEFAULT_SETTINGS.useEmbeddings,
    })

    if (insertError) {
      console.error("Error creating default AI settings:", insertError)
    }

    return DEFAULT_SETTINGS
  }

  return {
    model: data.model,
    temperature: data.temperature,
    maxTokens: data.max_tokens,
    contextWindow: data.context_window,
    useMemory: data.use_memory,
    useEmbeddings: data.use_embeddings,
  }
}

// Update user AI settings
export async function updateUserAISettings(userId: string, settings: Partial<AISettings>) {
  const { error } = await supabase
    .from("ai_settings")
    .update({
      model: settings.model,
      temperature: settings.temperature,
      max_tokens: settings.maxTokens,
      context_window: settings.contextWindow,
      use_memory: settings.useMemory,
      use_embeddings: settings.useEmbeddings,
      updated_at: new Date().toISOString(),
    })
    .eq("user_id", userId)

  if (error) {
    console.error("Error updating AI settings:", error)
    throw new Error("Failed to update AI settings")
  }

  return { success: true }
}

// Create a new conversation
export async function createConversation(userId: string, title?: string) {
  const { data, error } = await supabase
    .from("ai_conversations")
    .insert({
      user_id: userId,
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
export async function getConversationHistory(conversationId: string, limit = 50) {
  const { data, error } = await supabase
    .from("ai_messages")
    .select("*")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true })
    .limit(limit)

  if (error) {
    console.error("Error fetching conversation history:", error)
    throw new Error("Failed to fetch conversation history")
  }

  return data.map((message) => ({
    role: message.role as "user" | "assistant" | "system",
    content: message.content,
  }))
}

// Save a message to the conversation
export async function saveMessage(
  conversationId: string,
  role: "user" | "assistant" | "system",
  content: string,
  tokens?: number,
) {
  const { error } = await supabase.from("ai_messages").insert({
    conversation_id: conversationId,
    role,
    content,
    tokens,
  })

  if (error) {
    console.error("Error saving message:", error)
    throw new Error("Failed to save message")
  }

  return { success: true }
}

// Update user AI usage
export async function updateAIUsage(
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

// Update embedding usage
export async function updateEmbeddingUsage(userId: string, tokens: number) {
  const { data: profile, error: fetchError } = await supabase
    .from("profiles")
    .select("ai_usage")
    .eq("id", userId)
    .single()

  if (fetchError) {
    console.error("Error fetching user profile for embedding usage update:", fetchError)
    return
  }

  const currentUsage = profile.ai_usage || {
    total_tokens: 0,
    prompt_tokens: 0,
    completion_tokens: 0,
    embedding_tokens: 0,
  }

  const updatedUsage = {
    total_tokens: (currentUsage.total_tokens || 0) + tokens,
    prompt_tokens: currentUsage.prompt_tokens || 0,
    completion_tokens: currentUsage.completion_tokens || 0,
    embedding_tokens: (currentUsage.embedding_tokens || 0) + tokens,
  }

  const { error: updateError } = await supabase
    .from("profiles")
    .update({
      ai_usage: updatedUsage,
      ai_credits: supabase.rpc("decrement_credits", { amount: tokens }),
    })
    .eq("id", userId)

  if (updateError) {
    console.error("Error updating embedding usage:", updateError)
  }
}

// Generate text with OpenAI
export async function generateAIResponse(
  userId: string,
  messages: AIMessage[],
  settings?: Partial<AISettings>,
): Promise<AIResponse> {
  // Get user settings
  const userSettings = await getUserAISettings(userId)
  const mergedSettings = { ...userSettings, ...settings }

  try {
    // Generate response
    const response = await generateText({
      model: openai(mergedSettings.model),
      messages,
      temperature: mergedSettings.temperature,
      maxTokens: mergedSettings.maxTokens,
    })

    // Update usage statistics
    if (response.usage) {
      await updateAIUsage(userId, {
        totalTokens: response.usage.totalTokens,
        promptTokens: response.usage.promptTokens,
        completionTokens: response.usage.completionTokens,
      })
    }

    return {
      text: response.text,
      usage: response.usage,
    }
  } catch (error) {
    console.error("Error generating AI response:", error)
    throw new Error("Failed to generate AI response")
  }
}

// Create embedding for text
export async function createEmbedding(userId: string, content: string, metadata?: any) {
  try {
    // Generate embedding
    const embedding = await generateEmbedding({
      model: openai("text-embedding-3-small"),
      text: content,
    })

    // Estimate token usage (roughly 1 token per 4 characters)
    const estimatedTokens = Math.ceil(content.length / 4)

    // Store embedding in database
    const { error } = await supabase.from("embeddings").insert({
      user_id: userId,
      content,
      metadata,
      embedding: embedding.embedding,
    })

    if (error) {
      console.error("Error storing embedding:", error)
      throw new Error("Failed to store embedding")
    }

    // Update usage
    await updateEmbeddingUsage(userId, estimatedTokens)

    return { success: true }
  } catch (error) {
    console.error("Error creating embedding:", error)
    throw new Error("Failed to create embedding")
  }
}

// Search for similar content
export async function searchSimilarContent(userId: string, query: string, limit = 5) {
  try {
    // Generate embedding for query
    const embedding = await generateEmbedding({
      model: openai("text-embedding-3-small"),
      text: query,
    })

    // Search for similar content
    const { data, error } = await supabase.rpc("match_embeddings", {
      query_embedding: embedding.embedding,
      match_threshold: 0.7,
      match_count: limit,
      user_id: userId,
    })

    if (error) {
      console.error("Error searching similar content:", error)
      throw new Error("Failed to search similar content")
    }

    return data
  } catch (error) {
    console.error("Error in similarity search:", error)
    throw new Error("Failed to perform similarity search")
  }
}

// Get AI usage statistics
export async function getAIUsageStats(userId: string) {
  const { data, error } = await supabase.from("profiles").select("ai_credits, ai_usage").eq("id", userId).single()

  if (error) {
    console.error("Error fetching AI usage stats:", error)
    throw new Error("Failed to fetch AI usage statistics")
  }

  return {
    credits: data.ai_credits,
    usage: data.ai_usage,
  }
}
