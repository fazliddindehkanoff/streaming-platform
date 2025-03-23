"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Frame, Home, Play, Clock, Bookmark, Settings, LogOut } from "lucide-react"

export function DashboardSidebar() {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div
      className={cn(
        "h-screen bg-zinc-950 border-r border-zinc-800 flex flex-col transition-all duration-300",
        collapsed ? "w-16" : "w-64",
      )}
    >
      <div className="p-4 flex items-center justify-between border-b border-zinc-800">
        <Link href="/dashboard" className={cn("flex items-center gap-2", collapsed && "justify-center")}>
          <Frame className="h-6 w-6 text-white" />
          {!collapsed && <span className="font-bold text-white">StreamApp</span>}
        </Link>
        <Button
          variant="ghost"
          size="sm"
          className="text-zinc-400 hover:text-white"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? ">" : "<"}
        </Button>
      </div>

      <nav className="flex-1 p-2 space-y-1">
        <NavItem href="/dashboard" icon={Home} label="Home" collapsed={collapsed} />
        <NavItem href="/dashboard/live" icon={Play} label="Live Now" collapsed={collapsed} />
        <NavItem href="/dashboard/upcoming" icon={Clock} label="Upcoming" collapsed={collapsed} />
        <NavItem href="/dashboard/saved" icon={Bookmark} label="Saved" collapsed={collapsed} />
      </nav>

      <div className="p-2 border-t border-zinc-800">
        <NavItem href="/settings" icon={Settings} label="Settings" collapsed={collapsed} />
        <NavItem href="/logout" icon={LogOut} label="Logout" collapsed={collapsed} />
      </div>
    </div>
  )
}

interface NavItemProps {
  href: string
  icon: React.ElementType
  label: string
  collapsed: boolean
}

function NavItem({ href, icon: Icon, label, collapsed }: NavItemProps) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 px-3 py-2 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors",
        collapsed && "justify-center px-2",
      )}
    >
      <Icon className="h-5 w-5" />
      {!collapsed && <span>{label}</span>}
    </Link>
  )
}

