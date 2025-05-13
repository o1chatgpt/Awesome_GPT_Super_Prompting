"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useGuestData } from "@/hooks/use-guest-data"
import { useAuth } from "@/app/providers/auth-provider"
import { useToast } from "@/components/ui/use-toast"
import { ArrowUpFromLine } from "lucide-react"
import { Progress } from "@/components/ui/progress"

export function GuestDataMigration() {
  const { isGuest, data } = useGuestData()
  const { user } = useAuth()
  const { toast } = useToast()
  const [isMigrating, setIsMigrating] = useState(false)
  const [progress, setProgress] = useState(0)
  const [results, setResults] = useState<{
    success: number
    failed: number
    total: number
  }>({ success: 0, failed: 0, total: 0 })

  // Only show if user is authenticated and has guest data
  if (!isGuest || !user || user.isGuest || !data) return null

  const handleMigration = async () => {
    if (isMigrating) return

    try {
      setIsMigrating(true)
      setProgress(0)

      // Calculate total items to migrate
      const tasks = data.scraping_tasks?.length || 0
      const results = data.scraping_results?.length || 0
      const notes = data.notes?.length || 0
      const templates = data.templates?.length || 0
      const totalItems = tasks + results + notes + templates

      setResults({
        success: 0,
        failed: 0,
        total: totalItems,
      })

      if (totalItems === 0) {
        toast({
          title: "No data to migrate",
          description: "There is no guest data to migrate to your account.",
          variant: "default",
        })
        setIsMigrating(false)
        return
      }

      // This would be replaced with actual API calls to migrate data
      // For now, we'll simulate the migration process

      // Migrate tasks
      let successCount = 0
      let failedCount = 0

      if (data.scraping_tasks) {
        for (const task of data.scraping_tasks) {
          try {
            // Simulate API call to create task
            await new Promise((resolve) => setTimeout(resolve, 200))

            // Simulate success
            successCount++
            setProgress(Math.round(((successCount + failedCount) / totalItems) * 100))
            setResults((prev) => ({
              ...prev,
              success: prev.success + 1,
            }))
          } catch (error) {
            failedCount++
            setProgress(Math.round(((successCount + failedCount) / totalItems) * 100))
            setResults((prev) => ({
              ...prev,
              failed: prev.failed + 1,
            }))
          }
        }
      }

      // Migrate results
      if (data.scraping_results) {
        for (const result of data.scraping_results) {
          try {
            // Simulate API call to create result
            await new Promise((resolve) => setTimeout(resolve, 150))

            // Simulate success
            successCount++
            setProgress(Math.round(((successCount + failedCount) / totalItems) * 100))
            setResults((prev) => ({
              ...prev,
              success: prev.success + 1,
            }))
          } catch (error) {
            failedCount++
            setProgress(Math.round(((successCount + failedCount) / totalItems) * 100))
            setResults((prev) => ({
              ...prev,
              failed: prev.failed + 1,
            }))
          }
        }
      }

      // Migrate notes
      if (data.notes) {
        for (const note of data.notes) {
          try {
            // Simulate API call to create note
            await new Promise((resolve) => setTimeout(resolve, 100))

            // Simulate success
            successCount++
            setProgress(Math.round(((successCount + failedCount) / totalItems) * 100))
            setResults((prev) => ({
              ...prev,
              success: prev.success + 1,
            }))
          } catch (error) {
            failedCount++
            setProgress(Math.round(((successCount + failedCount) / totalItems) * 100))
            setResults((prev) => ({
              ...prev,
              failed: prev.failed + 1,
            }))
          }
        }
      }

      // Migrate templates
      if (data.templates) {
        for (const template of data.templates) {
          try {
            // Simulate API call to create template
            await new Promise((resolve) => setTimeout(resolve, 120))

            // Simulate success
            successCount++
            setProgress(Math.round(((successCount + failedCount) / totalItems) * 100))
            setResults((prev) => ({
              ...prev,
              success: prev.success + 1,
            }))
          } catch (error) {
            failedCount++
            setProgress(Math.round(((successCount + failedCount) / totalItems) * 100))
            setResults((prev) => ({
              ...prev,
              failed: prev.failed + 1,
            }))
          }
        }
      }

      // Migration complete
      toast({
        title: "Migration complete",
        description: `Successfully migrated ${successCount} items. ${failedCount} items failed.`,
        variant: failedCount > 0 ? "destructive" : "default",
      })
    } catch (error) {
      console.error("Migration error:", error)
      toast({
        title: "Migration failed",
        description: "There was an error migrating your guest data.",
        variant: "destructive",
      })
    } finally {
      setIsMigrating(false)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <ArrowUpFromLine className="mr-2 h-5 w-5" />
          Migrate Guest Data
        </CardTitle>
        <CardDescription>Transfer your temporary guest data to your account</CardDescription>
      </CardHeader>

      <CardContent>
        {isMigrating ? (
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Migration Progress</span>
                <span className="text-sm text-muted-foreground">{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>

            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="rounded-lg border p-3">
                <div className="text-sm font-medium">Total</div>
                <div className="text-2xl font-bold mt-1">{results.total}</div>
              </div>
              <div className="rounded-lg border p-3 bg-green-50 dark:bg-green-900/20">
                <div className="text-sm font-medium text-green-700 dark:text-green-300">Success</div>
                <div className="text-2xl font-bold mt-1 text-green-700 dark:text-green-300">{results.success}</div>
              </div>
              <div className="rounded-lg border p-3 bg-red-50 dark:bg-red-900/20">
                <div className="text-sm font-medium text-red-700 dark:text-red-300">Failed</div>
                <div className="text-2xl font-bold mt-1 text-red-700 dark:text-red-300">{results.failed}</div>
              </div>
            </div>

            <p className="text-sm text-muted-foreground text-center">
              Please wait while your data is being migrated...
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-lg border p-3">
                <div className="text-sm font-medium">Tasks</div>
                <div className="text-2xl font-bold mt-1">{data.scraping_tasks?.length || 0}</div>
              </div>
              <div className="rounded-lg border p-3">
                <div className="text-sm font-medium">Results</div>
                <div className="text-2xl font-bold mt-1">{data.scraping_results?.length || 0}</div>
              </div>
              <div className="rounded-lg border p-3">
                <div className="text-sm font-medium">Notes</div>
                <div className="text-2xl font-bold mt-1">{data.notes?.length || 0}</div>
              </div>
              <div className="rounded-lg border p-3">
                <div className="text-sm font-medium">Templates</div>
                <div className="text-2xl font-bold mt-1">{data.templates?.length || 0}</div>
              </div>
            </div>

            <div className="text-sm text-muted-foreground">
              <p>Migrate your temporary guest data to your account to keep it permanently.</p>
              <p className="mt-1">This will copy all your tasks, results, notes, and templates to your account.</p>
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter>
        <Button onClick={handleMigration} disabled={isMigrating} className="w-full">
          {isMigrating ? (
            <>Migrating...</>
          ) : (
            <>
              <ArrowUpFromLine className="mr-2 h-4 w-4" />
              Migrate Data to Account
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
