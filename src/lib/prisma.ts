import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient() {
  const isProduction = process.env.NODE_ENV === "production";
  let datasourceUrl = process.env.DATABASE_URL || "";
  
  if (isProduction) {
    // For production, try to use direct connection (port 5432) instead of pooler (port 6543)
    // This avoids pgbouncer connection pool issues on Vercel
    if (datasourceUrl.includes("pooler.supabase.com:6543")) {
      datasourceUrl = datasourceUrl.replace(":6543/", ":5432/");
      // Remove pgbouncer=true if present
      datasourceUrl = datasourceUrl.replace("?pgbouncer=true", "").replace("&pgbouncer=true", "");
    }
    
    // Add connection limit to prevent pool exhaustion
    const hasQueryParams = datasourceUrl.includes("?");
    const connector = hasQueryParams ? "&" : "?";
    if (!datasourceUrl.includes("connection_limit")) {
      datasourceUrl = `${datasourceUrl}${connector}connection_limit=1&pool_timeout=10`;
    }
  }
  
  const client = new PrismaClient({
    log: isProduction ? ["error"] : ["error", "warn"],
    datasources: {
      db: {
        url: datasourceUrl,
      },
    },
  });
  return client;
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;
