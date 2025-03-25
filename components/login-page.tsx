"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Script from "next/script"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

// Define the window interface for Telegram Login Widget
declare global {
  interface Window {
    onTelegramAuth: (user: any) => void
  }
}

export default function LoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [scriptLoaded, setScriptLoaded] = useState(false)
  const [botName, setBotName] = useState<string | null>(null)
  const [appUrl, setAppUrl] = useState<string | null>(null)

  useEffect(() => {
    // Set bot name and app URL from environment variables
    if (process.env.NEXT_PUBLIC_TELEGRAM_BOT_NAME) {
      setBotName(process.env.NEXT_PUBLIC_TELEGRAM_BOT_NAME)
    }
    if (process.env.NEXT_PUBLIC_APP_URL) {
      setAppUrl(process.env.NEXT_PUBLIC_APP_URL)
    }

    // Define the callback function for Telegram Login Widget
    window.onTelegramAuth = (user) => {
      handleTelegramLogin(user)
    }

    // Check for error in URL
    const urlParams = new URLSearchParams(window.location.search)
    const errorParam = urlParams.get("error")
    if (errorParam) {
      if (errorParam === "invalid_auth") {
        setError("Invalid authentication data from Telegram")
      } else if (errorParam === "not_allowed") {
        setError("Sizning accountingizga ruxsat berilmagan, iltimos admin bilan bog'laning.")
      } else {
        setError("Authentication failed. Please try again.")
      }
    }
  }, [])

  const handleTelegramLogin = async (telegramUser: any) => {
    setIsLoading(true)
    setError(null)

    try {
      console.log("Telegram user data:", telegramUser)

      const response = await fetch("/api/auth/telegram", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(telegramUser),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Authentication failed")
      }

      // Redirect to dashboard on successful login
      router.push("/dashboard")
    } catch (error) {
      console.error("Login failed:", error)
      setError(error instanceof Error ? error.message : "Authentication failed")
      setIsLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <Card className="w-full max-w-md bg-zinc-900 border-zinc-800">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-white">Welcome</CardTitle>
          <CardDescription className="text-zinc-400">
            Sign in with Telegram to access exclusive streaming content
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          {error && (
            <div className="bg-red-900/20 text-red-400 border border-red-900/50 p-3 rounded-md">
              <p className="text-sm">{error}</p>
            </div>
          )}

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-zinc-700" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-zinc-900 px-2 text-zinc-400">Continue with</span>
            </div>
          </div>

          {/* Telegram Login Widget */}
          <div className="flex justify-center">
            {botName && appUrl ? (
              <div id="telegram-login-container">
                <Script
                  src="https://telegram.org/js/telegram-widget.js?22"
                  async={true}
                  data-telegram-login={botName}
                  data-size="large"
                  data-onauth={`onTelegramAuth(user)`}
                  data-request-access="write"
                  strategy="afterInteractive"
                />
              </div>
            ) : (
              <div className="text-red-400 text-center">
                <p>Telegram bot name or app URL not configured.</p>
                <p className="text-xs mt-1">Please set the NEXT_PUBLIC_TELEGRAM_BOT_NAME and NEXT_PUBLIC_APP_URL environment variables.</p>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col">
          <p className="mt-2 text-xs text-center text-zinc-400">
            By continuing, you agree to our Terms of Service and Privacy Policy.
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}