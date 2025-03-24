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
  const [vdoScriptLoaded, setVdoScriptLoaded] = useState(false)
  const playerRef = useRef<any>(null) // Store player instance

  // Initialize player when both script is loaded and container is available
  useEffect(() => {
    if (!vdoScriptLoaded || !containerRef.current) {
      return
    }

    const initializePlayer = async () => {
      try {
        setIsLoading(true)
        setError(null)

        console.log("Fetching OTP for video:", videoId)
        const response = await getVdoCipherOtp(videoId)

        if (!response.ok) {
          let errorMessage = `Failed to get video OTP: ${response.status} ${response.statusText}`
          try {
            const errorData = await response.json()
            console.error("API error details:", errorData)
            errorMessage = errorData.error || errorMessage
          } catch (e) {
            // If parsing fails, try to get text
            const text = await response.text()
            console.error("API error response:", text)
          }
          throw new Error(errorMessage)
        }

        const data = await response.json()
        console.log("OTP received successfully")

        if (!window.vdo || !window.vdo.Player) {
          throw new Error("VDOCipher player not loaded")
        }

        if (playerRef.current) {
          console.log("Cleaning up previous player instance")
          // Clean up if there was a previous player
          if (containerRef.current) {
            containerRef.current.innerHTML = ""
          }
          playerRef.current = null
        }

        console.log("Creating new player instance")
        // Create the player with the container ref that we know exists
        playerRef.current = new window.vdo.Player({
          container: containerRef.current,
          otp: data.otp,
          playbackInfo: data.playbackInfo,
          theme: "9ae8bbe8dd964ddc9bdb932cca1cb59a",
          autoplay: false,
        })

        console.log("Player initialized successfully")
      } catch (error) {
        console.error("Player initialization error:", error)
        setError(error instanceof Error ? error.message : "Unknown error initializing player")
      } finally {
        setIsLoading(false)
      }
    }

    initializePlayer()

    // Clean up on unmount or if deps change
    return () => {
      if (playerRef.current) {
        console.log("Cleaning up player on unmount")
        playerRef.current = null
        if (containerRef.current) {
          containerRef.current.innerHTML = ""
        }
      }
    }
  }, [videoId, vdoScriptLoaded])

  return (
    <div className="relative w-full h-full bg-black">
      {/* VDOCipher Script */}
      <Script
        src="https://player.vdocipher.com/playerAssets/1.6.10/vdo.js"
        onLoad={() => {
          console.log("VDOCipher script loaded")
          setVdoScriptLoaded(true)
        }}
        onError={() => {
          console.error("Failed to load VDOCipher script")
          setError("Failed to load video player script")
          setIsLoading(false)
        }}
        strategy="afterInteractive"
      />

      {/* Player container - always rendered */}
      <div ref={containerRef} className="w-full h-full" />
      
      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/70 z-10">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-zinc-700 border-t-white" />
        </div>
      )}
      
      {/* Error overlay */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/70 z-10">
          <div className="bg-red-900/20 text-red-400 border border-red-900/50 p-4 rounded-md max-w-md">
            <h3 className="font-medium mb-2">Video Playback Error</h3>
            <p className="text-sm">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-3 px-3 py-1 bg-red-900/30 hover:bg-red-900/50 rounded text-xs transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      <div className="absolute top-2 right-2 bg-black/50 px-2 py-1 rounded text-xs text-white z-20">
        VDOCipher
      </div>
    </div>
  )
}

// Add VDOCipher type definitions
declare global {
  interface Window {
    vdo: {
      Player: new (config: any) => any
    }
  }
}