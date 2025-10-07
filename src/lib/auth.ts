import { type NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import GithubProvider from "next-auth/providers/github"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { prisma } from "@/lib/prisma"

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: { strategy: "database" },
  
  // 👇 Permite linkear por email entre proveedores (útil para Google + GitHub)
  allowDangerousEmailAccountLinking: true,
  
  pages: { 
    signIn: "/login", 
    error: "/login" 
  },
  
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      // Pedimos emails privados también
      authorization: { params: { scope: "read:user user:email" } },
      // Aseguramos campos que NextAuth necesita
      profile(profile) {
        return {
          id: String(profile.id),
          name: profile.name || profile.login,
          email: profile.email,         // NextAuth intentará completar con user:email si no viene aquí
          image: profile.avatar_url,
        };
      },
    }),
  ],
  
  // (Opcional) endurecer: bloquear si GitHub no trae email
  callbacks: {
    async signIn({ account, profile }) {
      if (account?.provider === "github") {
        const email = (profile as any)?.email;
        if (!email) {
          // rechazá el login si no hay email (evita crear usuarios huérfanos)
          return "/login?error=NoEmailFromGitHub";
        }
      }
      return true;
    },
    async redirect({ baseUrl }) {
      return `${baseUrl}/dashboard`;
    },
  },
  
  debug: process.env.NODE_ENV === "development", // solo debug en desarrollo
}
