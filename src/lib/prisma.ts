import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient() {
  const isProduction = process.env.NODE_ENV === "production";
  
  let datasourceUrl = process.env.DATABASE_URL || "";
  
  if (isProduction && datasourceUrl.includes("pooler.supabase.com")) {
    if (!datasourceUrl.includes("connection_limit")) {
      const separator = datasourceUrl.includes("?") ? "&" : "?";
      datasourceUrl = `${datasourceUrl}${separator}connection_limit=1&pool_timeout=10`;
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
