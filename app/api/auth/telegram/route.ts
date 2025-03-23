import { type NextRequest, NextResponse } from "next/server"
import { validateTelegramAuth, convertTelegramUserToDbUser } from "@/lib/telegram-auth"
import { getUserByTelegramId, createUser } from "@/lib/db-service"
import { cookies } from "next/headers"

export async function POST(req: NextRequest) {
  try {
    const telegramUser = await req.json()
    console.log("Received Telegram user data:", telegramUser)

    // Validate the Telegram authentication data
    const isValid = validateTelegramAuth(telegramUser)

    if (!isValid) {
      console.error("Invalid authentication data")
      return NextResponse.json({ error: "Invalid authentication data" }, { status: 401 })
    }

    // Check if the user already exists in the database
    let user = await getUserByTelegramId(telegramUser.id)

    if (!user) {
      // Create a new user if they don't exist
      const userData = {
        ...convertTelegramUserToDbUser(telegramUser),
        createdAt: new Date(),
        updatedAt: new Date()
      }
      user = await createUser(userData)
    }

    // Check if the user is allowed to access the platform
    if (!user.isAllowed) {
      return NextResponse.json({ error: "User not allowed" }, { status: 403 })
    }

    // Set a session cookie
    const cookieStore = await cookies()
    cookieStore.set(
      "user_session",
      JSON.stringify({
        id: user._id,
        telegramId: user.telegramId,
        firstName: user.firstName,
        isAdmin: user.isAdmin,
      }),
      {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 3, // 1 week
        path: "/",
      },
    )

    // Sanitize user data before sending response
    const { _id, ...sanitizedUser } = user;
    return NextResponse.json({ success: true, user: sanitizedUser })
  } catch (error) {
    console.error("Authentication error:", error)
    return NextResponse.json({ error: "Authentication failed" }, { status: 500 })
  }
}

// Also handle GET requests for redirect from Telegram
export async function GET(req: NextRequest) {
  try {
    // Extract Telegram auth data from URL parameters
    const url = new URL(req.url)
    const params = Object.fromEntries(url.searchParams.entries())

    console.log("Received Telegram auth params:", params)

    // Validate the Telegram authentication data
    const isValid = validateTelegramAuth(params)

    if (!isValid) {
      console.error("Invalid authentication data")
      return NextResponse.redirect(new URL(`/?error=invalid_auth`, req.url))
    }

    // Use string ID directly (Telegram IDs are numeric strings)
    let user = await getUserByTelegramId(params.id)

    if (!user) {
      // Add error handling for user creation
      try {
        const userData = {
          ...convertTelegramUserToDbUser(params),
          createdAt: new Date(),
          updatedAt: new Date()
        }
        user = await createUser(userData)
      } catch (error: any) {
        if (error.code === 11000) { // MongoDB duplicate key error
          console.error("Duplicate user creation attempt")
          return NextResponse.redirect(new URL(`/?error=user_exists`, req.url))
        }
        throw error;
      }
    }

    // Check if the user is allowed to access the platform
    if (!user.isAllowed) {
      return NextResponse.redirect(new URL(`/?error=not_allowed`, req.url))
    }

    // Set a session cookie
    const cookieStore = await cookies()
    cookieStore.set(
      "user_session",
      JSON.stringify({
        id: user._id,
        telegramId: user.telegramId,
        firstName: user.firstName,
        isAdmin: user.isAdmin,
      }),
      {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 7, // 1 week
        path: "/",
      },
    )

    return NextResponse.redirect(new URL("/dashboard", req.url))
  } catch (error) {
    console.error("Authentication error:", error)
    return NextResponse.redirect(new URL(`/?error=auth_failed`, req.url))
  }
}

