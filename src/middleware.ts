import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

// Paths that should skip middleware entirely
const publicPaths = [
  "/maintenance",
  "/api",
  "/_next",
  "/favicon.ico",
];

// Check if path should skip middleware
function shouldSkip(pathname: string): boolean {
  return publicPaths.some((path) => pathname.startsWith(path)) || 
         pathname.includes(".");
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for public paths and static files
  if (shouldSkip(pathname)) {
    return NextResponse.next();
  }

  // Get session token with explicit cookie name for NextAuth v5
  let token = null;
  try {
    token = await getToken({
      req: request,
      secret: process.env.AUTH_SECRET,
      secureCookie: process.env.NODE_ENV === "production",
    });
  } catch (error) {
    // Token parsing failed, treat as unauthenticated
    console.error("Token error:", error);
  }

  const isAuthenticated = !!token;
  const isLoginPage = pathname === "/login";
  const isAdminRoute = pathname.startsWith("/admin");
  const isMaintenanceMode = process.env.MAINTENANCE_MODE === "true";

  // Handle login page - redirect authenticated users to admin
  if (isLoginPage && isAuthenticated) {
    const callbackUrl = request.nextUrl.searchParams.get("callbackUrl");
    const redirectUrl = callbackUrl && callbackUrl.startsWith("/") ? callbackUrl : "/admin";
    return NextResponse.redirect(new URL(redirectUrl, request.url));
  }

  // Handle admin routes - require authentication
  if (isAdminRoute && !isAuthenticated) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Handle maintenance mode for public pages
  if (isMaintenanceMode && !isAuthenticated && !isLoginPage && !isAdminRoute) {
    return NextResponse.redirect(new URL("/maintenance", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
