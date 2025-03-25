import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { getUserByTelegramId } from "@/lib/db-service"

export async function GET(req: NextRequest) {
  try {
    // Use req.cookies instead of cookies(req)
    const sessionCookie = req.cookies.get("user_session")

    if (!sessionCookie) {
      console.log("No session cookie found")
      return NextResponse.json({ authenticated: false }, { status: 401 })
    }

    let session;
    try {
      session = JSON.parse(sessionCookie.value)
    } catch (parseError) {
      console.error("Session cookie parsing error:", parseError)
      return NextResponse.json({ authenticated: false }, { status: 401 })
    }

    if (!session || !session.telegramId) {
      console.log("Invalid session structure")
      return NextResponse.json({ authenticated: false }, { status: 401 })
    }

    const user = await getUserByTelegramId(session.telegramId)

    if (!user || !user.isAllowed) {
      console.log("User not found or not allowed", { 
        userFound: !!user, 
        isAllowed: user?.isAllowed 
      })
      
      // Clear the cookie
      cookies().delete("user_session")
      return NextResponse.json({ authenticated: false }, { status: 401 })
    }

    return NextResponse.json({
      authenticated: true,
      user: {
        id: user._id,
        telegramId: user.telegramId,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        photoUrl: user.photoUrl,
        isAdmin: user.isAdmin,
      },
    })
  } catch (error) {
    console.error("Session error:", error)
    return NextResponse.json({ 
      authenticated: false, 
      error: error instanceof Error ? error.message : "Session error" 
    }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  const cookieStore = cookies()
  await cookieStore.delete({
    name: "user_session",
    path: "/",
  })

  return NextResponse.json({ success: true })
}