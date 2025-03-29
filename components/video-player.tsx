"use client"

import { useState } from "react"
import KinescopePlayer from '@kinescope/react-kinescope-player';

interface VideoPlayerProps {
  videoId: string
}

export function VideoPlayer({ videoId }: VideoPlayerProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  return (
    <div className="relative w-full h-full bg-black">
      <KinescopePlayer
        videoId={videoId}
        options={{
          autoplay: false,
          muted: false,
          loop: false,
        }}
        onReady={() => setIsLoading(false)}
        onError={(error) => {
          console.error("Kinescope player error:", error)
          setError("Failed to load video content")
        }}
      />
      
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