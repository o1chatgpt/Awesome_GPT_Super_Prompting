import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function Documentation() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Documentation</h1>

      <Tabs defaultValue="getting-started">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="getting-started">Getting Started</TabsTrigger>
          <TabsTrigger value="api">API Reference</TabsTrigger>
          <TabsTrigger value="ai-features">AI Features</TabsTrigger>
          <TabsTrigger value="advanced">Advanced Usage</TabsTrigger>
        </TabsList>

        <TabsContent value="getting-started">
          <Card>
            <CardHeader>
              <CardTitle>Getting Started with Web Scraper Tool</CardTitle>
              <CardDescription>Learn the basics of using our web scraping platform</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <h3 className="text-xl font-semibold">Introduction</h3>
              <p>
                Web Scraper Tool is a powerful platform that allows you to extract data from websites, schedule
                recurring scraping tasks, and leverage AI to analyze and process the scraped data.
              </p>

              <h3 className="text-xl font-semibold">Basic Usage</h3>
              <ol className="list-decimal pl-5 space-y-2">
                <li>Enter the URL you want to scrape in the main input field</li>
                <li>Configure the scraping options (content type, depth, output format)</li>
                <li>Choose whether to run the scrape once or on a schedule</li>
                <li>Click "Start Scraping" or "Schedule Scraping"</li>
                <li>View and analyze your results</li>
              </ol>

              <h3 className="text-xl font-semibold">Account Management</h3>
              <p>
                Create an account to save your scraping history, access scheduled tasks, and utilize advanced features
                like AI-powered analysis and team collaboration.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="api">
          <Card>
            <CardHeader>
              <CardTitle>API Reference</CardTitle>
              <CardDescription>Integrate Web Scraper Tool into your applications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <h3 className="text-xl font-semibold">Authentication</h3>
              <p>All API requests require an API key. You can generate an API key in your account settings.</p>

              <h3 className="text-xl font-semibold">Endpoints</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold">POST /api/scrape</h4>
                  <p>Initiate a scraping task</p>
                  <pre className="bg-gray-100 p-2 rounded mt-2">
                    {`{
  "url": "https://example.com",
  "options": {
    "contentType": "text",
    "depth": "single",
    "format": "json"
  }
}`}
                  </pre>
                </div>

                <div>
                  <h4 className="font-semibold">GET /api/tasks</h4>
                  <p>Retrieve all scheduled tasks</p>
                </div>

                <div>
                  <h4 className="font-semibold">POST /api/tasks</h4>
                  <p>Create a new scheduled task</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ai-features">
          <Card>
            <CardHeader>
              <CardTitle>AI Features</CardTitle>
              <CardDescription>Leverage artificial intelligence with your scraped data</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <h3 className="text-xl font-semibold">AI-Powered Analysis</h3>
              <p>Our platform uses advanced AI models to help you extract insights from your scraped data:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Automatic content summarization</li>
                <li>Entity extraction and categorization</li>
                <li>Sentiment analysis</li>
                <li>Topic modeling</li>
              </ul>

              <h3 className="text-xl font-semibold">CrewAI Integration</h3>
              <p>
                CrewAI allows you to create specialized AI agents that work together to process your scraped data. Each
                agent has a specific role and expertise, enabling complex data processing workflows.
              </p>

              <h3 className="text-xl font-semibold">Memory System</h3>
              <p>
                Our platform remembers your previous scraping tasks and analyses, allowing it to provide more relevant
                suggestions and insights over time.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="advanced">
          <Card>
            <CardHeader>
              <CardTitle>Advanced Usage</CardTitle>
              <CardDescription>Take your web scraping to the next level</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <h3 className="text-xl font-semibold">Custom Selectors</h3>
              <p>Use CSS selectors or XPath to target specific elements on a webpage:</p>
              <pre className="bg-gray-100 p-2 rounded mt-2">
                {`{
  "selectors": {
    "title": "h1.article-title",
    "content": "div.article-content",
    "author": "span.author-name"
  }
}`}
              </pre>

              <h3 className="text-xl font-semibold">Data Transformation</h3>
              <p>Apply custom transformations to your scraped data using JavaScript functions:</p>
              <pre className="bg-gray-100 p-2 rounded mt-2">
                {`function transformData(data) {
  return {
    title: data.title.toUpperCase(),
    wordCount: data.content.split(' ').length,
    authorInitials: data.author.split(' ').map(name => name[0]).join('')
  };
}`}
              </pre>

              <h3 className="text-xl font-semibold">Webhooks</h3>
              <p>Configure webhooks to notify your systems when a scraping task is completed:</p>
              <pre className="bg-gray-100 p-2 rounded mt-2">
                {`{
  "webhookUrl": "https://your-api.example.com/webhook",
  "webhookSecret": "your_secret_key"
}`}
              </pre>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
