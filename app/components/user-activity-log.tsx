"use client"

import { useState, useEffect } from "react"
import { Activity, Clock } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { getUserActivity } from "@/lib/actions/user-management"
import type { UserActivity } from "@/lib/database"

interface UserActivityLogProps {
  userId: string
}

export function UserActivityLog({ userId }: UserActivityLogProps) {
  const [activities, setActivities] = useState<UserActivity[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchActivities = async () => {
      setLoading(true)
      const result = await getUserActivity(userId)

      if (result.error) {
        setError(result.error)
      } else {
        setActivities(result.activities || [])
      }

      setLoading(false)
    }

    fetchActivities()
  }, [userId])

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  // Get activity icon
  const getActivityIcon = (action: string) => {
    switch (action) {
      case "login":
        return <Activity className="h-4 w-4 text-green-500" />
      case "logout":
        return <Activity className="h-4 w-4 text-red-500" />
      case "create":
        return <Activity className="h-4 w-4 text-blue-500" />
      case "update":
        return <Activity className="h-4 w-4 text-yellow-500" />
      case "delete":
        return <Activity className="h-4 w-4 text-red-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Activity</CardTitle>
        <CardDescription>Recent actions performed by this user</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="h-8 w-8 rounded-full" />
                <div className="space-y-1 flex-1">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-8 text-muted-foreground">Error loading activity: {error}</div>
        ) : activities.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">No activity recorded for this user</div>
        ) : (
          <div className="space-y-4">
            {activities.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3">
                <div className="mt-1">{getActivityIcon(activity.action)}</div>
                <div>
                  <p className="text-sm">
                    <span className="font-medium">{activity.action}</span> {activity.resource_type}
                    {activity.resource_id && <span className="text-muted-foreground"> ({activity.resource_id})</span>}
                  </p>
                  <p className="text-xs text-muted-foreground">{formatDate(activity.created_at)}</p>
                  {activity.details && (
                    <p className="text-xs text-muted-foreground mt-1">{JSON.stringify(activity.details)}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
