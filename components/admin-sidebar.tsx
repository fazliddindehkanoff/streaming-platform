"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Frame, Video, Users, Settings, LogOut } from "lucide-react"
import { useRouter } from "next/navigation"

export function AdminSidebar() {
  const router = useRouter()
  const [collapsed, setCollapsed] = useState(false)
  const [activeTab, setActiveTab] = useState("videos")

  const handleLogout = () => {
    // In a real app, you would implement actual logout logic here
    console.log("Logging out...")
    router.push("/")
  }

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
          {!collapsed && <span className="font-bold text-white">Admin Panel</span>}
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
        <NavItem
          icon={Video}
          label="Videos"
          collapsed={collapsed}
          active={activeTab === "videos"}
          onClick={() => setActiveTab("videos")}
        />
        <NavItem
          icon={Users}
          label="Allowed Users"
          collapsed={collapsed}
          active={activeTab === "users"}
          onClick={() => setActiveTab("users")}
        />
      </nav>

      <div className="p-2 border-t border-zinc-800">
        <NavItem
          icon={Settings}
          label="Settings"
          collapsed={collapsed}
          onClick={() => setActiveTab("settings")}
          active={activeTab === "settings"}
        />
        <NavItem icon={LogOut} label="Logout" collapsed={collapsed} onClick={handleLogout} active={false} />
      </div>
    </div>
  )
}

interface NavItemProps {
  icon: React.ElementType
  label: string
  collapsed: boolean
  active?: boolean
  onClick: () => void
}

function NavItem({ icon: Icon, label, collapsed, active = false, onClick }: NavItemProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-3 px-3 py-2 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors",
        collapsed && "justify-center px-2",
        active && "bg-zinc-900 text-white",
      )}
    >
      <Icon className="h-5 w-5" />
      {!collapsed && <span>{label}</span>}
    </button>
  )
}

