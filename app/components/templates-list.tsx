"use client"

import Link from "next/link"
import type { InvitationTemplate } from "@/lib/database"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Edit } from "lucide-react"

interface TemplatesListProps {
  templates: InvitationTemplate[]
  error?: string
}

export function TemplatesList({ templates = [], error }: TemplatesListProps) {
  if (error) {
    return <div className="p-4 bg-destructive/10 text-destructive rounded-md">Error loading templates: {error}</div>
  }

  if (!templates || templates.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground">No templates found</p>
        <p className="mt-2">Create your first template to get started</p>
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {templates.map((template) => (
        <Card key={template.id}>
          <CardHeader>
            <CardTitle className="flex items-center">
              {template.name}
              {template.is_default && (
                <Badge variant="secondary" className="ml-2">
                  Default
                </Badge>
              )}
            </CardTitle>
            <p className="text-sm text-muted-foreground">{template.subject}</p>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm max-w-none line-clamp-3">{template.content.replace(/<[^>]*>/g, " ")}</div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" size="sm" asChild>
              <Link href={`/admin/templates/${template.id}`}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Link>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
