import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/db"

import Credentials from "next-auth/providers/credentials"

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Credentials({
        name: "Demo Credentials",
        credentials: {
          email: { label: "Email", type: "email", placeholder: "demo@example.com" },
          password: { label: "Password", type: "password", placeholder: "demo123" }
        },
        async authorize(credentials) {
          if (credentials?.email === "demo@example.com" && credentials?.password === "demo123") {
            // Return a mock user for demo
            return {
              id: "demo-user-id",
              name: "Demo User",
              email: "demo@example.com",
            }
          }
          return null
        }
    })
  ],
  session: { strategy: "jwt" },
  trustHost: true,
})
