"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/app/providers/auth-provider"
import { GuestStorageManager } from "@/app/components/guest-storage-manager"
import { GuestDataMigration } from "@/app/components/guest-data-migration"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function GuestDataPage() {
  const { isGuest } = useAuth()
  const router = useRouter()

  // Redirect if not in guest mode
  useEffect(() => {
    if (!isGuest) {
      router.push("/settings")
    }
  }, [isGuest, router])

  if (!isGuest) {
    return null
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" asChild className="mr-2">
            <Link href="/settings">
              <ArrowLeft className="h-5 w-5" />
              <span className="sr-only">Back</span>
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">Guest Data Management</h1>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <GuestStorageManager />
        </div>
        <div>
          <GuestDataMigration />
        </div>
      </div>

      <div className="rounded-lg border p-4 bg-amber-50 dark:bg-amber-900/20">
        <h2 className="text-lg font-medium text-amber-800 dark:text-amber-200 mb-2">Important Information</h2>
        <div className="text-sm text-amber-700 dark:text-amber-300 space-y-2">
          <p>Guest data is stored only in your browser's local storage and has the following limitations:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Data is limited to approximately 5MB of storage</li>
            <li>Data will be lost if you clear your browser cache or cookies</li>
            <li>Data is not synchronized across different devices or browsers</li>
            <li>Data is not backed up and cannot be recovered if lost</li>
          </ul>
          <p className="font-medium mt-4">For permanent storage and full functionality, please create an account.</p>
        </div>
      </div>
    </div>
  )
}
