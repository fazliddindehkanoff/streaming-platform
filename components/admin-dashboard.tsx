"use client"

import { useState, useEffect } from "react"
import { VideoManagement } from "@/components/video-management"
import { UserManagement } from "@/components/user-management"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("videos")
  const [videos, setVideos] = useState([])
  const [users, setUsers] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch data when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        setError(null)

        // Fetch videos
        const videosResponse = await fetch("/api/videos")
        if (!videosResponse.ok) {
          throw new Error(`Failed to fetch videos: ${videosResponse.statusText}`)
        }
        const videosData = await videosResponse.json()
        setVideos(videosData)

        // Fetch users
        const usersResponse = await fetch("/api/users")
        if (!usersResponse.ok) {
          throw new Error(`Failed to fetch users: ${usersResponse.statusText}`)
        }
        const usersData = await usersResponse.json()
        setUsers(usersData)
      } catch (error) {
        console.error("Error fetching data:", error)
        setError(error instanceof Error ? error.message : "Failed to load data")
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  // Handle video operations
  const handleAddVideo = async (video) => {
    try {
      setError(null)
      const response = await fetch("/api/videos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(video),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to add video")
      }

      const newVideo = await response.json()
      setVideos([...videos, newVideo])
    } catch (error) {
      console.error("Error adding video:", error)
      setError(error instanceof Error ? error.message : "Failed to add video")
    }
  }

  const handleUpdateVideo = async (updatedVideo) => {
    try {
      setError(null)
      const response = await fetch(`/api/videos/${updatedVideo._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedVideo),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to update video")
      }

      const updated = await response.json()
      setVideos(videos.map((video) => (video._id === updated._id ? updated : video)))
    } catch (error) {
      console.error("Error updating video:", error)
      setError(error instanceof Error ? error.message : "Failed to update video")
    }
  }

  const handleDeleteVideo = async (videoId) => {
    try {
      setError(null)
      const response = await fetch(`/api/videos/${videoId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to delete video")
      }

      setVideos(videos.filter((video) => video._id !== videoId))
    } catch (error) {
      console.error("Error deleting video:", error)
      setError(error instanceof Error ? error.message : "Failed to delete video")
    }
  }

  // Handle user operations
  const handleAddUser = async (user) => {
    try {
      setError(null)
      const response = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to add user")
      }

      const newUser = await response.json()
      setUsers([...users, newUser])
    } catch (error) {
      console.error("Error adding user:", error)
      setError(error instanceof Error ? error.message : "Failed to add user")
    }
  }

  const handleUpdateUser = async (updatedUser) => {
    try {
      setError(null)
      const response = await fetch(`/api/users/${updatedUser._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedUser),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to update user")
      }

      const updated = await response.json()
      setUsers(users.map((user) => (user._id === updated._id ? updated : user)))
    } catch (error) {
      console.error("Error updating user:", error)
      setError(error instanceof Error ? error.message : "Failed to update user")
    }
  }

  const handleDeleteUser = async (userId) => {
    try {
      setError(null)
      const response = await fetch(`/api/users/${userId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to delete user")
      }

      setUsers(users.filter((user) => user._id !== userId))
    } catch (error) {
      console.error("Error deleting user:", error)
      setError(error instanceof Error ? error.message : "Failed to delete user")
    }
  }

  if (isLoading) {
    return (
      <main className="flex-1 overflow-y-auto p-6 bg-zinc-950">
        <div className="flex items-center justify-center h-full">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-zinc-700 border-t-white" />
        </div>
      </main>
    )
  }

  return (
    <main className="flex-1 overflow-y-auto p-6 bg-zinc-950">
      {error && (
        <Alert className="mb-6 bg-red-900/20 text-red-400 border-red-900">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="mb-6 border-b border-zinc-800 pb-4">
        <div className="flex space-x-4">
          <button
            className={`px-4 py-2 font-medium ${activeTab === "videos" ? "text-white border-b-2 border-white" : "text-zinc-400"}`}
            onClick={() => setActiveTab("videos")}
          >
            Videos
          </button>
          <button
            className={`px-4 py-2 font-medium ${activeTab === "users" ? "text-white border-b-2 border-white" : "text-zinc-400"}`}
            onClick={() => setActiveTab("users")}
          >
            Allowed Users
          </button>
        </div>
      </div>

      {activeTab === "videos" && (
        <VideoManagement
          videos={videos}
          onAddVideo={handleAddVideo}
          onUpdateVideo={handleUpdateVideo}
          onDeleteVideo={handleDeleteVideo}
        />
      )}

      {activeTab === "users" && (
        <UserManagement
          users={users}
          onAddUser={handleAddUser}
          onUpdateUser={handleUpdateUser}
          onDeleteUser={handleDeleteUser}
        />
      )}
    </main>
  )
}

