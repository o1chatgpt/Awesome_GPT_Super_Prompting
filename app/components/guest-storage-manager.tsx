"use client"

import { useState } from "react"
import { useGuestData } from "@/hooks/use-guest-data"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { exportGuestData, importGuestData, clearGuestData } from "@/lib/guest-storage"
import { Download, Upload, Trash2, RefreshCw, HardDrive } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export function GuestStorageManager() {
  const { isGuest, storageStats, refreshData, tasks, results, notes, templates } = useGuestData()
  const [activeTab, setActiveTab] = useState("overview")
  const { toast } = useToast()

  // Don't render if not in guest mode
  if (!isGuest) return null

  const handleExport = () => {
    try {
      const jsonData = exportGuestData()

      // Create a blob and download link
      const blob = new Blob([jsonData], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `web-scraper-guest-data-${new Date().toISOString().split("T")[0]}.json`
      document.body.appendChild(a)
      a.click()

      // Clean up
      setTimeout(() => {
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
      }, 0)

      toast({
        title: "Data exported successfully",
        description: "Your guest data has been exported to a JSON file.",
        variant: "default",
      })
    } catch (error) {
      console.error("Error exporting data:", error)
      toast({
        title: "Export failed",
        description: "There was an error exporting your data.",
        variant: "destructive",
      })
    }
  }

  const handleImport = () => {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = ".json"

    input.onchange = (e: any) => {
      const file = e.target.files[0]
      if (!file) return

      const reader = new FileReader()
      reader.onload = (event) => {
        try {
          const jsonData = event.target?.result as string
          const success = importGuestData(jsonData)

          if (success) {
            refreshData()
            toast({
              title: "Data imported successfully",
              description: "Your guest data has been imported.",
              variant: "default",
            })
          } else {
            throw new Error("Import failed")
          }
        } catch (error) {
          console.error("Error importing data:", error)
          toast({
            title: "Import failed",
            description: "The file format is invalid or corrupted.",
            variant: "destructive",
          })
        }
      }

      reader.readAsText(file)
    }

    input.click()
  }

  const handleClear = () => {
    if (window.confirm("Are you sure you want to clear all your guest data? This action cannot be undone.")) {
      clearGuestData()
      refreshData()
      toast({
        title: "Data cleared",
        description: "All your guest data has been removed.",
        variant: "default",
      })
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <HardDrive className="mr-2 h-5 w-5" />
          Guest Storage Manager
        </CardTitle>
        <CardDescription>Manage your temporary guest data stored in your browser</CardDescription>
      </CardHeader>

      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="export">Export/Import</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Storage Usage</span>
                  <span className="text-sm text-muted-foreground">
                    {storageStats.usedMB.toFixed(2)} MB / {storageStats.totalMB.toFixed(2)} MB
                  </span>
                </div>
                <Progress value={storageStats.percentUsed} className="h-2" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg border p-3">
                  <div className="text-sm font-medium">Tasks</div>
                  <div className="text-2xl font-bold mt-1">{tasks().length}</div>
                </div>
                <div className="rounded-lg border p-3">
                  <div className="text-sm font-medium">Results</div>
                  <div className="text-2xl font-bold mt-1">{results().length}</div>
                </div>
                <div className="rounded-lg border p-3">
                  <div className="text-sm font-medium">Notes</div>
                  <div className="text-2xl font-bold mt-1">{notes().length}</div>
                </div>
                <div className="rounded-lg border p-3">
                  <div className="text-sm font-medium">Templates</div>
                  <div className="text-2xl font-bold mt-1">{templates().length}</div>
                </div>
              </div>

              <div className="text-sm text-muted-foreground mt-4">
                <p>Guest data is stored only in your browser and will be lost if you clear your browser data.</p>
                <p className="mt-1">To keep your data permanently, please create an account.</p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="export">
            <div className="space-y-4">
              <div className="rounded-lg border p-4">
                <h3 className="font-medium mb-2">Export Data</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Download your guest data as a JSON file that you can import later.
                </p>
                <Button onClick={handleExport} className="w-full">
                  <Download className="mr-2 h-4 w-4" />
                  Export Data
                </Button>
              </div>

              <div className="rounded-lg border p-4">
                <h3 className="font-medium mb-2">Import Data</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Import previously exported guest data from a JSON file.
                </p>
                <Button onClick={handleImport} variant="outline" className="w-full">
                  <Upload className="mr-2 h-4 w-4" />
                  Import Data
                </Button>
              </div>

              <div className="rounded-lg border p-4">
                <h3 className="font-medium mb-2">Clear Data</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Remove all your guest data from browser storage. This cannot be undone.
                </p>
                <Button onClick={handleClear} variant="destructive" className="w-full">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Clear All Data
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>

      <CardFooter className="flex justify-between">
        <Button variant="outline" size="sm" onClick={refreshData}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
        <div className="text-xs text-muted-foreground">Last updated: {new Date().toLocaleString()}</div>
      </CardFooter>
    </Card>
  )
}
