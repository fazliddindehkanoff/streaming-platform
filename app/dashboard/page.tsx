"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard-header"
import { AdminSidebar } from "@/components/admin-sidebar"
import { UserDashboard } from "@/components/user-dashboard"
import { AdminDashboard } from "@/components/admin-dashboard"
import { Button } from "@/components/ui/button"
import { Eye, EyeOff } from "lucide-react"

export default function DashboardPage() {
  const router = useRouter()
  const [userData, setUserData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [previewAsUser, setPreviewAsUser] = useState(false)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/session")
        const data = await response.json()

        if (data.authenticated) {
          setUserData(data.user)
        } else {
          // Redirect to login if not authenticated
          router.push("/")
        }
      } catch (error) {
        console.error("Auth check failed:", error)
        router.push("/")
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [router])

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-black">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-zinc-700 border-t-white" />
      </div>
    )
  }

  // If no user data, redirect to login
  if (!userData) {
    router.push("/")
    return null
  }

  const isAdmin = userData.isAdmin
  const showAdminView = isAdmin && !previewAsUser

  // Toggle preview function
  const togglePreview = () => {
    setPreviewAsUser(!previewAsUser)
  }

  return (
    <div className="flex h-screen bg-black text-white">
      {showAdminView && <AdminSidebar />}

      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader isAdmin={showAdminView} userData={userData} />

        {isAdmin && (
          <div className="fixed bottom-4 right-4 z-50">
            <Button
              onClick={togglePreview}
              className="bg-zinc-800 hover:bg-zinc-700 flex items-center gap-2"
              data-preview-toggle="true"
            >
              {previewAsUser ? (
                <>
                  <EyeOff className="h-4 w-4" />
                  <span>Exit User Preview</span>
                </>
              ) : (
                <>
                  <Eye className="h-4 w-4" />
                  <span>Preview as User</span>
                </>
              )}
            </Button>
          </div>
        )}

        {showAdminView ? <AdminDashboard /> : <UserDashboard />}
      </div>
    </div>
  )
}

