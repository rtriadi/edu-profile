import { PrismaClient } from "@prisma/client";

// Prevent multiple PrismaClient instances in development (hot-reload)
// In production, each serverless function invocation gets a fresh instance
// with proper connection management via Supabase Supavisor pooler.
//
// IMPORTANT for Vercel: Set DATABASE_URL to Supabase connection pooler URL
// (port 6543, mode=transaction) to prevent connection exhaustion:
// postgresql://user:pass@db.xxxx.supabase.co:6543/postgres?pgbouncer=true&connection_limit=1
//
// See: docs/supabase-connection-guide.md

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient() {
  return new PrismaClient({
    log:
      process.env.NODE_ENV === "production"
        ? ["error"]
        : ["error", "warn"],
  });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  // Only reuse client in development to prevent multiple instances on hot-reload
  globalForPrisma.prisma = prisma;
}

export default prisma;
