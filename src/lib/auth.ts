import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import type { Role } from "@prisma/client";

export const { handlers, signIn, signOut, auth } = NextAuth({
  // Note: Adapter is not needed for Credentials provider with JWT strategy
  // adapter: PrismaAdapter(prisma) as Adapter,
  session: { strategy: "jwt" },
  trustHost: true,
  secret: process.env.AUTH_SECRET,
  pages: {
    signIn: "/login",
    error: "/login",
  },
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email dan password diperlukan");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });

        if (!user || !user.password) {
          throw new Error("Email atau password salah");
        }

        if (!user.isActive) {
          throw new Error("Akun Anda telah dinonaktifkan");
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password as string,
          user.password
        );

        if (!isPasswordValid) {
          throw new Error("Email atau password salah");
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id as string;
        token.role = user.role;
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
});

// Helper to check if user has required role
export function hasRole(userRole: Role, requiredRoles: Role[]): boolean {
  return requiredRoles.includes(userRole);
}

// Role hierarchy check
export function canAccess(userRole: Role, minimumRole: Role): boolean {
  const hierarchy: Record<Role, number> = {
    SUPERADMIN: 3,
    ADMIN: 2,
    EDITOR: 1,
  };
  return hierarchy[userRole] >= hierarchy[minimumRole];
}
