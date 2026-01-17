import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for static files and API routes
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".") // static files
  ) {
    return NextResponse.next();
  }

  // Check maintenance mode from environment variable
  const isMaintenanceMode = process.env.MAINTENANCE_MODE === "true";

  // Get session token (lightweight - Edge compatible)
  const token = await getToken({
    req: request,
    secret: process.env.AUTH_SECRET,
  });

  // Handle maintenance mode - redirect non-admin users to maintenance page
  if (isMaintenanceMode) {
    // Allow access to maintenance page, login, and admin
    const allowedPaths = ["/maintenance", "/login", "/admin"];
    const isAllowedPath = allowedPaths.some((path) =>
      pathname.startsWith(path),
    );

    // If not on allowed path and not authenticated, redirect to maintenance
    if (!isAllowedPath && !token) {
      return NextResponse.redirect(new URL("/maintenance", request.url));
    }
  }

  // Redirect logged-in users away from login page
  if (pathname === "/login" && token) {
    // Respect callbackUrl if provided, otherwise default to /admin
    const callbackUrl = request.nextUrl.searchParams.get("callbackUrl");
    const redirectUrl =
      callbackUrl && callbackUrl.startsWith("/") ? callbackUrl : "/admin";
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
