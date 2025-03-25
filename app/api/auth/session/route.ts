import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { getUserByTelegramId } from "@/lib/db-service"

export async function GET(req: NextRequest) {
  try {
    const cookieStore = cookies(req)
    const sessionCookie = cookieStore.get("user_session")

    if (!sessionCookie) {
      return NextResponse.json({ authenticated: false }, { status: 401 })
    }

    const session = JSON.parse(sessionCookie.value)
    const user = await getUserByTelegramId(session.telegramId)

    if (!user || !user.isAllowed) {
      // Clear the cookie with same path as creation
      cookieStore.delete({
        name: "user_session",
        path: "/",
      })
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
    return NextResponse.json({ authenticated: false, error: "Session error" }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  const cookieStore = cookies(req)
  cookieStore.delete({
    name: "user_session",
    path: "/",
  })

  return NextResponse.json({ success: true })
}

