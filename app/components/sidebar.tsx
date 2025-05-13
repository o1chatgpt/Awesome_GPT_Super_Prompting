"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  BarChart3,
  Clock,
  FileDown,
  FileText,
  Home,
  Settings,
  Share2,
  Users,
  Search,
  Globe,
  Shield,
  BrainCircuit,
  AlertCircle,
  LogIn,
} from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useEffect, useState } from "react"
import { NotificationsPopover } from "./notifications"
import { ThemeToggle } from "./theme-toggle"
import { useAuth } from "../providers/auth-provider"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface NavItem {
  title: string
  href: string
  icon: React.ElementType
  requiresAuth?: boolean
}

const mainNavItems: NavItem[] = [
  { title: "Home", href: "/", icon: Home },
  { title: "Dashboard", href: "/dashboard", icon: BarChart3, requiresAuth: true },
  { title: "Scheduled Tasks", href: "/scheduled", icon: Clock, requiresAuth: true },
  { title: "Results", href: "/results", icon: FileText, requiresAuth: true },
]

const secondaryNavItems: NavItem[] = [
  { title: "Export Data", href: "/export", icon: FileDown, requiresAuth: true },
  { title: "Team", href: "/team", icon: Users, requiresAuth: true },
  { title: "Shared", href: "/shared", icon: Share2, requiresAuth: true },
  { title: "Proxies", href: "/proxies", icon: Globe, requiresAuth: true },
  { title: "AI Tools", href: "/ai-tools", icon: BrainCircuit },
  { title: "Settings", href: "/settings", icon: Settings },
]

const adminNavItems: NavItem[] = [
  { title: "Admin Dashboard", href: "/admin", icon: Shield },
  { title: "User Management", href: "/admin/users", icon: Users },
  { title: "Memory Management", href: "/admin/memories", icon: BarChart3 },
  { title: "AI Settings", href: "/admin/ai-settings", icon: BrainCircuit },
  { title: "Templates", href: "/admin/templates", icon: FileText },
]

export function AppSidebar() {
  const pathname = usePathname()
  const { profile, isLoading, isGuest, authError, enableGuestMode, disableGuestMode } = useAuth()
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    // Check if user is admin
    setIsAdmin(profile?.role === "admin")
  }, [profile])

  // Filter nav items based on authentication status
  const filteredMainNavItems = mainNavItems.filter((item) => !item.requiresAuth || !isGuest)
  const filteredSecondaryNavItems = secondaryNavItems.filter((item) => !item.requiresAuth || !isGuest)

  return (
    <div className="border-r bg-background h-screen w-64 fixed left-0 top-0 z-40">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="border-b p-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="rounded-md bg-primary p-1">
              <Search className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-semibold">Web Scraper</span>
          </Link>
        </div>

        {/* Guest Mode Banner */}
        {isGuest && (
          <div className="bg-yellow-100 dark:bg-yellow-900 p-2 text-xs text-yellow-800 dark:text-yellow-200 flex items-center justify-between">
            <div className="flex items-center">
              <AlertCircle className="h-3 w-3 mr-1" />
              <span>Guest Mode</span>
            </div>
            <Button variant="ghost" size="sm" className="h-6 text-xs" onClick={disableGuestMode}>
              Sign In
            </Button>
          </div>
        )}

        {/* Auth Error Banner */}
        {authError && !isGuest && (
          <div className="bg-red-100 dark:bg-red-900 p-2 text-xs text-red-800 dark:text-red-200 flex items-center justify-between">
            <div className="flex items-center">
              <AlertCircle className="h-3 w-3 mr-1" />
              <span>Auth Error</span>
            </div>
            <Button variant="ghost" size="sm" className="h-6 text-xs" onClick={enableGuestMode}>
              Use as Guest
            </Button>
          </div>
        )}

        {/* Navigation */}
        <div className="flex-1 overflow-auto py-2">
          <div className="px-3 py-2">
            <h3 className="mb-2 px-4 text-xs font-semibold text-muted-foreground">Navigation</h3>
            <nav className="space-y-1">
              {filteredMainNavItems.map((item) => (
                <TooltipProvider key={item.href}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link
                        href={item.href}
                        className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium ${
                          pathname === item.href
                            ? "bg-primary text-primary-foreground"
                            : "text-muted-foreground hover:bg-muted"
                        }`}
                      >
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    </TooltipTrigger>
                    {item.requiresAuth && isGuest && (
                      <TooltipContent>
                        <p>Sign in to access this feature</p>
                      </TooltipContent>
                    )}
                  </Tooltip>
                </TooltipProvider>
              ))}
            </nav>
          </div>

          <div className="px-3 py-2">
            <h3 className="mb-2 px-4 text-xs font-semibold text-muted-foreground">Tools</h3>
            <nav className="space-y-1">
              {filteredSecondaryNavItems.map((item) => (
                <TooltipProvider key={item.href}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link
                        href={item.href}
                        className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium ${
                          pathname === item.href
                            ? "bg-primary text-primary-foreground"
                            : "text-muted-foreground hover:bg-muted"
                        }`}
                      >
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    </TooltipTrigger>
                    {item.requiresAuth && isGuest && (
                      <TooltipContent>
                        <p>Sign in to access this feature</p>
                      </TooltipContent>
                    )}
                  </Tooltip>
                </TooltipProvider>
              ))}
            </nav>
          </div>

          {isAdmin && (
            <div className="px-3 py-2">
              <h3 className="mb-2 px-4 text-xs font-semibold text-muted-foreground">Admin</h3>
              <nav className="space-y-1">
                {adminNavItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium ${
                      pathname === item.href || pathname.startsWith(`${item.href}/`)
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </Link>
                ))}
              </nav>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={profile?.avatar_url || "/placeholder.svg"} />
                <AvatarFallback>{isGuest ? "G" : profile?.full_name?.charAt(0) || "U"}</AvatarFallback>
              </Avatar>
              <div className="text-sm">
                <p className="font-medium">
                  {isLoading ? "Loading..." : profile?.full_name || "Guest"}
                  {isGuest && <span className="ml-1 text-xs text-yellow-600 dark:text-yellow-400">(Guest)</span>}
                </p>
                <p className="text-xs text-muted-foreground">{profile?.email || ""}</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <ThemeToggle />
              {!isGuest && <NotificationsPopover />}
              {isGuest && (
                <Button variant="ghost" size="icon" onClick={disableGuestMode} className="h-8 w-8" title="Sign In">
                  <LogIn className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function SidebarLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <AppSidebar />
      <div className="flex-1 ml-64">
        <div className="container py-6 px-4">{children}</div>
      </div>
    </div>
  )
}
