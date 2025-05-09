"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { createInvitationTemplate } from "@/lib/actions/templates"

const DEFAULT_TEMPLATE = `<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
  <h1 style="color: #7c3aed;">Welcome to Web Scraper Interface</h1>
  <p>Hello,</p>
  <p>You've been invited to join our Web Scraper Interface platform as a <strong>{{role}}</strong>.</p>
  <p>Please click the link below to complete your registration:</p>
  <p><a href="{{invitation_link}}" style="color: #7c3aed;">{{invitation_link}}</a></p>
  <p>This invitation will expire in 7 days.</p>
  <p>Best regards,<br>{{inviter_name}}</p>
</div>`

export function CreateCustomTemplate() {
  const router = useRouter()
  const [name, setName] = useState("Modern Welcome Template")
  const [subject, setSubject] = useState("Welcome to Web Scraper Interface - You're Invited!")
  const [content, setContent] = useState(DEFAULT_TEMPLATE)
  const [isDefault, setIsDefault] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name || !subject || !content) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const result = await createInvitationTemplate({
        name,
        subject,
        content,
        is_default: isDefault,
      })

      if (result.error) {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        })
      } else {
        toast({
          title: "Success",
          description: "Template created successfully",
        })
        router.push("/admin/templates")
      }
    } catch (error) {
      console.error("Error creating template:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Template Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Welcome Template"
              required
            />
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

          <div className="flex items-center space-x-2">
            <Switch id="default-template" checked={isDefault} onCheckedChange={setIsDefault} />
            <Label htmlFor="default-template">Set as default template</Label>
          </div>
        </div>

        <Card>
          <CardContent className="p-4">
            <h3 className="font-medium mb-2">Available Variables</h3>
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-muted p-2 rounded text-sm">
                <code>{"{{invitation_link}}"}</code>
                <p className="text-xs text-muted-foreground mt-1">Registration link</p>
              </div>
              <div className="bg-muted p-2 rounded text-sm">
                <code>{"{{inviter_name}}"}</code>
                <p className="text-xs text-muted-foreground mt-1">Name of the inviter</p>
              </div>
              <div className="bg-muted p-2 rounded text-sm">
                <code>{"{{role}}"}</code>
                <p className="text-xs text-muted-foreground mt-1">User role (admin, user, viewer)</p>
              </div>
              <div className="bg-muted p-2 rounded text-sm">
                <code>{"{{email}}"}</code>
                <p className="text-xs text-muted-foreground mt-1">Recipient's email</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-2">
        <Label htmlFor="content">Email Content (HTML)</Label>
        <Textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="min-h-[300px] font-mono text-sm"
          placeholder="Enter your HTML template here..."
          required
        />
      </div>

      <div className="flex justify-end space-x-4">
        <Button type="button" variant="outline" onClick={() => router.push("/admin/templates")}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Creating..." : "Create Template"}
        </Button>
      </div>
    </form>
  )
}
