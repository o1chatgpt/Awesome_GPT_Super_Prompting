import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import CrewAIPanel from "../components/crew-ai-panel"
import EnhancedMemorySystem from "../components/enhanced-memory-system"
import AnalyticsDashboard from "../components/analytics-dashboard"

export default function Dashboard() {
  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold">User Dashboard</h1>

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
    </div>
  )
}
