import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getUsers } from "@/lib/actions/user-management"
import { BarChart, LineChart } from "@/components/ui/charts"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Users, Database, Bot, Activity, Settings, Search, BrainCircuit } from "lucide-react"

export default async function AdminDashboard() {
  // Get user statistics
  const usersData = await getUsers({ page: 1, limit: 1 })
  const totalUsers = usersData.totalCount || 0

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Comprehensive overview of your web scraper platform with AI intelligence
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild>
            <Link href="/admin/ai-settings">
              <BrainCircuit className="mr-2 h-4 w-4" />
              AI Settings
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/admin/system">
              <Settings className="mr-2 h-4 w-4" />
              System Settings
            </Link>
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold">{totalUsers}</div>
              <Users className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">+12% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Scraping Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold">247</div>
              <Search className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">+5% from last week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">AI Interactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold">1,842</div>
              <Bot className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">+28% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">System Health</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold text-green-500">98%</div>
              <Activity className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">Optimal performance</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="ai">AI Intelligence</TabsTrigger>
          <TabsTrigger value="scraping">Scraping Activity</TabsTrigger>
          <TabsTrigger value="system">System Resources</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Platform Activity</CardTitle>
                <CardDescription>User activity over the past 30 days</CardDescription>
              </CardHeader>
              <CardContent>
                <LineChart
                  data={[
                    { name: "Week 1", value: 420 },
                    { name: "Week 2", value: 380 },
                    { name: "Week 3", value: 650 },
                    { name: "Week 4", value: 540 },
                  ]}
                  xAxisKey="name"
                  yAxisKey="value"
                  height={300}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest platform events</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border-l-4 border-blue-500 pl-4 py-1">
                    <p className="font-medium">New User Registration</p>
                    <p className="text-sm text-muted-foreground">John Smith joined the platform</p>
                    <p className="text-xs text-muted-foreground">10 minutes ago</p>
                  </div>

                  <div className="border-l-4 border-green-500 pl-4 py-1">
                    <p className="font-medium">Scraping Task Completed</p>
                    <p className="text-sm text-muted-foreground">E-commerce data extraction finished</p>
                    <p className="text-xs text-muted-foreground">25 minutes ago</p>
                  </div>

                  <div className="border-l-4 border-amber-500 pl-4 py-1">
                    <p className="font-medium">AI Model Updated</p>
                    <p className="text-sm text-muted-foreground">Switched to GPT-4o for all users</p>
                    <p className="text-xs text-muted-foreground">1 hour ago</p>
                  </div>

                  <div className="border-l-4 border-purple-500 pl-4 py-1">
                    <p className="font-medium">Vector Database Optimized</p>
                    <p className="text-sm text-muted-foreground">Improved embedding search performance</p>
                    <p className="text-xs text-muted-foreground">3 hours ago</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>User Distribution</CardTitle>
                <CardDescription>Users by role and status</CardDescription>
              </CardHeader>
              <CardContent>
                <BarChart
                  data={[
                    { name: "Admin", value: 3 },
                    { name: "User", value: 42 },
                    { name: "Viewer", value: 18 },
                  ]}
                  xAxisKey="name"
                  yAxisKey="value"
                  height={250}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Resource Allocation</CardTitle>
                <CardDescription>System resource distribution</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Database Storage</span>
                      <span className="text-sm font-medium">65%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2.5">
                      <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: "65%" }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Vector Storage</span>
                      <span className="text-sm font-medium">42%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2.5">
                      <div className="bg-purple-600 h-2.5 rounded-full" style={{ width: "42%" }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">API Rate Limits</span>
                      <span className="text-sm font-medium">28%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2.5">
                      <div className="bg-green-600 h-2.5 rounded-full" style={{ width: "28%" }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">CPU Usage</span>
                      <span className="text-sm font-medium">53%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2.5">
                      <div className="bg-amber-600 h-2.5 rounded-full" style={{ width: "53%" }}></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="ai" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>AI Models</CardTitle>
                <CardDescription>Currently active models</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <BrainCircuit className="h-5 w-5 mr-2 text-blue-500" />
                      <span>GPT-4o</span>
                    </div>
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Active</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <BrainCircuit className="h-5 w-5 mr-2 text-purple-500" />
                      <span>Embedding Model</span>
                    </div>
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Active</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <BrainCircuit className="h-5 w-5 mr-2 text-gray-500" />
                      <span>GPT-3.5 Turbo</span>
                    </div>
                    <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-full">Backup</span>
                  </div>

                  <Separator />

                  <div className="pt-2">
                    <Button size="sm" className="w-full">
                      <Settings className="h-4 w-4 mr-2" />
                      Manage AI Models
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Token Usage</CardTitle>
                <CardDescription>AI token consumption</CardDescription>
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
                  height={250}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Vector Database</CardTitle>
                <CardDescription>Embedding storage metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Total Embeddings</span>
                    <span className="font-bold">24,568</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span>Average Dimension</span>
                    <span className="font-bold">1,536</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span>Storage Used</span>
                    <span className="font-bold">1.2 GB</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span>Query Performance</span>
                    <span className="font-bold text-green-500">42ms avg</span>
                  </div>

                  <Separator />

                  <div className="pt-2">
                    <Button size="sm" variant="outline" className="w-full">
                      <Database className="h-4 w-4 mr-2" />
                      Vector Database Console
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>AI Interaction History</CardTitle>
              <CardDescription>Recent AI interactions across the platform</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-5 text-sm font-medium text-muted-foreground">
                  <div>User</div>
                  <div>Type</div>
                  <div>Model</div>
                  <div>Tokens</div>
                  <div>Time</div>
                </div>

                <div className="grid grid-cols-5 text-sm border-b pb-2">
                  <div>john@example.com</div>
                  <div>Chat Completion</div>
                  <div>GPT-4o</div>
                  <div>1,245</div>
                  <div>2 minutes ago</div>
                </div>

                <div className="grid grid-cols-5 text-sm border-b pb-2">
                  <div>sarah@example.com</div>
                  <div>Embedding</div>
                  <div>text-embedding-3-small</div>
                  <div>320</div>
                  <div>15 minutes ago</div>
                </div>

                <div className="grid grid-cols-5 text-sm border-b pb-2">
                  <div>admin@example.com</div>
                  <div>Chat Completion</div>
                  <div>GPT-4o</div>
                  <div>2,845</div>
                  <div>28 minutes ago</div>
                </div>

                <div className="grid grid-cols-5 text-sm border-b pb-2">
                  <div>mike@example.com</div>
                  <div>Embedding</div>
                  <div>text-embedding-3-small</div>
                  <div>512</div>
                  <div>45 minutes ago</div>
                </div>

                <div className="grid grid-cols-5 text-sm border-b pb-2">
                  <div>lisa@example.com</div>
                  <div>Chat Completion</div>
                  <div>GPT-3.5 Turbo</div>
                  <div>980</div>
                  <div>1 hour ago</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scraping" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Active Scraping Tasks</CardTitle>
                <CardDescription>Currently running scraping operations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b pb-2">
                    <div>
                      <p className="font-medium">E-commerce Product Data</p>
                      <p className="text-sm text-muted-foreground">Running for 12 minutes</p>
                    </div>
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">In Progress</span>
                  </div>

                  <div className="flex justify-between items-center border-b pb-2">
                    <div>
                      <p className="font-medium">News Article Extraction</p>
                      <p className="text-sm text-muted-foreground">Running for 5 minutes</p>
                    </div>
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">In Progress</span>
                  </div>

                  <div className="flex justify-between items-center border-b pb-2">
                    <div>
                      <p className="font-medium">Social Media Profiles</p>
                      <p className="text-sm text-muted-foreground">Running for 28 minutes</p>
                    </div>
                    <span className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded-full">Rate Limited</span>
                  </div>

                  <div className="flex justify-between items-center border-b pb-2">
                    <div>
                      <p className="font-medium">Real Estate Listings</p>
                      <p className="text-sm text-muted-foreground">Running for 42 minutes</p>
                    </div>
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">In Progress</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Scraping Performance</CardTitle>
                <CardDescription>System performance metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Success Rate</span>
                      <span className="text-sm font-medium">92%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2.5">
                      <div className="bg-green-600 h-2.5 rounded-full" style={{ width: "92%" }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Proxy Utilization</span>
                      <span className="text-sm font-medium">68%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2.5">
                      <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: "68%" }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Rate Limit Hits</span>
                      <span className="text-sm font-medium">12%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2.5">
                      <div className="bg-amber-600 h-2.5 rounded-full" style={{ width: "12%" }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Error Rate</span>
                      <span className="text-sm font-medium">8%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2.5">
                      <div className="bg-red-600 h-2.5 rounded-full" style={{ width: "8%" }}></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Scraping Results</CardTitle>
              <CardDescription>Recent data extraction results</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-5 text-sm font-medium text-muted-foreground">
                  <div>Task</div>
                  <div>User</div>
                  <div>Status</div>
                  <div>Data Size</div>
                  <div>Completed</div>
                </div>

                <div className="grid grid-cols-5 text-sm border-b pb-2">
                  <div>Product Catalog</div>
                  <div>john@example.com</div>
                  <div className="text-green-600">Completed</div>
                  <div>2.4 MB</div>
                  <div>10 minutes ago</div>
                </div>

                <div className="grid grid-cols-5 text-sm border-b pb-2">
                  <div>Financial Data</div>
                  <div>sarah@example.com</div>
                  <div className="text-green-600">Completed</div>
                  <div>850 KB</div>
                  <div>25 minutes ago</div>
                </div>

                <div className="grid grid-cols-5 text-sm border-b pb-2">
                  <div>Job Listings</div>
                  <div>mike@example.com</div>
                  <div className="text-red-600">Failed</div>
                  <div>0 KB</div>
                  <div>32 minutes ago</div>
                </div>

                <div className="grid grid-cols-5 text-sm border-b pb-2">
                  <div>News Articles</div>
                  <div>lisa@example.com</div>
                  <div className="text-green-600">Completed</div>
                  <div>1.2 MB</div>
                  <div>45 minutes ago</div>
                </div>

                <div className="grid grid-cols-5 text-sm border-b pb-2">
                  <div>Social Media</div>
                  <div>admin@example.com</div>
                  <div className="text-amber-600">Partial</div>
                  <div>420 KB</div>
                  <div>1 hour ago</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>System Health</CardTitle>
                <CardDescription>Current system status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="h-3 w-3 rounded-full bg-green-500 mr-2"></div>
                      <span>API Services</span>
                    </div>
                    <span className="text-green-600">Operational</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="h-3 w-3 rounded-full bg-green-500 mr-2"></div>
                      <span>Database</span>
                    </div>
                    <span className="text-green-600">Operational</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="h-3 w-3 rounded-full bg-green-500 mr-2"></div>
                      <span>Vector Storage</span>
                    </div>
                    <span className="text-green-600">Operational</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="h-3 w-3 rounded-full bg-green-500 mr-2"></div>
                      <span>Proxy Network</span>
                    </div>
                    <span className="text-green-600">Operational</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="h-3 w-3 rounded-full bg-amber-500 mr-2"></div>
                      <span>OpenAI Integration</span>
                    </div>
                    <span className="text-amber-600">Degraded</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Resource Usage</CardTitle>
                <CardDescription>Current system resource utilization</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">CPU</span>
                      <span className="text-sm font-medium">42%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2.5">
                      <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: "42%" }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Memory</span>
                      <span className="text-sm font-medium">68%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2.5">
                      <div className="bg-purple-600 h-2.5 rounded-full" style={{ width: "68%" }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Disk</span>
                      <span className="text-sm font-medium">35%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2.5">
                      <div className="bg-green-600 h-2.5 rounded-full" style={{ width: "35%" }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Network</span>
                      <span className="text-sm font-medium">52%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2.5">
                      <div className="bg-amber-600 h-2.5 rounded-full" style={{ width: "52%" }}></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>System Logs</CardTitle>
                <CardDescription>Recent system events</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-[250px] overflow-y-auto text-xs font-mono">
                  <div className="bg-muted p-2 rounded">
                    <span className="text-green-600">[INFO]</span> System startup completed successfully
                  </div>
                  <div className="bg-muted p-2 rounded">
                    <span className="text-blue-600">[DEBUG]</span> Database connection pool optimized
                  </div>
                  <div className="bg-muted p-2 rounded">
                    <span className="text-amber-600">[WARN]</span> Rate limit reached for OpenAI API
                  </div>
                  <div className="bg-muted p-2 rounded">
                    <span className="text-green-600">[INFO]</span> Vector database index rebuilt
                  </div>
                  <div className="bg-muted p-2 rounded">
                    <span className="text-red-600">[ERROR]</span> Failed to connect to proxy server 192.168.1.5
                  </div>
                  <div className="bg-muted p-2 rounded">
                    <span className="text-green-600">[INFO]</span> Scheduled maintenance completed
                  </div>
                  <div className="bg-muted p-2 rounded">
                    <span className="text-blue-600">[DEBUG]</span> Cache purged successfully
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>System Configuration</CardTitle>
              <CardDescription>Current system settings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-sm font-medium">General Settings</h3>

                  <div className="grid grid-cols-2 text-sm">
                    <div className="text-muted-foreground">Environment</div>
                    <div>Production</div>
                  </div>

                  <div className="grid grid-cols-2 text-sm">
                    <div className="text-muted-foreground">Version</div>
                    <div>2.4.1</div>
                  </div>

                  <div className="grid grid-cols-2 text-sm">
                    <div className="text-muted-foreground">Last Updated</div>
                    <div>2 days ago</div>
                  </div>

                  <div className="grid grid-cols-2 text-sm">
                    <div className="text-muted-foreground">Maintenance Mode</div>
                    <div>Disabled</div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-medium">API Configuration</h3>

                  <div className="grid grid-cols-2 text-sm">
                    <div className="text-muted-foreground">Rate Limiting</div>
                    <div>Enabled (100 req/min)</div>
                  </div>

                  <div className="grid grid-cols-2 text-sm">
                    <div className="text-muted-foreground">Authentication</div>
                    <div>JWT + API Keys</div>
                  </div>

                  <div className="grid grid-cols-2 text-sm">
                    <div className="text-muted-foreground">Timeout</div>
                    <div>30 seconds</div>
                  </div>

                  <div className="grid grid-cols-2 text-sm">
                    <div className="text-muted-foreground">CORS</div>
                    <div>Restricted</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
