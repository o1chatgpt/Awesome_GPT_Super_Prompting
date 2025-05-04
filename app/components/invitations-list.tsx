"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast } from "@/components/ui/use-toast"
import { getInvitations, resendInvitation, cancelInvitation } from "@/lib/actions/invitations"
import { Copy, RefreshCw, Trash2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { Invitation } from "@/lib/database"

export function InvitationsList() {
  const [invitations, setInvitations] = useState<Invitation[]>([])
  const [loading, setLoading] = useState(true)
  const [resendDialogOpen, setResendDialogOpen] = useState(false)
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false)
  const [selectedInvitation, setSelectedInvitation] = useState<Invitation | null>(null)
  const [newInvitationLink, setNewInvitationLink] = useState<string | null>(null)
  const [actionInProgress, setActionInProgress] = useState(false)

  useEffect(() => {
    loadInvitations()
  }, [])

  const loadInvitations = async () => {
    setLoading(true)
    try {
      const result = await getInvitations()
      if (result.error) {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        })
      } else {
        setInvitations(result.invitations || [])
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load invitations",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleResend = (invitation: Invitation) => {
    setSelectedInvitation(invitation)
    setResendDialogOpen(true)
  }

  const handleCancel = (invitation: Invitation) => {
    setSelectedInvitation(invitation)
    setCancelDialogOpen(true)
  }

  const confirmResend = async () => {
    if (!selectedInvitation) return

    setActionInProgress(true)
    try {
      const result = await resendInvitation(selectedInvitation.id)
      if (result.error) {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        })
      } else {
        setNewInvitationLink(result.invitationLink)
        toast({
          title: "Invitation Resent",
          description: "The invitation has been resent successfully.",
        })
        await loadInvitations()
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to resend invitation",
        variant: "destructive",
      })
    } finally {
      setActionInProgress(false)
    }
  }

  const confirmCancel = async () => {
    if (!selectedInvitation) return

    setActionInProgress(true)
    try {
      const result = await cancelInvitation(selectedInvitation.id)
      if (result.error) {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        })
      } else {
        toast({
          title: "Invitation Cancelled",
          description: "The invitation has been cancelled successfully.",
        })
        setInvitations(invitations.filter((inv) => inv.id !== selectedInvitation.id))
        setCancelDialogOpen(false)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to cancel invitation",
        variant: "destructive",
      })
    } finally {
      setActionInProgress(false)
    }
  }

  const handleCopyLink = () => {
    if (newInvitationLink) {
      navigator.clipboard.writeText(newInvitationLink)
      toast({
        title: "Copied",
        description: "Invitation link copied to clipboard",
      })
    }
  }

  const closeResendDialog = () => {
    setResendDialogOpen(false)
    setSelectedInvitation(null)
    setNewInvitationLink(null)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  const isExpired = (expiresAt: string) => {
    return new Date(expiresAt) < new Date()
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Pending Invitations</CardTitle>
          <CardDescription>Manage user invitations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-4">
            <div className="animate-pulse">Loading invitations...</div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Pending Invitations</CardTitle>
          <CardDescription>Manage user invitations</CardDescription>
        </CardHeader>
        <CardContent>
          {invitations.length === 0 ? (
            <div className="text-center py-4 text-muted-foreground">No pending invitations</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Invited By</TableHead>
                  <TableHead>Expires</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invitations.map((invitation) => (
                  <TableRow key={invitation.id}>
                    <TableCell>{invitation.email}</TableCell>
                    <TableCell className="capitalize">{invitation.role}</TableCell>
                    <TableCell>{invitation.inviter?.full_name || "Unknown"}</TableCell>
                    <TableCell>{formatDate(invitation.expires_at)}</TableCell>
                    <TableCell>
                      {invitation.used_at ? (
                        <Badge variant="outline">Used</Badge>
                      ) : isExpired(invitation.expires_at) ? (
                        <Badge variant="destructive">Expired</Badge>
                      ) : (
                        <Badge variant="outline">Pending</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleResend(invitation)}
                          disabled={!!invitation.used_at}
                        >
                          <RefreshCw className="h-4 w-4" />
                          <span className="sr-only">Resend</span>
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleCancel(invitation)}
                          disabled={!!invitation.used_at}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Cancel</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={loadInvitations}>
            Refresh
          </Button>
        </CardFooter>
      </Card>

      {/* Resend Dialog */}
      <Dialog open={resendDialogOpen} onOpenChange={setResendDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Resend Invitation</DialogTitle>
            <DialogDescription>
              {!newInvitationLink
                ? `Are you sure you want to resend the invitation to ${selectedInvitation?.email}?`
                : "The invitation has been resent successfully."}
            </DialogDescription>
          </DialogHeader>
          {!newInvitationLink ? (
            <DialogFooter>
              <Button variant="outline" onClick={closeResendDialog} disabled={actionInProgress}>
                Cancel
              </Button>
              <Button onClick={confirmResend} disabled={actionInProgress}>
                {actionInProgress ? "Resending..." : "Resend"}
              </Button>
            </DialogFooter>
          ) : (
            <>
              <div className="py-4">
                <Label htmlFor="new-invitation-link">New Invitation Link</Label>
                <div className="flex mt-1">
                  <Input id="new-invitation-link" value={newInvitationLink} readOnly className="rounded-r-none" />
                  <Button type="button" variant="secondary" className="rounded-l-none" onClick={handleCopyLink}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <DialogFooter>
                <Button onClick={closeResendDialog}>Done</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Cancel Dialog */}
      <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Invitation</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel the invitation to {selectedInvitation?.email}?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCancelDialogOpen(false)} disabled={actionInProgress}>
              No, Keep It
            </Button>
            <Button variant="destructive" onClick={confirmCancel} disabled={actionInProgress}>
              {actionInProgress ? "Cancelling..." : "Yes, Cancel It"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
