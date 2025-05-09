"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { getUserProfile } from "@/lib/actions/auth"
import { updateUserPreferences } from "@/lib/actions/user-preferences"
import { toast } from "@/components/ui/use-toast"
import { LayoutGrid, List, Rows, Columns, Maximize, PanelTop, LayoutDashboard } from "lucide-react"

export function UserPreferences() {
  const [user, setUser] = useState<any>(null)
  const [preferences, setPreferences] = useState({
    theme: "system",
    emailNotifications: true,
    dashboardLayout: "grid",
    language: "en",
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const profile = await getUserProfile()
        setUser(profile)

        // If user has preferences, load them
        if (profile?.preferences) {
          setPreferences({
            ...preferences,
            ...profile.preferences,
          })
        }

        setLoading(false)
      } catch (error) {
        console.error("Error fetching user data:", error)
        setLoading(false)
      }
    }

    fetchUserData()
  }, [])

  const handleSavePreferences = async () => {
    if (!user) return

    setSaving(true)
    try {
      await updateUserPreferences(user.id, preferences)
      toast({
        title: "Preferences saved",
        description: "Your preferences have been updated successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save preferences. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>User Preferences</CardTitle>
          <CardDescription>Loading your preferences...</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Preferences</CardTitle>
        <CardDescription>Customize your experience with the Web Scraper Interface</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="theme">Theme</Label>
          <Select value={preferences.theme} onValueChange={(value) => setPreferences({ ...preferences, theme: value })}>
            <SelectTrigger id="theme">
              <SelectValue placeholder="Select theme" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">Light</SelectItem>
              <SelectItem value="dark">Dark</SelectItem>
              <SelectItem value="system">System</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="language">Language</Label>
          <Select
            value={preferences.language}
            onValueChange={(value) => setPreferences({ ...preferences, language: value })}
          >
            <SelectTrigger id="language">
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="es">Spanish</SelectItem>
              <SelectItem value="fr">French</SelectItem>
              <SelectItem value="de">German</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-4">
          <Label>Dashboard Layout</Label>
          <RadioGroup
            value={preferences.dashboardLayout}
            onValueChange={(value) => setPreferences({ ...preferences, dashboardLayout: value })}
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            <Label
              htmlFor="layout-grid"
              className={`flex flex-col items-center gap-2 rounded-md border-2 p-4 hover:bg-accent hover:text-accent-foreground ${
                preferences.dashboardLayout === "grid" ? "border-primary" : "border-muted"
              }`}
            >
              <RadioGroupItem value="grid" id="layout-grid" className="sr-only" />
              <LayoutGrid className="h-6 w-6" />
              <span>Grid</span>
              <span className="text-xs text-muted-foreground">3-column cards</span>
            </Label>
            <Label
              htmlFor="layout-list"
              className={`flex flex-col items-center gap-2 rounded-md border-2 p-4 hover:bg-accent hover:text-accent-foreground ${
                preferences.dashboardLayout === "list" ? "border-primary" : "border-muted"
              }`}
            >
              <RadioGroupItem value="list" id="layout-list" className="sr-only" />
              <List className="h-6 w-6" />
              <span>List</span>
              <span className="text-xs text-muted-foreground">Stacked cards</span>
            </Label>
            <Label
              htmlFor="layout-compact"
              className={`flex flex-col items-center gap-2 rounded-md border-2 p-4 hover:bg-accent hover:text-accent-foreground ${
                preferences.dashboardLayout === "compact" ? "border-primary" : "border-muted"
              }`}
            >
              <RadioGroupItem value="compact" id="layout-compact" className="sr-only" />
              <Rows className="h-6 w-6" />
              <span>Compact</span>
              <span className="text-xs text-muted-foreground">Space-efficient</span>
            </Label>
            <Label
              htmlFor="layout-masonry"
              className={`flex flex-col items-center gap-2 rounded-md border-2 p-4 hover:bg-accent hover:text-accent-foreground ${
                preferences.dashboardLayout === "masonry" ? "border-primary" : "border-muted"
              }`}
            >
              <RadioGroupItem value="masonry" id="layout-masonry" className="sr-only" />
              <Columns className="h-6 w-6" />
              <span>Masonry</span>
              <span className="text-xs text-muted-foreground">Variable heights</span>
            </Label>
            <Label
              htmlFor="layout-minimal"
              className={`flex flex-col items-center gap-2 rounded-md border-2 p-4 hover:bg-accent hover:text-accent-foreground ${
                preferences.dashboardLayout === "minimal" ? "border-primary" : "border-muted"
              }`}
            >
              <RadioGroupItem value="minimal" id="layout-minimal" className="sr-only" />
              <PanelTop className="h-6 w-6" />
              <span>Minimal</span>
              <span className="text-xs text-muted-foreground">Streamlined view</span>
            </Label>
            <Label
              htmlFor="layout-detailed"
              className={`flex flex-col items-center gap-2 rounded-md border-2 p-4 hover:bg-accent hover:text-accent-foreground ${
                preferences.dashboardLayout === "detailed" ? "border-primary" : "border-muted"
              }`}
            >
              <RadioGroupItem value="detailed" id="layout-detailed" className="sr-only" />
              <LayoutDashboard className="h-6 w-6" />
              <span>Detailed</span>
              <span className="text-xs text-muted-foreground">Comprehensive</span>
            </Label>
            <Label
              htmlFor="layout-focus"
              className={`flex flex-col items-center gap-2 rounded-md border-2 p-4 hover:bg-accent hover:text-accent-foreground ${
                preferences.dashboardLayout === "focus" ? "border-primary" : "border-muted"
              }`}
            >
              <RadioGroupItem value="focus" id="layout-focus" className="sr-only" />
              <Maximize className="h-6 w-6" />
              <span>Focus</span>
              <span className="text-xs text-muted-foreground">Key metrics</span>
            </Label>
          </RadioGroup>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="emailNotifications"
            checked={preferences.emailNotifications}
            onCheckedChange={(checked) => setPreferences({ ...preferences, emailNotifications: checked })}
          />
          <Label htmlFor="emailNotifications">Email Notifications</Label>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleSavePreferences} disabled={saving}>
          {saving ? "Saving..." : "Save Preferences"}
        </Button>
      </CardFooter>
    </Card>
  )
}
