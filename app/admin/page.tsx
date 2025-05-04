import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold">Admin Dashboard</h1>
      <p className="text-muted-foreground">
        Welcome to the administrator dashboard. Here you can manage users, view system-wide analytics, and access
        advanced settings.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>User Stats</CardTitle>
            <CardDescription>Overview of user activity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Total Users</span>
                <span className="font-bold">42</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Active Today</span>
                <span className="font-bold">12</span>
              </div>
              <div className="flex justify-between items-center">
                <span>New This Week</span>
                <span className="font-bold">8</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Status</CardTitle>
            <CardDescription>Current system performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Server Load</span>
                <span className="font-bold text-green-500">Normal</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Database Status</span>
                <span className="font-bold text-green-500">Healthy</span>
              </div>
              <div className="flex justify-between items-center">
                <span>API Rate Limit</span>
                <span className="font-bold">24%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Scraping Stats</CardTitle>
            <CardDescription>Platform-wide scraping activity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Total Scrapes</span>
                <span className="font-bold">1,248</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Active Schedules</span>
                <span className="font-bold">37</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Data Collected</span>
                <span className="font-bold">24.6 GB</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="users">
        <TabsList>
          <TabsTrigger value="users">User Management</TabsTrigger>
          <TabsTrigger value="tasks">Task Management</TabsTrigger>
          <TabsTrigger value="system">System Settings</TabsTrigger>
        </TabsList>
        <TabsContent value="users" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent User Activity</CardTitle>
              <CardDescription>Latest actions from users across the platform</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border-b pb-2">
                  <p className="font-medium">User Registration</p>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Sam Taylor (sam@example.com)</span>
                    <span>2 hours ago</span>
                  </div>
                </div>
                <div className="border-b pb-2">
                  <p className="font-medium">Password Reset</p>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Jordan Lee (jordan@example.com)</span>
                    <span>Yesterday</span>
                  </div>
                </div>
                <div className="border-b pb-2">
                  <p className="font-medium">Role Change</p>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Alex Johnson (alex@example.com)</span>
                    <span>3 days ago</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="tasks" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Task Overview</CardTitle>
              <CardDescription>Manage and monitor all scraping tasks</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                This section allows administrators to view and manage all scraping tasks across the platform.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="system" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>System Configuration</CardTitle>
              <CardDescription>Manage global system settings</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                This section allows administrators to configure global system settings, including rate limits, proxy
                configurations, and security settings.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
