"use client"

import { useState } from "react"
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
import { toast } from "@/components/ui/use-toast"
import { updateUser } from "@/lib/actions/user-management"
import { Edit } from "lucide-react"

interface EditUserDialogProps {
  user: any
  onUserUpdated?: (updatedUser: any) => void
}

export function EditUserDialog({ user, onUserUpdated }: EditUserDialogProps) {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    fullName: user.full_name || "",
    username: user.username || "",
    avatarUrl: user.avatar_url || "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when field is edited
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.fullName) {
      newErrors.fullName = "Full name is required"
    }

    // Username is optional, but if provided, should be at least 3 characters
    if (formData.username && formData.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters"
    }

    // Avatar URL is optional, but if provided, should be a valid URL
    if (formData.avatarUrl && !isValidUrl(formData.avatarUrl)) {
      newErrors.avatarUrl = "Please enter a valid URL"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const isValidUrl = (url: string) => {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }

  const handleSubmit = async () => {
    if (!validateForm()) return

    setIsLoading(true)

    try {
      const result = await updateUser(user.id, {
        fullName: formData.fullName,
        username: formData.username,
        avatarUrl: formData.avatarUrl,
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
          description: "User updated successfully",
        })
        setOpen(false)

        if (onUserUpdated) {
          onUserUpdated({
            full_name: formData.fullName,
            username: formData.username,
            avatar_url: formData.avatarUrl,
          })
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Edit className="h-4 w-4 mr-2" />
          Edit Profile
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit User Profile</DialogTitle>
          <DialogDescription>Update user profile information. Email cannot be changed.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={user.email} disabled className="bg-muted" />
            <p className="text-xs text-muted-foreground">Email cannot be changed</p>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              value={formData.fullName}
              onChange={(e) => handleChange("fullName", e.target.value)}
              placeholder="John Doe"
              className={errors.fullName ? "border-red-500" : ""}
            />
            {errors.fullName && <p className="text-sm text-red-500">{errors.fullName}</p>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="username">Username (Optional)</Label>
            <Input
              id="username"
              value={formData.username}
              onChange={(e) => handleChange("username", e.target.value)}
              placeholder="johndoe"
              className={errors.username ? "border-red-500" : ""}
            />
            {errors.username && <p className="text-sm text-red-500">{errors.username}</p>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="avatarUrl">Avatar URL (Optional)</Label>
            <Input
              id="avatarUrl"
              value={formData.avatarUrl}
              onChange={(e) => handleChange("avatarUrl", e.target.value)}
              placeholder="https://example.com/avatar.jpg"
              className={errors.avatarUrl ? "border-red-500" : ""}
            />
            {errors.avatarUrl && <p className="text-sm text-red-500">{errors.avatarUrl}</p>}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
