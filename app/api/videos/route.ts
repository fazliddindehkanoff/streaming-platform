import { type NextRequest, NextResponse } from "next/server"
import { getAllVideos, createVideo } from "@/lib/db-service"
import { getSessionUser } from "@/lib/auth-utils"

export async function GET(req: NextRequest) {
  try {
    const videos = await getAllVideos()
    return NextResponse.json(videos)
  } catch (error) {
    console.error("Error fetching videos:", error)
    return NextResponse.json({ error: "Failed to fetch videos" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    // Check if the user is an admin
    const session = await getSessionUser()

    if (!session || !session.isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const videoData = await req.json()
    const newVideo = await createVideo(videoData)

    return NextResponse.json(newVideo)
  } catch (error) {
    console.error("Error creating video:", error)
    return NextResponse.json({ error: "Failed to create video" }, { status: 500 })
  }
}

