"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import CrewAIPanel from "./crew-ai-panel"
import EnhancedMemorySystem from "./enhanced-memory-system"
import AnalyticsDashboard from "./analytics-dashboard"
import { getUserProfile } from "@/lib/actions/auth"
import { getUserPreferences } from "@/lib/actions/user-preferences"
import { Skeleton } from "@/components/ui/skeleton"
import { LayoutSwitcher } from "./layout-switcher"
import { Button } from "@/components/ui/button"

export function DashboardContent() {
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [preferences, setPreferences] = useState({
    dashboardLayout: "grid", // Default to grid layout
  })

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const profile = await getUserProfile()
        setUser(profile)

        if (profile?.id) {
          const userPrefs = await getUserPreferences(profile.id)
          if (userPrefs) {
            setPreferences({
              ...preferences,
              ...userPrefs,
            })
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [])

  const handleLayoutChange = (layout: string) => {
    setPreferences({
      ...preferences,
      dashboardLayout: layout,
    })
  }

  if (loading) {
    return <DashboardSkeleton />
  }

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold">User Dashboard</h1>
        {user && (
          <LayoutSwitcher
            userId={user.id}
            currentLayout={preferences.dashboardLayout}
            onLayoutChange={handleLayoutChange}
          />
        )}
      </div>

      <StatsCards layout={preferences.dashboardLayout} />

      <AnalyticsDashboard />

      <Tabs defaultValue="ai-tools">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="ai-tools">AI Tools</TabsTrigger>
          <TabsTrigger value="memory">Memory System</TabsTrigger>
        </TabsList>

        <TabsContent value="ai-tools">
          <div className="mt-6">
            <CrewAIPanel />
          </div>
        </TabsContent>

        <TabsContent value="memory">
          <div className="mt-6">
            <EnhancedMemorySystem />
          </div>
        </TabsContent>
      </Tabs>
    </>
  )
}

