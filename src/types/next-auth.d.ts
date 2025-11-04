import NextAuth from "next-auth"
import { JWT } from "next-auth/jwt"

declare module "next-auth" {
  interface Session {
    user: {
      id: number
      name?: string | null
      email?: string | null
      image?: string | null
      scopes: string[]
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    userId?: number
    scopes?: string[]
  }
}
