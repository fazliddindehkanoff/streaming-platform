"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import LoginPage from "@/components/login-page"

export default function Home() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/session")
        const data = await response.json()

        if (data.authenticated) {
          setIsAuthenticated(true)
          router.push("/dashboard")
        } else {
          setIsAuthenticated(false)
        }
      } catch (error) {
        console.error("Auth check failed:", error)
        setIsAuthenticated(false)
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

  // If not authenticated, show login page
  if (!isAuthenticated) {
    return <LoginPage />
  }

  // This should not be rendered as the router.push above will navigate away
  return null
}

