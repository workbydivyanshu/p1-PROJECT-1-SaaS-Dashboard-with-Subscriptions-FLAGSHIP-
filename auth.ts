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
            
            // Ensure demo user exists in DB for Foreign Key relations
            const user = await prisma.user.upsert({
                where: { email: "demo@example.com" },
                update: {},
                create: {
                    id: "demo-user-id",
                    email: "demo@example.com",
                    name: "Demo User",
                    image: "https://github.com/shadcn.png"
                }
            })

            return user
          }
          return null
        }
    })
  ],
  session: { strategy: "jwt" },
  trustHost: true,
})
