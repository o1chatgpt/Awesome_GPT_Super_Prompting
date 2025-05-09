"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft,
  Search,
  FileCode,
  Globe,
  ShoppingCart,
  NewspaperIcon as News,
  Users,
  Code,
  Download,
  Star,
  Filter,
} from "lucide-react"
import Link from "next/link"

interface Template {
  id: string
  title: string
  description: string
  category: string
  tags: string[]
  popularity: number
  createdAt: string
}

const mockTemplates: Template[] = [
  {
    id: "1",
    title: "E-commerce Product Scraper",
    description: "Extract product details, prices, and reviews from major e-commerce platforms",
    category: "E-commerce",
    tags: ["products", "pricing", "reviews"],
    popularity: 4.8,
    createdAt: "2023-10-15",
  },
  {
    id: "2",
    title: "News Article Extractor",
    description: "Scrape news articles, headlines, and metadata from news websites",
    category: "News",
    tags: ["articles", "headlines", "content"],
    popularity: 4.5,
    createdAt: "2023-09-22",
  },
  {
    id: "3",
    title: "Social Media Profile Scraper",
    description: "Extract public profile information from social media platforms",
    category: "Social Media",
    tags: ["profiles", "posts", "engagement"],
    popularity: 4.7,
    createdAt: "2023-11-05",
  },
  {
    id: "4",
    title: "Real Estate Listing Scraper",
    description: "Collect property listings, prices, and details from real estate websites",
    category: "Real Estate",
    tags: ["properties", "pricing", "locations"],
    popularity: 4.6,
    createdAt: "2023-10-30",
  },
  {
    id: "5",
    title: "Job Listing Aggregator",
    description: "Gather job postings, requirements, and company details from job boards",
    category: "Jobs",
    tags: ["jobs", "requirements", "companies"],
    popularity: 4.4,
    createdAt: "2023-09-15",
  },
  {
    id: "6",
    title: "Restaurant Menu Scraper",
    description: "Extract menu items, prices, and descriptions from restaurant websites",
    category: "Food",
    tags: ["menus", "pricing", "restaurants"],
    popularity: 4.3,
    createdAt: "2023-11-10",
  },
]

export default function AITemplatesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState("all")

  const filteredTemplates = mockTemplates.filter((template) => {
    const matchesSearch =
      template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesCategory = activeCategory === "all" || template.category.toLowerCase() === activeCategory.toLowerCase()

    return matchesSearch && matchesCategory
  })

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case "e-commerce":
        return <ShoppingCart className="h-4 w-4" />
      case "news":
        return <News className="h-4 w-4" />
      case "social media":
        return <Users className="h-4 w-4" />
      case "real estate":
        return <Globe className="h-4 w-4" />
      case "jobs":
        return <FileCode className="h-4 w-4" />
      case "food":
        return <ShoppingCart className="h-4 w-4" />
      default:
        return <Code className="h-4 w-4" />
    }
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center mb-6">
        <Button variant="outline" size="icon" asChild className="mr-4">
          <Link href="/ai-tools">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">AI Templates</h1>
          <p className="text-muted-foreground">Pre-built AI-generated scraping templates</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search templates..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="outline" className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          Filters
        </Button>
      </div>

      <Tabs defaultValue="all" value={activeCategory} onValueChange={setActiveCategory}>
        <TabsList className="mb-4">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="e-commerce">E-commerce</TabsTrigger>
          <TabsTrigger value="news">News</TabsTrigger>
          <TabsTrigger value="social media">Social Media</TabsTrigger>
          <TabsTrigger value="real estate">Real Estate</TabsTrigger>
          <TabsTrigger value="jobs">Jobs</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates.map((template) => (
              <Card key={template.id}>
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{template.title}</CardTitle>
                    <Badge variant="outline" className="flex items-center gap-1">
                      {getCategoryIcon(template.category)}
                      {template.category}
                    </Badge>
                  </div>
                  <CardDescription>{template.description}</CardDescription>
                </CardHeader>
                <CardContent className="pb-3">
                  <div className="flex flex-wrap gap-2">
                    {template.tags.map((tag) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between items-center">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-amber-500 fill-amber-500 mr-1" />
                    <span className="text-sm">{template.popularity.toFixed(1)}</span>
                  </div>
                  <Button>
                    <Download className="h-4 w-4 mr-2" />
                    Use Template
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        {["e-commerce", "news", "social media", "real estate", "jobs"].map((category) => (
          <TabsContent key={category} value={category} className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTemplates.map((template) => (
                <Card key={template.id}>
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{template.title}</CardTitle>
                      <Badge variant="outline" className="flex items-center gap-1">
                        {getCategoryIcon(template.category)}
                        {template.category}
                      </Badge>
                    </div>
                    <CardDescription>{template.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="pb-3">
                    <div className="flex flex-wrap gap-2">
                      {template.tags.map((tag) => (
                        <Badge key={tag} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between items-center">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-amber-500 fill-amber-500 mr-1" />
                      <span className="text-sm">{template.popularity.toFixed(1)}</span>
                    </div>
                    <Button>
                      <Download className="h-4 w-4 mr-2" />
                      Use Template
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
