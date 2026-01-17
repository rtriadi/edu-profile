import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";

// Paths that should be accessible during maintenance
const maintenanceAllowedPaths = [
  "/maintenance",
  "/admin",
  "/api",
  "/login",
  "/_next",
  "/favicon.ico",
];

// Check if path is allowed during maintenance
function isAllowedDuringMaintenance(pathname: string): boolean {
  return maintenanceAllowedPaths.some((path) => pathname.startsWith(path));
}

async function checkMaintenanceMode(baseUrl: string): Promise<boolean> {
  try {
    // Add timestamp to prevent caching
    const response = await fetch(`${baseUrl}/api/maintenance?t=${Date.now()}`, {
      cache: "no-store",
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
        "Pragma": "no-cache",
      },
    });
    
    if (response.ok) {
      const data = await response.json();
      return data.maintenanceMode === true;
    }
  } catch (error) {
    console.error("Error checking maintenance mode:", error);
  }
  
  return false;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip maintenance check for allowed paths
  if (!isAllowedDuringMaintenance(pathname)) {
    // Check maintenance mode via API
    const baseUrl = request.nextUrl.origin;
    const maintenanceMode = await checkMaintenanceMode(baseUrl);

    // If in maintenance mode, redirect non-admin users
    if (maintenanceMode) {
      const session = await auth();
      if (!session?.user) {
        return NextResponse.redirect(new URL("/maintenance", request.url));
      }
    }
  }

  // Handle admin routes authentication
  if (pathname.startsWith("/admin")) {
    const session = await auth();
    if (!session?.user) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
