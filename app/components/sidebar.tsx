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
} from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getUserProfile } from "@/lib/actions/auth"
import { useEffect, useState } from "react"
import { NotificationsPopover } from "./notifications"
import { ThemeToggle } from "./theme-toggle"

interface NavItem {
  title: string
  href: string
  icon: React.ElementType
}

const mainNavItems: NavItem[] = [
  { title: "Home", href: "/", icon: Home },
  { title: "Dashboard", href: "/dashboard", icon: BarChart3 },
  { title: "Scheduled Tasks", href: "/scheduled", icon: Clock },
  { title: "Results", href: "/results", icon: FileText },
]

const secondaryNavItems: NavItem[] = [
  { title: "Export Data", href: "/export", icon: FileDown },
  { title: "Team", href: "/team", icon: Users },
  { title: "Shared", href: "/shared", icon: Share2 },
  { title: "Proxies", href: "/proxies", icon: Globe },
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
  const [user, setUser] = useState<any>(null)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    const fetchUser = async () => {
      const profile = await getUserProfile()
      setUser(profile)
      // Check if user is admin
      setIsAdmin(profile?.role === "admin")
    }
    fetchUser()
  }, [])

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

        {/* Navigation */}
        <div className="flex-1 overflow-auto py-2">
          <div className="px-3 py-2">
            <h3 className="mb-2 px-4 text-xs font-semibold text-muted-foreground">Navigation</h3>
            <nav className="space-y-1">
              {mainNavItems.map((item) => (
                <Link
                  key={item.href}
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
              ))}
            </nav>
          </div>

          <div className="px-3 py-2">
            <h3 className="mb-2 px-4 text-xs font-semibold text-muted-foreground">Tools</h3>
            <nav className="space-y-1">
              {secondaryNavItems.map((item) => (
                <Link
                  key={item.href}
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
                <AvatarImage src={user?.avatar_url || "/placeholder.svg"} />
                <AvatarFallback>{user?.full_name?.charAt(0) || "U"}</AvatarFallback>
              </Avatar>
              <div className="text-sm">
                <p className="font-medium">{user?.full_name || "User"}</p>
                <p className="text-xs text-muted-foreground">{user?.email || ""}</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <ThemeToggle />
              <NotificationsPopover />
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
