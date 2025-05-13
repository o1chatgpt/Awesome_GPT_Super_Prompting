"use client"

import { useAuth } from "@/app/providers/auth-provider"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LogOut, User, Settings, HelpCircle } from "lucide-react"
import Link from "next/link"
import { FcGoogle } from "react-icons/fc"
import { FaGithub, FaTwitter, FaMicrosoft } from "react-icons/fa"

export function UserMenu() {
  const { user, profile, isGuest, signOut } = useAuth()

  // Get initials for avatar fallback
  const getInitials = () => {
    if (isGuest) return "G"
    if (!profile?.full_name) return "U"

    return profile.full_name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  // Get avatar image based on auth provider
  const getAvatarImage = () => {
    if (isGuest) return null

    // For GitHub users, we can use their avatar
    if (profile?.auth_provider === "github" && user?.user_metadata?.avatar_url) {
      return user.user_metadata.avatar_url
    }

    // For Google users, we can use their avatar
    if (profile?.auth_provider === "google" && user?.user_metadata?.avatar_url) {
      return user.user_metadata.avatar_url
    }

    return null
  }

  // Get provider icon
  const getProviderIcon = () => {
    if (isGuest) return null

    switch (profile?.auth_provider) {
      case "google":
        return <FcGoogle className="h-4 w-4 mr-2" />
      case "github":
        return <FaGithub className="h-4 w-4 mr-2" />
      case "twitter":
        return <FaTwitter className="h-4 w-4 mr-2 text-blue-400" />
      case "azure":
        return <FaMicrosoft className="h-4 w-4 mr-2 text-blue-500" />
      default:
        return null
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={getAvatarImage() || ""} alt={profile?.full_name || "User"} />
            <AvatarFallback>{getInitials()}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{profile?.full_name || "Guest User"}</p>
            <p className="text-xs leading-none text-muted-foreground">{profile?.email || "guest@example.com"}</p>
            {profile?.auth_provider && !isGuest && (
              <div className="flex items-center text-xs text-muted-foreground mt-1">
                {getProviderIcon()}
                <span className="capitalize">{profile.auth_provider}</span>
              </div>
            )}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href="/profile">
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/settings">
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/help">
              <HelpCircle className="mr-2 h-4 w-4" />
              <span>Help</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => signOut()}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>{isGuest ? "Exit Guest Mode" : "Sign out"}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
