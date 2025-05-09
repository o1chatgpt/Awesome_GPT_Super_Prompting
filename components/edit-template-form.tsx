"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { getTemplate, updateTemplate } from "@/lib/actions/templates"

interface EditTemplateFormProps {
  templateId: string
}

export function EditTemplateForm({ templateId }: EditTemplateFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [name, setName] = useState("")
  const [subject, setSubject] = useState("")
  const [content, setContent] = useState("")

  useEffect(() => {
    const fetchTemplate = async () => {
      try {
        const result = await getTemplate(templateId)
        if (result.success && result.data) {
          setName(result.data.name)
          setSubject(result.data.subject)
          setContent(result.data.content)
        } else {
          toast({
            title: "Error",
            description: result.error || "Failed to load template",
            variant: "destructive",
          })
        }
      } catch (error) {
        console.error("Error fetching template:", error)
        toast({
          title: "Error",
          description: "An unexpected error occurred",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchTemplate()
  }, [templateId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const result = await updateTemplate({
        id: templateId,
        name,
        subject,
        content,
      })

      if (result.success) {
        toast({
          title: "Template updated",
          description: "Your template has been updated successfully.",
        })
        router.refresh()
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to update template",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error updating template:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="h-6 w-24 bg-muted rounded animate-pulse" />
          <div className="h-10 w-full bg-muted rounded animate-pulse" />
        </div>
        <div className="space-y-2">
          <div className="h-6 w-24 bg-muted rounded animate-pulse" />
          <div className="h-10 w-full bg-muted rounded animate-pulse" />
        </div>
        <div className="space-y-2">
          <div className="h-6 w-24 bg-muted rounded animate-pulse" />
          <div className="h-40 w-full bg-muted rounded animate-pulse" />
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Template Name</Label>
        <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Welcome Email" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="subject">Email Subject</Label>
        <Input
          id="subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="Welcome to our platform!"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="content">Email Content</Label>
        <Textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Enter email content here..."
          className="min-h-[300px] font-mono"
          required
        />
        <p className="text-sm text-muted-foreground">
          Available variables: {`{{name}}`}, {`{{inviterName}}`}, {`{{invitationLink}}`}, {`{{role}}`}
        </p>
      </div>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button type="submit" disabled={saving}>
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </form>
  )
}
