import crypto from "crypto"

interface TelegramUser {
  id: string
  first_name: string
  last_name?: string
  username?: string
  photo_url?: string
  auth_date: number | string
  hash: string
}

export function validateTelegramAuth(telegramUser: any): boolean {
  // Get the Telegram bot token from environment variables
  const botToken = process.env.TELEGRAM_BOT_TOKEN

  if (!botToken) {
    console.error("TELEGRAM_BOT_TOKEN is not defined in environment variables")
    return false
  }

  // Create a data check string
  const { hash, ...userData } = telegramUser

  // Sort the object by key
  const dataCheckArr: string[] = []
  Object.keys(userData)
    .sort()
    .forEach((key) => {
      dataCheckArr.push(`${key}=${userData[key]}`)
    })

  const dataCheckString = dataCheckArr.join("\n")

  // Create a secret key from the bot token
  const secretKey = crypto.createHash("sha256").update(botToken).digest()

  // Calculate the hash
  const calculatedHash = crypto.createHmac("sha256", secretKey).update(dataCheckString).digest("hex")

  // Compare the calculated hash with the provided hash
  return calculatedHash === hash
}

export function convertTelegramUserToDbUser(telegramUser: any) {
  // Normalize the data to handle both widget and redirect formats
  const id = telegramUser.id || telegramUser.user?.id
  const firstName = telegramUser.first_name || telegramUser.user?.first_name
  const lastName = telegramUser.last_name || telegramUser.user?.last_name
  const username = telegramUser.username || telegramUser.user?.username
  const photoUrl = telegramUser.photo_url || telegramUser.user?.photo_url
  const authDate = Number(telegramUser.auth_date || telegramUser.user?.auth_date)
  const hash = telegramUser.hash

  return {
    telegramId: id,
    firstName,
    lastName,
    username,
    photoUrl,
    authDate,
    hash,
    isAdmin: id === "1535815443", // Hardcoded admin ID
    isAllowed: id === "1535815443", // By default, only admin is allowed
  }
}

