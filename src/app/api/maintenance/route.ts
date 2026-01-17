import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// API route to check maintenance mode status
// Used by middleware to determine if site is in maintenance
export async function GET() {
  try {
    const setting = await prisma.setting.findUnique({
      where: { key: "maintenanceMode" },
    });
    
    const isMaintenanceMode = setting?.value === true || setting?.value === "true";
    
    return NextResponse.json({ maintenanceMode: isMaintenanceMode });
  } catch (error) {
    console.error("Error checking maintenance mode:", error);
    // Default to not in maintenance mode if error
    return NextResponse.json({ maintenanceMode: false });
  }
}
