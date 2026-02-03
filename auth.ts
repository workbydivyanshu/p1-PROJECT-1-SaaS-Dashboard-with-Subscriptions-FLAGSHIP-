import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/db"

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [], // Providers (e.g. Email, Google) will be added later
  session: { strategy: "jwt" },
  trustHost: true, // Trust the host for production (Vercel)
})
