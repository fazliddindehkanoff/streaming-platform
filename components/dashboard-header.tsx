"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, Bell, Menu, LogOut } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useRouter } from "next/navigation"

interface DashboardHeaderProps {
  isAdmin: boolean
  userData: {
    id: string
    firstName: string
    username: string
  }
}

export function DashboardHeader({ isAdmin, userData }: DashboardHeaderProps) {
  const router = useRouter()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleLogout = () => {
    // In a real app, you would implement actual logout logic here
    console.log("Logging out...")
    router.push("/")
  }

  return (
    <header className="border-b border-zinc-800 bg-zinc-950 px-4 py-3 flex items-center justify-between">
      {isAdmin && (
        <div className="flex items-center md:hidden">
          <Button
            variant="ghost"
            size="icon"
            className="text-zinc-400 hover:text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </div>
      )}

      <div className={isAdmin ? "hidden md:flex md:w-72 lg:w-80" : "flex-1"}>
        {isAdmin ? (
          <div className="relative w-full">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-zinc-500" />
            <Input
              type="search"
              placeholder="Search..."
              className="w-full bg-zinc-900 border-zinc-800 pl-8 text-sm text-zinc-400 focus-visible:ring-zinc-700"
            />
          </div>
        ) : (
          <h1 className="text-xl font-bold">Streaming Platform</h1>
        )}
      </div>

      <div className="flex items-center gap-4">
        {isAdmin && (
          <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-white">
            <Bell className="h-5 w-5" />
            <span className="sr-only">Notifications</span>
          </Button>
        )}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder-user.jpg" alt={userData.firstName} />
                <AvatarFallback className="bg-zinc-800 text-zinc-400">{userData.firstName.charAt(0)}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{userData.firstName}</p>
                <p className="text-xs leading-none text-zinc-400">{userData.username}</p>
                <p className="text-xs leading-none text-zinc-400">ID: {userData.id}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}

