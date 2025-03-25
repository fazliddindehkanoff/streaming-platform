"use client"

import { signIn } from "next-auth/react"
import { Button } from "./ui/button"

export default function LoginPage() {
  const handleTelegramLogin = async () => {
    await signIn("telegram", {
      callbackUrl: "/dashboard",
      redirect: true,
    })
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <div className="w-full max-w-md p-6 bg-zinc-900 rounded-lg border border-zinc-800">
        <h1 className="text-2xl font-bold text-white mb-4">Welcome</h1>
        <Button 
          onClick={handleTelegramLogin}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
        >
          Continue with Telegram
        </Button>
      </div>
    </div>
  )
}