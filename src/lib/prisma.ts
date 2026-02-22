import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient() {
  const isProduction = process.env.NODE_ENV === "production";
  let datasourceUrl = process.env.DATABASE_URL || "";
  
  if (isProduction && datasourceUrl.includes("pooler.supabase.com")) {
    datasourceUrl = datasourceUrl.replace("?pgbouncer=true", "").replace("&pgbouncer=true", "");
    
    const separator = datasourceUrl.includes("?") ? "&" : "?";
    datasourceUrl = `${datasourceUrl}${separator}connection_limit=1&connect_timeout=15&pool_timeout=15`;
  }
  
  return new PrismaClient({
    log: isProduction ? ["error"] : ["error", "warn"],
    datasources: {
      db: { url: datasourceUrl },
    },
  });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;
