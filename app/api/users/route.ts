import { type NextRequest, NextResponse } from "next/server"
import { getAllUsers, createUser } from "@/lib/db-service"
import { getSessionUser } from "@/lib/auth-utils"

export async function GET(req: NextRequest) {
  try {
    // Check if the user is an admin
    const session = await getSessionUser()

    if (!session || !session.isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const users = await getAllUsers()
    return NextResponse.json(users)
  } catch (error) {
    console.error("Error fetching users:", error)
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    // Check if the user is an admin
    const session = await getSessionUser()

    if (!session || !session.isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userData = await req.json()
    const newUser = await createUser(userData)

    return NextResponse.json(newUser)
  } catch (error) {
    console.error("Error creating user:", error)
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 })
  }
}

