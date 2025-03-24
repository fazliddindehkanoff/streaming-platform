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
  const [isPlayerInitialized, setIsPlayerInitialized] = useState(false)

  // Always render the container element regardless of loading state
  useEffect(() => {
    console.log("Component mounted, container ref:", containerRef.current ? "available" : "not available")
    
    // This effect runs once after initial render to confirm the ref is available
    return () => {
      console.log("Component unmounting")
    }
  }, [])

  // Handle script loading separately
  useEffect(() => {
    if (vdoScriptLoaded) {
      console.log("VDO script is loaded and ready")
    }
  }, [vdoScriptLoaded])

  // Handle player initialization when both conditions are met
  useEffect(() => {
    // Skip if either condition isn't met
    if (!vdoScriptLoaded) {
      console.log("Waiting for VDO script to load...")
      return
    }
    
    if (!containerRef.current) {
      console.log("Container ref is not available yet")
      return
    }

    // Skip if player is already initialized for this video
    if (isPlayerInitialized) {
      return
    }

    console.log("Both script loaded and container available, initializing player...")
    
    const initializePlayer = async () => {
      setIsLoading(true)
      setError(null)
      
      try {
        // if (!window.vdo || !window.vdo.Player) {
        //   throw new Error("VDOCipher API not available")
        // }

        // Log container details for debugging
        const container = containerRef.current
        // console.log("Container dimensions:", {
        //   width: container.clientWidth,
        //   height: container.clientHeight,
        //   offsetWidth: container.offsetWidth,
        //   offsetHeight: container.offsetHeight
        // })

        // Get OTP for video
        console.log("Fetching OTP for video:", videoId)
        const response = await getVdoCipherOtp(videoId)

        if (!response.ok) {
          throw new Error(`Failed to get video OTP: ${response.status}`)
        }

        const { otp, playbackInfo } = await response.json()
        
        // Initialize player with the container that we confirmed exists
        console.log("Creating player instance...")
        new window.vdo.Player({
          container: containerRef.current,
          otp,
          playbackInfo,
          theme: "9ae8bbe8dd964ddc9bdb932cca1cb59a",
          autoplay: false,
        })
        
        console.log("Player initialized successfully")
        setIsPlayerInitialized(true)
      } catch (error) {
        console.error("Error initializing player:", error)
        setError(`Failed to initialize player: ${error instanceof Error ? error.message : "Unknown error"}`)
      } finally {
        setIsLoading(false)
      }
    }

    initializePlayer()
    
    // Cleanup function will run when component unmounts or dependencies change
    return () => {
      console.log("Cleaning up player...")
      if (containerRef.current) {
        containerRef.current.innerHTML = ""
      }
      setIsPlayerInitialized(false)
    }
  }, [videoId, vdoScriptLoaded, isPlayerInitialized])

  return (
    <div className="relative w-full h-full bg-black">
      {/* VDOCipher Script */}
      <Script
        src="https://player.vdocipher.com/playerAssets/1.6.10/vdo.js"
        onLoad={() => {
          console.log("VDOCipher script loaded successfully")
          setVdoScriptLoaded(true)
        }}
        onError={() => {
          console.error("Failed to load VDOCipher script")
          setError("Failed to load video player script")
          setIsLoading(false)
        }}
        strategy="afterInteractive"
      />

      {/* Always render the container div */}
      <div ref={containerRef} className="w-full h-full" />
      
      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-zinc-700 border-t-white" />
        </div>
      )}
      
      {/* Error overlay */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80">
          <div className="bg-red-900/20 text-red-400 border border-red-900/50 p-4 rounded-md max-w-md text-center">
            <p>{error}</p>
          </div>
        </div>
      )}

      <div className="absolute top-2 right-2 bg-black/50 px-2 py-1 rounded text-xs text-white">VDOCipher</div>
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