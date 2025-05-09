"use client"

import { useState, useEffect } from "react"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { sendInvitation } from "@/lib/actions/invitations"
import { getInvitationTemplates } from "@/lib/actions/templates"
import { UserPlus, Copy, Check } from "lucide-react"
import type { InvitationTemplate } from "@/lib/database"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function InviteUserDialog() {
  const [open, setOpen] = useState(false)
  const [email, setEmail] = useState("")
  const [role, setRole] = useState<"user" | "admin" | "viewer">("user")
  const [templateId, setTemplateId] = useState<string>("")
  const [templates, setTemplates] = useState<InvitationTemplate[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [invitationLink, setInvitationLink] = useState<string | null>(null)
  const [emailContent, setEmailContent] = useState<string | null>(null)
  const [emailSubject, setEmailSubject] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [activeTab, setActiveTab] = useState("link")
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchTemplates = async () => {
      if (!open) return

      try {
        const result = await getInvitationTemplates()
        if (!result.error && result.templates) {
          setTemplates(result.templates)

          // Set default template if available
          const defaultTemplate = result.templates.find((t) => t.is_default)
          if (defaultTemplate) {
            setTemplateId(defaultTemplate.id)
          } else if (result.templates.length > 0) {
            setTemplateId(result.templates[0].id)
          }
        } else if (result.error) {
          setError(result.error)
        }
      } catch (err) {
        setError("Failed to load templates")
      }
    }

    fetchTemplates()
  }, [open])

  const handleInvite = async () => {
    if (!email) {
      setError("Please enter an email address")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      const result = await sendInvitation(email, role, templateId || undefined)

      if (result.error) {
        setError(result.error)
        return
      }

      setInvitationLink(result.invitationLink)
      setEmailContent(result.emailContent)
      setEmailSubject(result.emailSubject)
    } catch (err) {
      setError("An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = () => {
    if (invitationLink) {
      navigator.clipboard.writeText(invitationLink)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const resetForm = () => {
    setEmail("")
    setRole("user")
    setTemplateId("")
    setInvitationLink(null)
    setEmailContent(null)
    setEmailSubject(null)
    setActiveTab("link")
    setError("")
  }

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      resetForm()
    }
    setOpen(newOpen)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <UserPlus className="h-4 w-4 mr-2" />
          Invite User
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Invite User</DialogTitle>
          <DialogDescription>Send an invitation to a new user to join your web scraper platform.</DialogDescription>
        </DialogHeader>

        {error && <div className="p-4 bg-destructive/10 text-destructive rounded-md mt-2">{error}</div>}

        {!invitationLink ? (
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@example.com"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="role">Role</Label>
              <Select value={role} onValueChange={(value) => setRole(value as "user" | "admin" | "viewer")}>
                <SelectTrigger id="role">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="viewer">Viewer</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="template">Template</Label>
              <Select value={templateId} onValueChange={setTemplateId}>
                <SelectTrigger id="template">
                  <SelectValue placeholder="Select a template" />
                </SelectTrigger>
                <SelectContent>
                  {templates.map((template) => (
                    <SelectItem key={template.id} value={template.id}>
                      {template.name} {template.is_default ? "(Default)" : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <DialogFooter>
              <Button onClick={handleInvite} disabled={isLoading}>
                {isLoading ? "Sending..." : "Send Invitation"}
              </Button>
            </DialogFooter>
          </div>
        ) : (
          <div className="py-4">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="link">Invitation Link</TabsTrigger>
                <TabsTrigger value="email">Email Preview</TabsTrigger>
              </TabsList>
              <TabsContent value="link" className="mt-4">
                <div className="mb-4">
                  <Label>Invitation Link</Label>
                  <div className="flex mt-2">
                    <Input value={invitationLink} readOnly className="flex-1 pr-10" />
                    <Button type="button" variant="ghost" size="icon" className="-ml-10" onClick={copyToClipboard}>
                      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    Share this link with the user. The link will expire in 7 days.
                  </p>
                </div>
              </TabsContent>
              <TabsContent value="email" className="mt-4">
                <div className="border rounded-md p-4">
                  <div className="mb-2 pb-2 border-b">
                    <div className="font-semibold">Subject:</div>
                    <div>{emailSubject}</div>
                  </div>
                  <div dangerouslySetInnerHTML={{ __html: emailContent || "" }} />
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  This is a preview of the email that would be sent to the user.
                </p>
              </TabsContent>
            </Tabs>
            <DialogFooter className="mt-4">
              <Button onClick={() => setInvitationLink(null)}>Send Another Invitation</Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
