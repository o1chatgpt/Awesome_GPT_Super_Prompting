"use client"

import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { getSupabaseBrowserClient } from "@/lib/supabase-browser"

export function AuthStatusIndicator() {
  const [status, setStatus] = useState<"online" | "offline" | "checking">("checking")
  const [lastChecked, setLastChecked] = useState<Date | null>(null)

  const checkAuthService = async () => {
    try {
      setStatus("checking")
      const supabase = getSupabaseBrowserClient()

      // Simple ping to Supabase auth service
      const { data, error } = await supabase.auth.getSession()

      if (error && error.message.includes("network")) {
        setStatus("offline")
      } else {
        setStatus("online")
      }
    } catch (error) {
      console.error("Auth service check failed:", error)
      setStatus("offline")
    }

    setLastChecked(new Date())
  }

  useEffect(() => {
    // Check immediately on component mount
    checkAuthService()

    // Set up interval to check periodically
    const interval = setInterval(checkAuthService, 60000) // Check every minute

    return () => clearInterval(interval)
  }, [])

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center">
            <Badge
              variant={status === "online" ? "default" : status === "offline" ? "destructive" : "outline"}
              className="cursor-help"
            >
              <span
                className={`mr-1 h-2 w-2 rounded-full ${
                  status === "online" ? "bg-green-500" : status === "offline" ? "bg-red-500" : "bg-yellow-500"
                }`}
              />
              Auth {status === "checking" ? "Checking" : status === "online" ? "Online" : "Offline"}
            </Badge>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>Authentication service status: {status}</p>
          {lastChecked && (
            <p className="text-xs text-muted-foreground">Last checked: {lastChecked.toLocaleTimeString()}</p>
          )}
          <p className="text-xs mt-1">Click to check again</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
