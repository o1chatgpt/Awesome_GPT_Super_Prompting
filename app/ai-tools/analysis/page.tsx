"use client"

import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import AIScrapingAnalysis from "@/app/components/ai-scraping-analysis"

export default function AIAnalysisPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center mb-6">
        <Button variant="outline" size="icon" asChild className="mr-4">
          <Link href="/ai-tools">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">AI Data Analysis</h1>
          <p className="text-muted-foreground">Analyze and transform your scraped data with AI</p>
        </div>
      </div>

      <AIScrapingAnalysis />
    </div>
  )
}
