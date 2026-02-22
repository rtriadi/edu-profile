import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient() {
  const isProduction = process.env.NODE_ENV === "production";
  let datasourceUrl = process.env.DATABASE_URL || "";
  
  // For production on Vercel with Supabase pooler:
  // Keep using port 6543 (pooler) but configure for serverless
  if (isProduction && datasourceUrl.includes("pooler.supabase.com")) {
    // Remove pgbouncer=true as it can cause issues
    datasourceUrl = datasourceUrl.replace("?pgbouncer=true", "").replace("&pgbouncer=true", "");
    
    // Add connection parameters for serverless
    const separator = datasourceUrl.includes("?") ? "&" : "?";
    const params = "connection_limit=1&connect_timeout=10&pool_timeout=10";
    datasourceUrl = `${datasourceUrl}${separator}${params}`;
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
