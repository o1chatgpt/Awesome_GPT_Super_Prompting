"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { createInvitationTemplate } from "@/lib/actions/templates"
import { Plus } from "lucide-react"

export function CreateTemplateButton() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")
  const [subject, setSubject] = useState("")
  const [content, setContent] = useState(`<p>Hello,</p>
<p>You have been invited to join the Web Scraper Interface as a {{role}}.</p>
<p>Please click the link below to complete your registration:</p>
<p>{{invitation_link}}</p>
<p>This invitation will expire in 7 days.</p>
<p>Best regards,<br>{{inviter_name}}</p>`)
  const [isDefault, setIsDefault] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")

    try {
      const result = await createInvitationTemplate({
        name,
        subject,
        content,
        is_default: isDefault,
      })

      if (result.error) {
        setError(result.error)
      } else {
        setOpen(false)
        resetForm()
        router.refresh()
      }
    } catch (err) {
      setError("An unexpected error occurred")
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetForm = () => {
    setName("")
    setSubject("")
    setContent(`<p>Hello,</p>
<p>You have been invited to join the Web Scraper Interface as a {{role}}.</p>
<p>Please click the link below to complete your registration:</p>
<p>{{invitation_link}}</p>
<p>This invitation will expire in 7 days.</p>
<p>Best regards,<br>{{inviter_name}}</p>`)
    setIsDefault(false)
    setError("")
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(newOpen) => {
        setOpen(newOpen)
        if (!newOpen) resetForm()
      }}
    >
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Template
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create Invitation Template</DialogTitle>
            <DialogDescription>Create a new template for invitation emails</DialogDescription>
          </DialogHeader>

          {error && <div className="p-4 bg-destructive/10 text-destructive rounded-md mt-4">{error}</div>}

          <div className="grid gap-4 py-4">
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
                <Textarea id="content" value={content} onChange={(e) => setContent(e.target.value)} rows={8} required />
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
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Template"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
