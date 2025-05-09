"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getUserProfile } from "@/lib/actions/auth"
import { updateUserPreferences } from "@/lib/actions/user-preferences"
import { toast } from "@/components/ui/use-toast"

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

        <div className="space-y-2">
          <Label htmlFor="dashboardLayout">Dashboard Layout</Label>
          <Select
            value={preferences.dashboardLayout}
            onValueChange={(value) => setPreferences({ ...preferences, dashboardLayout: value })}
          >
            <SelectTrigger id="dashboardLayout">
              <SelectValue placeholder="Select layout" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="grid">Grid</SelectItem>
              <SelectItem value="list">List</SelectItem>
              <SelectItem value="compact">Compact</SelectItem>
            </SelectContent>
          </Select>
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
