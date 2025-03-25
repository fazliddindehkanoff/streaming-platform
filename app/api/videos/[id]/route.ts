import { type NextRequest, NextResponse } from "next/server"
import { getVideoById, updateVideo, deleteVideo } from "@/lib/db-service"
import { getSessionUser } from "@/lib/auth-utils"

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const video = await getVideoById(params.id)

    if (!video) {
      return NextResponse.json({ error: "Video not found" }, { status: 404 })
    }

    return NextResponse.json(video)
  } catch (error) {
    console.error("Error fetching video:", error)
    return NextResponse.json({ error: "Failed to fetch video" }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Check if the user is an admin
    const session = await getSessionUser()

    if (!session || !session.isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const videoData = await req.json()
    console.log("videoId", params.id)
    console.log("videoData", videoData)
    const updatedVideo = await updateVideo(videoData.videoId, videoData)

    if (!updatedVideo) {
      return NextResponse.json({ error: "Video not found" }, { status: 404 })
    }

    return NextResponse.json(updatedVideo)
  } catch (error) {
    console.error("Error updating video:", error)
    return NextResponse.json({ error: "Failed to update video" }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Check if the user is an admin
    const session = await getSessionUser()

    if (!session || !session.isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const success = await deleteVideo(params.id)

    if (!success) {
      return NextResponse.json({ error: "Video not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting video:", error)
    return NextResponse.json({ error: "Failed to delete video" }, { status: 500 })
  }
}

