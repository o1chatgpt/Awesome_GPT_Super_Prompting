"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BarChart, LineChart } from "@/components/ui/charts"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Download, BrainCircuit, Search, RefreshCw } from "lucide-react"
import Link from "next/link"

export default function AIUsagePage() {
  const [dateRange, setDateRange] = useState("30")
  const [isLoading, setIsLoading] = useState(false)

  const handleRefresh = () => {
    setIsLoading(true)
    // Simulate loading
    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
  }

  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex items-center mb-6">
        <Button variant="outline" size="icon" asChild className="mr-4">
          <Link href="/admin/dashboard">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">AI Usage Statistics</h1>
          <p className="text-muted-foreground">Monitor AI usage across your platform</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select date range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 90 days</SelectItem>
              <SelectItem value="365">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={handleRefresh} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Tokens Used</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">2,547,892</div>
            <p className="text-xs text-muted-foreground mt-2">+18% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">AI Conversations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">4,281</div>
            <p className="text-xs text-muted-foreground mt-2">+24% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Avg. Tokens Per Request</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">842</div>
            <p className="text-xs text-muted-foreground mt-2">-5% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Estimated Cost</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">$127.39</div>
            <p className="text-xs text-muted-foreground mt-2">+12% from last month</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="models">Models</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="features">Features</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Token Usage Over Time</CardTitle>
              <CardDescription>Daily token consumption across all models</CardDescription>
            </CardHeader>
            <CardContent>
              <LineChart
                data={[
                  { name: "Week 1", value: 42000 },
                  { name: "Week 2", value: 63000 },
                  { name: "Week 3", value: 52000 },
                  { name: "Week 4", value: 78000 },
                ]}
                xAxisKey="name"
                yAxisKey="value"
                height={350}
              />
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Token Usage by Type</CardTitle>
                <CardDescription>Distribution of token usage by type</CardDescription>
              </CardHeader>
              <CardContent>
                <BarChart
                  data={[
                    { name: "Prompt", value: 1250000 },
                    { name: "Completion", value: 850000 },
                    { name: "Embedding", value: 450000 },
                  ]}
                  xAxisKey="name"
                  yAxisKey="value"
                  height={300}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Conversations by Day</CardTitle>
                <CardDescription>Number of AI conversations per day</CardDescription>
              </CardHeader>
              <CardContent>
                <LineChart
                  data={[
                    { name: "Mon", value: 145 },
                    { name: "Tue", value: 132 },
                    { name: "Wed", value: 164 },
                    { name: "Thu", value: 156 },
                    { name: "Fri", value: 139 },
                    { name: "Sat", value: 98 },
                    { name: "Sun", value: 87 },
                  ]}
                  xAxisKey="name"
                  yAxisKey="value"
                  height={300}
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="models" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Usage by Model</CardTitle>
              <CardDescription>Token consumption by AI model</CardDescription>
            </CardHeader>
            <CardContent>
              <BarChart
                data={[
                  { name: "GPT-4o", value: 1450000 },
                  { name: "GPT-3.5 Turbo", value: 650000 },
                  { name: "Embedding", value: 450000 },
                ]}
                xAxisKey="name"
                yAxisKey="value"
                height={350}
              />
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BrainCircuit className="mr-2 h-5 w-5 text-blue-500" />
                  GPT-4o
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Tokens</span>
                  <span className="font-medium">1,450,000</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Avg. Response Time</span>
                  <span className="font-medium">1.8s</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Avg. Tokens/Request</span>
                  <span className="font-medium">950</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Estimated Cost</span>
                  <span className="font-medium">$87.00</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BrainCircuit className="mr-2 h-5 w-5 text-green-500" />
                  GPT-3.5 Turbo
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Tokens</span>
                  <span className="font-medium">650,000</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Avg. Response Time</span>
                  <span className="font-medium">0.9s</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Avg. Tokens/Request</span>
                  <span className="font-medium">720</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Estimated Cost</span>
                  <span className="font-medium">$13.00</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Search className="mr-2 h-5 w-5 text-purple-500" />
                  Embedding Model
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Tokens</span>
                  <span className="font-medium">450,000</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Avg. Response Time</span>
                  <span className="font-medium">0.3s</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Avg. Tokens/Request</span>
                  <span className="font-medium">512</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Estimated Cost</span>
                  <span className="font-medium">$27.39</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <div className="flex items-center justify-between mb-4">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input placeholder="Search users..." className="pl-10" />
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Top Users by AI Usage</CardTitle>
              <CardDescription>Users with the highest token consumption</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-5 text-sm font-medium text-muted-foreground">
                  <div>User</div>
                  <div>Total Tokens</div>
                  <div>Conversations</div>
                  <div>Avg. Tokens/Request</div>
                  <div>Last Active</div>
                </div>

                <Separator />

                {[
                  {
                    name: "admin@example.com",
                    tokens: "458,921",
                    conversations: 245,
                    avgTokens: 872,
                    lastActive: "2 hours ago",
                  },
                  {
                    name: "john@example.com",
                    tokens: "352,678",
                    conversations: 187,
                    avgTokens: 912,
                    lastActive: "5 hours ago",
                  },
                  {
                    name: "sarah@example.com",
                    tokens: "287,432",
                    conversations: 156,
                    avgTokens: 845,
                    lastActive: "1 day ago",
                  },
                  {
                    name: "mike@example.com",
                    tokens: "198,765",
                    conversations: 124,
                    avgTokens: 782,
                    lastActive: "3 days ago",
                  },
                  {
                    name: "lisa@example.com",
                    tokens: "176,543",
                    conversations: 98,
                    avgTokens: 865,
                    lastActive: "5 days ago",
                  },
                ].map((user, index) => (
                  <div key={index} className="grid grid-cols-5 text-sm py-2 border-b">
                    <div className="font-medium">{user.name}</div>
                    <div>{user.tokens}</div>
                    <div>{user.conversations}</div>
                    <div>{user.avgTokens}</div>
                    <div>{user.lastActive}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>User Growth</CardTitle>
              <CardDescription>New users using AI features over time</CardDescription>
            </CardHeader>
            <CardContent>
              <LineChart
                data={[
                  { name: "Jan", value: 12 },
                  { name: "Feb", value: 18 },
                  { name: "Mar", value: 24 },
                  { name: "Apr", value: 32 },
                  { name: "May", value: 45 },
                  { name: "Jun", value: 58 },
                  { name: "Jul", value: 67 },
                  { name: "Aug", value: 72 },
                  { name: "Sep", value: 80 },
                ]}
                xAxisKey="name"
                yAxisKey="value"
                height={300}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="features" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>AI Feature Usage</CardTitle>
              <CardDescription>Usage distribution across AI features</CardDescription>
            </CardHeader>
            <CardContent>
              <BarChart
                data={[
                  { name: "Chat Assistant", value: 1250 },
                  { name: "Data Analysis", value: 850 },
                  { name: "Scraping Suggestions", value: 650 },
                  { name: "Templates", value: 450 },
                  { name: "Memory System", value: 350 },
                ]}
                xAxisKey="name"
                yAxisKey="value"
                height={350}
              />
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Feature Engagement</CardTitle>
                <CardDescription>User engagement with AI features</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Chat Assistant</span>
                    <span className="text-sm font-medium">85%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2.5">
                    <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: "85%" }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Data Analysis</span>
                    <span className="text-sm font-medium">68%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2.5">
                    <div className="bg-purple-600 h-2.5 rounded-full" style={{ width: "68%" }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Scraping Suggestions</span>
                    <span className="text-sm font-medium">52%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2.5">
                    <div className="bg-green-600 h-2.5 rounded-full" style={{ width: "52%" }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Templates</span>
                    <span className="text-sm font-medium">42%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2.5">
                    <div className="bg-amber-600 h-2.5 rounded-full" style={{ width: "42%" }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Memory System</span>
                    <span className="text-sm font-medium">35%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2.5">
                    <div className="bg-red-600 h-2.5 rounded-full" style={{ width: "35%" }}></div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Feature Satisfaction</CardTitle>
                <CardDescription>User satisfaction ratings for AI features</CardDescription>
              </CardHeader>
              <CardContent>
                <BarChart
                  data={[
                    { name: "Chat Assistant", value: 4.8 },
                    { name: "Data Analysis", value: 4.5 },
                    { name: "Scraping Suggestions", value: 4.2 },
                    { name: "Templates", value: 4.6 },
                    { name: "Memory System", value: 4.3 },
                  ]}
                  xAxisKey="name"
                  yAxisKey="value"
                  height={300}
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
