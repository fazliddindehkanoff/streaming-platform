import { type NextRequest, NextResponse } from "next/server"
import { updateUser, deleteUser, getUserByTelegramId } from "@/lib/db-service"
import { getSessionUser } from "@/lib/auth-utils"

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params

  try {
    // Check if the user is an admin
    const session = await getSessionUser()

    if (!session || !session.isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userData = await req.json()
    const updatedUser = await updateUser(id, userData)

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json(updatedUser)
  } catch (error) {
    console.error("Error updating user:", error)
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Check if the user is an admin
    const session = await getSessionUser()

    if (!session || !session.isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Prevent deleting the admin user
    const adminId = "1535815443"
    const userToDelete = await getUserByTelegramId(params.id)

    if (userToDelete?.telegramId === adminId) {
      return NextResponse.json({ error: "Cannot delete admin user" }, { status: 403 })
    }

    const success = await deleteUser(params.id)

    if (!success) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting user:", error)
    return NextResponse.json({ error: "Failed to delete user" }, { status: 500 })
  }
}

