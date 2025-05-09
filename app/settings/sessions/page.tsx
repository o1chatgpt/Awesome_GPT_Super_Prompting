"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getUserSessions, revokeSession, revokeAllOtherSessions, type SessionInfo } from "@/lib/actions/sessions"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { Shield, Laptop, Smartphone, Globe, Clock, AlertTriangle } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function SessionsPage() {
  const [sessions, setSessions] = useState<SessionInfo[]>([])
  const [loading, setLoading] = useState(true)
  const [revoking, setRevoking] = useState<string | null>(null)
  const [revokingAll, setRevokingAll] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    fetchSessions()
  }, [])

  const fetchSessions = async () => {
    setLoading(true)
    try {
      const result = await getUserSessions()
      if (result.error) {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        })
      } else if (result.sessions) {
        setSessions(result.sessions)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch sessions",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleRevokeSession = async (sessionId: string) => {
    setRevoking(sessionId)
    try {
      const result = await revokeSession(sessionId)
      if (result.error) {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        })
      } else {
        toast({
          title: "Success",
          description: "Session revoked successfully",
        })

        if (result.signedOut) {
          // If current session was revoked, redirect to login
          router.push("/auth/sign-in")
        } else {
          // Otherwise, refresh the sessions list
          fetchSessions()
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to revoke session",
        variant: "destructive",
      })
    } finally {
      setRevoking(null)
    }
  }

  const handleRevokeAllOtherSessions = async () => {
    setRevokingAll(true)
    try {
      const result = await revokeAllOtherSessions()
      if (result.error) {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        })
      } else {
        toast({
          title: "Success",
          description: "All other sessions revoked successfully",
        })
        fetchSessions()
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to revoke sessions",
        variant: "destructive",
      })
    } finally {
      setRevokingAll(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString()
  }

  const getTimeSince = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (seconds < 60) return `${seconds} seconds ago`

    const minutes = Math.floor(seconds / 60)
    if (minutes < 60) return `${minutes} minute${minutes !== 1 ? "s" : ""} ago`

    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours} hour${hours !== 1 ? "s" : ""} ago`

    const days = Math.floor(hours / 24)
    if (days < 30) return `${days} day${days !== 1 ? "s" : ""} ago`

    const months = Math.floor(days / 30)
    if (months < 12) return `${months} month${months !== 1 ? "s" : ""} ago`

    const years = Math.floor(months / 12)
    return `${years} year${years !== 1 ? "s" : ""} ago`
  }

  const getDeviceIcon = (deviceInfo: string, os: string) => {
    if (
      deviceInfo.includes("Mobile") ||
      deviceInfo.includes("iPhone") ||
      deviceInfo.includes("Android") ||
      deviceInfo.includes("Samsung") ||
      deviceInfo.includes("Xiaomi")
    ) {
      return <Smartphone className="h-8 w-8 text-primary" />
    }

    return <Laptop className="h-8 w-8 text-primary" />
  }

  const isSessionExpired = (expiresAt: string) => {
    return new Date(expiresAt) < new Date()
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Manage Your Sessions</h1>

      <Tabs defaultValue="active">
        <TabsList className="mb-6">
          <TabsTrigger value="active">Active Sessions</TabsTrigger>
          <TabsTrigger value="security">Security Tips</TabsTrigger>
        </TabsList>

        <TabsContent value="active">
          <div className="flex justify-between items-center mb-6">
            <p className="text-muted-foreground">
              These are all the devices where you're currently logged in. You can review them and log out from any
              session that you don't recognize.
            </p>
            <Button
              variant="outline"
              onClick={handleRevokeAllOtherSessions}
              disabled={revokingAll || sessions.filter((s) => !s.is_current).length === 0}
            >
              {revokingAll ? "Revoking..." : "Sign Out All Other Devices"}
            </Button>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Card key={i}>
                  <CardHeader className="pb-2">
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-3 w-1/4" />
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between">
                      <div className="flex space-x-4">
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <div>
                          <Skeleton className="h-4 w-[200px] mb-2" />
                          <Skeleton className="h-3 w-[150px]" />
                        </div>
                      </div>
                      <Skeleton className="h-9 w-[100px]" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {sessions.length === 0 ? (
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center py-6">
                      <p>No active sessions found.</p>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                sessions.map((session) => (
                  <Card key={session.id} className={session.is_current ? "border-primary" : ""}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-lg flex items-center">
                          {session.is_current && (
                            <Badge variant="outline" className="mr-2 bg-primary/10 text-primary border-primary">
                              Current Session
                            </Badge>
                          )}
                          {session.is_remembered && (
                            <Badge variant="outline" className="mr-2">
                              Extended Session
                            </Badge>
                          )}
                          {isSessionExpired(session.expires_at) && (
                            <Badge variant="destructive" className="mr-2">
                              Expired
                            </Badge>
                          )}
                          {session.device_info}
                        </CardTitle>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleRevokeSession(session.id)}
                          disabled={revoking === session.id}
                        >
                          {revoking === session.id ? "Signing Out..." : session.is_current ? "Sign Out" : "Revoke"}
                        </Button>
                      </div>
                      <CardDescription>
                        {session.is_current
                          ? "This is your current session"
                          : `Last active ${getTimeSince(session.last_active)}`}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-start space-x-4">
                        {getDeviceIcon(session.device_info, session.operating_system)}
                        <div className="space-y-1">
                          <p className="text-sm font-medium">
                            {session.browser} on {session.operating_system}
                          </p>
                          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                            <div className="flex items-center">
                              <Globe className="mr-1 h-3 w-3" />
                              <span>{session.ip_address}</span>
                            </div>
                            <div className="flex items-center">
                              <Clock className="mr-1 h-3 w-3" />
                              <span>Created: {formatDate(session.created_at)}</span>
                            </div>
                            <div className="flex items-center">
                              <Clock className="mr-1 h-3 w-3" />
                              <span>Expires: {formatDate(session.expires_at)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          )}
        </TabsContent>

        <TabsContent value="security">
          <div className="space-y-6">
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Security Best Practices</AlertTitle>
              <AlertDescription>
                Always sign out from devices you don't use regularly, especially on public or shared computers.
              </AlertDescription>
            </Alert>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="mr-2 h-5 w-5 text-primary" />
                  Session Security Tips
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-medium mb-1">Use "Remember Me" Wisely</h3>
                  <p className="text-sm text-muted-foreground">
                    Only use the "Remember Me" option on your personal devices. This extends your session duration and
                    could pose a security risk on shared devices.
                  </p>
                </div>

                <div>
                  <h3 className="font-medium mb-1">Review Active Sessions Regularly</h3>
                  <p className="text-sm text-muted-foreground">
                    Check your active sessions periodically to ensure there's no unauthorized access to your account.
                  </p>
                </div>

                <div>
                  <h3 className="font-medium mb-1">Sign Out When Not Using</h3>
                  <p className="text-sm text-muted-foreground">
                    Always sign out from your account when using public computers or devices you don't own.
                  </p>
                </div>

                <div>
                  <h3 className="font-medium mb-1">Suspicious Activity</h3>
                  <p className="text-sm text-muted-foreground">
                    If you notice any sessions you don't recognize, immediately revoke them and consider changing your
                    password.
                  </p>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" onClick={() => router.push("/settings/security")}>
                  More Security Settings
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
