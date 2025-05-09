"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "@/components/ui/use-toast"
import { deleteInvitationTemplate, getInvitationTemplates } from "@/lib/actions/templates"
import { Badge } from "@/components/ui/badge"
import { PlusCircle } from "lucide-react"
import type { InvitationTemplate } from "@/lib/database"

export function TemplatesList({
  templates: initialTemplates = [],
  error: initialError,
}: {
  templates?: InvitationTemplate[]
  error?: string
}) {
  const router = useRouter()
  const [templates, setTemplates] = useState<InvitationTemplate[]>(initialTemplates)
  const [loading, setLoading] = useState(!initialTemplates.length)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(initialError || null)

  useEffect(() => {
    if (initialTemplates.length) {
      return
    }

    const fetchTemplates = async () => {
      try {
        const result = await getInvitationTemplates()
        if (result.error) {
          setError(result.error)
        } else {
          setTemplates(result.templates || [])
        }
      } catch (err) {
        console.error("Error fetching templates:", err)
        setError("An unexpected error occurred")
      } finally {
        setLoading(false)
      }
    }

    fetchTemplates()
  }, [initialTemplates])

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this template?")) {
      setDeleting(id)
      try {
        const result = await deleteInvitationTemplate(id)
        if (result.error) {
          toast({
            title: "Error",
            description: result.error,
            variant: "destructive",
          })
        } else {
          setTemplates(templates.filter((template) => template.id !== id))
          toast({
            title: "Template deleted",
            description: "The template has been deleted successfully.",
          })
        }
      } catch (err) {
        console.error("Error deleting template:", err)
        toast({
          title: "Error",
          description: "An unexpected error occurred",
          variant: "destructive",
        })
      } finally {
        setDeleting(null)
      }
    }
  }

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-3/4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-2/3" />
            </CardContent>
            <CardFooter>
              <Skeleton className="h-9 w-full" />
            </CardFooter>
          </Card>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 bg-destructive/10 text-destructive rounded-md">
        <p>{error}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Create New Template Card */}
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center h-[200px]">
            <Link href="/admin/templates/create" className="flex flex-col items-center text-center p-4">
              <PlusCircle className="h-10 w-10 text-muted-foreground mb-2" />
              <h3 className="font-medium text-lg">Create Custom Template</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Design a beautiful invitation template with our visual editor
              </p>
            </Link>
          </CardContent>
        </Card>

        {/* Template Cards */}
        {templates.map((template) => (
          <Card key={template.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{template.name}</CardTitle>
                {template.is_default && <Badge variant="secondary">Default</Badge>}
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground truncate">{template.subject}</p>
              <p className="text-xs text-muted-foreground mt-2">
                Created: {new Date(template.created_at).toLocaleDateString()}
              </p>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" asChild>
                <Link href={`/admin/templates/${template.id}`}>Edit</Link>
              </Button>
              <Button
                variant="destructive"
                onClick={() => handleDelete(template.id)}
                disabled={deleting === template.id || template.is_default}
              >
                {deleting === template.id ? "Deleting..." : "Delete"}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {templates.length === 0 && (
        <div className="text-center py-10">
          <p className="text-muted-foreground">No templates found. Create your first template to get started.</p>
        </div>
      )}
    </div>
  )
}
