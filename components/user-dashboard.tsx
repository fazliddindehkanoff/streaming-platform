"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { VideoPlayer } from "@/components/video-player"
import { LogOut } from "lucide-react"
import { useRouter } from "next/navigation"

export function UserDashboard() {
  const router = useRouter()
  const [videos, setVideos] = useState([])
  const [selectedVideo, setSelectedVideo] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isPreviewMode, setIsPreviewMode] = useState(false)

  // Fetch videos from the API
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await fetch("/api/videos")

        if (!response.ok) {
          throw new Error("Failed to fetch videos")
        }

        const data = await response.json()
        setVideos(data)

        if (data.length > 0) {
          setSelectedVideo(data[0])
        }
      } catch (error) {
        console.error("Error fetching videos:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchVideos()
  }, [])

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/session", { method: "DELETE" })
      router.push("/")
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  useEffect(() => {
    // Check if we're in preview mode
    const previewToggle = document.querySelector('[data-preview-toggle="true"]')
    if (previewToggle) {
      setIsPreviewMode(true)
    } else {
      setIsPreviewMode(false)
    }
  }, [])

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-zinc-700 border-t-white" />
      </div>
    )
  }

  if (videos.length === 0) {
    return (
      <main className="flex-1 overflow-y-auto bg-zinc-950">
        <div className="container mx-auto p-6 max-w-6xl">
          <div className="flex flex-col items-center justify-center h-[50vh]">
            <h2 className="text-xl font-semibold mb-4">No videos available</h2>
            <p className="text-zinc-400">Check back later for new content.</p>
          </div>

          <div className="mt-auto pt-8 border-t border-zinc-800 flex justify-center">
            <Button variant="outline" className="bg-zinc-900 border-zinc-800 hover:bg-zinc-800" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" /> Logout
            </Button>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="flex-1 overflow-y-auto bg-zinc-950">
      {/* Preview mode indicator - only visible when admin is previewing */}
      <div
        className={`bg-yellow-900/20 text-yellow-400 border border-yellow-900/50 p-2 mx-6 mt-6 rounded-md ${!isPreviewMode ? "hidden" : ""}`}
        id="preview-indicator"
      >
        <p className="text-sm font-medium text-center">
          You are currently previewing the site as a regular user. The actual users won't see this message.
        </p>
      </div>

      <div className="container mx-auto p-6 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-2">Now Playing</h1>
          <div className="aspect-video bg-zinc-900 rounded-lg overflow-hidden">
            <VideoPlayer videoId={selectedVideo?.videoId} />
          </div>
          <div className="mt-4">
            <h2 className="text-xl font-semibold">{selectedVideo?.title}</h2>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Available Videos</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {videos.map((video) => (
              <div
                key={video.videoId}
                className={`cursor-pointer rounded-lg overflow-hidden border ${
                  selectedVideo?.videoId === video.videoId ? "border-white" : "border-zinc-800"
                }`}
                onClick={() => setSelectedVideo(video)}
              >
                <div className="aspect-video bg-zinc-900 relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="h-12 w-12 rounded-full bg-black/50 flex items-center justify-center">
                      <div className="w-0 h-0 border-t-8 border-t-transparent border-l-12 border-l-white border-b-8 border-b-transparent ml-1" />
                    </div>
                  </div>
                </div>
                <div className="p-3">
                  <h3 className="font-medium">{video.title}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-auto pt-8 border-t border-zinc-800 flex justify-center">
          <Button variant="outline" className="bg-zinc-900 border-zinc-800 hover:bg-zinc-800" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" /> Logout
          </Button>
        </div>
      </div>
    </main>
  )
}

