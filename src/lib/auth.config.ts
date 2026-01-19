import type { NextAuthConfig } from "next-auth";
import type { Role } from "@prisma/client";

export const authConfig = {
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id as string;
        token.role = user.role as Role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.role = token.role as Role;
      }
      return session;
    },
    async authorized({ auth }) {
      // Let middleware handle all redirects to avoid conflicts
      // This callback only validates if user is authenticated
      return true;
    },
  },
  providers: [], // Providers are configured in auth.ts to avoid edge runtime issues
} satisfies NextAuthConfig;
