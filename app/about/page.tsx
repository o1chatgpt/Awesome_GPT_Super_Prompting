import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function About() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">About Web Scraper Tool</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Our Mission</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              Web Scraper Tool was created to democratize web data extraction and analysis. We believe that access to
              web data should be simple, efficient, and accessible to everyone, from individual researchers to large
              enterprises.
            </p>
            <p className="mt-4">
              Our platform combines powerful scraping capabilities with cutting-edge AI to help you not just collect
              data, but understand and utilize it effectively.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Key Features</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-2">
              <li>Intuitive web scraping interface</li>
              <li>Scheduled scraping tasks</li>
              <li>AI-powered data analysis</li>
              <li>Multi-user collaboration</li>
              <li>Comprehensive API</li>
              <li>Data export in multiple formats</li>
              <li>Advanced filtering and transformation</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Our Technology Stack</CardTitle>
          <CardDescription>Built with modern, reliable technologies</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded">
              <h3 className="font-semibold">Frontend</h3>
              <p>Next.js & React</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded">
              <h3 className="font-semibold">Backend</h3>
              <p>Node.js</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded">
              <h3 className="font-semibold">Database</h3>
              <p>PostgreSQL</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded">
              <h3 className="font-semibold">AI</h3>
              <p>OpenAI & CrewAI</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Contact Us</CardTitle>
          <CardDescription>We'd love to hear from you</CardDescription>
        </CardHeader>
        <CardContent>
          <p>
            If you have any questions, feedback, or need assistance, please don't hesitate to reach out to our team:
          </p>
          <div className="mt-4 space-y-2">
            <p>
              <strong>Email:</strong> support@webscrapertool.com
            </p>
            <p>
              <strong>Phone:</strong> +1 (555) 123-4567
            </p>
            <p>
              <strong>Address:</strong> 123 Tech Street, San Francisco, CA 94107
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
