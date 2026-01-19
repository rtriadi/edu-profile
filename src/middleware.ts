import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";

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

export default auth((req) => {
  const { nextUrl } = req;
  const pathname = nextUrl.pathname;

  // Skip middleware for public paths and static files
  if (shouldSkip(pathname)) {
    return NextResponse.next();
  }

  const isAuthenticated = !!req.auth;
  const isLoginPage = pathname === "/login";
  const isAdminRoute = pathname.startsWith("/admin");
  const isMaintenanceMode = process.env.MAINTENANCE_MODE === "true";

  // Handle login page - redirect authenticated users to admin
  if (isLoginPage && isAuthenticated) {
    const callbackUrl = nextUrl.searchParams.get("callbackUrl");
    const redirectUrl = callbackUrl && callbackUrl.startsWith("/") ? callbackUrl : "/admin";
    return NextResponse.redirect(new URL(redirectUrl, req.url));
  }

  // Handle admin routes - require authentication
  if (isAdminRoute && !isAuthenticated) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Handle maintenance mode for public pages
  if (isMaintenanceMode && !isAuthenticated && !isLoginPage && !isAdminRoute) {
    return NextResponse.redirect(new URL("/maintenance", req.url));
  }

  return NextResponse.next();
});

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
