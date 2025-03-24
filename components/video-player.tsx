"use client"

import { useEffect, useRef, useState } from "react"
import { getVdoCipherOtp } from "@/lib/vdocipher"
import Script from "next/script"

interface VideoPlayerProps {
  videoId: string
  url: string
}

export function VideoPlayer({ videoId, url }: VideoPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [scriptLoaded, setScriptLoaded] = useState(false)

  // Load player script dynamically
  useEffect(() => {
    if (typeof window === "undefined") return

    if ((window as any).vdo?.Player) {
      setScriptLoaded(true)
      return
    }

    const script = document.createElement("script")
    script.src = "https://player.vdocipher.com/playerAssets/1.6.10/vdo.js"
    script.async = true
    script.onload = () => {
      console.log("VDOCipher script loaded successfully")
      // No longer need setScriptLoaded
    }
    script.onerror = () => {
      console.error("Failed to load VDOCipher script")
      setError("Failed to load video player resources")
    }
    document.body.appendChild(script)

    return () => {
      document.body.removeChild(script)
    }
  }, [])

  // Initialize player when ready
  useEffect(() => {
    const initializePlayer = async () => {
      setIsLoading(true)
      try {
        // Add safety check for Player constructor
        if (!window.VdoPlayer) {
          throw new Error("VDOCipher player script not fully loaded")
        }

        const response = await getVdoCipherOtp(videoId)
        if (!response.ok) throw new Error("Failed to get OTP")
        
        const { otp, playbackInfo } = await response.json()

        // Use the correct constructor name
        new window.VdoPlayer({
          container: containerRef.current,
          otp,
          playbackInfo,
          theme: "9ae8bbe8dd964ddc9bdb932cca1cb59a",
          autoplay: false,
        })

      } catch (err) {
        console.error("Player initialization failed:", err)
        setError(err instanceof Error ? err.message : "Unknown error")
      } finally {
        setIsLoading(false)
      }
    }

    // Modified initialization trigger
    if (typeof window !== "undefined" && window.VdoPlayer) {
      initializePlayer()
    } else {
      const checkInterval = setInterval(() => {
        if (window.VdoPlayer) {
          clearInterval(checkInterval)
          initializePlayer()
        }
      }, 100)
    }
  }, [scriptLoaded, videoId])

  return (
    <div className="relative w-full h-full bg-black">
      <div ref={containerRef} className="w-full h-full" />
      
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-zinc-700 border-t-white" />
        </div>
      )}
      
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80">
          <div className="bg-red-900/20 text-red-400 border border-red-900/50 p-4 rounded-md max-w-md text-center">
            <p>{error}</p>
          </div>
        </div>
      )}
    </div>
  )
}

declare global {
  interface Window {
    vdo: {
      Player: new (config: any) => any
    }
  }
}