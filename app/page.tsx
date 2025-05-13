import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4">
      <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">Web Scraper Interface</h1>
      <p className="mt-6 text-lg text-gray-600 dark:text-gray-400 max-w-3xl">
        A powerful web scraping tool with scheduling capabilities, AI-powered analysis, and collaborative features.
        Access your data from anywhere and transform the web into structured information.
      </p>
      <div className="mt-10 flex flex-col sm:flex-row gap-4">
        <Button asChild size="lg">
          <Link href="/dashboard">Go to Dashboard</Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link href="/docs">View Documentation</Link>
        </Button>
      </div>

      <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg border bg-card p-6 text-left shadow-sm">
          <h3 className="text-xl font-semibold">Scheduled Scraping</h3>
          <p className="mt-2 text-muted-foreground">
            Set up recurring scraping tasks to automatically collect data at specified intervals.
          </p>
        </div>
        <div className="rounded-lg border bg-card p-6 text-left shadow-sm">
          <h3 className="text-xl font-semibold">AI Analysis</h3>
          <p className="mt-2 text-muted-foreground">
            Leverage AI to analyze and extract insights from your scraped data.
          </p>
        </div>
        <div className="rounded-lg border bg-card p-6 text-left shadow-sm">
          <h3 className="text-xl font-semibold">Team Collaboration</h3>
          <p className="mt-2 text-muted-foreground">
            Share scraping tasks and results with your team members for collaborative work.
          </p>
        </div>
      </div>
    </div>
  )
}
