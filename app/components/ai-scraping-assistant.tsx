"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { toast } from "@/components/ui/use-toast"
import { Bot, Loader2, Copy, Check, Code, FileJson } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function AIScrapingAssistant() {
  const [url, setUrl] = useState("")
  const [objective, setObjective] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [suggestion, setSuggestion] = useState<any | null>(null)
  const [copied, setCopied] = useState(false)

  const handleGenerate = async () => {
    if (!url.trim() || !objective.trim()) {
      toast({
        title: "Missing Information",
        description: "Please provide both a URL and your scraping objective",
        variant: "destructive",
      })
      return
    }

    setIsGenerating(true)
    setSuggestion(null)

    try {
      // Simulate AI processing
      await new Promise((resolve) => setTimeout(resolve, 2500))

      // Mock suggestion data
      const mockSuggestion = {
        selectors: {
          title: "h1.product-title",
          price: "span.price-value",
          description: "div.product-description",
          images: "div.product-gallery img",
          rating: "div.rating-stars",
          reviews: "div.review-container .review-item",
        },
        code: `
// Example scraping code for ${url}
const puppeteer = require('puppeteer');

async function scrapeProduct() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('${url}');

  // Extract product information
  const data = await page.evaluate(() => {
    return {
      title: document.querySelector('h1.product-title')?.innerText,
      price: document.querySelector('span.price-value')?.innerText,
      description: document.querySelector('div.product-description')?.innerText,
      images: Array.from(document.querySelectorAll('div.product-gallery img')).map(img => img.src),
      rating: document.querySelector('div.rating-stars')?.getAttribute('data-rating'),
      reviews: Array.from(document.querySelectorAll('div.review-container .review-item')).map(review => ({
        text: review.querySelector('.review-text')?.innerText,
        author: review.querySelector('.review-author')?.innerText,
        date: review.querySelector('.review-date')?.innerText,
        rating: review.querySelector('.review-rating')?.getAttribute('data-rating')
      }))
    };
  });

  await browser.close();
  return data;
}

scrapeProduct()
  .then(data => console.log(JSON.stringify(data, null, 2)))
  .catch(error => console.error('Error scraping product:', error));
`,
        tips: [
          "Use a rotating proxy to avoid IP blocks",
          "Add random delays between requests",
          "Set a realistic user agent",
          "Consider implementing error handling for missing elements",
          "Use headless mode for production, but visible browser for debugging",
        ],
        config: {
          waitForSelector: "h1.product-title",
          timeout: 30000,
          userAgent:
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
          proxy: "Recommended for production use",
        },
      }

      setSuggestion(mockSuggestion)
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "Failed to generate scraping suggestions. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const handleCopyCode = () => {
    if (!suggestion) return

    navigator.clipboard.writeText(suggestion.code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)

    toast({
      title: "Code Copied",
      description: "Scraping code copied to clipboard",
    })
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Bot className="mr-2 h-5 w-5" />
          AI Scraping Assistant
        </CardTitle>
        <CardDescription>Get AI-powered suggestions for scraping any website</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="url">Website URL</Label>
          <Input
            id="url"
            placeholder="https://example.com/products/123"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="objective">What data do you want to extract?</Label>
          <Textarea
            id="objective"
            placeholder="I want to extract product information including title, price, description, images, and reviews..."
            className="min-h-[100px]"
            value={objective}
            onChange={(e) => setObjective(e.target.value)}
          />
        </div>

        <Button onClick={handleGenerate} disabled={isGenerating || !url.trim() || !objective.trim()} className="w-full">
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating Suggestions...
            </>
          ) : (
            "Generate Scraping Suggestions"
          )}
        </Button>

        {suggestion && (
          <>
            <Separator />

            <Tabs defaultValue="selectors" className="w-full">
              <TabsList className="grid grid-cols-3 w-full">
                <TabsTrigger value="selectors">
                  <Code className="h-4 w-4 mr-2" />
                  Selectors
                </TabsTrigger>
                <TabsTrigger value="code">
                  <FileJson className="h-4 w-4 mr-2" />
                  Code
                </TabsTrigger>
                <TabsTrigger value="tips">
                  <Bot className="h-4 w-4 mr-2" />
                  Tips
                </TabsTrigger>
              </TabsList>

              <TabsContent value="selectors" className="mt-4 space-y-4">
                <div>
                  <h3 className="text-sm font-medium mb-2">Recommended CSS Selectors</h3>
                  <div className="bg-muted p-4 rounded-md">
                    <div className="grid grid-cols-2 gap-2">
                      {Object.entries(suggestion.selectors).map(([key, value]) => (
                        <div key={key} className="space-y-1">
                          <div className="text-sm font-medium">{key}:</div>
                          <code className="text-xs bg-background p-1 rounded block truncate">{String(value)}</code>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium mb-2">Configuration Options</h3>
                  <div className="bg-muted p-4 rounded-md">
                    <div className="grid grid-cols-2 gap-2">
                      {Object.entries(suggestion.config).map(([key, value]) => (
                        <div key={key} className="space-y-1">
                          <div className="text-sm font-medium">{key}:</div>
                          <div className="text-xs">{String(value)}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="code" className="mt-4">
                <div className="relative">
                  <div className="bg-muted p-4 rounded-md overflow-auto max-h-[400px]">
                    <pre className="text-sm">
                      <code>{suggestion.code}</code>
                    </pre>
                  </div>
                  <Button size="sm" variant="secondary" className="absolute top-2 right-2" onClick={handleCopyCode}>
                    {copied ? (
                      <>
                        <Check className="h-4 w-4 mr-1" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4 mr-1" />
                        Copy
                      </>
                    )}
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="tips" className="mt-4">
                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Scraping Tips & Best Practices</h3>
                  <ul className="space-y-2">
                    {suggestion.tips.map((tip: string, index: number) => (
                      <li key={index} className="flex items-start">
                        <div className="bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5">
                          {index + 1}
                        </div>
                        <span className="text-sm">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </TabsContent>
            </Tabs>
          </>
        )}
      </CardContent>
    </Card>
  )
}
