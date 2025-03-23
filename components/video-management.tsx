"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Edit, Trash, Plus, Video, AlertCircle } from "lucide-react"
import { extractVdoCipherId } from "@/lib/vdocipher"

interface VideoInterface {
  _id?: string
  title: string
  videoId: string
}

interface VideoManagementProps {
  videos: VideoInterface[]
  onAddVideo: (video: VideoInterface) => void
  onUpdateVideo: (video: VideoInterface) => void
  onDeleteVideo: (videoId: string) => void
}

export function VideoManagement({ videos, onAddVideo, onUpdateVideo, onDeleteVideo }: VideoManagementProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentVideo, setCurrentVideo] = useState<VideoInterface | null>(null)
  const [formData, setFormData] = useState<Omit<VideoInterface, "_id">>({
    title: "",
    videoId: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    onAddVideo(formData)
    setIsAddDialogOpen(false)
    resetForm()
  }

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (currentVideo) {
      onUpdateVideo({ ...formData, _id: currentVideo._id })
      setIsEditDialogOpen(false)
      resetForm()
    }
  }

  const handleDeleteConfirm = () => {
    if (currentVideo && currentVideo._id) {
      onDeleteVideo(currentVideo._id)
      setIsDeleteDialogOpen(false)
    }
  }

  const openEditDialog = (video: VideoInterface) => {
    setCurrentVideo(video)
    setFormData({
      title: video.title,
      videoId: video.videoId,
    })
    setIsEditDialogOpen(true)
  }

  const openDeleteDialog = (video: VideoInterface) => {
    setCurrentVideo(video)
    setIsDeleteDialogOpen(true)
  }

  const resetForm = () => {
    setFormData({
      title: "",
      videoId: "",
    })
    setCurrentVideo(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Manage Videos</h2>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-zinc-800 hover:bg-zinc-700">
              <Plus className="mr-2 h-4 w-4" /> Add Video
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-zinc-900 text-white border-zinc-800">
            <DialogHeader>
              <DialogTitle>Add New Video</DialogTitle>
              <DialogDescription className="text-zinc-400">Enter the details for the new video.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="bg-zinc-800 border-zinc-700"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="videoId">Video ID</Label>
                  <Input
                    id="videoId"
                    name="videoId"
                    value={formData.videoId}
                    onChange={handleInputChange}
                    className="bg-zinc-800 border-zinc-700"
                    required
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" className="bg-zinc-800 hover:bg-zinc-700">
                  Add Video
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {videos.map((video) => (
          <Card key={video._id} className="bg-zinc-900 border-zinc-800 overflow-hidden">
            <div className="aspect-video bg-zinc-800 relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <Video className="h-12 w-12 text-zinc-700" />
              </div>
            </div>
            <CardHeader>
              <CardTitle className="text-white">{video.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-zinc-400 truncate">{video.videoId}</p>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                variant="outline"
                size="icon"
                className="bg-zinc-800 border-zinc-700 hover:bg-zinc-700"
                onClick={() => openEditDialog(video)}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="bg-zinc-800 border-zinc-700 hover:bg-zinc-700 hover:text-red-500"
                onClick={() => openDeleteDialog(video)}
              >
                <Trash className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="bg-zinc-900 text-white border-zinc-800">
          <DialogHeader>
            <DialogTitle>Edit Video</DialogTitle>
            <DialogDescription className="text-zinc-400">Update the video details.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-title">Title</Label>
                <Input
                  id="edit-title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="bg-zinc-800 border-zinc-700"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-videoId">Video ID</Label>
                <Input
                  id="edit-videoId"
                  name="videoId"
                  value={formData.videoId}
                  onChange={handleInputChange}
                  className="bg-zinc-800 border-zinc-700"
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" className="bg-zinc-800 hover:bg-zinc-700">
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="bg-zinc-900 text-white border-zinc-800">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription className="text-zinc-400">
              Are you sure you want to delete "{currentVideo?.title}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              className="bg-zinc-800 border-zinc-700 hover:bg-zinc-700"
            >
              Cancel
            </Button>
            <Button onClick={handleDeleteConfirm} className="bg-red-900 hover:bg-red-800">
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

