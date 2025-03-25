import NextAuth from "next-auth"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { prisma } from "@/lib/prisma"

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    {
      id: "telegram",
      name: "Telegram",
      type: "oauth",
      version: "2.0",
      authorization: {
        url: "https://telegram.org/auth",
        params: {
          bot_id: process.env.NEXT_PUBLIC_TELEGRAM_BOT_NAME,
          origin: process.env.NEXT_PUBLIC_APP_URL,
          request_access: "write",
        }
      },
      token: "https://api.telegram.org/bot{botToken}/getUserProfilePhotos",
      userinfo: {
        url: "https://api.telegram.org/bot{botToken}/getMe",
        async request(context) {
          const profile = await context.client.userinfo()
          return {
            id: profile.result.id,
            name: `${profile.result.first_name} ${profile.result.last_name || ''}`,
            email: profile.result.username ? `${profile.result.username}@telegram.org` : null,
            image: profile.result.photo_url,
          }
        }
      },
      profile(profile) {
        return {
          id: profile.result.id.toString(),
          name: `${profile.result.first_name} ${profile.result.last_name || ''}`.trim(),
          email: profile.result.username ? `${profile.result.username}@telegram.org` : null,
          image: profile.result.photo_url,
        }
      },
      clientId: process.env.NEXT_PUBLIC_TELEGRAM_BOT_NAME,
      clientSecret: process.env.NEXT_PUBLIC_TELEGRAM_BOT_TOKEN,
    }
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async session({ session, user }) {
      session.user.id = user.id
      session.user.isAdmin = false
      return session
    }
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth(authOptions) 