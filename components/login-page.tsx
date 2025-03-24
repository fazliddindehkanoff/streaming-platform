"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Script from "next/script"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { BellIcon as BrandTelegram } from "lucide-react"

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

  useEffect(() => {
    // Fix: Use environment variable properly
    if (process.env.NEXT_PUBLIC_TELEGRAM_BOT_NAME) {
      setBotName(process.env.NEXT_PUBLIC_TELEGRAM_BOT_NAME)
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
        setError("Your account is not allowed to access this platform. Please contact the administrator.")
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
            {botName ? (
              <div id="telegram-login-container">
                <Script
                  src="https://telegram.org/js/telegram-widget.js?22"
                  onLoad={() => {
                    const nonce = Math.random().toString(36).substring(2, 15)
                    const script = document.createElement("script")
                    script.async = true
                    script.src = `https://telegram.org/js/telegram-widget.js?22#${nonce}`
                    script.setAttribute("data-telegram-login", botName)
                    script.setAttribute("data-auth-url", "/api/auth/telegram")
                    script.setAttribute("data-request-access", "write")
                    const container = document.getElementById("telegram-login-container")
                    container?.replaceChildren(script)
                  }}
                  strategy="afterInteractive"
                />
              </div>
            ) : (
              <div className="text-red-400 text-center">
                <p>Telegram bot name not configured</p>
                <p className="text-xs mt-1">Please set the TELEGRAM_BOT_NAME environment variable.</p>
              </div>
            )}
          </div>

          {/* Fallback button in case the widget doesn't load */}
          <Button
            variant="outline"
            className="bg-zinc-800 border-zinc-700 hover:bg-zinc-700 text-white"
            onClick={() => window.location.reload()}
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-zinc-400 border-t-zinc-100" />
                Connecting...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <BrandTelegram className="h-5 w-5 text-[#0088cc]" />
                Reload Telegram Login
              </span>
            )}
          </Button>
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

