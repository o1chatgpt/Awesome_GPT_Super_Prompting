"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { toast } from "@/components/ui/use-toast"
import { Bot, FileJson, FileText, Table, Download, Loader2 } from "lucide-react"

export default function AIScrapingAnalysis({ scrapedData }: { scrapedData?: string }) {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<string | null>(null)
  const [structuredData, setStructuredData] = useState<any | null>(null)
  const [analysisType, setAnalysisType] = useState("summary")
  const [outputFormat, setOutputFormat] = useState("json")
  const [dataInput, setDataInput] = useState(scrapedData || "")

  const handleAnalyze = async () => {
    if (!dataInput.trim()) {
      toast({
        title: "Error",
        description: "Please provide scraped data to analyze",
        variant: "destructive",
      })
      return
    }

    setIsAnalyzing(true)
    setAnalysisResult(null)
    setStructuredData(null)

    try {
      // Simulate AI analysis
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Mock analysis results based on analysis type
      let result = ""
      let structured = null

      switch (analysisType) {
        case "summary":
          result =
            "This scraped data contains product information from an e-commerce website, including 15 products with prices, descriptions, and ratings. The average price is $45.99 and the highest-rated product is 'Premium Wireless Headphones' with a 4.8/5 rating."
          break
        case "extract":
          result =
            "Extracted 15 products with the following attributes: name, price, description, rating, and availability."
          structured = [
            {
              name: "Premium Wireless Headphones",
              price: "$129.99",
              rating: 4.8,
              availability: "In Stock",
            },
            {
              name: "Bluetooth Speaker",
              price: "$79.99",
              rating: 4.5,
              availability: "In Stock",
            },
            {
              name: "Smart Watch",
              price: "$199.99",
              rating: 4.7,
              availability: "Limited Stock",
            },
          ]
          break
        case "clean":
          result = "Cleaned data by removing duplicate entries, standardizing formats, and fixing inconsistent values."
          structured = {
            originalEntries: 18,
            cleanedEntries: 15,
            duplicatesRemoved: 3,
            standardizedFields: ["price", "date", "category"],
          }
          break
        case "transform":
          result = "Transformed raw HTML data into structured format with normalized categories and attributes."
          structured = {
            format: outputFormat,
            entries: 15,
            fields: ["name", "price", "description", "rating", "availability", "category", "sku"],
          }
          break
      }

      setAnalysisResult(result)
      setStructuredData(structured)
    } catch (error) {
      toast({
        title: "Analysis Failed",
        description: "Failed to analyze the scraped data. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleDownload = () => {
    if (!structuredData) return

    const dataStr = JSON.stringify(structuredData, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement("a")
    link.href = url
    link.download = `ai-analysis-${analysisType}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    toast({
      title: "Download Started",
      description: "Your analysis results are being downloaded",
    })
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Bot className="mr-2 h-5 w-5" />
          AI Scraping Analysis
        </CardTitle>
        <CardDescription>Use AI to analyze, extract, and transform your scraped data</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="data-input">Scraped Data</Label>
          <Textarea
            id="data-input"
            placeholder="Paste your scraped HTML or data here..."
            className="min-h-[150px]"
            value={dataInput}
            onChange={(e) => setDataInput(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="analysis-type">Analysis Type</Label>
            <Select value={analysisType} onValueChange={setAnalysisType}>
              <SelectTrigger id="analysis-type">
                <SelectValue placeholder="Select analysis type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="summary">Summarize Data</SelectItem>
                <SelectItem value="extract">Extract Structured Data</SelectItem>
                <SelectItem value="clean">Clean & Normalize</SelectItem>
                <SelectItem value="transform">Transform Format</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="output-format">Output Format</Label>
            <Select value={outputFormat} onValueChange={setOutputFormat}>
              <SelectTrigger id="output-format">
                <SelectValue placeholder="Select output format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="json">JSON</SelectItem>
                <SelectItem value="csv">CSV</SelectItem>
                <SelectItem value="markdown">Markdown</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button onClick={handleAnalyze} disabled={isAnalyzing || !dataInput.trim()} className="w-full">
          {isAnalyzing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            "Analyze with AI"
          )}
        </Button>

        {analysisResult && (
          <>
            <Separator />

            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium">Analysis Results</h3>
                <p className="text-sm text-muted-foreground mt-1">{analysisResult}</p>
              </div>

              {structuredData && (
                <Tabs defaultValue="preview" className="w-full">
                  <TabsList className="grid grid-cols-3 w-full">
                    <TabsTrigger value="preview">
                      <FileText className="h-4 w-4 mr-2" />
                      Preview
                    </TabsTrigger>
                    <TabsTrigger value="json">
                      <FileJson className="h-4 w-4 mr-2" />
                      JSON
                    </TabsTrigger>
                    <TabsTrigger value="table">
                      <Table className="h-4 w-4 mr-2" />
                      Table
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="preview" className="mt-4">
                    <div className="bg-muted p-4 rounded-md">
                      <pre className="text-sm whitespace-pre-wrap">
                        {typeof structuredData === "object" ? JSON.stringify(structuredData, null, 2) : structuredData}
                      </pre>
                    </div>
                  </TabsContent>

                  <TabsContent value="json" className="mt-4">
                    <div className="bg-muted p-4 rounded-md overflow-auto max-h-[300px]">
                      <pre className="text-sm">
                        <code>{JSON.stringify(structuredData, null, 2)}</code>
                      </pre>
                    </div>
                  </TabsContent>

                  <TabsContent value="table" className="mt-4">
                    {Array.isArray(structuredData) ? (
                      <div className="border rounded-md overflow-auto max-h-[300px]">
                        <table className="w-full">
                          <thead>
                            <tr className="bg-muted">
                              {Object.keys(structuredData[0]).map((key) => (
                                <th key={key} className="px-4 py-2 text-left text-sm font-medium">
                                  {key}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {structuredData.map((item, index) => (
                              <tr key={index} className="border-t">
                                {Object.values(item).map((value: any, i) => (
                                  <td key={i} className="px-4 py-2 text-sm">
                                    {typeof value === "object" ? JSON.stringify(value) : String(value)}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        Table view is only available for array data
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              )}
            </div>
          </>
        )}
      </CardContent>
      {structuredData && (
        <CardFooter>
          <Button variant="outline" className="w-full" onClick={handleDownload}>
            <Download className="mr-2 h-4 w-4" />
            Download Results
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}
