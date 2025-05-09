"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Slider } from "@/components/ui/slider"
import { toast } from "@/components/ui/use-toast"
import { BrainCircuit, Database, Bot, Key, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function AISettingsPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  const [generalSettings, setGeneralSettings] = useState({
    defaultModel: "gpt-4o",
    apiKey: "sk-••••••••••••••••••••••••••••••••••••••••••••",
    organizationId: "",
    maxTokensPerRequest: "1000",
    defaultTemperature: 0.7,
  })

  const [vectorSettings, setVectorSettings] = useState({
    embeddingModel: "text-embedding-3-small",
    vectorDimensions: "1536",
    similarityThreshold: 0.75,
    maxResults: "5",
    indexType: "ivfflat",
  })

  const [memorySettings, setMemorySettings] = useState({
    enableMemory: true,
    contextWindow: "10",
    relevanceThreshold: 0.6,
    maxMemoryItems: "50",
    memoryDecay: "0.95",
  })

  const [usageSettings, setUsageSettings] = useState({
    enableRateLimiting: true,
    defaultCreditsPerUser: "1000",
    alertThreshold: "100",
    preventOverages: false,
    trackUsageByModel: true,
  })

  useEffect(() => {
    // Simulate loading settings from the server
    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
  }, [])

  const handleSaveGeneral = () => {
    setIsSaving(true)
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Settings Saved",
        description: "General AI settings have been updated",
      })
      setIsSaving(false)
    }, 1000)
  }

  const handleSaveVector = () => {
    setIsSaving(true)
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Settings Saved",
        description: "Vector database settings have been updated",
      })
      setIsSaving(false)
    }, 1000)
  }

  const handleSaveMemory = () => {
    setIsSaving(true)
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Settings Saved",
        description: "Memory system settings have been updated",
      })
      setIsSaving(false)
    }, 1000)
  }

  const handleSaveUsage = () => {
    setIsSaving(true)
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Settings Saved",
        description: "Usage and limits settings have been updated",
      })
      setIsSaving(false)
    }, 1000)
  }

  if (isLoading) {
    return (
      <div className="container mx-auto">
        <div className="flex items-center mb-6">
          <Button variant="outline" size="icon" asChild className="mr-4">
            <Link href="/admin/dashboard">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-3xl font-bold">AI Settings</h1>
        </div>
        <Card>
          <CardContent className="p-8 text-center">Loading AI settings...</CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto">
      <div className="flex items-center mb-6">
        <Button variant="outline" size="icon" asChild className="mr-4">
          <Link href="/admin/dashboard">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">AI Settings</h1>
          <p className="text-muted-foreground">Configure AI models, vector storage, and memory systems</p>
        </div>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid grid-cols-4 w-full max-w-2xl">
          <TabsTrigger value="general">
            <Bot className="h-4 w-4 mr-2" />
            General
          </TabsTrigger>
          <TabsTrigger value="vector">
            <Database className="h-4 w-4 mr-2" />
            Vector DB
          </TabsTrigger>
          <TabsTrigger value="memory">
            <BrainCircuit className="h-4 w-4 mr-2" />
            Memory
          </TabsTrigger>
          <TabsTrigger value="usage">
            <Key className="h-4 w-4 mr-2" />
            Usage & Limits
          </TabsTrigger>
        </TabsList>

        {/* General AI Settings */}
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General AI Settings</CardTitle>
              <CardDescription>Configure OpenAI integration and default model settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="apiKey">OpenAI API Key</Label>
                  <Input
                    id="apiKey"
                    value={generalSettings.apiKey}
                    onChange={(e) => setGeneralSettings({ ...generalSettings, apiKey: e.target.value })}
                    type="password"
                  />
                  <p className="text-sm text-muted-foreground">Your OpenAI API key for authentication</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="organizationId">Organization ID (Optional)</Label>
                  <Input
                    id="organizationId"
                    value={generalSettings.organizationId}
                    onChange={(e) => setGeneralSettings({ ...generalSettings, organizationId: e.target.value })}
                    placeholder="org-..."
                  />
                  <p className="text-sm text-muted-foreground">Your OpenAI organization ID if applicable</p>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label htmlFor="defaultModel">Default AI Model</Label>
                  <Select
                    value={generalSettings.defaultModel}
                    onValueChange={(value) => setGeneralSettings({ ...generalSettings, defaultModel: value })}
                  >
                    <SelectTrigger id="defaultModel">
                      <SelectValue placeholder="Select model" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gpt-4o">GPT-4o</SelectItem>
                      <SelectItem value="gpt-4-turbo">GPT-4 Turbo</SelectItem>
                      <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground">The default model to use for AI interactions</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maxTokens">Max Tokens Per Request</Label>
                  <Input
                    id="maxTokens"
                    value={generalSettings.maxTokensPerRequest}
                    onChange={(e) => setGeneralSettings({ ...generalSettings, maxTokensPerRequest: e.target.value })}
                    type="number"
                  />
                  <p className="text-sm text-muted-foreground">Maximum number of tokens to generate per request</p>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="temperature">Temperature</Label>
                    <span className="text-sm">{generalSettings.defaultTemperature}</span>
                  </div>
                  <Slider
                    id="temperature"
                    min={0}
                    max={2}
                    step={0.1}
                    value={[generalSettings.defaultTemperature]}
                    onValueChange={(value) => setGeneralSettings({ ...generalSettings, defaultTemperature: value[0] })}
                  />
                  <p className="text-sm text-muted-foreground">
                    Controls randomness: Lower values are more deterministic, higher values more creative
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">Reset to Defaults</Button>
              <Button onClick={handleSaveGeneral} disabled={isSaving}>
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Vector Database Settings */}
        <TabsContent value="vector">
          <Card>
            <CardHeader>
              <CardTitle>Vector Database Settings</CardTitle>
              <CardDescription>Configure embedding models and vector storage</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="embeddingModel">Embedding Model</Label>
                  <Select
                    value={vectorSettings.embeddingModel}
                    onValueChange={(value) => setVectorSettings({ ...vectorSettings, embeddingModel: value })}
                  >
                    <SelectTrigger id="embeddingModel">
                      <SelectValue placeholder="Select model" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="text-embedding-3-small">text-embedding-3-small</SelectItem>
                      <SelectItem value="text-embedding-3-large">text-embedding-3-large</SelectItem>
                      <SelectItem value="text-embedding-ada-002">text-embedding-ada-002 (Legacy)</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground">The model to use for generating embeddings</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="vectorDimensions">Vector Dimensions</Label>
                  <Input
                    id="vectorDimensions"
                    value={vectorSettings.vectorDimensions}
                    onChange={(e) => setVectorSettings({ ...vectorSettings, vectorDimensions: e.target.value })}
                    type="number"
                    disabled
                  />
                  <p className="text-sm text-muted-foreground">
                    Dimensions of the embedding vectors (determined by the model)
                  </p>
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="similarityThreshold">Similarity Threshold</Label>
                    <span className="text-sm">{vectorSettings.similarityThreshold}</span>
                  </div>
                  <Slider
                    id="similarityThreshold"
                    min={0}
                    max={1}
                    step={0.05}
                    value={[vectorSettings.similarityThreshold]}
                    onValueChange={(value) => setVectorSettings({ ...vectorSettings, similarityThreshold: value[0] })}
                  />
                  <p className="text-sm text-muted-foreground">
                    Minimum similarity score for matching embeddings (higher = more precise)
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maxResults">Max Results</Label>
                  <Input
                    id="maxResults"
                    value={vectorSettings.maxResults}
                    onChange={(e) => setVectorSettings({ ...vectorSettings, maxResults: e.target.value })}
                    type="number"
                  />
                  <p className="text-sm text-muted-foreground">
                    Maximum number of results to return from similarity searches
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="indexType">Index Type</Label>
                  <Select
                    value={vectorSettings.indexType}
                    onValueChange={(value) => setVectorSettings({ ...vectorSettings, indexType: value })}
                  >
                    <SelectTrigger id="indexType">
                      <SelectValue placeholder="Select index type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ivfflat">IVF Flat</SelectItem>
                      <SelectItem value="hnsw">HNSW</SelectItem>
                      <SelectItem value="flat">Flat (Exact Search)</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground">
                    Vector index type for optimizing search performance and accuracy
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">Reset to Defaults</Button>
              <Button onClick={handleSaveVector} disabled={isSaving}>
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Memory System Settings */}
        <TabsContent value="memory">
          <Card>
            <CardHeader>
              <CardTitle>Memory System Settings</CardTitle>
              <CardDescription>Configure how the AI remembers and uses past interactions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Enable Memory System</h3>
                    <p className="text-sm text-muted-foreground">Allow AI to remember past interactions</p>
                  </div>
                  <Switch
                    checked={memorySettings.enableMemory}
                    onCheckedChange={(checked) => setMemorySettings({ ...memorySettings, enableMemory: checked })}
                  />
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label htmlFor="contextWindow">Context Window Size</Label>
                  <Input
                    id="contextWindow"
                    value={memorySettings.contextWindow}
                    onChange={(e) => setMemorySettings({ ...memorySettings, contextWindow: e.target.value })}
                    type="number"
                    disabled={!memorySettings.enableMemory}
                  />
                  <p className="text-sm text-muted-foreground">
                    Number of previous messages to include in each conversation
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="relevanceThreshold">Relevance Threshold</Label>
                    <span className="text-sm">{memorySettings.relevanceThreshold}</span>
                  </div>
                  <Slider
                    id="relevanceThreshold"
                    min={0}
                    max={1}
                    step={0.05}
                    value={[memorySettings.relevanceThreshold]}
                    onValueChange={(value) => setMemorySettings({ ...memorySettings, relevanceThreshold: value[0] })}
                    disabled={!memorySettings.enableMemory}
                  />
                  <p className="text-sm text-muted-foreground">
                    Minimum relevance score for including memories (higher = more selective)
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maxMemoryItems">Max Memory Items</Label>
                  <Input
                    id="maxMemoryItems"
                    value={memorySettings.maxMemoryItems}
                    onChange={(e) => setMemorySettings({ ...memorySettings, maxMemoryItems: e.target.value })}
                    type="number"
                    disabled={!memorySettings.enableMemory}
                  />
                  <p className="text-sm text-muted-foreground">Maximum number of memory items to store per user</p>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="memoryDecay">Memory Decay Rate</Label>
                    <span className="text-sm">{memorySettings.memoryDecay}</span>
                  </div>
                  <Slider
                    id="memoryDecay"
                    min={0.5}
                    max={1}
                    step={0.01}
                    value={[memorySettings.memoryDecay]}
                    onValueChange={(value) => setMemorySettings({ ...memorySettings, memoryDecay: value[0] })}
                    disabled={!memorySettings.enableMemory}
                  />
                  <p className="text-sm text-muted-foreground">
                    Rate at which memory relevance decays over time (higher = slower decay)
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">Reset to Defaults</Button>
              <Button onClick={handleSaveMemory} disabled={isSaving}>
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Usage and Limits Settings */}
        <TabsContent value="usage">
          <Card>
            <CardHeader>
              <CardTitle>Usage & Limits</CardTitle>
              <CardDescription>Configure AI usage limits and tracking</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Enable Rate Limiting</h3>
                    <p className="text-sm text-muted-foreground">Limit AI usage based on user credits</p>
                  </div>
                  <Switch
                    checked={usageSettings.enableRateLimiting}
                    onCheckedChange={(checked) => setUsageSettings({ ...usageSettings, enableRateLimiting: checked })}
                  />
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label htmlFor="defaultCredits">Default Credits Per User</Label>
                  <Input
                    id="defaultCredits"
                    value={usageSettings.defaultCreditsPerUser}
                    onChange={(e) => setUsageSettings({ ...usageSettings, defaultCreditsPerUser: e.target.value })}
                    type="number"
                    disabled={!usageSettings.enableRateLimiting}
                  />
                  <p className="text-sm text-muted-foreground">
                    Number of AI credits allocated to each new user (1 credit ≈ 1000 tokens)
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="alertThreshold">Alert Threshold</Label>
                  <Input
                    id="alertThreshold"
                    value={usageSettings.alertThreshold}
                    onChange={(e) => setUsageSettings({ ...usageSettings, alertThreshold: e.target.value })}
                    type="number"
                    disabled={!usageSettings.enableRateLimiting}
                  />
                  <p className="text-sm text-muted-foreground">
                    Notify users when their credits fall below this threshold
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Prevent Overages</h3>
                    <p className="text-sm text-muted-foreground">Block AI usage when credits are depleted</p>
                  </div>
                  <Switch
                    checked={usageSettings.preventOverages}
                    onCheckedChange={(checked) => setUsageSettings({ ...usageSettings, preventOverages: checked })}
                    disabled={!usageSettings.enableRateLimiting}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Track Usage By Model</h3>
                    <p className="text-sm text-muted-foreground">Track and report AI usage separately for each model</p>
                  </div>
                  <Switch
                    checked={usageSettings.trackUsageByModel}
                    onCheckedChange={(checked) => setUsageSettings({ ...usageSettings, trackUsageByModel: checked })}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">Reset to Defaults</Button>
              <Button onClick={handleSaveUsage} disabled={isSaving}>
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
