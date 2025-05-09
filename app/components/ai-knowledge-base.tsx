"use client"

import type React from "react"

import { useState } from "react"
import { Search, Plus, Minus } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"

interface QAItem {
  question: string
  answer: string
}

interface Category {
  name: string
  icon: React.ReactNode
  items: QAItem[]
}

export default function AIKnowledgeBase({ onSelectQuestion }: { onSelectQuestion: (question: string) => void }) {
  const [searchQuery, setSearchQuery] = useState("")
  const [expandedCategories, setExpandedCategories] = useState<string[]>([])

  const toggleCategory = (categoryName: string) => {
    setExpandedCategories((prev) =>
      prev.includes(categoryName) ? prev.filter((name) => name !== categoryName) : [...prev, categoryName],
    )
  }

  const categories: Category[] = [
    {
      name: "Getting Started",
      icon: (
        <Badge variant="outline" className="mr-2">
          101
        </Badge>
      ),
      items: [
        {
          question: "What is web scraping?",
          answer:
            "Web scraping is the process of automatically extracting data from websites. It involves making HTTP requests to web servers, downloading HTML content, and parsing that content to extract specific information.",
        },
        {
          question: "How do I create my first scraping task?",
          answer:
            "To create your first scraping task, navigate to the dashboard and click on 'New Task'. Enter the target URL, select the data you want to extract, and configure any additional settings like scheduling or proxy usage.",
        },
        {
          question: "What can I do with scraped data?",
          answer:
            "Scraped data can be used for market research, price monitoring, lead generation, content aggregation, machine learning training, and much more. Our platform allows you to export data in various formats or integrate it directly with your applications.",
        },
      ],
    },
    {
      name: "Technical Implementation",
      icon: (
        <Badge variant="outline" className="mr-2">
          Tech
        </Badge>
      ),
      items: [
        {
          question: "How do I scrape JavaScript-heavy websites?",
          answer:
            "For JavaScript-heavy websites, you'll need to use a headless browser like Puppeteer or Playwright. These tools can render JavaScript and interact with dynamic elements. Our platform supports both options with built-in integration.",
        },
        {
          question: "What are CSS selectors and XPath?",
          answer:
            "CSS selectors and XPath are methods to target specific elements in an HTML document. CSS selectors use the same syntax as CSS stylesheets (e.g., '.classname', '#id'), while XPath provides more powerful selection capabilities for complex documents.",
        },
        {
          question: "How can I extract data from tables?",
          answer:
            "To extract data from tables, you can use CSS selectors or XPath to target table rows and cells. For example, 'table tr' selects all rows, and then you can iterate through cells with 'td' selectors. Our platform also offers specialized table extraction tools.",
        },
      ],
    },
    {
      name: "Proxies & IP Management",
      icon: (
        <Badge variant="outline" className="mr-2">
          IP
        </Badge>
      ),
      items: [
        {
          question: "Why do I need proxies for web scraping?",
          answer:
            "Proxies are essential for large-scale scraping to avoid IP blocks and bans. Websites often limit the number of requests from a single IP address, so rotating through multiple proxies allows you to distribute requests and appear as different users.",
        },
        {
          question: "What types of proxies are available?",
          answer:
            "There are several types of proxies: Datacenter proxies (fast but easily detected), Residential proxies (use real IP addresses, harder to detect), Mobile proxies (use mobile network IPs), and Rotating proxies (automatically change IPs). Our platform supports all these types.",
        },
        {
          question: "How do I handle CAPTCHAs and bot detection?",
          answer:
            "To handle CAPTCHAs and bot detection, you can use residential proxies, implement proper browser fingerprinting, add random delays between requests, and use CAPTCHA solving services. Our platform includes built-in solutions for these challenges.",
        },
      ],
    },
    {
      name: "Legal & Ethical Considerations",
      icon: (
        <Badge variant="outline" className="mr-2">
          Legal
        </Badge>
      ),
      items: [
        {
          question: "Is web scraping legal?",
          answer:
            "The legality of web scraping varies by jurisdiction and depends on factors like the website's Terms of Service, whether the data is publicly available, how the data will be used, and the impact on the website's servers. Always consult legal professionals for specific advice.",
        },
        {
          question: "What is robots.txt and should I respect it?",
          answer:
            "Robots.txt is a file that websites use to communicate with web crawlers about which parts of the site should not be accessed. Ethical scrapers should respect these directives. Our platform can automatically parse and follow robots.txt rules.",
        },
        {
          question: "How can I scrape ethically?",
          answer:
            "Ethical scraping practices include respecting robots.txt, identifying your scraper in the User-Agent, not scraping personal information, implementing rate limiting to minimize server impact, and only collecting data you have a legitimate use for.",
        },
      ],
    },
    {
      name: "Data Processing & Storage",
      icon: (
        <Badge variant="outline" className="mr-2">
          Data
        </Badge>
      ),
      items: [
        {
          question: "How do I clean and transform scraped data?",
          answer:
            "Our platform provides tools for cleaning and transforming scraped data, including removing duplicates, standardizing formats, extracting specific information with regex, and applying custom transformations with JavaScript or Python functions.",
        },
        {
          question: "What export formats are supported?",
          answer:
            "You can export scraped data in various formats including CSV, JSON, Excel, XML, and SQL. Our platform also supports direct integration with databases like PostgreSQL, MySQL, and MongoDB, as well as cloud storage services.",
        },
        {
          question: "How can I automate data processing workflows?",
          answer:
            "You can create automated workflows that trigger when new data is scraped. These workflows can include data cleaning, transformation, analysis, and export steps. You can also set up notifications and alerts based on specific conditions in the data.",
        },
      ],
    },
    {
      name: "Troubleshooting",
      icon: (
        <Badge variant="outline" className="mr-2">
          Help
        </Badge>
      ),
      items: [
        {
          question: "Why is my scraper not getting the right data?",
          answer:
            "Common reasons include: the website structure changed, you're using incorrect selectors, JavaScript content isn't being rendered, or the site has implemented anti-scraping measures. Our debugging tools can help identify and fix these issues.",
        },
        {
          question: "How do I fix IP blocking issues?",
          answer:
            "To fix IP blocking, try using proxies, rotating user agents, implementing rate limiting, adding random delays between requests, and making your scraper behave more like a real user with realistic browsing patterns.",
        },
        {
          question: "What should I do if the website structure changes?",
          answer:
            "When website structures change, you'll need to update your selectors. Our platform includes monitoring tools that can alert you to changes and AI-powered selector suggestions that can adapt to new structures automatically.",
        },
      ],
    },
  ]

  const filteredCategories = categories
    .map((category) => ({
      ...category,
      items: category.items.filter(
        (item) =>
          item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.answer.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    }))
    .filter((category) => category.items.length > 0)

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Knowledge Base</CardTitle>
        <CardDescription>Common questions and answers about web scraping</CardDescription>
        <div className="relative mt-2">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search questions..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[500px] pr-4">
          {filteredCategories.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">No questions found matching your search.</div>
          ) : (
            <div className="space-y-4">
              {filteredCategories.map((category) => (
                <Collapsible
                  key={category.name}
                  open={expandedCategories.includes(category.name)}
                  onOpenChange={() => toggleCategory(category.name)}
                  className="border rounded-md"
                >
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" className="flex items-center justify-between w-full p-4 text-left">
                      <div className="flex items-center">
                        {category.icon}
                        <span>{category.name}</span>
                        <Badge className="ml-2" variant="secondary">
                          {category.items.length}
                        </Badge>
                      </div>
                      {expandedCategories.includes(category.name) ? (
                        <Minus className="h-4 w-4" />
                      ) : (
                        <Plus className="h-4 w-4" />
                      )}
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="px-4 pb-4">
                    <div className="space-y-2">
                      {category.items.map((item, index) => (
                        <div key={index} className="border rounded-md p-3">
                          <Button
                            variant="link"
                            className="text-left justify-start p-0 h-auto font-medium text-primary"
                            onClick={() => onSelectQuestion(item.question)}
                          >
                            {item.question}
                          </Button>
                          <p className="text-sm mt-2 text-muted-foreground">{item.answer}</p>
                        </div>
                      ))}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
