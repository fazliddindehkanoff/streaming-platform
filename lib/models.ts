import type { ObjectId } from "mongodb"

export interface User {
  _id?: ObjectId
  telegramId: string
  firstName: string
  lastName?: string
  username?: string
  photoUrl?: string
  authDate: number
  hash: string
  isAdmin: boolean
  isAllowed: boolean
  email?: string
  createdAt: Date
  updatedAt: Date
}

export interface Video {
  _id?: ObjectId
  title: string
  description: string
  url: string
  platform: "vdocipher" | "kinescope"
  thumbnailUrl: string
  createdAt: Date
  updatedAt: Date
}

