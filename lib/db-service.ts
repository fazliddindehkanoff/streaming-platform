import clientPromise from "./mongodb"
import type { User, Video } from "./models"

// Database and collections names
const DB_NAME = "streaming_platform"
const USERS_COLLECTION = "users"
const VIDEOS_COLLECTION = "videos"

// User operations
export async function getUserByTelegramId(telegramId: string): Promise<User | null> {
  const client = await clientPromise
  const db = client.db(DB_NAME)
  return db.collection<User>(USERS_COLLECTION).findOne({ telegramId })
}

export async function createUser(userData: Omit<User, "_id">): Promise<User> {
  const client = await clientPromise
  const db = client.db(DB_NAME)

  const now = new Date()
  const newUser = {
    ...userData,
    isAdmin: userData.telegramId === "1535815443", // Hardcoded admin ID
    isAllowed: userData.telegramId === "1535815443", // By default, only admin is allowed
    createdAt: now,
    updatedAt: now,
  }

  const result = await db.collection<User>(USERS_COLLECTION).insertOne(newUser)
  return { ...newUser, _id: result.insertedId }
}

export async function updateUser(id: string, userData: Partial<User>): Promise<User | null> {
  const { _id, ...sanitizedData } = userData;
  
  const client = await clientPromise
  const db = client.db(DB_NAME)

  const updatedUser = {
    ...sanitizedData,
    updatedAt: new Date(),
  }

  const result = await db
    .collection<User>(USERS_COLLECTION)
    .findOneAndUpdate({ videoId: id }, { $set: updatedUser }, { returnDocument: "after" })

  return result
}

export async function getAllUsers(): Promise<User[]> {
  const client = await clientPromise
  const db = client.db(DB_NAME)
  return db.collection<User>(USERS_COLLECTION).find().sort({ createdAt: -1 }).toArray()
}

export async function deleteUser(id: string): Promise<boolean> {
  const client = await clientPromise
  const db = client.db(DB_NAME)
  const result = await db.collection(USERS_COLLECTION).deleteOne({ videoId: id })
  return result.deletedCount === 1
}

// Video operations
export async function getAllVideos(): Promise<Video[]> {
  const client = await clientPromise
  const db = client.db(DB_NAME)
  return db.collection<Video>(VIDEOS_COLLECTION).find().sort({ createdAt: -1 }).toArray()
}

export async function getVideoById(id: string): Promise<Video | null> {
  const client = await clientPromise
  const db = client.db(DB_NAME)
  return db.collection<Video>(VIDEOS_COLLECTION).findOne({ videoId: id })
}

export async function createVideo(videoData: Omit<Video, "_id">): Promise<Video> {
  const client = await clientPromise
  const db = client.db(DB_NAME)

  const now = new Date()
  const newVideo = {
    ...videoData,
    createdAt: now,
    updatedAt: now,
  }

  const result = await db.collection<Video>(VIDEOS_COLLECTION).insertOne(newVideo)
  return { ...newVideo, _id: result.insertedId }
}

export async function updateVideo(id: string, videoData: Partial<Video>): Promise<Video | null> {
  const client = await clientPromise
  const db = client.db(DB_NAME)

  const updatedVideo = {
    ...videoData,
    updatedAt: new Date(),
  }

  const result = await db
    .collection<Video>(VIDEOS_COLLECTION)
    .findOneAndUpdate({ videoId: id }, { $set: updatedVideo }, { returnDocument: "after" })

  return result
}

export async function deleteVideo(id: string): Promise<boolean> {
  const client = await clientPromise
  const db = client.db(DB_NAME)
  const result = await db.collection(VIDEOS_COLLECTION).deleteOne({ videoId: id })
  return result.deletedCount === 1
}

