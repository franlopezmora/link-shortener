import { type NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import GithubProvider from "next-auth/providers/github"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { prisma } from "@/lib/prisma"

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: { strategy: "database" }, // o "jwt"
  pages: { signIn: "/login", error: "/login" },

  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      authorization: { params: { scope: "read:user user:email" } }, // no agregues profile custom
    }),
  ],

  // logs mínimos para ver qué devuelve GitHub (quitá luego)
  events: {
    async signIn(message) {
      console.log("[next-auth] signIn event", {
        provider: message?.account?.provider,
        email: (message?.profile as { email?: string })?.email ?? null,
      });
    },
    async linkAccount(message) {
      console.log("[next-auth] linkAccount event", {
        provider: message?.account?.provider,
        userId: message?.user?.id,
      });
    },
  },
}
