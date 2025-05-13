"use client"

import { useAuth } from "@/app/providers/auth-provider"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import Link from "next/link"

export function GuestModeBanner() {
  const { isGuest, disableGuestMode } = useAuth()

  if (!isGuest) return null

  return (
    <div className="bg-yellow-100 dark:bg-yellow-900/30 border-b border-yellow-200 dark:border-yellow-800 py-2 px-4">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-yellow-800 dark:text-yellow-200">
            You're browsing as a guest. Some features may be limited.
          </span>
          <Link href="/auth/sign-in" className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-400">
            Sign in
          </Link>
          <span className="text-sm text-yellow-800 dark:text-yellow-200">to access all features.</span>
        </div>
        <Button variant="ghost" size="sm" onClick={disableGuestMode} className="h-8 w-8 p-0" aria-label="Close banner">
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
