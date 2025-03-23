import { cookies } from "next/headers"
import { getUserByTelegramId } from "./db-service"

export async function getSessionUser() {
  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get("user_session")

  if (!sessionCookie) {
    return null
  }

  try {
    const session = JSON.parse(sessionCookie.value)
    const user = await getUserByTelegramId(session.telegramId)

    if (!user || !user.isAllowed) {
      return null
    }

    return {
      id: user._id,
      telegramId: user.telegramId,
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      photoUrl: user.photoUrl,
      isAdmin: user.isAdmin,
    }
  } catch (error) {
    console.error("Session error:", error)
    return null
  }
}

