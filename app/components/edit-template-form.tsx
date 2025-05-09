"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import type { InvitationTemplate } from "@/lib/database"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { updateInvitationTemplate } from "@/lib/actions/templates"

interface EditTemplateFormProps {
  template: InvitationTemplate
}

export function EditTemplateForm({ template }: EditTemplateFormProps) {
  const router = useRouter()
  const [name, setName] = useState(template.name)
  const [subject, setSubject] = useState(template.subject)
  const [content, setContent] = useState(template.content)
  const [isDefault, setIsDefault] = useState(template.is_default)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")

    try {
      const result = await updateInvitationTemplate(template.id, {
        name,
        subject,
        content,
        is_default: isDefault,
      })

      if (result.error) {
        setError(result.error)
      } else {
        router.refresh()
        router.push("/admin/templates")
      }
    } catch (err) {
      setError("An unexpected error occurred")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <Button variant="outline" asChild>
        <Link href="/admin/templates">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Templates
        </Link>
      </Button>

      {error && <div className="p-4 bg-destructive/10 text-destructive rounded-md">{error}</div>}

      <form onSubmit={handleSubmit}>
        <Card>
          <CardContent className="pt-6">
            <div className="grid gap-6">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="subject">Subject</Label>
                <Input id="subject" value={subject} onChange={(e) => setSubject(e.target.value)} required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="content">Content</Label>
                <div>
                  <p className="text-sm text-muted-foreground mb-2">
                    Available variables: {"{{role}}, {{invitation_link}}, {{inviter_name}}, {{email}}"}
                  </p>
                  <Textarea
                    id="content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={10}
                    required
                  />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="is-default"
                  checked={isDefault}
                  onCheckedChange={(checked) => setIsDefault(checked === true)}
                />
                <Label htmlFor="is-default">Set as default template</Label>
              </div>
              <div className="flex justify-end">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  )
}
