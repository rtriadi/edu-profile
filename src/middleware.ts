import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

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
    const response = await fetch(`${baseUrl}/api/maintenance?t=${Date.now()}`, {
      cache: "no-store",
    });
    
    if (response.ok) {
      const data = await response.json();
      return data.maintenanceMode === true;
    }
  } catch {
    // Silently fail - don't block if API is unreachable
  }
  
  return false;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Get session token (lightweight - Edge compatible)
  const token = await getToken({ 
    req: request, 
    secret: process.env.AUTH_SECRET 
  });

  // Skip maintenance check for allowed paths
  if (!isAllowedDuringMaintenance(pathname)) {
    const baseUrl = request.nextUrl.origin;
    const maintenanceMode = await checkMaintenanceMode(baseUrl);

    // If in maintenance mode, redirect non-admin users
    if (maintenanceMode && !token) {
      return NextResponse.redirect(new URL("/maintenance", request.url));
    }
  }

  // Redirect logged-in users away from login page
  if (pathname === "/login" && token) {
    // Respect callbackUrl if provided, otherwise default to /admin
    const callbackUrl = request.nextUrl.searchParams.get("callbackUrl");
    const redirectUrl = callbackUrl && callbackUrl.startsWith("/") ? callbackUrl : "/admin";
    return NextResponse.redirect(new URL(redirectUrl, request.url));
  }

  // Handle admin routes authentication
  if (pathname.startsWith("/admin")) {
    if (!token) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
