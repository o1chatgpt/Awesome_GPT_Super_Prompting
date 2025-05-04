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
import { toast } from "@/components/ui/use-toast"
import { getUserProfile } from "@/lib/actions/auth"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User, Bell, Key, Globe } from "lucide-react"

export default function SettingsPage() {
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  const [profileForm, setProfileForm] = useState({
    fullName: "",
    email: "",
    avatar: "",
  })

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    taskCompletions: true,
    taskFailures: true,
    weeklyReports: false,
  })

  const [apiSettings, setApiSettings] = useState({
    apiKey: "••••••••••••••••",
    rateLimit: "100",
    timeout: "30",
  })

  const [scrapingSettings, setScrapingSettings] = useState({
    defaultContentType: "text",
    defaultDepth: "single",
    defaultFormat: "raw",
    userAgent: "Mozilla/5.0 (compatible; WebScraperBot/1.0)",
    respectRobotsTxt: true,
    proxyRotation: false,
  })

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const profile = await getUserProfile()
        setUser(profile)

        if (profile) {
          setProfileForm({
            fullName: profile.full_name || "",
            email: profile.email || "",
            avatar: profile.avatar_url || "",
          })
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load user profile",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchUser()
  }, [])

  const handleSaveProfile = () => {
    setIsSaving(true)

    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully",
      })
      setIsSaving(false)
    }, 1000)
  }

  const handleSaveNotifications = () => {
    setIsSaving(true)

    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Notification Settings Updated",
        description: "Your notification preferences have been saved",
      })
      setIsSaving(false)
    }, 1000)
  }

  const handleSaveAPI = () => {
    setIsSaving(true)

    // Simulate API call
    setTimeout(() => {
      toast({
        title: "API Settings Updated",
        description: "Your API settings have been saved",
      })
      setIsSaving(false)
    }, 1000)
  }

  const handleSaveScrapingSettings = () => {
    setIsSaving(true)

    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Scraping Settings Updated",
        description: "Your default scraping settings have been saved",
      })
      setIsSaving(false)
    }, 1000)
  }

  const regenerateApiKey = () => {
    setApiSettings({
      ...apiSettings,
      apiKey: "••••••••••••••••",
    })

    toast({
      title: "API Key Regenerated",
      description: "Your new API key has been generated",
    })
  }

  if (isLoading) {
    return (
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold mb-6">Settings</h1>
        <Card>
          <CardContent className="p-8 text-center">Loading settings...</CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid grid-cols-4 w-full max-w-2xl">
          <TabsTrigger value="profile">
            <User className="h-4 w-4 mr-2" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="h-4 w-4 mr-2" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="api">
            <Key className="h-4 w-4 mr-2" />
            API
          </TabsTrigger>
          <TabsTrigger value="scraping">
            <Globe className="h-4 w-4 mr-2" />
            Scraping
          </TabsTrigger>
        </TabsList>

        {/* Profile Settings */}
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile Settings</CardTitle>
              <CardDescription>Manage your personal information and account settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col items-center space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={profileForm.avatar || "/placeholder.svg"} />
                  <AvatarFallback>{profileForm.fullName.charAt(0) || "U"}</AvatarFallback>
                </Avatar>
                <div className="space-y-2 text-center sm:text-left">
                  <h3 className="font-medium">{profileForm.fullName || "User"}</h3>
                  <p className="text-sm text-muted-foreground">{profileForm.email}</p>
                  <Button size="sm" variant="outline">
                    Change Avatar
                  </Button>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      value={profileForm.fullName}
                      onChange={(e) => setProfileForm({ ...profileForm, fullName: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profileForm.email}
                      onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="avatar">Avatar URL</Label>
                  <Input
                    id="avatar"
                    value={profileForm.avatar}
                    onChange={(e) => setProfileForm({ ...profileForm, avatar: e.target.value })}
                    placeholder="https://example.com/avatar.jpg"
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">Cancel</Button>
              <Button onClick={handleSaveProfile} disabled={isSaving}>
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>Configure how you want to be notified about events</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Email Notifications</h3>
                    <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                  </div>
                  <Switch
                    checked={notificationSettings.emailNotifications}
                    onCheckedChange={(checked) =>
                      setNotificationSettings({ ...notificationSettings, emailNotifications: checked })
                    }
                  />
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="font-medium">Notification Types</h3>

                  <div className="flex items-center justify-between">
                    <div>
                      <p>Task Completions</p>
                      <p className="text-sm text-muted-foreground">Get notified when a task completes</p>
                    </div>
                    <Switch
                      checked={notificationSettings.taskCompletions}
                      onCheckedChange={(checked) =>
                        setNotificationSettings({ ...notificationSettings, taskCompletions: checked })
                      }
                      disabled={!notificationSettings.emailNotifications}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p>Task Failures</p>
                      <p className="text-sm text-muted-foreground">Get notified when a task fails</p>
                    </div>
                    <Switch
                      checked={notificationSettings.taskFailures}
                      onCheckedChange={(checked) =>
                        setNotificationSettings({ ...notificationSettings, taskFailures: checked })
                      }
                      disabled={!notificationSettings.emailNotifications}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p>Weekly Reports</p>
                      <p className="text-sm text-muted-foreground">Receive weekly summary reports</p>
                    </div>
                    <Switch
                      checked={notificationSettings.weeklyReports}
                      onCheckedChange={(checked) =>
                        setNotificationSettings({ ...notificationSettings, weeklyReports: checked })
                      }
                      disabled={!notificationSettings.emailNotifications}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">Cancel</Button>
              <Button onClick={handleSaveNotifications} disabled={isSaving}>
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* API Settings */}
        <TabsContent value="api">
          <Card>
            <CardHeader>
              <CardTitle>API Settings</CardTitle>
              <CardDescription>Manage your API keys and access settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="apiKey">API Key</Label>
                  <div className="flex gap-2">
                    <Input id="apiKey" value={apiSettings.apiKey} readOnly className="flex-1" />
                    <Button variant="outline" onClick={regenerateApiKey}>
                      Regenerate
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">Use this key to authenticate API requests</p>
                </div>

                <Separator />

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="rateLimit">Rate Limit (requests/minute)</Label>
                    <Input
                      id="rateLimit"
                      value={apiSettings.rateLimit}
                      onChange={(e) => setApiSettings({ ...apiSettings, rateLimit: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="timeout">Request Timeout (seconds)</Label>
                    <Input
                      id="timeout"
                      value={apiSettings.timeout}
                      onChange={(e) => setApiSettings({ ...apiSettings, timeout: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">Cancel</Button>
              <Button onClick={handleSaveAPI} disabled={isSaving}>
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Scraping Settings */}
        <TabsContent value="scraping">
          <Card>
            <CardHeader>
              <CardTitle>Scraping Settings</CardTitle>
              <CardDescription>Configure your default scraping preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-medium">Default Scraping Options</h3>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="defaultContentType">Content Type</Label>
                    <Select
                      value={scrapingSettings.defaultContentType}
                      onValueChange={(value) => setScrapingSettings({ ...scrapingSettings, defaultContentType: value })}
                    >
                      <SelectTrigger id="defaultContentType">
                        <SelectValue placeholder="Select content type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="text">Text</SelectItem>
                        <SelectItem value="images">Images</SelectItem>
                        <SelectItem value="links">Links</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="defaultDepth">Scraping Depth</Label>
                    <Select
                      value={scrapingSettings.defaultDepth}
                      onValueChange={(value) => setScrapingSettings({ ...scrapingSettings, defaultDepth: value })}
                    >
                      <SelectTrigger id="defaultDepth">
                        <SelectValue placeholder="Select depth" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="single">Single Page</SelectItem>
                        <SelectItem value="domain">Entire Domain</SelectItem>
                        <SelectItem value="custom">Custom Depth</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="defaultFormat">Output Format</Label>
                    <Select
                      value={scrapingSettings.defaultFormat}
                      onValueChange={(value) => setScrapingSettings({ ...scrapingSettings, defaultFormat: value })}
                    >
                      <SelectTrigger id="defaultFormat">
                        <SelectValue placeholder="Select format" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="raw">Raw HTML</SelectItem>
                        <SelectItem value="json">JSON</SelectItem>
                        <SelectItem value="csv">CSV</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="font-medium">Advanced Settings</h3>

                  <div className="space-y-2">
                    <Label htmlFor="userAgent">User Agent</Label>
                    <Input
                      id="userAgent"
                      value={scrapingSettings.userAgent}
                      onChange={(e) => setScrapingSettings({ ...scrapingSettings, userAgent: e.target.value })}
                    />
                    <p className="text-sm text-muted-foreground">The user agent string to use for scraping requests</p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p>Respect robots.txt</p>
                      <p className="text-sm text-muted-foreground">
                        Follow the rules specified in the site's robots.txt file
                      </p>
                    </div>
                    <Switch
                      checked={scrapingSettings.respectRobotsTxt}
                      onCheckedChange={(checked) =>
                        setScrapingSettings({ ...scrapingSettings, respectRobotsTxt: checked })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p>Proxy Rotation</p>
                      <p className="text-sm text-muted-foreground">Automatically rotate through proxies for scraping</p>
                    </div>
                    <Switch
                      checked={scrapingSettings.proxyRotation}
                      onCheckedChange={(checked) =>
                        setScrapingSettings({ ...scrapingSettings, proxyRotation: checked })
                      }
                    />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">Cancel</Button>
              <Button onClick={handleSaveScrapingSettings} disabled={isSaving}>
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
