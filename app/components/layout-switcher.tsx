"use client"

import { useState } from "react"
import { Check, Columns, LayoutDashboard, LayoutGrid, List, Maximize, PanelTop, Rows } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { updateUserPreferences } from "@/lib/actions/user-preferences"
import { toast } from "@/components/ui/use-toast"

interface LayoutSwitcherProps {
  userId: string
  currentLayout: string
  onLayoutChange: (layout: string) => void
}

export function LayoutSwitcher({ userId, currentLayout, onLayoutChange }: LayoutSwitcherProps) {
  const [saving, setSaving] = useState(false)

  const layouts = [
    { id: "grid", name: "Grid", icon: LayoutGrid },
    { id: "list", name: "List", icon: List },
    { id: "compact", name: "Compact", icon: Rows },
    { id: "masonry", name: "Masonry", icon: Columns },
    { id: "minimal", name: "Minimal", icon: PanelTop },
    { id: "detailed", name: "Detailed", icon: LayoutDashboard },
    { id: "focus", name: "Focus", icon: Maximize },
  ]

  const handleLayoutChange = async (layoutId: string) => {
    onLayoutChange(layoutId)
    setSaving(true)

    try {
      await updateUserPreferences(userId, { dashboardLayout: layoutId })
      toast({
        title: "Layout updated",
        description: `Dashboard layout changed to ${layoutId}`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save layout preference",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 gap-1" disabled={saving}>
          {saving ? (
            "Saving..."
          ) : (
            <>
              {layouts.find((l) => l.id === currentLayout)?.name || "Change Layout"}
              <span className="sr-only">Change layout</span>
            </>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Dashboard Layout</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {layouts.map((layout) => (
          <DropdownMenuItem
            key={layout.id}
            className="flex items-center gap-2"
            onClick={() => handleLayoutChange(layout.id)}
          >
            <layout.icon className="h-4 w-4" />
            <span>{layout.name}</span>
            {currentLayout === layout.id && <Check className="h-4 w-4 ml-auto" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
