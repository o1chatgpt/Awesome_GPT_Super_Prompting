"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { User, Settings, LogOut, RefreshCw } from "lucide-react"
import { useRouter } from "next/navigation"
import { useAuth } from "../providers/auth-provider"
import { Button } from "@/components/ui/button"

export function UserMenu() {
  const { user, profile, isLoading, signOut, refreshSession } = useAuth()
  const router = useRouter()

  // Show initials if no name is available
  const getInitials = () => {
    if (!profile) return "U"
    if (profile.full_name) return profile.full_name.charAt(0).toUpperCase()
    if (profile.email) return profile.email.charAt(0).toUpperCase()
    return "U"
  }

  if (isLoading) {
    return (
      <Avatar className="h-8 w-8">
        <AvatarFallback className="animate-pulse">...</AvatarFallback>
      </Avatar>
    )
  }

  if (!user) {
    return (
      <Button variant="outline" size="sm" onClick={() => router.push("/auth/sign-in")}>
        Sign In
      </Button>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="h-8 w-8 cursor-pointer">
          <AvatarImage src={profile?.avatar_url || "/placeholder.svg"} />
          <AvatarFallback>{getInitials()}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{profile?.full_name || "User"}</p>
            <p className="text-xs leading-none text-muted-foreground">{profile?.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => router.push("/profile")}>
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push("/settings")}>
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => refreshSession()}>
            <RefreshCw className="mr-2 h-4 w-4" />
            <span>Refresh Session</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => signOut()}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