function StatsCards({ layout = "grid" }) {
  // Different layouts for the stats cards
  switch (layout) {
    case "list":
      return (
        <div className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div>
                <CardTitle>Scraping Stats</CardTitle>
                <CardDescription>Your scraping activity overview</CardDescription>
              </div>
              <div className="text-2xl font-bold">24</div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span>Active Schedules</span>
                  <span className="font-bold">3</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Data Collected</span>
                  <span className="font-bold">1.2 GB</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Average Rating</span>
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <svg
                        key={i}
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill={i < 4 ? "gold" : "none"}
                        stroke="currentColor"
                        strokeWidth="2"
                        className="mr-1"
                      >
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                      </svg>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Your latest scraping tasks</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border-b pb-2">
                  <p className="font-medium">example.com</p>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>2 hours ago</span>
                    <span>Completed</span>
                  </div>
                </div>
                <div className="border-b pb-2">
                  <p className="font-medium">news.ycombinator.com</p>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Yesterday</span>
                    <span>Completed</span>
                  </div>
                </div>
                <div className="border-b pb-2">
                  <p className="font-medium">github.com/trending</p>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>3 days ago</span>
                    <span>Completed</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div>
                <CardTitle>AI Usage</CardTitle>
                <CardDescription>Your AI feature utilization</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>AI Analyses</span>
                  <span className="font-bold">12</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>CrewAI Sessions</span>
                  <span className="font-bold">5</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Stored Memories</span>
                  <span className="font-bold">18</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Chat Interactions</span>
                  <span className="font-bold">34</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )

    case "compact":
      return (
        <div className="grid grid-cols-2 gap-4">
          <Card className="col-span-2">
            <CardHeader className="p-4">
              <CardTitle className="text-lg">Dashboard Overview</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="grid grid-cols-4 gap-4">
                <div className="bg-primary/10 p-3 rounded-lg text-center">
                  <div className="text-2xl font-bold">24</div>
                  <div className="text-xs text-muted-foreground">Total Scrapes</div>
                </div>
                <div className="bg-primary/10 p-3 rounded-lg text-center">
                  <div className="text-2xl font-bold">3</div>
                  <div className="text-xs text-muted-foreground">Active Schedules</div>
                </div>
                <div className="bg-primary/10 p-3 rounded-lg text-center">
                  <div className="text-2xl font-bold">1.2GB</div>
                  <div className="text-xs text-muted-foreground">Data Collected</div>
                </div>
                <div className="bg-primary/10 p-3 rounded-lg text-center">
                  <div className="text-2xl font-bold">12</div>
                  <div className="text-xs text-muted-foreground">AI Analyses</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="p-3">
              <CardTitle className="text-sm">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="p-3 pt-0 text-sm">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>example.com</span>
                  <span className="text-xs text-muted-foreground">2h ago</span>
                </div>
                <div className="flex justify-between">
                  <span>news.ycombinator.com</span>
                  <span className="text-xs text-muted-foreground">1d ago</span>
                </div>
                <div className="flex justify-between">
                  <span>github.com/trending</span>
                  <span className="text-xs text-muted-foreground">3d ago</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="p-3">
              <CardTitle className="text-sm">AI Usage</CardTitle>
            </CardHeader>
            <CardContent className="p-3 pt-0 text-sm">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>CrewAI Sessions</span>
                  <span className="font-bold">5</span>
                </div>
                <div className="flex justify-between">
                  <span>Stored Memories</span>
                  <span className="font-bold">18</span>
                </div>
                <div className="flex justify-between">
                  <span>Chat Interactions</span>
                  <span className="font-bold">34</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )

    case "masonry":
      return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="md:col-span-2 md:row-span-2">
            <CardHeader>
              <CardTitle>Scraping Stats</CardTitle>
              <CardDescription>Your scraping activity overview</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Total Scrapes</span>
                  <span className="font-bold">24</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Active Schedules</span>
                  <span className="font-bold">3</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Data Collected</span>
                  <span className="font-bold">1.2 GB</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Average Rating</span>
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <svg
                        key={i}
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill={i < 4 ? "gold" : "none"}
                        stroke="currentColor"
                        strokeWidth="2"
                        className="mr-1"
                      >
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                      </svg>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your latest scraping tasks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border-b pb-2">
                  <p className="font-medium">example.com</p>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>2 hours ago</span>
                    <span>Completed</span>
                  </div>
                </div>
                <div className="border-b pb-2">
                  <p className="font-medium">news.ycombinator.com</p>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Yesterday</span>
                    <span>Completed</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-1 md:row-span-2">
            <CardHeader>
              <CardTitle>AI Usage</CardTitle>
              <CardDescription>Your AI feature utilization</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>AI Analyses</span>
                  <span className="font-bold">12</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>CrewAI Sessions</span>
                  <span className="font-bold">5</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Stored Memories</span>
                  <span className="font-bold">18</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Chat Interactions</span>
                  <span className="font-bold">34</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-1">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-2">
                <Button size="sm" variant="outline" className="justify-start">
                  New Scrape Task
                </Button>
                <Button size="sm" variant="outline" className="justify-start">
                  View Reports
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )

    case "minimal":
      return (
        <div className="space-y-6">
          <div className="flex flex-wrap gap-4">
            <div className="bg-primary/5 rounded-lg p-4 flex-1 min-w-[120px]">
              <div className="text-3xl font-bold">24</div>
              <div className="text-sm text-muted-foreground">Total Scrapes</div>
            </div>
            <div className="bg-primary/5 rounded-lg p-4 flex-1 min-w-[120px]">
              <div className="text-3xl font-bold">3</div>
              <div className="text-sm text-muted-foreground">Active Schedules</div>
            </div>
            <div className="bg-primary/5 rounded-lg p-4 flex-1 min-w-[120px]">
              <div className="text-3xl font-bold">1.2GB</div>
              <div className="text-sm text-muted-foreground">Data Collected</div>
            </div>
            <div className="bg-primary/5 rounded-lg p-4 flex-1 min-w-[120px]">
              <div className="text-3xl font-bold">12</div>
              <div className="text-sm text-muted-foreground">AI Analyses</div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1">
              <h3 className="text-lg font-medium mb-2">Recent Activity</h3>
              <div className="space-y-2">
                <div className="flex justify-between border-b pb-2">
                  <span>example.com</span>
                  <span className="text-sm text-muted-foreground">2h ago</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span>news.ycombinator.com</span>
                  <span className="text-sm text-muted-foreground">1d ago</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span>github.com/trending</span>
                  <span className="text-sm text-muted-foreground">3d ago</span>
                </div>
              </div>
            </div>

            <div className="flex-1">
              <h3 className="text-lg font-medium mb-2">AI Usage</h3>
              <div className="space-y-2">
                <div className="flex justify-between border-b pb-2">
                  <span>AI Analyses</span>
                  <span>12</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span>CrewAI Sessions</span>
                  <span>5</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span>Stored Memories</span>
                  <span>18</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )

    case "detailed":
      return (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Scraping Statistics</CardTitle>
              <CardDescription>Comprehensive overview of your scraping activities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-primary/5 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold">24</div>
                  <div className="text-sm text-muted-foreground">Total Scrapes</div>
                </div>
                <div className="bg-primary/5 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold">3</div>
                  <div className="text-sm text-muted-foreground">Active Schedules</div>
                </div>
                <div className="bg-primary/5 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold">1.2GB</div>
                  <div className="text-sm text-muted-foreground">Data Collected</div>
                </div>
                <div className="bg-primary/5 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold">4.2</div>
                  <div className="text-sm text-muted-foreground">Avg. Rating</div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Detailed Metrics</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium mb-2">Scraping Frequency</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Daily</span>
                        <span>2 tasks</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Weekly</span>
                        <span>5 tasks</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Monthly</span>
                        <span>12 tasks</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium mb-2">Data Types</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Text</span>
                        <span>65%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Images</span>
                        <span>20%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Structured Data</span>
                        <span>15%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Your latest scraping tasks with details</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border-b pb-3">
                    <div className="flex justify-between mb-1">
                      <p className="font-medium">example.com</p>
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">Completed</span>
                    </div>
                    <div className="text-sm text-muted-foreground mb-1">2 hours ago</div>
                    <div className="text-sm">Extracted 142 product listings with prices and descriptions</div>
                  </div>
                  <div className="border-b pb-3">
                    <div className="flex justify-between mb-1">
                      <p className="font-medium">news.ycombinator.com</p>
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">Completed</span>
                    </div>
                    <div className="text-sm text-muted-foreground mb-1">Yesterday</div>
                    <div className="text-sm">Collected 30 top stories with comments and vote counts</div>
                  </div>
                  <div className="border-b pb-3">
                    <div className="flex justify-between mb-1">
                      <p className="font-medium">github.com/trending</p>
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">Completed</span>
                    </div>
                    <div className="text-sm text-muted-foreground mb-1">3 days ago</div>
                    <div className="text-sm">Gathered trending repositories with star counts and descriptions</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>AI Usage</CardTitle>
                <CardDescription>Detailed breakdown of your AI feature utilization</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium mb-2">AI Analyses</h4>
                    <div className="flex justify-between items-center mb-2">
                      <span>Text Analysis</span>
                      <span>8 tasks</span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <span>Data Classification</span>
                      <span>3 tasks</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Sentiment Analysis</span>
                      <span>1 task</span>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium mb-2">CrewAI Sessions</h4>
                    <div className="flex justify-between items-center mb-2">
                      <span>Data Extraction</span>
                      <span>3 sessions</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Content Generation</span>
                      <span>2 sessions</span>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium mb-2">Memory System</h4>
                    <div className="flex justify-between items-center mb-2">
                      <span>Stored Memories</span>
                      <span>18 items</span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <span>Accessed Today</span>
                      <span>5 times</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Memory Size</span>
                      <span>245 KB</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )

    case "focus":
      return (
        <div className="space-y-6">
          <Card className="border-2 border-primary">
            <CardHeader className="pb-2">
              <CardTitle>Key Performance Metrics</CardTitle>
              <CardDescription>Your most important scraping metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4">
                  <div className="text-4xl font-bold text-primary mb-2">24</div>
                  <div className="text-sm font-medium">Total Scrapes</div>
                  <div className="text-xs text-muted-foreground">↑ 12% from last week</div>
                </div>
                <div className="text-center p-4">
                  <div className="text-4xl font-bold text-primary mb-2">1.2GB</div>
                  <div className="text-sm font-medium">Data Collected</div>
                  <div className="text-xs text-muted-foreground">↑ 0.3GB from last week</div>
                </div>
                <div className="text-center p-4">
                  <div className="text-4xl font-bold text-primary mb-2">4.2</div>
                  <div className="text-sm font-medium">Average Rating</div>
                  <div className="text-xs text-muted-foreground">↑ 0.2 from last week</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Latest Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between items-center p-2 rounded-lg bg-primary/5">
                    <div>
                      <div className="font-medium">example.com</div>
                      <div className="text-xs text-muted-foreground">2 hours ago</div>
                    </div>
                    <div className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">Completed</div>
                  </div>
                  <div className="flex justify-between items-center p-2 rounded-lg">
                    <div>
                      <div className="font-medium">news.ycombinator.com</div>
                      <div className="text-xs text-muted-foreground">Yesterday</div>
                    </div>
                    <div className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">Completed</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle>AI Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="p-2 rounded-lg bg-primary/5">
                    <div className="font-medium">Content Trend Analysis</div>
                    <div className="text-sm">Tech topics increased by 15% this week</div>
                  </div>
                  <div className="p-2 rounded-lg">
                    <div className="font-medium">Data Quality Report</div>
                    <div className="text-sm">98.5% accuracy in last 10 scrapes</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )

    // Default grid layout
    default:
      return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Scraping Stats</CardTitle>
              <CardDescription>Your scraping activity overview</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Total Scrapes</span>
                  <span className="font-bold">24</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Active Schedules</span>
                  <span className="font-bold">3</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Data Collected</span>
                  <span className="font-bold">1.2 GB</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Average Rating</span>
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <svg
                        key={i}
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill={i < 4 ? "gold" : "none"}
                        stroke="currentColor"
                        strokeWidth="2"
                        className="mr-1"
                      >
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                      </svg>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your latest scraping tasks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border-b pb-2">
                  <p className="font-medium">example.com</p>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>2 hours ago</span>
                    <span>Completed</span>
                  </div>
                </div>
                <div className="border-b pb-2">
                  <p className="font-medium">news.ycombinator.com</p>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Yesterday</span>
                    <span>Completed</span>
                  </div>
                </div>
                <div className="border-b pb-2">
                  <p className="font-medium">github.com/trending</p>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>3 days ago</span>
                    <span>Completed</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>AI Usage</CardTitle>
              <CardDescription>Your AI feature utilization</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>AI Analyses</span>
                  <span className="font-bold">12</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>CrewAI Sessions</span>
                  <span className="font-bold">5</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Stored Memories</span>
                  <span className="font-bold">18</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Chat Interactions</span>
                  <span className="font-bold">34</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )
  }
}

function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-[140px]" />
            <Skeleton className="h-4 w-[180px]" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex justify-between items-center">
                  <Skeleton className="h-4 w-[100px]" />
                  <Skeleton className="h-4 w-[50px]" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-[140px]" />
            <Skeleton className="h-4 w-[180px]" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="border-b pb-2">
                  <Skeleton className="h-5 w-[150px] mb-2" />
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-[80px]" />
                    <Skeleton className="h-4 w-[80px]" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-[140px]" />
            <Skeleton className="h-4 w-[180px]" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex justify-between items-center">
                  <Skeleton className="h-4 w-[120px]" />
                  <Skeleton className="h-4 w-[30px]" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div>
        <Skeleton className="h-[300px] w-full rounded-lg" />
      </div>

      <div>
        <Skeleton className="h-10 w-full rounded-lg mb-6" />
        <Skeleton className="h-[200px] w-full rounded-lg" />
      </div>
    </div>
  )
}
