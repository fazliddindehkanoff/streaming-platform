import { type NextRequest, NextResponse } from "next/server"
import { getVdoCipherOtp } from "@/lib/vdocipher"
import { getSessionUser } from "@/lib/auth-utils"

export async function POST(req: NextRequest) {
  try {
    // Check if the user is authenticated
    const session = await getSessionUser()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { videoId } = await req.json()

    if (!videoId) {
      return NextResponse.json({ error: "Video ID is required" }, { status: 400 })
    }

    // Check if VDOCipher API secret is configured
    if (!process.env.VDOCIPHER_API_SECRET) {
      return NextResponse.json({ error: "VDOCipher API secret not configured" }, { status: 500 })
    }

    const otpData = await getVdoCipherOtp(videoId)

    return NextResponse.json(otpData)
  } catch (error) {
    console.error("Error getting VDOCipher OTP:", error)
    return NextResponse.json(
      {
        error: "Failed to get OTP",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

