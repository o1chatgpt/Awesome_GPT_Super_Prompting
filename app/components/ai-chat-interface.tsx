"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Send, Bot, User, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"

type Message = {
  id: string
  role: "user" | "assistant"
  content: string
}

interface AIChatInterfaceProps {
  initialInput?: string
}

export default function AIChatInterface({ initialInput = "" }: AIChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Hello! I'm your AI assistant. How can I help you with web scraping today?",
    },
  ])
  const [input, setInput] = useState(initialInput)
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const formRef = useRef<HTMLFormElement>(null)

  // Handle initial input
  useEffect(() => {
    if (initialInput && initialInput !== input) {
      setInput(initialInput)

      // Auto-submit if there's an initial input and no previous messages except welcome
      if (messages.length === 1 && messages[0].id === "welcome") {
        // Use a small timeout to ensure the input is set
        setTimeout(() => {
          formRef.current?.dispatchEvent(new Event("submit", { cancelable: true, bubbles: true }))
        }, 100)
      }
    }
  }, [initialInput, messages])

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
    }
    setMessages((prev) => [...prev, userMessage])

    // Clear input and set loading
    const userInput = input
    setInput("")
    setIsLoading(true)

    // Simulate AI response with a typing effect
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: getSimulatedResponse(userInput),
      }
      setMessages((prev) => [...prev, aiMessage])
      setIsLoading(false)
    }, 1000)
  }

  // Enhanced function to generate responses based on keywords
  const getSimulatedResponse = (input: string) => {
    const lowerInput = input.toLowerCase()

    // General greetings and introduction
    if (lowerInput.match(/\b(hello|hi|hey|greetings)\b/)) {
      return "Hello! I'm your AI assistant for web scraping. I can help with techniques, best practices, and troubleshooting. What would you like to know about?"
    }

    if (lowerInput.match(/\b(how are you|how's it going)\b/)) {
      return "I'm functioning well, thank you for asking! I'm here to assist with your web scraping needs. What can I help you with today?"
    }

    if (lowerInput.match(/\b(thank you|thanks)\b/)) {
      return "You're welcome! If you have any more questions about web scraping or data extraction, feel free to ask."
    }

    // Web scraping concepts
    if (lowerInput.match(/\b(what is|define|explain) (web )?(scraping|scraper)\b/)) {
      return "Web scraping is the process of automatically extracting data from websites. It involves making HTTP requests to web servers, downloading HTML content, and parsing that content to extract specific information. Web scraping is used for data mining, research, price monitoring, and many other applications."
    }

    if (lowerInput.match(/\b(scrape|scraping|extract data)\b/)) {
      return "Web scraping involves extracting data from websites. Here are some best practices:\n\n1. Always check the website's robots.txt file and terms of service\n2. Use appropriate request headers to mimic a real browser\n3. Implement rate limiting to avoid overloading the server\n4. Consider using proxies for large-scale scraping\n5. Parse HTML with specialized libraries like Cheerio or BeautifulSoup\n\nWhat specific website or data are you trying to scrape?"
    }

    // Technical implementation
    if (lowerInput.match(/\b(javascript|dynamic|spa|single page|react|vue|angular)\b/)) {
      return "Scraping JavaScript-heavy websites or Single Page Applications (SPAs) requires special techniques:\n\n1. Use headless browsers like Puppeteer or Playwright to render JavaScript\n2. Wait for network requests to complete before extracting data\n3. Intercept API calls made by the website to get data directly\n4. Use browser automation to interact with elements that load dynamically\n5. Consider using tools like Selenium for complex interactions\n\nWhat specific dynamic website are you working with?"
    }

    if (lowerInput.match(/\b(puppeteer|playwright|selenium|headless)\b/)) {
      return "Headless browsers like Puppeteer, Playwright, and Selenium are powerful tools for scraping dynamic websites. They allow you to:\n\n1. Render JavaScript and load dynamic content\n2. Interact with the page (clicking, scrolling, typing)\n3. Wait for specific elements to appear\n4. Take screenshots or generate PDFs\n5. Handle authentication and cookies\n\nOur platform supports integration with these tools for complex scraping tasks."
    }

    if (lowerInput.match(/\b(api|apis|endpoint|json|rest)\b/)) {
      return "Using APIs is often more efficient than scraping websites when available. Benefits include:\n\n1. More structured data format (usually JSON)\n2. Better reliability and stability\n3. Explicit rate limits and documentation\n4. Less resource-intensive\n\nSome websites offer public APIs, while others have undocumented APIs that can be discovered by monitoring network requests in browser developer tools."
    }

    // Proxies and IP management
    if (lowerInput.match(/\b(proxy|proxies|ip rotation|ip block|banned)\b/)) {
      return "Using proxies is essential for large-scale scraping to avoid IP blocks. Our platform offers:\n\n1. Integration with major proxy providers\n2. Automatic IP rotation\n3. Geolocation-specific proxies\n4. Residential and datacenter proxy options\n5. Proxy health monitoring\n\nWe recommend starting with a small proxy pool and scaling up as needed. Would you like more specific information about setting up proxies?"
    }

    if (lowerInput.match(/\b(captcha|recaptcha|cloudflare|bot detection)\b/)) {
      return "Modern websites use various bot detection mechanisms like CAPTCHA, reCAPTCHA, or Cloudflare protection. To handle these:\n\n1. Use residential proxies which are less likely to be flagged\n2. Implement proper browser fingerprinting\n3. Add random delays between requests\n4. Use CAPTCHA solving services for automated solutions\n5. Consider using specialized services like 2captcha or Anti-Captcha\n\nOur platform can help manage these challenges with built-in solutions."
    }

    // Legal and ethical considerations
    if (lowerInput.match(/\b(legal|illegal|allowed|permission|terms of service|tos)\b/)) {
      return "The legality of web scraping varies by jurisdiction and depends on several factors:\n\n1. The website's Terms of Service\n2. Whether the data is publicly available\n3. How the data will be used\n4. The impact on the website's servers\n\nBest practices include:\n- Respecting robots.txt directives\n- Identifying your scraper in the User-Agent\n- Not scraping personal or private information\n- Using rate limiting to minimize server impact\n\nPlease consult with a legal professional for advice specific to your situation."
    }

    if (lowerInput.match(/\b(robots\.txt|robots|crawl delay)\b/)) {
      return "The robots.txt file is a standard used by websites to communicate with web crawlers and scrapers. It indicates which parts of the site should not be accessed by bots.\n\nKey directives include:\n- User-agent: Specifies which crawler the rules apply to\n- Disallow: Paths that should not be crawled\n- Allow: Exceptions to disallow rules\n- Crawl-delay: Suggested delay between requests\n\nEthical scrapers should respect these directives. Our platform can automatically parse and respect robots.txt rules."
    }

    // Data processing and storage
    if (lowerInput.match(/\b(parse|parsing|html|css selector|xpath)\b/)) {
      return "Parsing HTML can be done using various selectors:\n\n1. CSS Selectors: Similar to what you use in CSS stylesheets (e.g., '.classname', '#id', 'div > p')\n2. XPath: More powerful for complex selections (e.g., '//div[@class=\"content\"]/p[2]')\n3. Regular Expressions: Useful for pattern matching in text\n\nPopular parsing libraries include Cheerio (Node.js), Beautiful Soup (Python), and Jsoup (Java). Our platform supports all these methods for extracting structured data."
    }

    if (lowerInput.match(/\b(database|store|storage|export|csv|json|excel)\b/)) {
      return "After scraping data, you can store and export it in various formats:\n\n1. CSV: Simple tabular data\n2. JSON: Hierarchical data with nested structures\n3. Excel: For spreadsheet analysis\n4. Databases: SQL or NoSQL for larger datasets\n\nOur platform supports automatic export to all these formats and direct integration with databases like PostgreSQL, MySQL, and MongoDB. We also provide data transformation tools to clean and structure your scraped data."
    }

    // Platform-specific features
    if (lowerInput.match(/\b(schedule|scheduling|automate|automation|cron)\b/)) {
      return "Our platform allows you to schedule scraping tasks to run automatically:\n\n1. One-time scheduled runs\n2. Recurring schedules (hourly, daily, weekly, monthly)\n3. Custom cron expressions for advanced scheduling\n4. Conditional scheduling based on previous results\n\nYou can manage all scheduled tasks from the dashboard and receive notifications when they complete or encounter errors."
    }

    if (lowerInput.match(/\b(monitor|monitoring|alert|notification|change detection)\b/)) {
      return "You can set up monitoring and alerts for your scraping tasks:\n\n1. Email notifications for completed jobs\n2. Alerts for errors or failed scrapes\n3. Change detection to notify when scraped content changes\n4. Performance monitoring for long-running scrapers\n\nThese features help you stay on top of your data collection without constant manual checking."
    }

    // Troubleshooting
    if (lowerInput.match(/\b(error|fail|issue|problem|not working|troubleshoot)\b/)) {
      return "Common scraping issues and troubleshooting steps:\n\n1. IP blocking: Use proxies and rotate user agents\n2. Dynamic content not loading: Switch to a headless browser\n3. CAPTCHAs appearing: Reduce request frequency or use CAPTCHA solving services\n4. Structure changes: Update your selectors or use more robust selection methods\n5. Performance issues: Optimize your code and use concurrent requests\n\nIf you're experiencing a specific error, please provide more details so I can help troubleshoot."
    }

    // Default response for unrecognized queries
    return (
      "I understand you're asking about: \"" +
      input +
      "\". In the full application, I would provide a detailed response using the OpenAI API. Is there something specific about web scraping, data extraction, or our platform features you'd like to know?"
    )
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot className="h-5 w-5" />
          AI Assistant
        </CardTitle>
        <CardDescription>Ask questions about web scraping, data extraction, or platform features</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === "assistant" ? "justify-start" : "justify-end"}`}
              >
                <div
                  className={`flex items-start gap-2 max-w-[80%] ${
                    message.role === "assistant" ? "flex-row" : "flex-row-reverse"
                  }`}
                >
                  <div className="rounded-full p-2 flex items-center justify-center h-8 w-8 bg-muted">
                    {message.role === "assistant" ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
                  </div>
                  <div
                    className={`rounded-lg px-4 py-2 ${
                      message.role === "assistant" ? "bg-muted" : "bg-primary text-primary-foreground"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-line">{message.content}</p>
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="flex items-start gap-2">
                  <div className="rounded-full p-2 flex items-center justify-center h-8 w-8 bg-muted">
                    <Bot className="h-4 w-4" />
                  </div>
                  <div className="rounded-lg px-4 py-2 bg-muted">
                    <Loader2 className="h-4 w-4 animate-spin" />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter>
        <form ref={formRef} onSubmit={handleSubmit} className="flex w-full gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message here..."
            className="flex-1 min-h-[60px]"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                handleSubmit(e as any)
              }
            }}
          />
          <Button type="submit" disabled={isLoading || !input.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </CardFooter>
    </Card>
  )
}
